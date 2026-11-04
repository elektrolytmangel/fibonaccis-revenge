# 0011: Selected card marked by colour only

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-005
- **Amends:** the "✓ Your pick" remarks in ADRs 0006-0010

## Context

The selected card showed "✓ Your pick" so that its state did not rely on colour alone (REQ-UI-005). The user finds the
colour sufficient and wants the text and check icon removed.

## Decision

Remove the text. The selected card is navy with white text, unselected cards are light tints (light theme) or Sky Surge
(dark theme). REQ-UI-005 now requires a lightness difference of at least 3:1 between selected and unselected cards
(measured: 10.0:1 light, 5.6:1 dark) plus `aria-pressed` for assistive technology.

## Consequences

- Cleaner cards. The difference is lightness, not hue, so it stays visible to people with colour vision deficiency.
- If a theme changes, the 3:1 lightness difference between selected and unselected cards must be rechecked.

## Alternatives considered

- Keeping a subtle non-text marker (e.g. an outline): declined, colour is enough.
