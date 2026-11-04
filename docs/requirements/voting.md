# Voting

### REQ-VOTE-001: Votes hidden until reveal

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Voting

The UI must not show other participants' chosen cards before a reveal. The
card value should not be derivable from what is shown (only "voted" status).

### REQ-VOTE-002: Fibonacci deck

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Voting

A participant must be able to choose one card from the Fibonacci deck
(0, 1, 2, 3, 5, 8, 13, 21, 42, ?) and change it until reveal.

### REQ-VOTE-003: Reveal

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Voting

Any participant must be able to reveal the round; afterwards all votes are visible to everyone.

### REQ-VOTE-004: Result summary

- **Priority:** should | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Voting

After reveal the app should show the distribution, the average of numeric
votes and whether there is consensus.

### REQ-VOTE-005: Reset

- **Priority:** must | **Phase:** 1 | **Status:** implemented | **Verify:** test | **Source:** design §Voting

Any participant must be able to reset the room, clearing all votes and hiding them again. There is no round counter.
