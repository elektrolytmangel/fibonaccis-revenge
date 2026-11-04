# Platform

### REQ-PLAT-001: Web app stack

- **Priority:** must | **Phase:** 1 | **Status:** accepted | **Verify:** review | **Source:** ADR 0001

The app must be a TypeScript + Vite + React web app.

### REQ-PLAT-002: kith from release tarball

- **Priority:** must | **Phase:** 2 | **Status:** accepted | **Verify:** review | **Source:** ADR 0001

kith must be consumed as the `kith-wasm` npm tarball of a pinned GitHub Release.

### REQ-PLAT-003: Modern browsers

- **Priority:** should | **Phase:** 1 | **Status:** accepted | **Verify:** manual | **Source:** design §Platform

The app should work in current Chrome, Firefox, Safari and Edge, desktop and mobile.

### REQ-PLAT-004: Favicon

- **Priority:** should | **Phase:** 1 | **Status:** implemented | **Verify:** manual | **Source:** user (2026-11-04)

The app must have an SVG favicon in the app's palette that stays recognisable at 16 px.
