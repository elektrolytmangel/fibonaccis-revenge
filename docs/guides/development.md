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
