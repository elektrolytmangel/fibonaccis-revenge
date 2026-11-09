# Development

## Prerequisites

| For                | Needs                                            |
| ------------------ | ------------------------------------------------ |
| App                | Node 22, pnpm 12 (version pinned in `packageManager`; `corepack enable` or `npm i -g pnpm`)                                     |
| Requirements check | Python 3.11+ (standard library only)             |
| Local sync testing | the kith relay binary from a kith GitHub Release |

## Daily loop

```sh
pnpm lint                        # Biome check (lint + format)
pnpm format                      # Biome auto-fix
pnpm typecheck
pnpm test
python3 scripts/reqs.py --write     # after touching requirements or `req:` tags
```

## Trying sync locally

```sh
# 1. relay (binary from the kith release; it listens on :8080 and has no flags)
gh release download v0.2.0-beta.3 -R elektrolytmangel/kith -p 'kith-relay-x86_64-unknown-linux-gnu.tar.gz'
tar xzf kith-relay-*.tar.gz && ./kith-relay

# 2. app (relay URL defaults to ws://localhost:8080/v1/ws; override with VITE_KITH_RELAY)
pnpm dev
```

Create a room, click "Copy invite link" and open the link in a **different browser profile**
(or private window): one browser profile owns a room's database, and the host has to stay
online while someone joins. Unit tests and `pnpm test` use the in-memory local backend
(`localBackend` in `src/ui/App.tsx`), not kith.

## Where code goes

| Change                                          | Place                                         |
| ----------------------------------------------- | --------------------------------------------- |
| Pure room/vote logic (reducers, result summary) | `src/domain/` (no React, no kith)             |
| kith integration                                | `src/sync/`                                   |
| UI                                              | `src/ui/`                                     |
| Tests                                           | next to code as `*.test.ts(x)` or in `tests/` |

## CI

`.github/workflows/ci.yml`: the `requirements` job always runs; the `web` job
runs lint, typecheck, test and build once `package.json` exists. Each is a plain
`pnpm` script, so you can run them locally.

## Deployment

`.github/workflows/deploy-azure.yml` builds the app and uploads `dist/` to an
Azure Static Web App on every push to `main` (and on manual dispatch). It needs
the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` (the Static Web App's
deployment token) and the repository variable `KITH_RELAY_URL` (a `wss://` URL,
built in as `VITE_KITH_RELAY`; the job fails early if it is missing or not `wss://`).
Without them the deploy job fails; CI is unaffected.
