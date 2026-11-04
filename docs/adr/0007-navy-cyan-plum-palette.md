# 0007: Navy, cyan and plum palette

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-003, REQ-UI-004, REQ-UI-005
- **Supersedes:** [ADR 0006](0006-sky-and-night-blue-themes.md)

## Context

The user supplied the palette: Oxford navy `#12355B`, Pacific cyan `#348AA7`, plum `#D68FD6`, white, onyx `#0A0A0A`.
Rules: navy is the primary colour; white and black are used otherwise, mostly; cyan is the primary where navy lacks
contrast; the other colours are used carefully.

## Decision

| Role | Light | Dark |
| --- | --- | --- |
| background | white | onyx |
| panels / rows | navy 6 % on white | navy 50 % on onyx |
| unselected cards, bar tracks | navy 12 % on white | navy |
| text / muted | onyx / navy 75 % on white | white / white 72 % on onyx |
| **primary** (buttons, selected card, bars) | **navy**, white text | **cyan**, onyx text |
| plum | revealed vote chips, one avatar colour | same |
| focus ring | navy | white |

- Navy on onyx is only 1.6:1, so the dark theme uses cyan as primary. In the light theme cyan fails with white text (3.9:1), so navy stays primary there.
- Plum is limited to revealed-value chips and avatars. Cyan outside the dark primary role appears only in avatars.
- Tints (the panel shades) are mixes of palette colours, defined with `color-mix` in `src/ui/tokens.css`; no other hues.
- The palette's gradients are not used (flat style, ADR 0003).

## Consequences

- Contrast: text 19.8:1 (both), muted 5.2:1+ (light) / 8.5:1+ (dark), white on navy 12.5:1, onyx on cyan 5.0:1, onyx on plum 8.3:1.
- Selected card in dark is cyan on navy (3.2:1), so it also carries the "✓ Your pick" text.
- Changing the palette means changing the five base variables.

## Alternatives considered

- Cyan as primary in both themes: white text fails AA (3.9:1); onyx text on cyan works but breaks "navy is primary".
- Sky/night blue (ADR 0006): replaced by the user's palette.
