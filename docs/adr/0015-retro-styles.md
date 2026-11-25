# 0015: Retro styles as a second axis next to light/dark

- **Status:** accepted
- **Date:** 2026-11-25
- **Requirements:** REQ-UI-004, REQ-UI-011

## Context

The user asked for a retro theme next to the current one, available in light and dark, and chose two flavours:
8-bit and terminal. The modern look (ADR 0003, palette ADRs 0007-0012) stays the default.

## Decision

- A separate *Style* setting (`modern` / `pixel` / `terminal`), stored as `fr.style` and set as `data-style` on
  `<html>`; the colour mode stays `data-theme` (system / light / dark). Both are applied in `main.tsx` before the first
  render.
- `src/ui/styles.css` overrides the design tokens per style and adds a few shape rules. Colours use CSS `light-dark()`
  with `color-scheme`, so each style defines its palette once for both modes. The modern tokens are untouched.
- 8-bit: Press Start 2P for the title, card values and the estimate; Pixelify Sans for body text (readable, has
  Cyrillic and Polish letters); square corners; 3 px ink borders; hard 4 px offset shadows (solid, no blur); the
  selected card sits "pressed" in its shadow. Palette from the Sweetie 16 family, navy as the light primary.
- Terminal: JetBrains Mono; green phosphor on black (dark) and line-printer black on paper (light); inverse video
  for the selected card and the primary button; `[ 5 ]` card labels, `> ` before the primary action and a static
  `_` cursor on the landing title (decorative content with empty alt text for screen readers).
- Fonts are self-hosted via `@fontsource`; files only download when a style uses them.

## Consequences

- The flat, no-shadow rule of ADR 0003 applies to the modern style only; retro styles may use solid block shadows.
  No motion in any style (REQ-UI-007).
- New colours were checked by hand against WCAG AA (all text pairs ≥ 5.3:1, selected vs unselected card ≥ 5.3:1).
- `light-dark()` needs Chrome 123, Firefox 120, Safari 17.5.

## Alternatives considered

- One combined theme list (modern-light, modern-dark, retro-light, ...): mixes two independent choices.
- Press Start 2P everywhere: too wide for buttons and Russian labels on a phone.
- VT323 for the terminal: no Cyrillic.
