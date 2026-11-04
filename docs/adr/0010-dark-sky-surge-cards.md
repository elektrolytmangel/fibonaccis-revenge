# 0010: Dark theme with Sky Surge cards

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-004, REQ-UI-005
- **Amends:** [ADR 0008](0008-dark-white-cards-navy-primary.md)

## Context

ADR 0008 made inactive cards white in the dark theme. The user wants Sky Surge (`#6BB8D2`) for inactive
(not selected) cards instead.

## Decision

Dark theme: `--card` (inactive cards, result-bar tracks, disabled buttons) is Sky Surge with onyx text.
The selected card, buttons and bar fills stay navy with white text. Light theme unchanged.

## Consequences

- Onyx on Sky Surge 8.9:1; white on navy 12.5:1; navy on Sky Surge 5.6:1, so the selected (navy) card is clearly
  distinct from the others and also shows "✓ Your pick".
- Sky Surge now covers a larger area in the dark theme, but still only as a card/track colour; plum stays limited
  to chips and avatars.

## Alternatives considered

- White cards (ADR 0008): replaced at the user's request.
