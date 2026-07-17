# OpenNyAI Website

The public website and small problem-interest admin for **OpenNyAI**, an Agami mission using community and AI to solve long-stuck justice problems in India.

The app uses React and Vite on the frontend. Local development uses Bun and SQLite; the Sites production adapter uses a Cloudflare Worker and D1.

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
| `bun run build:sites` | Build the frontend, Worker, D1 migrations, and Sites manifest. |
| `bun run start` | Serve the built frontend and API from Bun. |
| `bun run seed:admin` | Create or reset an admin user's password. |
| `bun test` | Run the SQLite and API tests. |

For a production-style local run:

```bash
bun run build
bun run start
```

## Routes and data

- `POST /api/signups` stores newsletter-only email consent.
- `POST /api/problem-interests` stores a person's chosen problem and contribution, deduped by email + problem.
- `/admin` provides protected problem-interest and mailing-list tables with separate CSV exports.
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
├── worker/index.js          Sites Worker API and asset routing
├── drizzle/                 Sites D1 migrations
├── .openai/hosting.json     Sites project and binding manifest
├── about/, misaal/          English supporting pages
├── admin/index.html         Static entry for the protected React admin route
├── hi/                      Hindi supporting pages
├── public/og.png            Social-share card
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

The production site is configured for OpenAI Sites in `.openai/hosting.json`. `bun run build:sites` creates the deployable Worker bundle, static assets, D1 migration, and Sites manifest. The Sites project must define `ADMIN_USERNAME` and a strong secret `ADMIN_PASSWORD` as runtime environment variables.

The Bun/SQLite path remains available for local development or a separately managed persistent Bun host. `netlify.toml` is frontend-only: it cannot persist SQLite or run the Bun API.

Before a Sites deployment:

1. Run `bun install`, `bun test`, and `bun run build:sites`.
2. Configure `ADMIN_USERNAME` and secret `ADMIN_PASSWORD` in Sites.
3. Package the validated build through the Sites helper and deploy the exact pushed commit.
4. Add platform rate limiting for `/api/admin/login` before broad public promotion.
