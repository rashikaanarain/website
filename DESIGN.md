---
name: OpenNyAI
description: A calm civic workshop for making justice with community and AI.
colors:
  primary: "#111F26"
  primary-hover: "#1C3540"
  accent: "#DA6EAA"
  accent-hover: "#E58DBB"
  canvas: "#F6F1E6"
  canvas-deep: "#ECE2CE"
  surface: "#FBF8F2"
  ink: "#241E1A"
  ink-soft: "#55493F"
  muted: "#6F6459"
  line: "#241E1A1F"
  dark: "#111F26"
  dark-deep: "#0A151A"
  success: "#176B4A"
  success-on-dark: "#8FE1BD"
  error: "#A33B32"
  error-on-dark: "#EFAFA8"
  black: "#000000"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.75rem, 7vw, 5.75rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  sm: "6px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "clamp(72px, 11vw, 144px)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  content-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: OpenNyAI

## Overview

**Creative North Star: "The Civic Workshop"**

OpenNyAI should feel like entering a well-run place where difficult public work is made tangible. Materials are quiet, structure is visible, and the human outcome remains in the foreground. The public surface uses scale, pacing, and restrained depth to invite participation; the admin surface uses the same proportions and colors with denser, task-first typography.

The system rejects generic AI and SaaS landing-page clichés. No repeated eyebrow scaffolding, decorative status theatre, telemetry language, glass panels, ornamental gradients, or floating card collections. Parallax is a spatial cue, never a spectacle, and all content remains readable without motion.

**Key Characteristics:**

- Warm neutral canvas with a dark civic anchor and one human accent.
- Serif display voice for public storytelling; sans-serif for every product control.
- Open layouts structured by rules, alignment, and whitespace before containers.
- Flat at rest, tactile only in response to interaction.
- Public expression and admin restraint built from the same primitives.

## Colors

The palette is warm, grounded, and restrained. Forest carries authority, pink supplies human warmth, and the canvas keeps long-form reading calm.

### Primary

- **Civic Forest:** Navigation, primary actions, major dark sections, and high-confidence text on light surfaces.

### Secondary

- **Assembly Pink:** One focal action or highlighted phrase per composition. It is not a general decoration color.

### Neutral

- **Working Canvas:** The default page field.
- **Archive Paper:** Raised reading and form surfaces.
- **Soft Ink:** Supporting prose and secondary controls.
- **Hairline:** Dividers and structural boundaries.

**The One Accent Rule.** Assembly Pink should occupy less than ten percent of a screen and identify a real point of attention.

**The Legibility Rule.** Bright color never carries small body copy. Use Civic Forest or Ink for text on light surfaces.

## Typography

**Display Font:** Fraunces (with Georgia fallback)

**Body Font:** Source Sans 3 (with system-ui fallback)

**Character:** The pairing combines an unmistakably human public voice with direct, highly legible working typography. The serif is reserved for ideas and outcomes; the sans handles explanations, navigation, forms, data, and state.

### Hierarchy

- **Display** (500, fluid display scale, 0.98): One primary statement per page or major opening composition.
- **Headline** (500, fluid headline scale, 1.02): Section arguments and decisive calls to action.
- **Title** (500, 1.35rem, 1.15): Named projects and grouped content.
- **Body** (400, 1rem, 1.65): Explanatory copy capped at 70 characters per line.
- **Label** (600, 0.875rem, normal tracking): Controls, table headers, and short navigation labels in sentence or title case.

**The No Eyebrow Rule.** Never place tiny tracked uppercase labels above headings. Establish hierarchy with the heading, a short lead, alignment, or a structural rule.

**The Product Type Rule.** Admin controls, navigation, tables, and states use Source Sans 3 only; display type never enters product chrome.

## Elevation

The system is flat by default. Depth comes from overlap, contrast, and small responsive transforms. Public parallax layers may move at different rates, but no resting component requires a decorative wide shadow. The admin uses tonal layers and hairlines rather than elevation.

### Shadow Vocabulary

- **Navigation lift** (`0 8px 20px rgba(17,31,38,.10)`): Only for navigation that must remain distinct while crossing content.
- **Interactive lift** (`0 4px 8px rgba(17,31,38,.12)`): Appears on hover for a genuinely clickable raised item, never alongside a decorative border.

**The Flat-at-Rest Rule.** If a surface needs both a border and a shadow before interaction, remove the shadow.

**The Motion-with-Meaning Rule.** Parallax may shift decorative or supporting layers by at most 48px across a viewport. It never moves body copy, form controls, or data tables and is fully disabled for reduced motion.

## Components

### Buttons

- **Shape:** Compact full pill for actions only.
- **Primary:** Civic Forest on light surfaces; Assembly Pink may carry the single primary action on dark surfaces.
- **Hover / Focus:** Subtle color shift and at most 2px of lift. Focus uses a visible two-color outline, never shadow alone.
- **Secondary:** Transparent with a structural hairline; it does not imitate a second primary action.

### Cards / Containers

- **Corner Style:** Gently curved (12px maximum).
- **Background:** Archive Paper or a tonal dark layer.
- **Shadow Strategy:** Flat at rest. Interactive lift is allowed only for links.
- **Border:** Use a hairline when the boundary clarifies grouping; omit it when spacing already does the job.
- **Internal Padding:** 24px on standard surfaces, reduced to 16px for dense admin rows.

### Inputs / Fields

- **Style:** Solid surface, 6px corners, clear label above, full-width hit area.
- **Focus:** Dark border plus an outer canvas-colored ring for contrast.
- **Error / Disabled:** Error text is explicit and adjacent; disabled state changes both color and cursor.

### Navigation

The public navigation is a quiet floating bar with limited rounding and no decorative blur. Links use title case and a simple underline or tonal hover. On mobile it becomes an accessible disclosure. Admin navigation is a conventional top bar with a clear page title and logout action.

### Tables

Tables are product components: sans-serif only, left aligned, with persistent column headers, generous row height, meaningful empty states, and horizontal containment on narrow screens. Dates are formatted for humans and preserve machine-readable `datetime` values.

## Do's and Don'ts

### Do:

- **Do** lead each section with one claim and use whitespace to make its hierarchy obvious.
- **Do** use the shared color, type, spacing, radius, focus, and motion tokens on both public and admin surfaces.
- **Do** keep parallax transform-only, subtle, and optional.
- **Do** show inline success and error feedback for every form action.
- **Do** reserve cards for projects, records, or choices that genuinely need a boundary.

### Don't:

- **Don't** use generic AI and SaaS landing-page clichés.
- **Don't** use tiny uppercase eyebrow labels as repeated section scaffolding.
- **Don't** add decorative status theatre such as live dots, system labels, telemetry, command-line language, or fake operational dashboards.
- **Don't** use glassmorphism, excessive pills, floating card grids, or ornamental gradients.
- **Don't** make admin interfaces visually novel at the expense of legibility and task speed.
- **Don't** pair a decorative border with a wide soft shadow, use gradients for text, or place accent stripes on one side of a container.
