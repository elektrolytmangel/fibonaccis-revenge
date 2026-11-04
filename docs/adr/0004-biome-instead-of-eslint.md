# 0004: Biome instead of ESLint + Prettier

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-PLAT-001

## Context

`typescript-eslint` (latest 8.72.1) declares a peer range of `typescript <6.1.0` and builds on the
TypeScript compiler API, so it blocked the Dependabot upgrade to TypeScript 7 (PR #5).
Type checking is done by `tsc`; the linter only needs style and bug-pattern rules.

## Decision

Use Biome (`@biomejs/biome`, pinned exactly) for linting and formatting of code files (`src/`, `tests/`,
root `*.ts`/`*.json`). It has its own parser, so it is independent of the TypeScript version, and includes
React hooks rules (`useExhaustiveDependencies`, `useHookAtTopLevel`). Removed: ESLint, `typescript-eslint`,
`eslint-plugin-react-hooks`, `@eslint/js`, `globals`, Prettier. TypeScript is now 7.

Markdown is not formatted by Biome (it would reflow the generated traceability tables).

## Consequences

- One tool and one config (`biome.json`); `npm run lint` checks, `npm run format` fixes.
- Rule set differs from ESLint; fewer type-aware rules (covered by `tsc`).
- Biome is pinned exactly so formatting and lint changes arrive as deliberate Dependabot PRs.

## Alternatives considered

- oxlint + Prettier: two tools, type-aware rules immature.
- ESLint with `--legacy-peer-deps`: hides the conflict and may break on TS 7.
