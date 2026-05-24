# QA Test Cases

This file is the test case inventory used by `docs/test-matrix.md`, `docs/browser-interaction-qa.md`, and `docs/traceability-matrix.md`.

## 1. Test case inventory

| Test case ID | Requirement ID | Story ID | Type | Preconditions | Steps | Expected result | Evidence ID/path | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-TEMPLATE-001 | REQ-TEMPLATE-001 | STORY-TEMPLATE-001 | template | Replace in a real project | Replace in a real project | Replace in a real project | EV-TEMPLATE-001 | QA Owner | not_run |
| TC-WB-005-RESCUE | REQ-WB-005 | WB-005 | browser | WB-006 app built and preview served through real-byte bridge | Choose `Co-op Rescue`; wait for rescue HUD and capture screenshot/WebGL status | Existing Zone 4 rescue practice is preserved with no reported browser errors | `docs/validation-reports/wb-005-rescue-practice-regression.json` | QA Owner | pass |
| TC-WB-005-CAMERA | REQ-WB-005 | WB-005 | browser | Fresh Xvfb display; virtual browser Gamepad API available | Choose `Local Co-op Run`; send Player 1 keyboard and Player 2 virtual-stick input until the opened door | Player 2 advances under Gamepad wiring and both buddies remain in shared-frame evidence | `docs/validation-reports/wb-005-shared-camera-proof.json` | QA Owner | pass |
| TC-WB-005-ROUTE | REQ-WB-005 | WB-005 | browser | Fresh Xvfb display; real Vite-byte bridge; virtual browser Gamepad API | Route both players through door, rope release and finish gate | Completion confirms both buddies finish; WebGL true and browser error arrays empty | `docs/validation-reports/wb-005-coop-route-proof.json` | QA Owner | pass |
| TC-WB-007-READY | REQ-WB-007 | WB-007 | accessibility | Real Vite-byte bridge; fresh Xvfb display | Observe controller fallback; inject Gamepad API presence; choose Reduced effects; enter play; open Pause and cycle focus | Controller badge changes; WebGL applies reduced preset; Pause autofocus and focus wrap pass | `docs/validation-reports/wb-007-preplay-readiness-proof.json` | Accessibility Owner / QA Owner | pass |
| TC-WB-007-REDUCED | REQ-WB-007 | WB-007 | browser | Fresh Xvfb display; virtual browser Gamepad; Reduced effects selected | Complete Local Co-op Run through door/rope/finale | Route finishes with WebGL true and Completion autofocus; no browser errors | `docs/validation-reports/wb-007-reduced-effects-coop-route-proof.json` | QA Owner | pass |
| TC-WB-007-STANDARD | REQ-WB-007 | WB-007 | browser | Fresh Xvfb display; virtual browser Gamepad; Standard preset | Complete Local Co-op Run after readiness changes | Standard route remains functional and completes both buddies | `docs/validation-reports/wb-005-coop-route-proof.json` | QA Owner | pass |

| TC-WB-008-FEEDBACK | REQ-WB-008 | WB-008 | browser | Final built app served through real-byte bridge | Move, jump, grab tutorial crate and observe hand/HUD state | Motion remains bounded, jump is lower and raised-hand state is visible with WebGL clean | `docs/validation-reports/wb-008-feedback-proof.json` | QA Owner | pass |
| TC-WB-008-LINK | REQ-WB-008 | WB-008 | browser | Co-op Rescue loaded through real-byte bridge | Acquire Buddy Link, retain hold until rescue, release | Raised-hand/link feedback is visible and buddy reaches safe state | `docs/validation-reports/wb-008-buddy-link-proof.json` | QA Owner | pass |
| TC-WB-008-MARKER | REQ-WB-008 | WB-008 | visual | Play Solo route reaches Zone 3 switch | Capture door-open target landmark | Target board is upright/readable in real Canvas render | `docs/validation-reports/wb-008-marker-proof.json` | Visual QA Reviewer | pass |
| TC-WB-010-EDGE | REQ-WB-010 | WB-010 | browser | Play Solo, real-byte bridge and WebGL available | Physically push tutorial crate beyond ledge and continue falling with it | Crate returns to start, player automatically recovers, crate message remains visible | `docs/validation-reports/wb-010-edge-recovery-proof.json` | QA Owner | pass |
| TC-WB-010-COOP | REQ-WB-010 | WB-010 | browser | Standard Local Co-op Run with virtual Gamepad boundary | Complete door/rope/finale after recovery change | Two-buddy route still completes with clean WebGL evidence | `docs/validation-reports/wb-005-coop-route-proof.json` | QA Owner | pass |
| TC-WB-011-KIT | REQ-WB-011 | WB-011 | manual | WB-008/WB-010 handoff reviewed; no real participant results yet | Review session template, triage guide, result-storage rules and protocol sequence against remaining risks | Kit captures physical controller/device/preset/interaction/collision/performance observations without PII or false acceptance claims | `docs/validation-reports/wb-011-human-playtest-kit-validation.md` | Human Playtest Owner / QA Owner | pass |
Allowed types: `unit`, `integration`, `api`, `browser`, `visual`, `accessibility`, `performance`, `security`, `playtest`, `manual`, `template`.

Allowed statuses: `not_run`, `pass`, `fail`, `partial`, `blocked`, `not_available`, `not_applicable`.

## 2. Coverage expectations

| Project type | Minimum test coverage |
|---|---|
| ui | browser interaction, component/state screenshots, visual QA, accessibility basics |
| mixed | UI flows plus API-backed loading/error/success states |
| api | contract tests, auth/error tests, negative input tests |
| backend | data/state tests, job tests, failure/retry tests |
| cli | command contract, exit codes, output snapshots, error cases |
| game | core loop, controls, HUD, pause/result/retry, self-play, human playtest before public release |
| web3d | canvas diagnostics, WebGL/WebGPU context, frame screenshots, camera/object interactions, fallback path |

## 3. Completion rule

A test case listed as `pass` must point to evidence. A story cannot be completed when its critical acceptance criteria have no mapped test case in `docs/traceability-matrix.md`.
