# 0003: Flat, Headspace-oriented visual style

- **Status:** accepted; colour decisions superseded by [ADR 0007](0007-navy-cyan-plum-palette.md) (flat, shape, type and motion still apply)
- **Date:** 2026-11-04
- **Requirements:** REQ-UI-001, REQ-UI-003, REQ-UI-005, REQ-UI-007

## Context

The user wants a unique, friendly, not overloaded look. From four options (Paper & Ink, Playful
Chunky, Soft Modern, Pastel Workshop) they chose "playful, oriented on Headspace, flatter than both
Headspace and Duolingo, no micro-movements".

## Decision

- **Flat:** solid fills only. No shadows, gradients, textures or thick bottom-border buttons.
- **Colour:** warm cream background, white surfaces, one orange accent (primary action, selected card),
  deep aubergine-grey text. Secondary tints (yellow, soft blue, pink) only for participant avatars and the
  result summary. Dark text on the orange accent (white on orange fails WCAG AA).
- **Shape:** generous radii (about 24 px for cards and panels, fully round buttons and avatars), lots of whitespace.
- **Type:** rounded sans (Nunito, bundled via npm, no external font request), large friendly headings.
- **Motion:** none beyond an instant state change or a fade of at most 150 ms (REQ-UI-007).
- All values live as CSS custom properties (REQ-UI-003), in `src/ui/tokens.css`.

## Consequences

- Distinct from stock UI kits; needs custom components (no component library).
- Depth is expressed by colour and spacing only, so contrast and focus rings must be designed carefully (REQ-UI-005).

## Alternatives considered

- Soft Modern, Paper & Ink, Pastel Workshop: not chosen.
- Duolingo-style chunky 3D buttons: rejected, too heavy and animated.
