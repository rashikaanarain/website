# CLAUDE.md

Guidance for Claude Code (and any AI agent) working in this repository. Read this first, then the deeper docs it points to.

## What this is

The **OpenNyAI** marketing homepage — a single, hand-written static site (no framework, no build step) deployed on Netlify. OpenNyAI is an Agami mission using AI + a community of justicemakers to solve long-stuck justice problems in India.

## Read these before making changes

- **`README.md`** — full handoff: how to run, repo structure, section-by-section content, deployment.
- **`DESIGN_SYSTEM.md`** — colour tokens, type, buttons, nav, spacing. The visual contract.
- **`context.md`** — org strategy, the "3.0" pivot, flagship project (Big Bail Bash), and the authoritative messaging/tone. Read before touching copy.

## Repo layout

```
index.html          # The ENTIRE site: all markup + all CSS (one <style> in <head>) + the hero-video <script> at the bottom.
assets/             # opennyai-logo.svg (white, for dark bgs), opennyai-logo-dark.svg (ink, for light bgs), agami-logo.svg
netlify.toml        # Netlify: publish root, no build, security/cache headers
README.md, DESIGN_SYSTEM.md, context.md, CLAUDE.md
```

There is no `package.json`, no node_modules, no bundler. Do not add tooling or split files without an explicit request — the single-file simplicity is intentional.

## Run / preview

No build. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Netlify is connected to GitHub and auto-deploys: **push to `main` → live in ~1 min.** Nothing to compile. So keep `main` shippable.

## Design rules (do not break)

- **Token-driven.** All themed values are CSS custom properties in `:root`. Use `var(--…)`; never hardcode hex/px for colours or fonts.
- **Accent = pink (`--pink` `#DA6EAA`).** Used for eyebrows, the hero "10x", stat figures, the live dot, footer titles, and primary buttons on dark sections. Pink works on light or dark.
- **Green-on-dark only.** `--green` (`#30CF8C`) must never sit on a light background (fails contrast). It's currently unused; on light use `--forest`.
- **`.on-dark`** on a section flips eyebrows/buttons/accents correctly. Dark section → add the class; light section → omit it.
- **Type:** Fraunces (`--font-display`) for all headings; Source Sans 3 (`--font-body`) for everything else. Loaded via one Google Fonts `<link>`.
- **Pills everywhere** (`border-radius:999px`) for buttons/nav. Cards ~18px radius, lift on hover.
- **Respect `prefers-reduced-motion`** (already gated at the end of the stylesheet) for any new animation.
- **Copy tone:** concrete, human, outcome-first (people released, wages recovered). Avoid hedge words like "demonstration"/"prototype". See `context.md`.

## Hero background video

The hero has a muted, auto-looping YouTube clip behind a dark gradient (`.hero-overlay`) with light text on top. Implemented with the YouTube IFrame API — a `<div id="heroPlayer">` inside `.hero-video`, and a `<script>` at the bottom of `index.html`. To change the clip, edit the constants in that script: `videoId`, `HERO_START`, `HERO_END` (seconds). Keep it **muted** (browsers block unmuted autoplay). Never download/rehost the video — embed via the official player only.

**Rights caveat:** the current clip is third-party (CNA Insider). Swap for owned/licensed footage before any public launch.

## Git workflow & version safety

The owner is non-technical — be explicit and cautious with git.

- Commit in small, described steps. After a change the owner approves, commit + push (or hand them the exact commands).
- **`v1-liked`** is a git tag marking the approved baseline (10x hero, bulletin board, pink accent, inline signup). Restore with `git checkout v1-liked -- .`.
- When a new version is approved, **tag it** (`v2-liked`, …) so there's a trail of known-good checkpoints.
- If a change is disliked and not yet committed, discard it (`git checkout -- <files>`) to fall back to the last commit.
- Remote: `github.com/rashikaanarain/website`. Auth is via `gh` (browser login) on the owner's machine; GitHub does not accept passwords for push.

## Standing request from the owner

At the **end of every task**, commit the work and either push or provide copy-paste push commands (`git add -A && git commit -m "…" && git push`).

## Known placeholders / next steps

See `README.md` §7 and `context.md` §10 — e.g. verify placeholder stats, decide on the legacy-tools section, optional custom domain, and swapping the hero video.
