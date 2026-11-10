# Changelog

## Unreleased

- Russian added as a language (with plural forms).
- Fix: dev server served index.html instead of the kith wasm file (pre-bundling); excluded from `optimizeDeps`.
- Repository structure.
- Local-state UI: rooms, Fibonacci deck, hidden votes, reveal, results, themes.
- Tooling: Biome replaces ESLint and Prettier; TypeScript 7.
- Package manager: pnpm.
- Themes: sky (light) and night blue (dark), no orange.
- Themes: user palette (Oxford navy, Pacific cyan, plum, white, onyx).
- Dark theme: white inactive cards, navy primary.
- Palette: Sky Surge replaces Pacific cyan.
- Room: app name in header, no round counter (Reset only), deck with 42 instead of coffee, more space above the cards.
- Dark theme: Sky Surge inactive cards.
- Selected card: no text mark, colour only.
- Dark theme: inactive cards use the light theme's tint.
- Room layout redone; estimate row (next Fibonacci above the average) replaces the result panel; German/English/Polish; scrollable participant list; SVG favicon.
- Reset button constant; flat disabled states.
- Plan refreshed.
- kith 0.1.0-alpha.3 integrated: rooms sync end-to-end encrypted through a relay; join by one-time invite link; rejoin after reload (ADR 0014).
- Azure Static Web Apps deployment workflow (push to `main`, secret `AZURE_STATIC_WEB_APPS_API_TOKEN`).
- Deploy workflow builds with the relay URL from repository variable `KITH_RELAY_URL` (must be `wss://`).
- kith upgraded to 0.2.0-beta.1 (no code changes needed).
- kith upgraded to 0.2.0-beta.2.
- Rooms: optional name (REQ-ROOM-005), list of joined rooms on the landing page and "Your rooms" in a room (REQ-ROOM-006), leave a room (REQ-ROOM-007).
- Room layout (option B): one-line header with a menu (invite, rooms, leave, theme, language) replaces the footer; the page scrolls, cards/actions/estimate pinned at the bottom on phones, two columns on desktop; compact estimate row.
- Room menu: item style, language on its own row, closes on outside tap; layout stacked on all sizes and the page scrolls as a whole (nothing pinned); invite link copy works on iOS Safari.
- Invite link: copy on desktop (reverts after 2 s), system share sheet on phones, selectable link as fallback (REQ-ROOM-008).
- kith 0.2.0-beta.3: one invite link admits several people (24 h, up to 20).
