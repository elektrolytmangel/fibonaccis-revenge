# Sync (kith)

### REQ-SYNC-001: Live updates between participants

- **Priority:** must | **Phase:** 2 | **Status:** accepted | **Verify:** test | **Source:** design §Sync

Joins, votes, reveals and resets must reach all online participants without a page reload.

### REQ-SYNC-002: Concurrent actions converge

- **Priority:** must | **Phase:** 2 | **Status:** accepted | **Verify:** test | **Source:** design §Sync

Concurrent actions (e.g. two votes, reveal during a vote) must converge to the same state on all devices.

### REQ-SYNC-003: End-to-end encrypted

- **Priority:** must | **Phase:** 2 | **Status:** accepted | **Verify:** review | **Source:** design §Sync

Room content must be transported only via kith's encrypted changes; the relay must see no vote or name.

### REQ-SYNC-004: Late join gets current state

- **Priority:** must | **Phase:** 2 | **Status:** accepted | **Verify:** test | **Source:** design §Sync

A participant joining while votes are being cast must see the current vote state (as far as another participant is online).
