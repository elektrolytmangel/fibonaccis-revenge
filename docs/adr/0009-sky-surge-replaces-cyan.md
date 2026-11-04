# 0009: Sky Surge replaces Pacific cyan

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-003, REQ-UI-005
- **Amends:** [ADR 0007](0007-navy-cyan-plum-palette.md)

## Context

The user replaced Pacific cyan `#348AA7` with Sky Surge `#6BB8D2` (hsl 195 53 % 62 %) in the palette.
Navy, plum, white and onyx are unchanged.

## Decision

The token `--cyan` becomes `--sky` (`#6BB8D2`). Its role is unchanged: since ADR 0008 it is used only as an
avatar colour (onyx initial). Wherever ADR 0007/0008 say "cyan" (including the fallback primary for the dark theme),
read Sky Surge.

## Consequences

- Onyx on Sky Surge 8.9:1 (was 5.0:1); navy on Sky Surge 5.6:1; Sky Surge against white 2.2:1 (so it must not carry
  white text or serve as a light-theme primary).
- As a dark-theme primary it would now be clearly visible (8.9:1 against onyx), which makes it a stronger fallback
  than before if navy buttons look too faint (ADR 0008).

## Alternatives considered

- None; palette change requested by the user.
