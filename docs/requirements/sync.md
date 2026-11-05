# Sync (kith)

### REQ-SYNC-001: Live updates between participants

- **Priority:** must | **Phase:** 2 | **Status:** partial | **Verify:** test | **Source:** design §Sync

Joins, votes, reveals and resets must reach all online participants without a page reload.

Works with kith 0.1.0-alpha.3 (ADR 0014); checked by hand with two browser profiles through a local relay. No automated two-client test yet.

### REQ-SYNC-002: Concurrent actions converge

- **Priority:** must | **Phase:** 2 | **Status:** partial | **Verify:** test | **Source:** design §Sync

Concurrent actions (e.g. two votes, reveal during a vote) must converge to the same state on all devices.

Convergence of the room document is unit-tested (`src/sync/roomDoc.test.ts`); two real devices checked by hand.

### REQ-SYNC-003: End-to-end encrypted

- **Priority:** must | **Phase:** 2 | **Status:** implemented | **Verify:** review | **Source:** design §Sync

Room content must be transported only via kith's encrypted changes; the relay must see no vote or name.

Room content (names, votes) is only written to a kith document of the room's org; the relay sees ciphertext (kith MLS).

### REQ-SYNC-004: Late join gets current state

- **Priority:** must | **Phase:** 2 | **Status:** partial | **Verify:** test | **Source:** design §Sync

A participant joining while votes are being cast must see the current vote state (as far as another participant is online).

Works with kith 0.1.0-alpha.3 (ADR 0014); checked by hand with two browser profiles through a local relay. No automated two-client test yet.
