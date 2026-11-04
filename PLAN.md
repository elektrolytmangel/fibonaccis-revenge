# Plan and status

The single place to see where fibonaccis-revenge stands, what was decided, and
what comes next. **Read this first when you pick up work. Update it whenever you
make a plan or finish a piece of work** (see [CLAUDE.md](CLAUDE.md)).

- **Last updated:** 2026-11-04 (requirements accepted, style chosen; UI in progress)
- **Version:** none yet
- **Repository:** <https://github.com/elektrolytmangel/fibonaccis-revenge>

## Where things stand

### Done

| Area                 | State                                                                                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository structure | Process scaffolding only: CLAUDE.md/PLAN.md handover, requirements as code (`scripts/reqs.py`), ADRs, design doc stub, issue/PR templates, CODEOWNERS, Dependabot, CI (requirements check; web jobs activate once `package.json` exists). |
| Requirements         | Seed requirements (all `proposed`) in `docs/requirements/`.                                                                                                                                                                               |

### Not started

UI not built yet.

## Plan

### Next steps (in order)

1. ~~User confirms requirements and picks a style~~ Done 2026-11-04 (see Decisions).
2. **UI on local state (in progress)** (no kith yet): room shell, Fibonacci deck, hidden votes, reveal, result summary, reset (REQ-ROOM-_, REQ-VOTE-_, REQ-UI-*). Pure logic in `src/domain/` so kith can replace the state source later.
3. **Integrate kith** once the library is ready (user: ready in ~1-2 days from 2026-11-04): consume the `kith-wasm` tarball ([ADR 0001](docs/adr/0001-react-vite-kith-npm.md)), room/vote data model ADR, smoke test two tabs through a local relay (REQ-SYNC-*).
4. **Polish**: motion, dark theme, rejoin, configurable decks.

### Open questions for the user

- Which kith version/tag to pin once released?
- Where does the kith relay run for real use?
- Anonymous joining by link, or invitations? (kith invitations/permissions are not implemented yet.)
- Card decks: fixed Fibonacci only, or configurable?

### Open issues

- **kith is alpha and "not fine for real user data"** (relay does not check org membership, no permission checks on changes). Fine for building; revisit before exposing publicly.

## Decisions (don't re-litigate without the user)

| Decision                                                                                                                     | Why                                                              | Where                                             |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| Web app on TypeScript + Vite + React                                                                                         | User choice (2026-11-04)                                         | [ADR 0001](docs/adr/0001-react-vite-kith-npm.md)  |
| kith consumed as npm tarball from a GitHub Release                                                                           | User choice (2026-11-04); kith publishes to GitHub Releases only | [ADR 0001](docs/adr/0001-react-vite-kith-npm.md)  |
| Style: flat, Headspace-oriented (cream, one orange accent, rounded type), no micro-movements; changed REQ-UI-007 accordingly | User (2026-11-04)                                                | [ADR 0003](docs/adr/0003-flat-headspace-style.md) |
| All 24 requirements accepted as written (REQ-UI-007 reworded for the style)                                                  | User (2026-11-04)                                                | `docs/requirements/`                              |
| UI first on local state, kith integrated afterwards                                                                          | User (2026-11-04): library ready in 1-2 days                     | Next steps 2-3                                    |
| Requirements need user confirmation before implementation                                                                    | User (2026-11-04)                                                | Next steps 1                                      |
| Process mirrors kith (PLAN.md, requirements as code, ADRs, agent merges own green PRs)                                       | User request (2026-11-04)                                        | `CLAUDE.md`                                       |
| Requirements as code                                                                                                         | Versioned with code, traced to tests                             | [ADR 0002](docs/adr/0002-requirements-as-code.md) |

## Pitfalls already hit

- **Vitest needs `globals: true`** for `it`/`test` without imports (also what `reqs.py` detects as test context).

## Working agreements

- Branch from `main`, open a PR, wait for CI. **Once every check is green the agent merges its own PR**
  (`gh pr merge --merge --delete-branch`). Never merge on red or pending checks, never force-push. Tags and releases stay the user's.
- Commits end with the `Co-Authored-By` line; PR descriptions follow `.github/pull_request_template.md`.

## Log

- **2026-11-04**: Repository structure set up, modelled on kith.
- **2026-11-04**: App scaffold (Vite/React/TS/Vitest/ESLint/Prettier), UI requirements and style options added. Next: user confirms requirements and style.
- **2026-11-04**: PR #1 merged (the user allowed the merge after the classifier blocked it once). User accepted all requirements and chose the style (ADR 0003). Next: build the UI on local state.
