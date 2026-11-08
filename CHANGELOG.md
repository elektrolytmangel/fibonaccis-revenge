# Changelog

## Unreleased

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
