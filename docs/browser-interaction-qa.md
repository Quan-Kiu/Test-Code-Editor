# Browser Interaction QA — WB-001

## Browser interaction plan

| Flow | Input | Expected user-visible response | Evidence target |
|---|---|---|---|
| Title to solo gameplay | Click `Play Solo` | Gameplay HUD and real 3D scene appear. | menu and Zone 1 screenshots |
| Local co-op entry | Click `Local Co-op` | Second coral buddy and co-op status appear. | local co-op screenshot |
| Movement/jump | `D`, `Space` | Blue buddy advances and lifts through physics scene. | gameplay screenshot and error log |
| Pause/resume | `Escape`, click `Resume` | Rounded pause dialog toggles without scene loss. | pause screenshot |
| Respawn | `R` | Player returns to active checkpoint with toast. | checkpoint/respawn evidence |
| Goal | Traverse into gate | Completion panel replaces active play state. | completion screenshot when exercised |

## Required evidence fields

| Surface | Pointer checked | Keyboard checked | Screenshot captured | Console/page errors recorded | WebGL checked | Current result |
|---|---|---|---|---|---|---|
| Foundation player route | scheduled | scheduled | scheduled | scheduled | scheduled | not_run until Chromium run |

## Findings table

| Route/state | Evidence path | Expected design | Actual observation | Severity | Action | Retest |
|---|---|---|---|---|---|---|
| Menu / gameplay / pause | captured during browser run | Follow registered screen references | awaiting real browser capture | none recorded | execute player flow | required after capture |

## Acceptance gate

The route can become `pass` only after real Chromium interactions, a non-zero WebGL canvas check, screenshots opened for review, and blocking console/page/request failures reported as absent or corrected.

## WB-005 local co-op extension

| Flow | Input | Expected user-visible response | Evidence target | Result |
|---|---|---|---|---|
| Preserve rescue practice | Click `Co-op Rescue` | Buddy begins hanging in Zone 4 practice; HUD does not overlap the target callout. | `docs/validation-reports/wb-005-rescue-practice-regression.json`, `wb-005-rescue-practice-preserved.png` | pass |
| Enter full co-op route | Click `Local Co-op Run` | Both buddies spawn at Zone 1 with shared framing and co-op route guidance. | `docs/validation-reports/wb-005-screenshots/wb-005-menu-three-modes.png` | pass |
| Player 2 movement wiring | Virtual browser Gamepad left stick plus Player 1 keyboard movement | Both buddies reach the opened heavy door in one camera view. | `docs/validation-reports/wb-005-shared-camera-proof.json`, `wb-005-coop-door-open.png` | pass |
| Co-op goal | Continue both inputs through rope/finale | Completion explicitly confirms both buddies reached the finish. | `docs/validation-reports/wb-005-coop-route-proof.json`, `wb-005-local-coop-run-completed.png` | pass |

Functional status: **pass** within the sandbox/browser Gamepad API boundary. Composition status: **partial** because final-release world richness and human/physical-controller review remain downstream.
