# Component Contract — Validated MVP Slices through WB-007

## Responsibility table

| Name | Kind | Responsibility | Owns state | Risk / validation |
|---|---|---|---|---|
| `GameApp` | app | Chooses menu/play/pause/completed surfaces; defers WebGL scene until play intent; unmounts Canvas at completion. | Reads/actions | WB-006 load/completion and WB-007 modal evidence |
| `gameSceneLoader` | app loader | Prefetches/imports deferred gameplay after user intent. | Module promise | Build measurement and bridge dynamic-chunk proof |
| `MenuScreen` | UI | Presents three play modes, controller-presence feedback and Standard/Reduced effects selection. | Graphics action | WB-007 menu/controller screenshot and readiness proof |
| `HUD` | UI | Shows zones, co-op guidance, door/rope/rescue status and completion requirements. | No | Rescue/shared-camera screenshots |
| `PauseOverlay` | UI dialog | Provides pause actions with focus entry, containment and restoration. | No | WB-007 Pause focus evidence |
| `CompletionOverlay` | UI dialog | Renders solo/two-buddy result and accessible action focus after completion. | No | WB-007 Completion autofocus evidence |
| `useDialogFocus` | accessibility helper | Focuses first action, wraps Tab traversal and restores prior focus. | DOM focus ref | WB-007 browser focus assertions |
| `GameScene` | scene | Owns Canvas, lighting, physics, route landmarks, shared camera and graphics-preset render cost. | Reads preset | WB-007 Reduced effects WebGL and route evidence |
| `LevelGeometry` / landmarks | scene | Provides platforms, door, rescue gap, rope and finish sensors. | No | Solo/co-op route completion |
| `PlayerCharacter` | gameplay | Applies movement, jump, facing, respawn and finale forces. | Rapier body | WB-004A and WB-005/WB-007 route proofs |
| `InputController` | input | Maps P1 controls and P2 Gamepad API/keyboard fallback snapshots. | Input refs/queues | Browser virtual Gamepad evidence; physical hardware downstream |
| `GrabSystem` / `BuddyLinkSystem` | gameplay | Applies bounded grab/rescue forces and feedback. | Interaction refs | WB-002/WB-003 and rescue regression |
| `gameStore` | state | Stores mode, graphics preset, progression, timer and completion. | Yes | Typecheck/browser flow evidence |

## Validated boundary

- `Co-op Rescue` remains the validated Zone 4 Buddy Link practice entry.
- `Local Co-op Run` is the validated sandbox five-zone route requiring both buddies at finish.
- Controller badge and Player 2 route evidence use browser Gamepad API state; physical-controller and human co-op acceptance remain downstream.
- Reduced effects lowers render work and completes the route in sandbox evidence; it is not a real-device performance signoff.
- Runtime segmentation identifies a deferred WebGL/physics cost above 1 MB gzip; it does not eliminate that release risk.


## WB-008 / WB-010 corrective addendum

| Component/system | Added responsibility | Evidence |
|---|---|---|
| `PlayerCharacter` | Damped movement, lower jump force, assisted rescue hoist and early edge-fall recovery telemetry | `wb-008-feedback-proof.json`, `wb-008-buddy-link-proof.json`, `wb-010-edge-recovery-proof.json` |
| `PhysicsCrate` | Reset tutorial/heavy crate after leaving safe island height and surface an explanatory message | `wb-010-edge-recovery-proof.json` |
| `GameplayLandmarks` | Upright switch target board while preserving floor sensor semantics | `wb-008-marker-proof.json` |
| `HUD` / `CharacterModel` | Raised-hand and textual interaction feedback | `wb-008-feedback-proof.json`, `wb-008-buddy-link-proof.json` |
