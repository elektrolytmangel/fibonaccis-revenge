# 0006: Sky and night-blue themes, no orange

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-004, REQ-UI-005
- **Supersedes:** the colour decisions of [ADR 0003](0003-flat-headspace-style.md)

## Context

ADR 0003 used a cream background with an orange accent in both themes. The user disliked the dark theme
(purple-ish, then an espresso alternative) and wants different light and dark themes with no orange. From three
pairings (sky/night blue, mint/forest, rose/plum) the user chose sky/night blue.

## Decision

| | Light (sky) | Dark (night blue) |
| --- | --- | --- |
| background / surface / card | `#F2F8FF` / `#FFFFFF` / `#DCEBFF` | `#111A2B` / `#1B2740` / `#2A3A5C` |
| text / muted | `#1B2A41` / `#5A6B85` | `#EEF3FB` / `#A9B8D0` |
| accent / on-accent | `#5AA9F5` / `#1B2A41` | `#7FB2FF` / `#111A2B` |

Each theme has its own accent; no orange anywhere. Flat style, radii, type and the no-motion rule
from ADR 0003 are unchanged. Values live in `src/ui/tokens.css` (REQ-UI-003).

## Consequences

- Contrast: body text 13.5:1 (light) / 15.6:1 (dark); text on the accent 5.8:1 / 8.1:1.
- In the light theme the sky accent against the page is about 2.3:1. State is therefore never shown by
  colour alone (selected card carries "✓ Your pick" text).
- Swapping to another palette only requires editing tokens.

## Alternatives considered

- Mint day / forest night, rose day / plum night: not chosen.
- Keeping orange with a new dark theme (espresso, midnight navy, forest): superseded by the no-orange request.
