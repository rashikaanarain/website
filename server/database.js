import { Database } from "bun:sqlite";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

export const DEFAULT_DATABASE_PATH = resolve(process.env.DATABASE_PATH || "data/opennyai.sqlite");

export function createDatabase(path = DEFAULT_DATABASE_PATH) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });

  const sqlite = new Database(path, { create: true, strict: true });
  sqlite.exec("PRAGMA foreign_keys = ON;");
  sqlite.exec("PRAGMA journal_mode = WAL;");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS email_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS email_signups_created_at_idx ON email_signups(created_at DESC);
  `);

  const statements = {
    upsertAdmin: sqlite.query(`
      INSERT INTO admin_users (username, password_hash)
      VALUES ($username, $passwordHash)
      ON CONFLICT(username) DO UPDATE SET
        password_hash = excluded.password_hash,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      RETURNING id, username, created_at AS createdAt, updated_at AS updatedAt
    `),
    findAdmin: sqlite.query("SELECT id, username, password_hash AS passwordHash FROM admin_users WHERE username = $username"),
    deleteAdminSessions: sqlite.query("DELETE FROM admin_sessions WHERE admin_user_id = $adminUserId"),
    findSignup: sqlite.query("SELECT id, email, created_at AS createdAt FROM email_signups WHERE email = $email"),
    insertSignup: sqlite.query("INSERT OR IGNORE INTO email_signups (email) VALUES ($email) RETURNING id, email, created_at AS createdAt"),
    listSignups: sqlite.query("SELECT id, email, created_at AS createdAt FROM email_signups ORDER BY created_at DESC, id DESC"),
    insertSession: sqlite.query("INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at) VALUES ($adminUserId, $tokenHash, $expiresAt)"),
    findSession: sqlite.query(`
      SELECT admin_users.id, admin_users.username
      FROM admin_sessions
      JOIN admin_users ON admin_users.id = admin_sessions.admin_user_id
      WHERE admin_sessions.token_hash = $tokenHash AND admin_sessions.expires_at > $now
    `),
    deleteSession: sqlite.query("DELETE FROM admin_sessions WHERE token_hash = $tokenHash"),
    deleteExpiredSessions: sqlite.query("DELETE FROM admin_sessions WHERE expires_at <= $now"),
  };

  return {
    sqlite,
    upsertAdmin(username, passwordHash) {
      const admin = statements.upsertAdmin.get({ username, passwordHash });
      statements.deleteAdminSessions.run({ adminUserId: admin.id });
      return admin;
    },
    findAdmin(username) {
      return statements.findAdmin.get({ username });
    },
    addSignup(email) {
      const inserted = statements.insertSignup.get({ email });
      if (inserted) return { signup: inserted, alreadySubscribed: false };
      return { signup: statements.findSignup.get({ email }), alreadySubscribed: true };
    },
    listSignups() {
      return statements.listSignups.all();
    },
    createSession(adminUserId, tokenHash, expiresAt) {
      statements.insertSession.run({ adminUserId, tokenHash, expiresAt });
    },
    findSession(tokenHash, now = new Date().toISOString()) {
      return statements.findSession.get({ tokenHash, now });
    },
    deleteSession(tokenHash) {
      statements.deleteSession.run({ tokenHash });
    },
    deleteExpiredSessions(now = new Date().toISOString()) {
      statements.deleteExpiredSessions.run({ now });
    },
    close() {
      sqlite.close();
    },
  };
}
