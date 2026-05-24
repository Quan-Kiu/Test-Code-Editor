# Stories — Wobble Buddies MVP

## WB-001 — Bootstrap playable Web3D foundation slice

**Status:** in_progress  
**Quality level:** L2  
**Goal:** establish a real browser-rendered WebGL prototype foundation aligned to approved design boards.

### Acceptance criteria

- Harness and registered design references exist in the repository.
- Vite + TypeScript + React Three Fiber + Drei + Rapier + Zustand project builds.
- Title/menu, gameplay HUD, pause, checkpoint notification and completion states render in the pastel art direction.
- A player can choose solo, move/jump through a physics playground, push an object, activate checkpoint feedback, respawn, pause/resume and reach finish.
- Local co-op selection spawns the second buddy and shared camera foundation, with keyboard sandbox fallback clearly documented while gamepad-complete traversal remains a later validation story.
- Real Chromium captures browser evidence and reports WebGL state and console/page errors.

### Out of story

Full independent hand constraints, tuned Buddy Link rescue physics, tuned rope swing traversal, online networking and production release.

## WB-002 / WB-003 — Grab System and Buddy Link Rescue Slice

**Status:** validated  
**Quality level:** L2  
**Goal:** turn Zone 4 into a playable signature-mechanic slice using independent grab inputs, bounded physical pull feedback and safe rescue retry.

### Acceptance criteria

- Player 1 can acquire, visibly pull and immediately release a nearby grabbable prop using either hand input.
- Local Co-op Rescue enters a Zone 4 practice setup directly, with a short safe hanging setup for the signature-mechanic slice.
- A hand-to-buddy acquisition produces a visible and physical bounded connection; the hanging buddy can be pulled toward safety without uncontrolled acceleration.
- Releasing the hand or respawning clears the active connection predictably.
- New real Chromium/WebGL evidence records object-grab and rescue-link states from the real application.

### Out of story

Full heavy-door puzzle completion, tuned rope swing finale, gamepad-only complete traversal, production release and human playtest signoff.

## WB-004 — Full Traversal and Finale

**Status:** validated  
**Quality level:** L2  
**Goal:** make the Play Solo route a readable start-to-finish five-zone playthrough with a forgiving heavy-door beat and rope-finale payoff.

### Acceptance criteria

- A solo player traverses Zone 1 through Zone 5 without a collision dead end.
- The heavy-door landmark has a discoverable progression interaction and visible open-path feedback.
- The rope finale has a player-triggered interaction and bounded launch assistance before the finish gate.
- Completion, WebGL/browser evidence and composition comparison are recorded from the real built app.

### Out of story

Full five-zone local co-op, gamepad-only verification, fully simulated pendulum tuning, public release and human playtest signoff.

## Planned stories

| ID | Story | Priority |
|---|---|---|
| WB-005 | Validate Player 2 local co-op traversal and gamepad wiring; physical-controller signoff remains downstream. | P1 — validated sandbox |
| WB-006 | Performance and visual polish slice. | P1 — validated sandbox |


## WB-006 — Performance and Visual Polish

**Status:** validated  
**Quality level:** L2  
**Goal:** reduce initial menu payload and improve finale/HUD presentation without regressing the validated gameplay slices.

### Acceptance criteria

- WebGL/physics code is not required for the initial menu bundle and loads only after a play mode is selected.
- The UI presents an explicit loading state while gameplay WebGL code is loaded.
- Quiet traversal zones have reduced onboarding obstruction while tutorial, door, rope and rescue prompts remain visible.
- Completion gains lightweight celebration/reward/buddy treatment aligned with the approved completion design direction.
- Build-size output and real Chromium/WebGL evidence confirm gameplay completion still works after the split.

### Out of story

New art/audio assets, full GPU/device profiling, public-release readiness, five-zone co-op validation and gamepad signoff.


## WB-005 — Local Co-op Route and Gamepad Wiring

**Status:** validated  
**Quality level:** L2  
**Goal:** preserve rescue practice while adding a complete two-buddy local route and browser-evidenced Player 2 controller wiring.

### Acceptance criteria

- Local Co-op Rescue continues to open the validated Zone 4 practice setup.
- A separate Local Co-op Run choice spawns both buddies at Zone 1 and requires both to reach the finish gate.
- Player 2 movement is accepted through the Gamepad API with keyboard fallback remaining documented.
- Shared-camera five-zone progression, finale and two-buddy completion are evidenced from the real built app in Chromium.
- Sandbox evidence is described as controller-API wiring validation only; physical gamepad and human co-op feel acceptance remain downstream.

### Out of story

Physical-controller certification, online multiplayer, production release, device FPS signoff and human two-player playtest approval.


## WB-008 — Movement, Props and Buddy-Link Feedback Fixes

**Status:** validated  
**Quality level:** L2  
**Goal:** address pre-playtest control feel and interaction readability issues reported from live review without expanding into general collision redesign.

### Acceptance criteria

- Player movement accelerates/decelerates smoothly, with reduced running speed and reduced jump height.
- Grab/Buddy Link state exposes a clear raised-hand visual and readable HUD feedback.
- A tutorial crate pushed below the island returns to its start with an understandable status message.
- The Zone 3 target landmark reads upright in the real rendered application.
- Rescue Practice Buddy Link progresses from staged to rescued to released in real Chromium/WebGL evidence.

### Out of story

General collision-system redesign, physical-controller approval, human playtest signoff and public release.

## WB-010 — Edge-Fall Recovery and Collision-Safety Follow-up

**Status:** validated  
**Quality level:** L2  
**Goal:** ensure an edge fall during crate pushing recovers promptly and communicates the recovery before human playtest.

### Acceptance criteria

- A real physics push can send the tutorial crate past the ledge and trigger its return to spawn.
- A player who falls during that interaction returns automatically to a playable checkpoint without manual reset.
- Crate-return feedback remains visible when crate and player recovery occur close together.
- Buddy Link and Local Co-op Run remain functional after the fall-recovery adjustment.

### Out of story

Full collider tuning, collision-proofing every zone, real-device performance, physical-gamepad signoff and human acceptance.

## WB-011 — Human Playtest Execution Kit

**Status:** validated  
**Quality level:** L2  
**Goal:** turn the validated pre-playtest build into a privacy-safe, repeatable real-session package without inventing human or hardware evidence.

### Acceptance criteria

- A facilitator can run Buddy Link comprehension, Standard full co-op and Reduced effects comparison sessions from one documented sequence.
- Session capture explicitly records physical controller context, device/GPU/browser, movement/jump/camera/collision observations and completion outcomes.
- Issue triage defines severities, reproduction fields and stop/continue decisions for feedback-driven follow-up stories.
- Result storage rules prohibit personally identifying participant material in the project archive.
- Documentation distinguishes a validated test kit from human-playtest completion, physical-controller certification or release readiness.

### Out of story

Conducting sessions, recording real participant outcomes, controller certification, real-device performance approval, runtime payload optimization and release approval.

