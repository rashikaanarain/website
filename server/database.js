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

    CREATE TABLE IF NOT EXISTS problem_interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE,
      organisation TEXT,
      problem_slug TEXT NOT NULL,
      contribution_type TEXT NOT NULL,
      problem_details TEXT,
      locale TEXT NOT NULL DEFAULT 'en',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      UNIQUE(email, problem_slug)
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
    CREATE INDEX IF NOT EXISTS problem_interests_created_at_idx ON problem_interests(created_at DESC);
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
    findProblemInterest: sqlite.query(`
      SELECT id, name, email, organisation, problem_slug AS problem,
             contribution_type AS contribution, problem_details AS problemDetails,
             locale, created_at AS createdAt, updated_at AS updatedAt
      FROM problem_interests
      WHERE email = $email AND problem_slug = $problem
    `),
    upsertProblemInterest: sqlite.query(`
      INSERT INTO problem_interests (name, email, organisation, problem_slug, contribution_type, problem_details, locale)
      VALUES ($name, $email, $organisation, $problem, $contribution, $problemDetails, $locale)
      ON CONFLICT(email, problem_slug) DO UPDATE SET
        name = excluded.name,
        organisation = excluded.organisation,
        contribution_type = excluded.contribution_type,
        problem_details = excluded.problem_details,
        locale = excluded.locale,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      RETURNING id, name, email, organisation, problem_slug AS problem,
                contribution_type AS contribution, problem_details AS problemDetails,
                locale, created_at AS createdAt, updated_at AS updatedAt
    `),
    listProblemInterests: sqlite.query(`
      SELECT id, name, email, organisation, problem_slug AS problem,
             contribution_type AS contribution, problem_details AS problemDetails,
             locale, created_at AS createdAt, updated_at AS updatedAt
      FROM problem_interests
      ORDER BY updated_at DESC, id DESC
    `),
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
    addProblemInterest(interest) {
      const alreadySubscribed = Boolean(statements.findProblemInterest.get({ email: interest.email, problem: interest.problem }));
      return {
        interest: statements.upsertProblemInterest.get(interest),
        alreadySubscribed,
      };
    },
    listProblemInterests() {
      return statements.listProblemInterests.all();
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
