# Game Playability Checklist

Use this after build/browser smoke and after player-facing readiness has passed or been honestly marked partial/fail.
Do not run player playability review against a screen that still exposes developer-only UI.

## Precondition

- [ ] Developer debug test is reported separately.
- [ ] Design conformance test is reported separately.
- [ ] Player-facing readiness gate from `.agent-harness/checklists/game-player-facing-readiness.md` has been run.
- [ ] Normal player route is used, not `?debug=1` or an internal QA route.

## Sandbox/local playability review

- [ ] First 30 seconds: player goal is clear without developer notes.
- [ ] Core loop can start, progress, and end.
- [ ] Controls feel understandable and responsive.
- [ ] Feedback is visible/audible enough for actions and outcomes.
- [ ] HUD communicates the minimum useful state without clutter or implementation details.
- [ ] Start, result/game-over, and retry screens feel player-facing.
- [ ] Visual style, camera, lighting, and motion align with design direction.
- [ ] Pacing has no obvious dead time or confusing stall.
- [ ] 3D camera, lighting, scale, and interaction are readable when applicable.
- [ ] Multiplayer simulation covers the technical flow when applicable.
- [ ] Human playtest gaps are recorded separately.
- [ ] Real-device/mobile/public URL gaps are promoted to downstream blockers.

## 3D web game addendum

For project type `game,web3d`, also run `.agent-harness/checklists/3d-web-game-readiness.md`. Normal player mode must
show camera, lighting, scale, collision affordances, interaction feedback, and HUD clearly enough for a first-time player.
Physics, wireframes, collider lines, grids, debug stats, seed/replay panels, and asset-inspection tools must remain behind
explicit debug mode.
