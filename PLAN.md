# Plan and status

The single place to see where fibonaccis-revenge stands, what was decided, and
what comes next. **Read this first when you pick up work. Update it whenever you
make a plan or finish a piece of work** (see [CLAUDE.md](CLAUDE.md)).

- **Last updated:** 2026-11-09 (menu and stacked layout feedback)
- **Version:** none yet (no tag, nothing deployed)
- **State of `main`:** CI green (requirements + web), no open PRs, no open Dependabot PRs.
- **Repository:** <https://github.com/elektrolytmangel/fibonaccis-revenge>

## Where things stand

### Done

| Area | State |
| --- | --- |
| Process | Modelled on kith: this plan as handover, requirements as code (`scripts/reqs.py`, traceability matrix), ADRs 0001-0013, issue/PR templates, CODEOWNERS, Dependabot, CI. The agent merges its own PRs when CI is green. |
| Tooling | Vite + React + TypeScript 7, pnpm 12, Biome (lint + format), Vitest + Testing Library. 18 tests. CI: `requirements` and `web` (install, lint, typecheck, test, build). |
| Local app | Landing (name, create/join room), room with: title + invite link, 10 cards (0, 1, 2, 3, 5, 8, 13, 21, 42, ?), Reveal and Reset, one **estimate row** (smallest Fibonacci number ≥ the average of the numeric votes; empty until reveal), scrollable participant list. Votes hidden until reveal; fits the screen. |
| Look | Flat, Headspace-oriented, no micro-movements. Palette: Oxford navy (primary), Sky Surge (avatars only), plum (revealed chips, avatars), white, onyx. Light and dark theme (system/light/dark toggle). Own SVG favicon (white Fibonacci spiral, plum dot, navy). |
| Sync (kith) | `@elektrolytmangel/kith-wasm` 0.2.0-beta.2 as release tarball. Room = kith org, one JSON document per room, one-time invite links, auto-admission by the host, rejoin after reload ([ADR 0014](docs/adr/0014-room-document-and-invites.md)). Code in `src/sync/`; `App` takes a `Backend` (`kithBackend` in `main.tsx`, `localBackend` in tests). |
| Languages | German, English, Polish (in-house i18n, correct plurals, browser detection, remembered choice). |
| Room layout | User picked option B (2026-11-09): one-line header + "⋯" menu (invite, your rooms, leave, theme, language; no footer), then user feedback: whole page scrolls, nothing pinned, same stacked order on desktop and phone (cards, actions, estimate, participants), menu items as buttons (language on its own row, closes on outside tap), iPhone-safe invite copy (ClipboardItem with promise, fallback shows the link). REQ-UI-009/010 revised. Checked in Firefox only, not on a real iPhone. |
| Rooms | Optional room name (in the room document), list of joined rooms on the landing page (from localStorage sessions), "Your rooms" and "Leave room" (confirm, removes own player entry, frees client, deletes session/device key/IndexedDB) in the room footer. |
| Requirements | 32 in `docs/requirements/`: 18 implemented, 6 partial, 8 accepted (see below). ROOM-005..007 are new, from the user's request of 2026-11-09. |

### Requirement status (all accepted by the user; none are `proposed`)

- **Implemented (18):** ROOM-001, ROOM-005..007, VOTE-001..005, UI-002, 003, 007..010, LANG-001, 002, PLAT-004.
- **Partial (6):**
  - ROOM-002 (join by link) and ROOM-003 (participant list): UI done, other participants only exist with kith.
  - UI-001 (look), UI-004 (themes), UI-006 (phone first): need the user's visual check. The agent checked Firefox at 390 px and 1100 px, light and dark, de and pl, not 360 px and not Chrome/Safari.
  - UI-005 (accessible): contrast was calculated by hand for the palette; there is no automated check yet.
- **Accepted, not started (8):** SYNC-001..004, ROOM-004 (rejoin keeps identity): all need kith. PLAT-001..003 are decisions/manual checks (PLAT-002 happens with the kith integration, PLAT-003 needs a browser pass).

### Not done

- **No automated two-client test.** Sync was checked by hand with two Firefox contexts (create, join by link, vote, reveal, estimate, reset, reload) against a local relay; unit tests cover only the room document (`src/sync/roomDoc.test.ts`). The throwaway Playwright script lived outside the repo.
- Web app hosting: Azure Static Web App (workflow `deploy-azure.yml`, needs secret `AZURE_STATIC_WEB_APPS_API_TOKEN` and repository variable `KITH_RELAY_URL` (`wss://…`), both set by the user; not yet run). Nothing is released; the kith relay host is still open.

## Plan

### Next steps (in order)

1. **User reviews the look** (`pnpm dev`) and the German/Polish texts (written by the agent, need a native check). Fix what they find.
2. **Test and harden the kith integration:**
   1. Automated two-client test (real wasm + local relay, e.g. Playwright in CI) for REQ-SYNC-001/004, ROOM-002..004; then set those requirements to `implemented`.
   2. Connection state in the UI (offline / reconnecting), host-offline message when joining times out, "room opened in another tab" message (kith allows one client per database).
   3. Edge cases: rename after join, participants who close the tab without leaving (stale entries stay in the list), leaving while offline (the removal may not reach others; not hand-tested with two clients), expired invite, Safari/Chrome check of IndexedDB + Web Locks.
3. **Polish and hardening:** automated contrast check (REQ-UI-005), 360 px and cross-browser pass (REQ-UI-006, PLAT-003), PNG/apple-touch icon, mobile pass on the landing page.
4. **Release/hosting** once the app works with kith (needs decisions below).

### Open questions for the user


- Where does the kith relay (and the web app) run for real use?
- Joining needs the host online and every invite link is single use ("Copy invite link" makes a new one). Acceptable, or should a room get a permanent always-on member (kith-always-on) so it works without the host?
- Participants who close the tab without "Leave room" stay in the list: remove by presence/timeout, by the host, or leave as is?
- Hidden votes are UI-only for now (votes are in the shared, encrypted document). Commit-reveal later?
- Card deck: fixed (0, 1, 2, 3, 5, 8, 13, 21, 42, ?) or configurable?
- Should Reveal require at least one vote (current) and may anyone reveal/reset (current)?

### Open issues

- **kith is alpha and "not fine for real user data"** (relay does not check org membership, no permission checks on changes). Fine for building; revisit before exposing publicly.
- **Navy buttons on the onyx dark background have only 1.6:1 shape contrast** (labels 12.5:1): accepted by the user ([ADR 0008](docs/adr/0008-dark-white-cards-navy-primary.md)). Fallback if it looks too faint: Sky Surge as the dark primary (8.9:1).
- **Translations are unreviewed** (de, pl).

## Decisions (don't re-litigate without the user)

| Decision | Why | Where |
| --- | --- | --- |
| Web app on TypeScript + Vite + React; kith as npm tarball from a GitHub Release | User choice | [ADR 0001](docs/adr/0001-react-vite-kith-npm.md) |
| Process mirrors kith; requirements need user confirmation before implementation | User request | `CLAUDE.md`, [ADR 0002](docs/adr/0002-requirements-as-code.md) |
| UI first on local state, kith integrated afterwards | User: library ready in 1-2 days | Next steps |
| Biome instead of ESLint/Prettier; TypeScript 7 | `typescript-eslint` caps TypeScript at <6.1 | [ADR 0004](docs/adr/0004-biome-instead-of-eslint.md) |
| pnpm instead of npm | User | [ADR 0005](docs/adr/0005-pnpm.md) |
| Flat, Headspace-oriented style; no micro-movements | User | [ADR 0003](docs/adr/0003-flat-headspace-style.md) |
| Palette: Oxford navy `#12355B` primary, Sky Surge `#6BB8D2`, plum `#D68FD6` sparingly, white, onyx `#0A0A0A`; dark theme: navy primary, inactive cards in the light-theme tint | User supplied colours and rules | ADRs [0007](docs/adr/0007-navy-cyan-plum-palette.md), [0008](docs/adr/0008-dark-white-cards-navy-primary.md), [0009](docs/adr/0009-sky-surge-replaces-cyan.md), [0012](docs/adr/0012-dark-cards-same-as-light.md) |
| Selected card: colour only (lightness contrast ≥ 3:1 + `aria-pressed`), no "Your pick" text | User: "the colour is enough" | [ADR 0011](docs/adr/0011-selected-card-colour-only.md) |
| Deck 0, 1, 2, 3, 5, 8, 13, 21, 42, ? (no coffee); no round counter, only Reset | User | REQ-VOTE-002, 005 |
| Estimate = smallest Fibonacci number ≥ average of numeric votes; no distribution/average/consensus UI; row always present, empty until reveal | User | REQ-VOTE-004 |
| Room layout: one-line header + menu, cards, actions, estimate row, participants; whole page scrolls, stacked on all sizes | User (revised 2026-11-09) | REQ-UI-009, 010 |
| Reset is a constant, always enabled secondary button; disabled controls are flat (no opacity, cards unchanged after reveal) | User | REQ-UI-002 |
| i18n de/en/pl without a library | Small app; `Intl.PluralRules` | [ADR 0013](docs/adr/0013-own-minimal-i18n.md) |
| Web app hosted on Azure Static Web Apps, deployed from `main` by GitHub Actions | User | `.github/workflows/deploy-azure.yml` |
| Favicon: white Fibonacci spiral with a plum dot on navy | Agent design, user asked for "very nice" | `public/favicon.svg` |

| kith 0.2.0-beta.1 pinned (was alpha.3); room = org, one JSON document, one-time invites, UI-only hidden votes | Agent proposal while integrating (user asked to "try to implement kith with this release"); open questions above | [ADR 0014](docs/adr/0014-room-document-and-invites.md) |

## Pitfalls already hit

- **kith wasm must be initialised before any static call** (`KithClient.parseInvite` threw "wasm is undefined"): `await ensureWasm()` first. `createDocument` uses "the only org": hence one client/database per room.
- **Playwright/Chromium are not installed on the dev machine.** For a two-client check install `playwright` + `npx playwright install firefox` in a scratch dir; Firefox has no clipboard read, so stub `navigator.clipboard.writeText` to capture the invite link. The relay binary has no flags (starts on :8080 at once).
- **`typescript-eslint` does not support TypeScript 7**: hence Biome. Don't reintroduce ESLint until it does.
- **Biome must not format Markdown** (reflows the generated TRACEABILITY tables); `biome.json` limits it to code. Prettier once split the labels of a YAML dropdown; check YAML after formatting.
- **pnpm 12 rejects packages younger than 1 day** (`minimumReleaseAge`), also from the lockfile: `pnpm install --frozen-lockfile` failed in CI on a same-day Biome release. Pin the previous release and keep the policy. Dependabot PRs for brand-new releases may need a day.
- **Requirement IDs must match `REQ-[A-Z]+-\d{3}`**: no digits in the area prefix (so `LANG`, not `I18N`).
- **Vitest needs `globals: true`** for `it`/`test` without imports (also what `reqs.py` detects as test context). `<output>` has an implicit `status` role and collides with the hint line.
- **Never `pkill -f` a pattern that also appears in your own command line**: it kills the shell (exit 144). Kill by PID.
- **Firefox headless screenshots** (visual checks): `firefox --no-remote --profile <dir under ~/snap/firefox/common> --headless --screenshot <file under ~/snap/firefox/common> --window-size=W,H <url>`. Snap confinement forbids `/tmp`; the first call sometimes fails, retry. Use a temporary scratch page rendering `Room` with fake state against `vite`, and delete it afterwards.
- **The permission classifier blocked a PR merge once** (PR #1); the user allowed it afterwards. Later merges went through.

## Working agreements

- Branch from `main`, open a PR, wait for CI. **Once every check is green the agent merges its own PR**
  (`gh pr merge --merge --delete-branch`). Never merge on red or pending checks, never force-push. Tags and releases stay the user's.
- After a merge, continue with the next plan item without asking, but ask when a decision is the user's.
- Commits end with the `Co-Authored-By` line; PR descriptions follow `.github/pull_request_template.md`.
- Update `PLAN.md`, `CHANGELOG.md` and (for decisions that supersede) the ADR index in every change.

## Log

- **2026-11-04**: Repository structure modelled on kith, app scaffold, UI requirements; user accepted all requirements and chose the style (PR #1, #3).
- **2026-11-04**: Local-state UI (#7). Dependabot jsdom, vitest, setup-node merged; ESLint/Prettier replaced by Biome and TypeScript 7 (#8); pnpm (#9).
- **2026-11-04**: Theme iterations, ending on the user's palette (#11 sky/night, #12 navy/cyan/plum, #13 white dark cards, #14 Sky Surge, #16 Sky Surge cards, #18 light-tint cards; espresso PR #10 closed). ADRs 0006-0012.
- **2026-11-04**: Room header with app name, no rounds, 42 instead of coffee (#15); selected card without text (#17).
- **2026-11-04**: New layout, estimate row, i18n de/en/pl, scrollable list, favicon (#19); constant Reset, flat disabled states (#20).
- **2026-11-04**: Plan and status report refreshed.
- **2026-11-05**: kith 0.1.0-alpha.3 integrated (`src/sync/`, ADR 0014); end-to-end checked by hand in two Firefox contexts. Next: automated two-client test, then user review.
- **2026-11-05**: Azure Static Web Apps deploy workflow (`deploy-azure.yml`); user adds the deployment token secret.
- **2026-11-05**: Deploy workflow passes `KITH_RELAY_URL` as `VITE_KITH_RELAY` and fails if it is not a `wss://` URL.
- **2026-11-08**: kith bumped to 0.2.0-beta.1 (tarball URL only; lint, typecheck, 22 tests, build pass). Not re-checked by hand with two clients/relay beta: the sync notes in `docs/requirements/sync.md` still describe the alpha.3 check. Do that with the automated two-client test (next steps, 2.1).
- **2026-11-09**: kith bumped to 0.2.0-beta.2. Room names, list of joined rooms, leave room (REQ-ROOM-005..007); 26 tests pass. Leave/list/name not yet checked by hand against a relay with two clients.
- **2026-11-09**: Room layout option B implemented (header menu, page scroll, pinned dock, desktop two columns).
- **2026-11-09**: Menu/layout feedback: stacked layout on all sizes, nothing pinned, menu restyled and closes outside, iPhone copy fix.
