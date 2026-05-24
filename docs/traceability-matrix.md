# Traceability Matrix

This file links requirements, stories, design references, implementation files, tests, browser evidence, and release evidence.

## 1. Operating rule

A story is not done until its requirement, acceptance criteria, implementation files, validation evidence, and relevant design assets are traceable in one row.

For production, every blocking release gate must map to evidence in `docs/evidence-ledger.md`.

## 2. Requirement to evidence matrix

| Requirement ID | Requirement | Story ID | Acceptance criteria | Design asset ID | Implementation files | Test cases | Evidence ID/path | QA result | Release gate |
|---|---|---|---|---|---|---|---|---|---|
| REQ-TEMPLATE-001 | Template requirement | STORY-TEMPLATE-001 | Replace with concrete criteria | not_available | not_available | TC-TEMPLATE-001 | EV-TEMPLATE-001 | not_run | not_applicable |
| REQ-WB-005 | Provide a distinct five-zone local co-op run with shared camera, Player 2 browser Gamepad API input and both-buddy completion without regressing rescue practice | WB-005 | Three modes visible; rescue practice preserved; virtual Gamepad moves P2; both buddies finish the route | `design-assets/screens/06-main-menu.webp`, `design-assets/screens/15-completion-screen.webp` | `src/game/types.ts`, `src/game/state/gameStore.ts`, `src/game/input/inputController.ts`, `src/game/components/PlayerCharacter.tsx`, `src/game/scenes/GameScene.tsx`, `src/ui/MenuScreen.tsx`, `src/ui/HUD.tsx`, `src/ui/CompletionOverlay.tsx`, `src/styles/index.css` | TC-WB-005-RESCUE, TC-WB-005-CAMERA, TC-WB-005-ROUTE | EVD-WB-017, EVD-WB-018, EVD-WB-019, EVD-WB-020 | pass | not_applicable |
| REQ-WB-006 | Defer WebGL menu payload and improve finale presentation without route regression | WB-006 | Idle menu excludes Canvas/gameplay chunk; completion route still finishes with polished overlay | `design-assets/screens/06-main-menu.webp`, `design-assets/screens/15-completion-screen.webp` | `src/app/GameApp.tsx`, `src/app/gameSceneLoader.ts`, `src/ui/MenuScreen.tsx`, `src/ui/HUD.tsx`, `src/ui/CompletionOverlay.tsx`, `src/styles/index.css`, `src/game/components/PlayerCharacter.tsx` | TC-WB-006-LOAD, TC-WB-006-FINISH | EVD-WB-013, EVD-WB-014 | pass | not_applicable |
| REQ-WB-007 | Harden the build for a human playtest entry with controller readiness, graphics fallback, accessible dialogs and honest bundle evidence | WB-007 | Permission file exists; controller badge responds; Reduced effects preserves route; Pause/Completion focus is contained; runtime cost is measured | `design-assets/screens/06-main-menu.webp`, `design-assets/screens/15-completion-screen.webp` | `src/ui/MenuScreen.tsx`, `src/ui/PauseOverlay.tsx`, `src/ui/CompletionOverlay.tsx`, `src/ui/useDialogFocus.ts`, `src/game/state/gameStore.ts`, `src/game/scene/GameScene.tsx`, `src/styles/index.css`, `vite.config.ts`, `docs/tool-permissions.md` | TC-WB-007-READY, TC-WB-007-REDUCED, TC-WB-007-STANDARD | EVD-WB-021, EVD-WB-022, EVD-WB-023, EVD-WB-024 | pass | human_playtest_required |

| REQ-WB-011 | Provide a privacy-safe, repeatable human-playtest execution kit without claiming unrun acceptance | WB-011 | PT-WB-001/002/003 template exists; triage and anonymous storage rules exist; kit distinguishes ready-to-run from completed testing | not_applicable — documentation/execution preparation | `docs/playtest-protocol.md`, `docs/playtest-session-template.md`, `docs/playtest-issue-triage.md`, `docs/playtest-results/README.md` | TC-WB-011-KIT | EVD-WB-028 | pass | human_playtest_required |

Allowed QA results: `not_run`, `pass`, `fail`, `partial`, `blocked`, `not_available`, `not_applicable`.

| REQ-WB-008 | Improve movement feel, prop recovery/readability and Buddy Link feedback before human playtest | WB-008 | Damped movement; lower speed/jump; raised-hand state; crate return; upright target; completable rescue link | `design-assets/screens/07-zone-1-tutorial.webp`, `design-assets/screens/10-zone-4-buddy-rescue.webp` | `src/game/components/PlayerCharacter.tsx`, `src/game/components/PhysicsCrate.tsx`, `src/game/components/GameplayLandmarks.tsx`, `src/game/components/CharacterModel.tsx`, `src/ui/HUD.tsx`, `src/styles/index.css` | TC-WB-008-FEEDBACK, TC-WB-008-LINK, TC-WB-008-MARKER | EVD-WB-025 | pass | human_playtest_required |
| REQ-WB-010 | Recover predictably from player/crate edge falls while preserving completed interaction routes | WB-010 | Physical push drives crate off ledge; crate and player recover; feedback remains clear; co-op route passes | `design-assets/screens/07-zone-1-tutorial.webp` | `src/game/components/PlayerCharacter.tsx`, `src/game/state/gameStore.ts`, `scripts/wb010-edge-recovery-proof.mjs` | TC-WB-010-EDGE, TC-WB-010-COOP | EVD-WB-026, EVD-WB-027 | pass | human_playtest_required |
## 3. Design conformance mapping

| Design asset ID | Image path | Route/screen | State | Viewport | Actual screenshot | Result | Difference/decision |
|---|---|---|---|---|---|---|---|
| not_available | not_available | not_available | not_available | not_available | not_available | not_run | Template row. |
| WB005-MENU | `design-assets/screens/06-main-menu.webp` | Start menu | three playable mode choices | 960x600 | `docs/validation-reports/wb-005-screenshots/wb-005-menu-three-modes.png` | partial | Third mode is added for co-op traversal while keeping the lightweight CSS presentation and readable controls. |
| WB005-DOOR | `design-assets/screens/10-door-puzzle.webp` | Local Co-op Run | both buddies at opened door | 960x600 | `docs/validation-reports/wb-005-screenshots/wb-005-coop-door-open.png` | partial | Functional shared-camera proof is clear; richer landmark art remains deferred. |
| WB005-COMPLETE | `design-assets/screens/15-completion-screen.webp` | Completion | both buddies finish | 640x400 | `docs/validation-reports/wb-005-screenshots/wb-005-local-coop-run-completed.png` | partial | Both-buddy message/reward/CTA hierarchy is visible; full-release art treatment remains downstream. |
| WB006-MENU | `design-assets/screens/06-main-menu.webp` | Start menu | idle lightweight state | 720x450 | `docs/validation-reports/wb-006-screenshots/wb-006-menu-lightweight.png` | partial | Controls and hierarchy fit; 3D hero intentionally replaced with CSS backdrop to defer WebGL. |
| WB006-COMPLETE | `design-assets/screens/15-completion-screen.webp` | Completion | solo finish | 720x450 | `docs/validation-reports/wb-006-screenshots/wb-006-completion-polished.png` | partial | Buddy/reward/CTA hierarchy improved; rich world backdrop and higher celebration density deferred. |
| WB007-MENU | `design-assets/screens/06-main-menu.webp` | Start menu | controller-ready and graphics-choice state | 960x600 | `docs/validation-reports/wb-007-screenshots/wb-007-menu-controller-quality.png` | partial | Added readiness choices while preserving compact hierarchy; final richer hero art remains downstream. |
| WB007-PAUSE | `design-assets/screens/13-pause-menu.webp` | Gameplay pause | focus-contained controller-readiness run | 960x600 | `docs/validation-reports/wb-007-screenshots/wb-007-pause-focus-controller.png` | partial | Functional modal readability and focus behavior evidenced; richer backdrop polish downstream. |
| WB007-COMPLETE | `design-assets/screens/15-completion-screen.webp` | Completion | reduced-effects co-op finish | 960x600 | `docs/validation-reports/wb-007-screenshots/wb-007-reduced-effects-completion.png` | partial | Completion remains clear in fallback mode; release visual signoff downstream. |

## 4. Validation mapping

| Test case ID | Requirement ID | Test type | Command/manual step | Expected outcome | Evidence ID/path | Status |
|---|---|---|---|---|---|---|
| TC-TEMPLATE-001 | REQ-TEMPLATE-001 | template | Replace in a real project | Replace in a real project | EV-TEMPLATE-001 | not_run |
| TC-WB-005-RESCUE | REQ-WB-005 | browser regression | `REAL_SERVER_URL=<preview> node scripts/wb005-rescue-practice-regression.mjs` under fresh Xvfb | `Co-op Rescue` still opens the Zone 4 hanging-buddy setup with WebGL available and no browser errors | EVD-WB-019 | pass |
| TC-WB-005-CAMERA | REQ-WB-005 | browser interaction | `REAL_SERVER_URL=<preview> node scripts/wb005-shared-camera-proof.mjs` under fresh Xvfb | Virtual Gamepad moves Player 2 while both buddies remain visible at the opened door | EVD-WB-018 | pass |
| TC-WB-005-ROUTE | REQ-WB-005 | browser flow | `REAL_SERVER_URL=<preview> node scripts/wb005-coop-route-proof.mjs` under fresh Xvfb | Both buddies traverse door/rope/finale and the co-op completion copy is rendered | EVD-WB-017 | pass |
| TC-WB-007-READY | REQ-WB-007 | browser accessibility | `REAL_SERVER_URL=<preview> node scripts/wb007-preplay-readiness-proof.mjs` under fresh Xvfb | Controller badge responds, Reduced effects applies to real WebGL scene and Pause focus is contained | EVD-WB-021 | pass |
| TC-WB-007-REDUCED | REQ-WB-007 | browser flow | `REAL_SERVER_URL=<preview> WB_GRAPHICS_PRESET=reduced node scripts/wb005-coop-route-proof.mjs` under fresh Xvfb | Both buddies complete under Reduced effects and completion autofocus is present | EVD-WB-022 | pass |
| TC-WB-007-STANDARD | REQ-WB-007 | browser regression | `REAL_SERVER_URL=<preview> node scripts/wb005-coop-route-proof.mjs` under fresh Xvfb | Standard mode retains both-buddy completion after readiness changes | `docs/validation-reports/wb-005-coop-route-proof.json` | pass |

| TC-WB-008-FEEDBACK | REQ-WB-008 | browser interaction | `REAL_SERVER_URL=<preview> node scripts/wb008-feedback-proof.mjs` under fresh Xvfb | Lower jump and raised-hand grab feedback are evidenced with clean WebGL | EVD-WB-025 | pass |
| TC-WB-008-LINK | REQ-WB-008 | browser flow | `REAL_SERVER_URL=<preview> node scripts/wb008-buddy-link-proof.mjs` under fresh Xvfb | Buddy Link progresses to rescued/released with raised-hand feedback | EVD-WB-025 | pass |
| TC-WB-008-MARKER | REQ-WB-008 | visual | `REAL_SERVER_URL=<preview> node scripts/wb008-marker-proof.mjs` under fresh Xvfb | Zone 3 target board renders upright | EVD-WB-025 | pass |
| TC-WB-010-EDGE | REQ-WB-010 | browser interaction | `REAL_SERVER_URL=<preview> node scripts/wb010-edge-recovery-proof.mjs` under fresh Xvfb | Real crate push and player fall recover automatically with readable feedback | EVD-WB-026 | pass |
| TC-WB-010-COOP | REQ-WB-010 | browser regression | `REAL_SERVER_URL=<preview> node scripts/wb005-coop-route-proof.mjs` under fresh Xvfb | Full co-op completion persists after recovery change | EVD-WB-027 | pass |
## 5. Completion rule

- MVP may keep temporary `not_available` design references only when the story explicitly allows exploratory UI.
- Real-project UI/game work must link to `docs/design-assets.md` or explain the accepted missing-design decision.
- Production work must not rely on template evidence IDs or placeholder rows.
