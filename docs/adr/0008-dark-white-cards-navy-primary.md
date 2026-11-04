# 0008: Dark theme with white cards and navy primary

- **Status:** accepted; white cards replaced by Sky Surge in [ADR 0010](0010-dark-sky-surge-cards.md)
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-004, REQ-UI-005
- **Amends:** the dark-theme column of [ADR 0007](0007-navy-cyan-plum-palette.md)

## Context

ADR 0007 used navy for unselected cards and cyan as the primary in the dark theme, because navy on onyx is
only 1.6:1. The user preferred white inactive cards and navy as the primary, and judged that it works.

## Decision

Dark theme: inactive cards and bar tracks are white with onyx text (`--card`, `--on-card`); primary
(buttons, selected card, bar fill) is navy with white text. Panels stay navy 50 % on onyx. Cyan is no longer
used as a primary; it remains an avatar colour. The light theme is unchanged.

## Consequences

- White text on navy 12.5:1; onyx on white cards 19.8:1; navy on white (bars) 12.5:1.
- A navy button on the onyx page has only 1.6:1 shape contrast (the label is fully legible). Selected cards stand
  out among white cards and carry the "✓ Your pick" text. If buttons look too faint, add a thin white/cyan
  outline or fall back to cyan (ADR 0007).
- Disabled controls use 50 % opacity of the card colours.
- New token `--on-card` for text on cards.

## Alternatives considered

- Cyan primary (ADR 0007): replaced at the user's request.
