# 0012: Dark theme cards use the light theme's tint

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-004, REQ-UI-005
- **Supersedes:** [ADR 0010](0010-dark-sky-surge-cards.md)

## Context

The user asked why the dark theme should not simply use the light theme's inactive-card colour, instead of Sky Surge.
There was no technical reason against it.

## Decision

Dark theme: `--card` (inactive cards, result-bar tracks, disabled buttons) is navy 12 % on white (`#E3E7EB`), the same
as in the light theme, with onyx text. Selected cards and buttons stay navy with white text. Sky Surge is used only
for avatars again.

## Consequences

- Onyx on the tint 17:1; navy (selected) against the tint 10.0:1, which is stronger than against Sky Surge (5.6:1).
- Both themes share the card colour, so there is one less theme-specific value to maintain.
- Cards are the brightest surfaces in the dark theme.

## Alternatives considered

- Sky Surge (ADR 0010) and white (ADR 0008): replaced at the user's request.
