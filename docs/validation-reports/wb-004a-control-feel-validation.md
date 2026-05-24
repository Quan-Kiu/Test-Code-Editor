# WB-004A — Control Feel Stabilization Validation

Status: **pass with browser-mode limitation**  
Date: 2026-05-23  
Route: `implement-story` · Mode: `mvp` · Project type: `game,web3d`

## User-observed defects addressed

- Camera follow no longer aims directly at stale transform samples; the camera rig now uses delta-based damping.
- Camera orbit is available by holding and dragging the middle mouse button, or `Alt` + left-drag, without removing left/right hand grab behavior.
- Player facing rotates toward camera-relative movement direction.
- The rendered character is aligned down to the physical capsule floor contact rather than appearing suspended above the platform.
- Jump uses grounded foot contact plus a small coyote window and a player-owned pressed-input queue, so other interaction systems cannot consume `Space` before the player controller.

## Implementation notes and rollback retained

The attempted switch from fixed physics stepping to variable stepping destabilized Chromium/SwiftShader play entry in this environment, so it was rolled back. The retained fix uses the previously stable fixed timestep, CCD, smoothed camera interpolation, and reduced transform publication frequency. This preserves the validated physics stability boundary while addressing the reported control defects.

## Static checks

| Check | Result |
|---|---|
| `npm run lint` | pass |
| `npm run typecheck` | pass |
| `npm run build` | pass; existing bundle-size warning remains (`~3.37 MB` minified / `~1.16 MB` gzip) |

## Browser and WebGL evidence

| Field | Evidence |
|---|---|
| Localhost direct | **blocked**: headed Chromium + Xvfb returned `net::ERR_BLOCKED_BY_ADMINISTRATOR` for `http://127.0.0.1:4176` |
| Direct blocker report | `docs/validation-reports/wb-004-correction-direct-probe.json` |
| Final interaction browser mode | **headless Chromium + Xvfb fallback**; headed interaction attempts terminated with an X connection/page-close failure during play entry and are not claimed as passing |
| Bridge used | yes |
| App source | real Vite preview bytes fetched from `http://127.0.0.1:4176` through the existing real-server fetch bridge; no mock HTML |
| WebGL | `true`; SwiftShader renderer; `glError=0` |
| Console/page/network errors in passing fallback proof | 0 / 0 / 0 |
| Structured proof report | `docs/validation-reports/wb-004-controls-proof.json` |

## Interaction proof retained

| State | Observed evidence | Screenshot |
|---|---|---|
| Grounded/aligned stance | `player1Y=1.199`, `grounded=true`; visual feet sit on the platform plane | `docs/validation-reports/wb-004-correction-screenshots/01-grounded-stance.png` |
| Jump airborne | `player1Y=2.533`, `grounded=false` after `Space` | `docs/validation-reports/wb-004-correction-screenshots/02-jump-airborne.png` |
| Jump landing | `player1Y=1.199`, `grounded=true` | `docs/validation-reports/wb-004-correction-screenshots/03-jump-landed.png` |
| Camera orbit | Middle-drag changes the rendered viewpoint while keeping hand-grab buttons available | `docs/validation-reports/wb-004-correction-screenshots/04-camera-orbit-after-drag.png` |
| Directional facing | Movement after orbit renders the character turned with locomotion direction | `docs/validation-reports/wb-004-correction-screenshots/05-facing-after-right-movement.png` |

## Screenshot review

- The grounded frame no longer shows the buddy capsule floating visibly above the platform surface; its body/shadow relationship is grounded and readable.
- The airborne frame clearly separates the buddy from the platform and matches the numeric height proof, demonstrating jump rather than camera-only movement.
- Orbit changes the visible platform/tree/crate composition around the player without UI occlusion; the control hint is present in the lower HUD.
- Remaining composition debt: the character back-face is visually plain during camera-relative travel and a more expressive turn/run animation remains polish scope.

## Post-validation role review

| Role | Review result | Evidence / remaining risk |
|---|---|---|
| Product/Game Design | pass for corrective slice | Core move/view/jump foundation is usable enough to resume WB-004 traversal; full five-zone balance remains open. |
| UX/Composition | pass with polish debt | Orbit is discoverable in HUD; run/turn animation polish remains downstream. |
| Frontend/Web3D | pass with environment limitation | Damped camera and local physics ownership compile/build; headed interactive render remains unstable in this sandbox. |
| Physics | pass for grounded jump proof | Height telemetry proves takeoff/landing; variable timestep experiment was reverted. |
| QA/Browser Evidence | pass with browser-mode limitation | Passing real-app proof is fallback headless+Xvfb; no final headed interaction pass is claimed. |
| Accessibility | partial | Keyboard movement/jump preserved; camera orbit remains mouse supplemental and keyboard camera support is not yet added. |
| Performance | partial | Existing large bundle remains unresolved; transform updates are throttled to avoid SwiftShader regression. |
| Security/Privacy/Release | not_applicable | No network, data, dependency, commit, push or deployment change. |

## Remaining follow-on

WB-004 remains in progress: resume solo traversal through door → rope → completion using the stabilized controls, then perform the intended final composition review and bundle/performance follow-up. Real-device and human playtesting remain downstream.
