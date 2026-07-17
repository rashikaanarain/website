CREATE TABLE IF NOT EXISTS email_signups (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS email_signups_created_at_idx
  ON email_signups(created_at DESC);

CREATE TABLE IF NOT EXISTS problem_interests (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  organisation TEXT,
  email TEXT NOT NULL COLLATE NOCASE,
  problem TEXT NOT NULL COLLATE NOCASE
    CHECK (problem IN ('bail', 'wages', 'online-safety', 'other')),
  contribution TEXT NOT NULL
    CHECK (contribution IN ('legal', 'technology', 'research', 'community', 'institutional', 'funding', 'other')),
  problem_details TEXT,
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'hi')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(email, problem)
);

CREATE INDEX IF NOT EXISTS problem_interests_updated_at_idx
  ON problem_interests(updated_at DESC);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  username TEXT NOT NULL COLLATE NOCASE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx
  ON admin_sessions(expires_at);
