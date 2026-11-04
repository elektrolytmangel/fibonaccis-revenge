# UI and style

### REQ-UI-001: Friendly, uncluttered visual identity

- **Priority:** must | **Phase:** 1 | **Status:** partial | **Verify:** review | **Source:** user (2026-11-04), design §Style

The app must have its own recognisable look that feels friendly and is not overloaded:
few colours, generous whitespace, rounded shapes, no decoration without function. The
look is flat (solid fills; no shadows, gradients or textures) and oriented on Headspace: soft
backgrounds, a fixed five-colour palette (Oxford navy primary, mostly white and onyx, sky surge and plum
sparingly), friendly rounded type. See [ADR 0003](../adr/0003-flat-headspace-style.md) and
[ADR 0007](../adr/0007-navy-cyan-plum-palette.md) and
[ADR 0009](../adr/0009-sky-surge-replaces-cyan.md).

### REQ-UI-002: One obvious next action

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** review | **Source:** design §Style

At every room state (waiting, voting, revealed) exactly one primary action must be visually dominant
(e.g. "Reveal", "Reset"); secondary actions must be visibly quieter.

### REQ-UI-003: Design tokens

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** review | **Source:** design §Style

Colours, radii, spacing, type scale and shadows must be defined once as CSS custom properties; components
must not hard-code them. Switching the style option must only require changing the tokens.

### REQ-UI-004: Light and dark theme

- **Priority:** should | **Phase:** 1 | **Status:** partial | **Verify:** manual | **Source:** design §Style

The app should follow the system colour scheme and let the user override it.

Implemented (system/light/dark toggle); needs a manual check of both themes.

### REQ-UI-005: Accessible

- **Priority:** must | **Phase:** 1 | **Status:** partial | **Verify:** test | **Source:** design §Style

Text contrast must meet WCAG AA. All actions, including choosing a card, must work with the keyboard,
with a visible focus ring. The selected card must differ from unselected cards by a strong lightness difference (at least 3:1), not by hue alone, and must expose its state to assistive technology (`aria-pressed`). Motion must respect `prefers-reduced-motion`.

Done: buttons with `aria-pressed`, selected card 10.0:1 (light) / 5.6:1 (dark) against unselected, focus ring, no motion. Open: automated contrast check.

### REQ-UI-006: Phone first

- **Priority:** must | **Phase:** 1 | **Status:** partial | **Verify:** manual | **Source:** design §Style

The layout must work from 360 px wide; cards must be usable one-handed (touch targets of at least 44 px).

### REQ-UI-007: No micro-movements

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** review | **Source:** user (2026-11-04), ADR 0003

The UI must not use micro-movements: no hover or press animations, wobbles, bounces, tilts, parallax or
looping animation. State changes (selecting a card, reveal, reset) happen instantly or with a plain
fade of at most 150 ms; `prefers-reduced-motion` removes the fade.

### REQ-UI-008: Friendly microcopy

- **Priority:** should | **Phase:** 1 | **Status:** implemented | **Verify:** review | **Source:** design §Style

Empty and waiting states ("Waiting for 2 more votes…") must use short, human wording; no jargon about
sync, keys or relays in the normal flow.

### REQ-UI-009: Room layout

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** user (2026-11-04)

The room must show, top to bottom: title with invite link; the cards to choose from; the actions (reveal, reset);
the estimate row (REQ-VOTE-004); the participant list. Settings (theme, language) sit in a footer.

### REQ-UI-010: Fits the screen

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** manual | **Source:** user (2026-11-04)

The room must fit the viewport height without page scrolling. When the participant list is long, only the list
scrolls; the cards, actions and estimate row stay in view. Cards stay in two rows of five on phones.
