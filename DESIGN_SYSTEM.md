# OpenNyAI Website — Design System

Extracted from the PUCAR website (live: [pucar.netlify.app](https://pucar.netlify.app/); source: [github.com/pucardotorg/pucar-website](https://github.com/pucardotorg/pucar-website)) and adapted for OpenNyAI. PUCAR and OpenNyAI are sibling Agami missions, so the same warm, paper-editorial system carries across cleanly.

The system is token-driven: every value below lives in a `:root` block and is referenced via `var(--name)`. Reuse the tokens rather than hardcoding hex/px.

---

## 1. Colour

Brand palette (given directly by the client, not sampled):

| Token | Hex | Role |
|---|---|---|
| `--green` | `#30CF8C` | **Dominant accent — dark backgrounds only.** The logo-mark green. |
| `--green-soft` | `#CCEBDE` | Pale tint of green. Soft backgrounds. |
| `--pink` | `#DA6EAA` | Secondary accent. Eyebrow labels, chips, link hovers. No light/dark restriction. |
| `--pink-soft` | `#F1D0E2` | Pale tint of pink. Section background tints. |
| `--forest` | `#111F26` | Dark background **and** the light-background stand-in for green. |
| `--forest-deep` | `#0A151A` | Darkest background (deep sections, footer accents). |

Warm neutrals (the paper base — unchanged from PUCAR):

| Token | Hex | Role |
|---|---|---|
| `--cream` | `#F6F1E6` | Page background. |
| `--cream-deep` | `#ECE2CE` | Deeper cream for banding. |
| `--paper` | `#FBF8F2` | Card / raised surface, light text on dark. |
| `--ink` | `#241E1A` | Body text, headings. |
| `--ink-soft` | `#55493F` | Secondary text, nav links. |
| `--muted` | `#8A7E6E` | Tertiary text, captions. |
| `--line` | `rgba(36,30,26,0.12)` | Hairline borders. |

### The one hard rule — green on dark only

Bright `--green` (`#30CF8C`) **only ever sits on a dark background.** On cream it fails contrast (1.8:1; WCAG text needs 4.5:1). Anywhere you'd want "green" on a light surface, use `--forest` instead — same hue, dark, 11–12:1 contrast. Green is reserved for: dark-section eyebrows/stats, primary buttons on dark, footer accents.

---

## 2. Typography

Two families, loaded from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'Fraunces', Georgia, 'Times New Roman', serif` | All headings (h1–h3), taglines, hero. Weight 500, `line-height: 1.05`. |
| `--font-body` | `'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Body, nav, buttons, labels. |

**Scale (fluid, clamp-based):**

- Hero / display: `clamp(1.9rem, 4.2vw, 3.1rem)`, Fraunces 500, `line-height 1.05`.
- Section heading (h2): `clamp(1.6rem, 3vw, 2.4rem)`, Fraunces 500.
- Card title (h3): `~1.15–1.4rem`, Fraunces 500.
- Body: `1rem–1.08rem`, Source Sans 3 400, `line-height 1.6`.
- **Eyebrow label:** `.78rem`, weight 600, `text-transform: uppercase`, `letter-spacing: .16em`. Colour `--forest` on light sections, `--pink` or `--green` on dark.

---

## 3. Buttons

Base `.btn`:

```css
.btn{
  display:inline-flex; align-items:center;
  padding:13px 24px;
  border-radius:999px;      /* fully pill */
  font-weight:600; font-size:.92rem;
  text-decoration:none;
  transition:background .2s ease, color .2s ease, border-color .2s ease;
}
```

**Primary** — context-aware (this is the green-on-dark rule in action):
- On a **dark** background: `background: var(--green); color: var(--ink);` hover → `#51D79E` (lighter green, keeps ink legible).
- On a **light** background: `background: var(--forest); color: var(--paper);` hover → `#1C3540`.

**Ghost / secondary:**
- On dark: `border:1px solid rgba(251,248,242,.4); color:var(--paper);` hover `background:rgba(251,248,242,.12)`.
- On light: `border:1px solid rgba(36,30,26,.32); color:var(--ink);` hover `background:rgba(36,30,26,.06)`.

**Outline:** `border:1px solid var(--line); color:var(--ink);` hover `background:rgba(36,30,26,.06)`.

Buttons often carry a looping down-arrow icon as a "scroll" hint (`.btn-arrow`, `arrowLoop` keyframe).

---

## 4. Navbar

A floating **frosted-glass pill**, not a solid bar. Logo sits left (scrolls away, absolute), nav cluster + CTA pinned right.

```css
.site-nav{
  display:flex; gap:2px;
  background:rgba(251,248,242,.52);
  backdrop-filter:blur(16px) saturate(1.6);
  border:1px solid rgba(26,26,26,.07);
  border-radius:999px;
  padding:5px;
  box-shadow:0 12px 32px rgba(17,31,38,.10), inset 0 1px 0 rgba(255,255,255,.55);
}
.site-nav a{
  font-size:.9rem; font-weight:600; letter-spacing:.01em;
  color:var(--ink-soft);
  padding:8px 15px; border-radius:999px;
  transition:background .22s, color .22s, box-shadow .22s;
}
.site-nav a:hover{
  background:var(--forest); color:var(--paper);
  box-shadow:0 4px 12px rgba(17,31,38,.25);
}
```

Header padding: `18px clamp(20px,4vw,48px)`. Nav items collapse to a burger below 640px. An **ecosystem switcher** (a caret beside the logo) opens a dark panel linking sibling Agami missions — carry this over for OpenNyAI to link Agami / PUCAR.

---

## 5. Layout & spacing

- **Page background:** `--cream`. Sections alternate cream / `--forest` (dark) for rhythm.
- **Content max-width:** `~1180px`, centred.
- **Section padding (vertical):** `clamp(48px, 8vh, 96px)`; hero uses `clamp(96px,14vh,140px)` top.
- **Horizontal gutter:** `clamp(20px, 5vw, 72px)`.
- **Grid gap:** `clamp(40px, 6vw, 96px)` for hero two-column; `clamp(28px,4vw,56px)` for card grids.
- **Card grids:** `repeat(auto-fill, minmax(300px, 1fr))`.
- **Pill radius everywhere interactive:** `999px`. Cards use `~16–20px` radius.

**Signature hero pattern:** two columns — left-aligned copy on the left (`1.05fr`), a raised "bulletin board" / visual panel on the right (`.95fr`), collapsing to one column below 900px. Panel is a dark forest surface with slightly-tilted "pinned note" cards.

---

## 6. Footer

Solid **black** (`#000`), light text, three-part grid: blurb left, sitemap columns right, copyright full-width below.

```css
.site-footer{ background:#000; color:rgba(251,248,242,.8); padding:64px clamp(20px,5vw,72px) 32px; }
.footer-col-title{ font-size:.68rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; color:var(--green); }
.footer-col a{ font-size:.85rem; color:rgba(251,248,242,.72); }
.footer-col a:hover{ color:var(--paper); }
```

Note green is used for the small column titles here — legal, because the footer is dark.

---

## 7. Motion & finish

- Transitions: `.2s–.45s ease` on colour/background/shadow. Smooth `scroll-behavior`.
- Hover lift on cards/buttons: `translate:0 -1px` + deeper shadow.
- Looping arrow hint on scroll CTAs.
- `-webkit-font-smoothing:antialiased`; `overflow-x:hidden` on body.
- Reduced-motion: gate non-essential animation behind `@media (prefers-reduced-motion)`.

---

## 8. Copy-paste `:root`

```css
:root{
  --cream:#F6F1E6; --cream-deep:#ECE2CE; --paper:#FBF8F2;
  --ink:#241E1A; --ink-soft:#55493F; --muted:#8A7E6E;
  --green:#30CF8C; --green-soft:#CCEBDE;
  --pink:#DA6EAA; --pink-soft:#F1D0E2;
  --forest:#111F26; --forest-deep:#0A151A;
  --line:rgba(36,30,26,0.12);
  --font-display:'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body:'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```
