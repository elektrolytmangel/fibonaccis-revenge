# Rooms and participants

### REQ-ROOM-001: Create a room

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Rooms

A user must be able to create a room and become its first participant.

### REQ-ROOM-002: Join a room by link

- **Priority:** must | **Phase:** 1 | **Status:** partial | **Verify:** test | **Source:** design §Rooms

A user must be able to join an existing room via a shareable link and choose a display name.

UI done (link, name form). Joining a room that lives on another device needs kith (REQ-SYNC-001).

Join links are one-time kith invites; the host must be online to admit (ADR 0014). Checked by hand.

### REQ-ROOM-003: Participant list

- **Priority:** must | **Phase:** 1 | **Status:** partial | **Verify:** test | **Source:** design §Rooms

All participants must see who is in the room and who has voted (not what).

UI done; other participants only appear with kith.

Other participants appear through kith; checked by hand.

### REQ-ROOM-004: Rejoin keeps identity

- **Priority:** should | **Phase:** 2 | **Status:** partial | **Verify:** test | **Source:** design §Rooms

A returning participant on the same device should keep their identity and the room state.

The device identity and room data live in IndexedDB; a reload reopens the room. Checked by hand.

### REQ-ROOM-005: Optional room name

- **Priority:** should | **Phase:** 2 | **Status:** implemented | **Verify:** test | **Source:** user request 2026-11-09

The creator of a room may give it a name. Without one the room stays unnamed. The name is part of the shared room document and shown in the room header.

### REQ-ROOM-006: List of joined rooms

- **Priority:** should | **Phase:** 2 | **Status:** implemented | **Verify:** manual | **Source:** user request 2026-11-09

The landing page lists the rooms this browser has joined (by name, or "Unnamed room"); a room opens with one click, without an invite. Rooms can also be reached from inside a room ("Your rooms").

### REQ-ROOM-007: Leave a room

- **Priority:** should | **Phase:** 2 | **Status:** implemented | **Verify:** test | **Source:** user request 2026-11-09

A participant can leave a room after a confirmation. They disappear from the participant list (with their vote), and the room is forgotten on this device (session, device key, database). Coming back needs a new invite link.

### REQ-ROOM-008: Share or copy the invite link

- **Priority:** must | **Phase:** 2 | **Status:** implemented | **Verify:** test | **Source:** user request 2026-11-09

The menu offers the invite link as: **copy** on desktop (the label changes to "Link copied" for 2 s, then returns), **share** through the system share sheet on touch devices that have one (iOS, Android). If copying or sharing fails, and always on request ("Show invite link"), the link is displayed in a selectable field so it can be copied by hand.
