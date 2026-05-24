# WB-005 — Local Co-op Route and Gamepad Wiring Validation

Status: **pass with downstream physical-controller and performance risks**  
Date: 2026-05-23  
Route: `implement-story` · Mode: `mvp` · Project type: `game,web3d` · Quality: `L2`

## Implemented slice

- Preserved **Co-op Rescue** as the validated Zone 4 Buddy Link practice entry.
- Added a separate **Local Co-op Run** menu path that spawns both buddies at Zone 1 and requires both to enter the finish gate.
- Reused the five-zone world, shared camera and finale progression; Player 2 follows keyboard fallback or Gamepad API input.
- Exposed bounded Player 2 position telemetry only for browser proof, allowing controller-wiring evidence without mocking gameplay state.
- Adjusted the three-mode menu and rescue feedback layout so the new mode and practice callout remain readable at the captured viewports.

## Static and build evidence

| Check | Result |
|---|---|
| `npm run lint` | pass |
| `npm run typecheck` | pass |
| `npm run build` | pass; open large-deferred-chunk warning retained |
| Idle-menu entry JS | **66.20 kB gzip** |
| Deferred gameplay chunk | **1,090.34 kB gzip** plus Rapier **1.19 kB gzip** |

## Browser evidence boundary

| Field | Evidence |
|---|---|
| Direct browser mode | headed Chromium + Xvfb |
| Localhost direct | blocked; `ERR_BLOCKED_BY_ADMINISTRATOR` in `docs/validation-reports/wb-005-direct-probe.json` |
| Successful gameplay mode | headless Chromium + Xvfb fallback |
| Bridge used | yes — `setContent` shell plus subresource fulfillment from exact Vite preview CSS/JS/dynamic chunk bytes; no mock HTML/gameplay |
| App source | real Vite preview served at `http://127.0.0.1:4211` during retained runs |
| WebGL | `true`, WebGL2 / SwiftShader, `glError=0` |
| Errors in passing proofs | `0` console / `0` page / `0` network failures |
| Controller evidence boundary | virtual browser Gamepad API state validates Player 2 wiring only; it is not physical controller/human co-op acceptance |

## Interaction proof

| Flow | Observed result | Evidence |
|---|---|---|
| Three-mode menu | Solo, Co-op Rescue and Local Co-op Run are visible with controls in-frame | `docs/validation-reports/wb-005-screenshots/wb-005-menu-three-modes.png` |
| Rescue practice regression | HUD reports `Buddy is hanging below. Grab to rescue!` in Zone 4 | `docs/validation-reports/wb-005-rescue-practice-regression.json`, `wb-005-rescue-practice-preserved.png` |
| Player 2 input / shared camera | P2 moves from `x=-4.000` to `x=20.514` through virtual Gamepad input while door opens in the shared view | `docs/validation-reports/wb-005-shared-camera-proof.json`, `wb-005-coop-door-open.png` |
| Full co-op completion | Both-player route completes; P2 moved from `x=-4.000` to `x=19.101` before the door and the completion copy confirms both buddies finish | `docs/validation-reports/wb-005-coop-route-proof.json`, `wb-005-local-coop-run-completed.png` |

## Full route checkpoint timing

| Checkpoint | Time |
|---|---:|
| Door opened | 12.88 s |
| Rope reached | 20.27 s |
| Rope held | 20.47 s |
| Finale launched | 21.52 s |
| Both buddies completed | 23.41 s |

## Post-validation role review

| Role | Result | Evidence / finding |
|---|---|---|
| Product / Game Design | pass | Practice mode remains separate; full co-op run adds progression without overwriting rescue slice. |
| UX / Visual QA | pass_with_risks | Menu and door/completion frames are readable; rescue still has intentionally prominent overlapping-adjacent messaging density but no occlusion after adjustment. |
| Frontend / Web3D | pass | Mode predicates localize behavior; no duplicate world or new dependency introduced. |
| QA / Browser Evidence | pass_with_risks | Real Canvas and Gamepad API wiring are evidenced; direct-localhost blocked and physical gamepad untested. |
| Accessibility | partial | Keyboard fallback remains visible; physical gamepad ergonomics and broader accessibility testing remain downstream. |
| Performance | partial | No material payload regression, but deferred gameplay chunk and SwiftShader runtime remain open risks. |

## Remaining risks

- Physical gamepad behavior, two-person feel, dead zones and co-op readability require real hardware/human playtest.
- Software-render evidence is technical proof only and does not establish release FPS.
- `docs/tool-permissions.md` is referenced by `AGENTS.md` but absent from the supplied handoff; this governance gap should be repaired in a later maintenance route.
