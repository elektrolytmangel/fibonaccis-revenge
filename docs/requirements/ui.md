# UI and style

### REQ-UI-001: Friendly, uncluttered visual identity

- **Priority:** must | **Phase:** 1 | **Status:** proposed | **Verify:** review | **Source:** user (2026-11-04), design §Style

The app must have its own recognisable look that feels friendly and is not overloaded:
few colours, generous whitespace, rounded shapes, no decoration without function. The
look is one of the options in the design doc's §Style, chosen by the user.

### REQ-UI-002: One obvious next action

- **Priority:** must | **Phase:** 1 | **Status:** proposed | **Verify:** review | **Source:** design §Style

At every room state (waiting, voting, revealed) exactly one primary action must be visually dominant
(e.g. "Reveal", "Next round"); secondary actions must be visibly quieter.

### REQ-UI-003: Design tokens

- **Priority:** must | **Phase:** 1 | **Status:** proposed | **Verify:** review | **Source:** design §Style

Colours, radii, spacing, type scale and shadows must be defined once as CSS custom properties; components
must not hard-code them. Switching the style option must only require changing the tokens.

### REQ-UI-004: Light and dark theme

- **Priority:** should | **Phase:** 1 | **Status:** proposed | **Verify:** manual | **Source:** design §Style

The app should follow the system colour scheme and let the user override it.

### REQ-UI-005: Accessible

- **Priority:** must | **Phase:** 1 | **Status:** proposed | **Verify:** test | **Source:** design §Style

Text contrast must meet WCAG AA. All actions, including choosing a card, must work with the keyboard,
with a visible focus ring. Card state must not rely on colour alone. Motion must respect `prefers-reduced-motion`.

### REQ-UI-006: Phone first

- **Priority:** must | **Phase:** 1 | **Status:** proposed | **Verify:** manual | **Source:** design §Style

The layout must work from 360 px wide; cards must be usable one-handed (touch targets of at least 44 px).

### REQ-UI-007: Calm motion

- **Priority:** should | **Phase:** 3 | **Status:** proposed | **Verify:** manual | **Source:** design §Style

Selecting a card and revealing the round should animate subtly (under 300 ms, e.g. card flip); no
animation may block interaction.

### REQ-UI-008: Friendly microcopy

- **Priority:** should | **Phase:** 1 | **Status:** proposed | **Verify:** review | **Source:** design §Style

Empty and waiting states ("Waiting for 2 more votes…") must use short, human wording; no jargon about
sync, keys or relays in the normal flow.
