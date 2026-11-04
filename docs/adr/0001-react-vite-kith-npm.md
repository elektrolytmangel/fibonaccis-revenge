# 0001: TypeScript + Vite + React, kith as npm tarball

- **Status:** accepted
- **Date:** 2026-11-04
- **Requirements:** REQ-PLAT-001, REQ-PLAT-002

## Context

We build a web scrum poker on the kith library. kith publishes only to GitHub
Releases; its web package is `kith-wasm-X.Y.Z.tgz` (wasm-bindgen).

## Decision

- App: TypeScript, Vite, React; tests with Vitest; npm as package manager.
- kith is a dependency on the release tarball URL of a pinned kith tag, in `package.json`.
- The kith relay is run separately (container or binary from the kith release).

## Consequences

- Upgrading kith is a deliberate version bump of the URL (Dependabot will not see it).
- kith is alpha; its API and wire format may break between versions.
- Web only. No native clients planned.

## Alternatives considered

- Svelte or no framework: user chose React.
- Vendoring kith source / submodule: heavier, no benefit while releases exist.
