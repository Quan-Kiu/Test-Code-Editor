# WB-002 / WB-003 — Grab and Buddy Link Rescue Validation

Status: **pass with documented sandbox limitation**  
Date: 2026-05-23  
Route: `implement-story` · Mode: `mvp` · Project type: `game,web3d`

## Implemented slice

- Independent left/right grab state and immediate release feedback.
- Tutorial crate acquisition and bounded physical pull.
- Local Co-op Rescue entry that stages Zone 4 directly for this signature-mechanic slice.
- Physical Buddy Link ribbon plus bounded pull behavior; hanging buddy reaches the rescued state.
- Physics stability corrections: platform colliders positioned in world space, CCD on dynamic actors/props, fixed physics timestep for SwiftShader stability, tutorial crate moved off the mandatory traversal line and bridge collider aligned for the later full-route story.

## Static checks

| Check | Result |
|---|---|
| `npm run lint` | pass |
| `npm run typecheck` | pass |
| `npm run build` | pass; existing bundle-size warning remains |
| `npm run validate:browser-pack` | pass |
| `npm run validate:design-assets:required` | pass |
| `npm run validate:project:mvp:web3d` | pass |

## Browser evidence

| Field | Evidence |
|---|---|
| Browser mode | headed Chromium under Xvfb |
| Localhost direct | blocked; Chromium returned `net::ERR_BLOCKED_BY_ADMINISTRATOR` |
| Bridge used | yes |
| App source | real Vite preview server bytes fetched from `http://127.0.0.1:4173` and injected by the existing CDP/fetch content bridge; no mock HTML |
| WebGL | `true`, WebGL2, SwiftShader renderer, `glError=0` |
| Page/console/network errors | 0 in retained WebGL and targeted interaction runs |
| WebGL report | `docs/validation-reports/wb-002-003-webgl-evidence.md` |
| Direct blocker report | `docs/validation-reports/wb-002-003-browser-evidence-direct.md` |

## Interaction proof retained

| Flow | Observed result | Screenshot |
|---|---|---|
| Solo crate acquire | HUD reported `Left hand grabbed crate. Release to let go.` | `docs/validation-reports/wb-002-crate-grabbed-proof.png` |
| Zone 4 setup | HUD reported `Buddy is hanging below. Grab to rescue!` | `docs/validation-reports/wb-003-rescue-staged-proof.png` |
| Buddy Link active | HUD reported `Buddy Link active — pull upward!` | `docs/validation-reports/wb-003-buddy-linked-proof.png` |
| Rescue success | HUD reported `Buddy rescued! Reach the checkpoint together.` | `docs/validation-reports/wb-003-buddy-rescued-proof.png` |
| Release | HUD reported `Left hand released buddy.` | `docs/validation-reports/wb-003-buddy-released-proof.png` |

## Limitation retained honestly

`tests/browser/buddy-link-rescue.spec.mjs` is implemented and was updated to use state-based movement and a stable story viewport, but the full Playwright command did not complete within sandbox time limits while running headed SwiftShader and report/trace overhead. This report does **not** claim that suite passed. The mechanic claims above are grounded in targeted headed Chromium interaction runs against the real served app.

## Remaining follow-on

WB-004 should restore and tune full start-to-finish traversal across bridge, door and rope finale, perform composition review against design assets, address the large bundle warning, and rerun automated/human playtest gates in a less constrained browser environment.
