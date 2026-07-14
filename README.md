# OpenNyAI Website

The marketing/homepage site for **OpenNyAI** — an Agami mission using AI and a community of justicemakers to solve long-stuck justice problems in India. This repository is a plain static website (hand-written HTML + CSS, no build step) deployed on Netlify.

This README is a **handoff document**: everything a new contributor or agent needs to understand the project, run it, change it, and ship it. Two companion docs go deeper where noted:

- **`context.md`** — the org's strategy, mission pivot (OpenNyAI 3.0), flagship project (Big Bail Bash), and messaging direction. Read this to understand *what the site should say and why*.
- **`DESIGN_SYSTEM.md`** — the full design system (colour, type, buttons, nav, spacing) extracted from the sibling PUCAR site. Read this to understand *how the site should look*.

---

## 1. Quick start

There is **no build and no dependencies**. It's static files.

To preview locally, either double-click `index.html` to open it in a browser, or serve the folder (nicer for correct asset paths):

```bash
cd ~/Documents/OpenNyAI/Website
python3 -m http.server 8000
# then open http://localhost:8000
```

To edit: open `index.html` in any text editor. All CSS lives in one `<style>` block in the `<head>` — there is no separate stylesheet. All copy is inline in the HTML body.

---

## 2. Repository structure

```
Website/
├── index.html          # The homepage — all markup + all CSS (in <head>). This is the whole site.
├── assets/
│   ├── opennyai-logo.svg        # White logo — used on dark backgrounds (footer)
│   ├── opennyai-logo-dark.svg   # Dark (ink) logo — used on the light header
│   └── agami-logo.svg           # Parent-org logo (available for the ecosystem switcher)
├── netlify.toml        # Netlify deploy config (publish root, no build, security headers)
├── README.md           # This file
├── DESIGN_SYSTEM.md    # Design system reference
└── context.md          # Org strategy, mission, and messaging source-of-truth
```

That's the entire site: one HTML file plus three SVGs. Keep it that way unless there's a strong reason to add tooling — the simplicity is deliberate.

---

## 3. What the site says (content)

The homepage follows the structure of the current live site at [opennyai.org](https://opennyai.org/), re-skinned in the PUCAR design language, with copy updated toward the OpenNyAI 3.0 direction. Sections, in order:

1. **Header** — pill nav (About / Approach / Missions / Participate) + "Join the Mission" CTA, with an ecosystem-switcher caret by the logo.
2. **Hero** — "How can we 10x access to justice?" + a "bulletin board" panel showing live work (Big Bail Bash, wage recovery, "bring a stuck problem").
3. **About / Why we exist** — the community + AI + public-goods thesis (3 cards).
4. **Approach** (dark section) — the 3-step model (find the stuck challenge → narrow the scope → solve it for real) + a stat row.
5. **Missions** (dark) — OpenNyAI's place in the Agami ecosystem (Agami, PUCAR, Praani, ODR).
6. **Participate** — the problem-selection criteria as 3 cards (stuck now / the subset / the signal).
7. **Join / CTA** — volunteer + email signup.
8. **Footer** — black, sitemap + Agami attribution.

**Before changing copy, read `context.md`.** It contains the authoritative messaging: the pivot from "building AI for justice" to "making justice with AI," the old→new copy revisions, and the tone rules (concrete, human, outcome-first — avoid hedged words like "demonstration"/"prototype"). Placeholder-ish content that still needs real numbers/examples is flagged in `context.md` §10.

---

## 4. Design system (summary — full details in `DESIGN_SYSTEM.md`)

The system is borrowed from the sibling **PUCAR** site ([pucar.netlify.app](https://pucar.netlify.app/) · [github.com/pucardotorg/pucar-website](https://github.com/pucardotorg/pucar-website)): warm, paper-editorial, serif headlines. It's token-driven — all values are CSS custom properties in `:root`. **Reuse the tokens; don't hardcode hex or px.**

**Colour tokens:**

```css
--cream:#F6F1E6; --cream-deep:#ECE2CE; --paper:#FBF8F2;   /* warm neutrals */
--ink:#241E1A; --ink-soft:#55493F; --muted:#8A7E6E;        /* text */
--green:#30CF8C; --green-soft:#CCEBDE;                     /* dominant accent */
--pink:#DA6EAA; --pink-soft:#F1D0E2;                       /* secondary accent */
--forest:#111F26; --forest-deep:#0A151A;                   /* dark backgrounds */
--line:rgba(36,30,26,0.12);
```

**The one rule you must not break:** bright `--green` (`#30CF8C`) **only ever appears on a dark background** — it fails contrast on cream (1.8:1). On light surfaces, use `--forest` instead (same hue, dark). In the code this is handled by the `.on-dark` class: sections/bands with `class="on-dark"` flip eyebrows, primary buttons, and accents to green; everywhere else they resolve to forest. So: **if you add a dark section, give it `class="on-dark"`; if you add a light one, don't.**

**Type:** Fraunces (serif) for all headings/display; Source Sans 3 (sans) for body/UI. Loaded via Google Fonts `<link>` in the head. Headings use `--font-display`, weight 500, tight line-height.

**Interactive:** everything pill-shaped (`border-radius:999px`). Buttons `.btn` + `.btn-primary` / `.btn-ghost`; primary colour auto-adapts to light/dark via the `.on-dark` parent. Nav is a frosted-glass floating pill. Cards lift on hover.

**Spacing:** content max-width `1180px`; section padding `clamp(56px,9vh,110px)`; gutter `clamp(20px,5vw,72px)`. Fluid `clamp()` sizing throughout, so it's responsive by default; explicit breakpoints at 900px and 640px.

---

## 5. How to make common changes

- **Edit copy:** find the text in `index.html` and change it in place.
- **Add a light section:** copy an existing `<section class="section">` block; use `--forest` for any accent colour.
- **Add a dark section:** copy a `<section class="section on-dark">` block; green accents are then allowed and automatic.
- **Add a nav item:** add an `<a>` inside `<nav class="site-nav">`, pointing to a section `#id`.
- **Swap the logo:** replace the SVGs in `assets/`. Remember the header needs a *dark* logo (visible on cream) and the footer a *white* one.
- **Change a colour globally:** edit the token in `:root` — it propagates everywhere.

Keep the "green-on-dark-only" rule intact and prefer the real token names (`--green`, `--forest`, `--pink`).

---

## 6. Deployment

**Host:** Netlify, connected to this GitHub repo ([github.com/rashikaanarain/website](https://github.com/rashikaanarain/website)).

The pipeline is automatic: **push to `main` → Netlify rebuilds and publishes within ~1 minute.** `netlify.toml` sets the publish directory to the repo root, no build command, plus security and caching headers. There is nothing to compile.

To deploy the first time (one-off), in the Netlify web UI: **Add new site → Import an existing project → Deploy with GitHub → select the `website` repo → Deploy** (defaults are correct because of `netlify.toml`).

**Git workflow (day to day):**

```bash
cd ~/Documents/OpenNyAI/Website
git add -A
git commit -m "describe your change"
git push
```

Auth is via the GitHub CLI (`gh auth login`, browser-based) already configured on the owner's machine. GitHub no longer accepts account passwords for push — use `gh` or a Personal Access Token.

---

## 7. Current state & next steps

**Done:** homepage (`index.html`) live in the PUCAR design system; design-system and context docs written; Netlify config in place.

**Open items (see `context.md` §10 for detail):**

- Fill remaining placeholder stats/examples with verified numbers.
- Build out inner pages if desired (About, Approach, Participate) on the same system — currently everything is a single-page site with anchor links.
- Decide whether to feature the legacy AI tools (Rhetorical Roles, Legal NER, Jugalbandi) as a "track record" section or retire them.
- Confirm the final nav/IA (e.g. whether MISAAL/Misaal gets its own page).
- Optional: attach a custom domain (e.g. opennyai.org) in Netlify domain settings.

**Reference material:**

- Current live site: https://opennyai.org/
- New-direction prototype (structure reference): the "Techno Human V1" Framer page (URL in `context.md`).
- Parent org: https://www.agami.in/
- Design donor: https://pucar.netlify.app/ and its repo.

---

## 8. Conventions for future changes

- Single HTML file, single `<style>` block — don't split into a framework or add a build step without good reason.
- Use CSS variables, never raw hex/px for themed values.
- Never put bright green on a light background.
- Write copy that is concrete and human (outcomes, real people) per `context.md`'s tone rules.
- Respect `prefers-reduced-motion` (already gated at the bottom of the stylesheet) for any new animation.
- Commit in small, described steps; every push auto-deploys, so keep `main` shippable.
