# OpenNyAI Website

The public website and small signup admin for **OpenNyAI**, an Agami mission using community and AI to solve long-stuck justice problems in India.

The app uses React and Vite on the frontend, Bun for the web/API server, and SQLite for email signups, admin users, and sessions.

## Quick start

```bash
bun install
bun run seed:admin
bun run dev
```

Open:

- Public site: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`

The seed command defaults to username `admin` and password `admin`. Those credentials are only appropriate for local setup.

To seed a different admin:

```bash
bun run seed:admin --username owner --password 'use-a-long-unique-password'
```

The same values can be supplied through `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

## Scripts

| Command | Purpose |
|---|---|
| `bun run dev` | Start Vite and the Bun API together with file watching. |
| `bun run build` | Build the React frontend into `dist/`. |
| `bun run start` | Serve the built frontend and API from Bun. |
| `bun run seed:admin` | Create or reset an admin user's password. |
| `bun test` | Run the SQLite and API tests. |

For a production-style local run:

```bash
bun run build
bun run start
```

## Routes and data

- `POST /api/signups` validates, normalizes, and stores a unique email address.
- `/admin` provides the login and signup table.
- Admin sessions use an HTTP-only, SameSite cookie and expire after seven days.
- Passwords are hashed with Argon2id through Bun's password API.
- CSV export happens in the browser from the protected signup response.

SQLite defaults to `data/opennyai.sqlite`. Override it with `DATABASE_PATH`:

```bash
DATABASE_PATH=/var/lib/opennyai/opennyai.sqlite bun run start
```

Database files are ignored by Git.

## Design language

[DESIGN.md](DESIGN.md) is the normative visual system for both the public site and admin. It defines the color, typography, spacing, radius, elevation, motion, and component rules. [PRODUCT.md](PRODUCT.md) explains the users, purpose, voice, and anti-references that those visual decisions support.

The key rules are:

- Lead with human outcomes; technology never becomes visual costume.
- No repeated eyebrow labels, live dots, fake telemetry, glassmorphism, or decorative dashboard language.
- Structure content with type, spacing, alignment, and rules before adding containers.
- Keep public parallax subtle, transform-only, and disabled for reduced motion.
- Use the same tokens in admin, but keep product controls sans-serif, familiar, and compact.

Organisation strategy and copy context remain in [context.md](context.md).

## Repository structure

```text
.
├── assets/                 Brand SVGs
├── server/
│   ├── api.js              Signup and admin endpoints
│   ├── database.js         SQLite schema and queries
│   ├── dev.js              Combined API + Vite dev runner
│   ├── seed-admin.js       Admin seed command
│   └── *.test.js           Bun tests
├── src/
│   ├── admin/AdminApp.jsx  Login and signup dashboard
│   ├── hooks/useParallax.js
│   ├── site/HomePage.jsx   Public site components
│   ├── App.jsx             Route selection
│   ├── main.jsx            React entrypoint
│   └── styles.css          Shared design tokens and component styles
├── DESIGN.md               Normative design system
├── PRODUCT.md              Product and brand context
├── context.md              Organisation and messaging source material
├── package.json
└── vite.config.js
```

## Deployment

The complete app must run on a Bun-compatible host with a persistent volume for the SQLite file. Build with `bun run build`, start with `bun run start`, and point `DATABASE_PATH` at that volume.

`netlify.toml` still supports a static frontend deployment, but Netlify's static runtime cannot persist this SQLite database or run the Bun API. On Netlify, the page renders but signup and admin functionality are unavailable. Use a persistent Bun host for the complete application.

Before a public deployment:

1. Mount persistent storage and set `DATABASE_PATH`.
2. Seed a unique admin username and password.
3. Serve the app over HTTPS so the admin session cookie is secure.
4. Back up the SQLite file on a regular schedule.
