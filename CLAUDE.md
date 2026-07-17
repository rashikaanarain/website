# CLAUDE.md

Guidance for coding agents working in this repository.

## What this is

The OpenNyAI public site and protected problem-interest admin. The frontend is React + Vite. Local API development uses Bun + SQLite; production on OpenAI Sites uses a Cloudflare Worker + D1.

## Read first

- `README.md` — commands, routes, repository map, and deployment model.
- `DESIGN.md` — normative visual and interaction system.
- `PRODUCT.md` — audiences, product purpose, voice, and anti-references.
- `context.md` — organisation and messaging source material; some historical proposals are not current runtime copy.

## Key paths

- `src/site/HomePage.jsx` — bilingual English/Hindi React homepage and problem-led form.
- `src/styles.css` — shared public/admin design system and pinned approach story.
- `src/admin/AdminApp.jsx` — problem-interest and mailing-list admin.
- `server/` — local Bun/SQLite API and tests.
- `worker/index.js`, `drizzle/` — Sites Worker/D1 production API.
- `about/`, `misaal/`, `hi/` — supporting English and Hindi pages.
- `.openai/hosting.json` — Sites project ID and binding names; never put secrets here.

## Commands

```bash
bun install
bun run dev
bun test
bun run build
bun run build:sites
```

The local admin defaults are development-only. Production `ADMIN_USERNAME` and secret `ADMIN_PASSWORD` belong in Sites runtime environment variables.

## Product and design invariants

- Lead people to concrete justice problems, not a generic mission or mailing list.
- Keep problem status meaningful and static; do not add decorative live dots or fake telemetry.
- Frame AI as a multiplier of community knowledge, trust, reach, and coordination.
- Use the Agami credibility proof and keep sourced track-record claims linked to their evidence.
- Preserve complete English and Hindi journeys, including language switches and metadata.
- Keep the pinned approach story reversible, readable without animation, and final-state under reduced motion.
- Follow `DESIGN.md`: one restrained accent, 12px maximum content radius, serif storytelling, sans-serif product controls, and no generic AI/SaaS visual clichés.

## Data boundaries

- `/api/signups` is newsletter consent only.
- `/api/problem-interests` is a separate record, unique by email + problem, so one person may choose multiple problems.
- Keep Bun/SQLite and Worker/D1 validation and response shapes in sync.
- Never commit local SQLite files, Sites credentials, or runtime secrets.

## Git and deployment

Preserve unrelated working-tree changes. Keep `main` shippable. At the end of a completed task, commit the intended files and publish the exact committed source state. Sites deployments must be built, packaged, saved, and deployed through the Sites workflow; do not treat the static Netlify path as a complete production deployment.
