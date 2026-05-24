# WB-010 — Edge-Fall Recovery and Collision-Safety Follow-up Validation

Status: **pass with collision-scope limitation**  
Date: **2026-05-24**

## Scope

WB-010 handles the player-facing consequence of falling while pushing a crate near an edge: the crate and player recover promptly with readable feedback. It intentionally does **not** redesign general platform colliders or claim a complete collision-system pass.

## Implemented behavior

- Player fall recovery now triggers once the body falls clearly below the playable island (`y < -3.25`) rather than waiting deep below the world.
- Non-crate fall messaging now reads `Returned to checkpoint — try again.`
- When crate recovery and player recovery occur together, the more useful player-facing message `Crate returned to the tutorial start.` remains visible.

## Real-browser proof

`docs/validation-reports/wb-010-edge-recovery-proof.json` records a physics interaction in the real WebGL app through the real-Vite-byte bridge:

| Measurement | Result |
|---|---:|
| Crate pushed beyond island (`max z`) | `7.134` |
| Player observed below safe edge (`min y`) | `-2.800` |
| Automatic player recovery after fall observation | `1093 ms` |
| Final player state | grounded at checkpoint |
| Final crate state | returned to `x=0.8, z=2.2` |
| Player-facing crate-return message | visible |
| WebGL / glError | `true` / `0` |
| Console/page/network errors | `0 / 0 / 0` |

## Regression evidence on the same build

- Buddy Link rescue: `docs/validation-reports/wb-008-buddy-link-proof.json` — pass.
- Upright marker render: `docs/validation-reports/wb-008-marker-proof.json` — pass.
- Full Local Co-op Run: `docs/validation-reports/wb-005-coop-route-proof.json` — pass, completion at `36.38s` with virtual Gamepad boundary retained.

## Remaining boundary

Human playtest must still assess whether edge recovery feels forgiving, whether players understand crate reset and Buddy Link, and whether any additional collision snag is experienced on physical controllers and real hardware.
