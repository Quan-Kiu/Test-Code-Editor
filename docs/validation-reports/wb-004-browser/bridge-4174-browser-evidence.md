# Browser Evidence Report

Status: pass
Generated: 2026-05-23T11:46:34.786Z
Project type: game,web3d
Normal URL: http://bridge.invalid/
Debug URL: not_run
Browser mode: headed
Localhost direct: blocked_in_chromium; upstream confirmed by server probe
Bridge used: yes
App source: real Vite preview server via CDP/fetch content bridge (http://127.0.0.1:4174); exact HTML/CSS/JS response bytes injected because navigation is blocked
Human playtest request allowed: yes

## Summary

| Route | Viewport | Status | Screenshot | Component shots | Keyboard probe | Console errors | Network failures | Visible dev selectors | Forbidden player text | 3D diagnostics |
|---|---|---|---|---:|---|---:|---:|---:|---|---|
| player | story 960x600 | pass | docs/validation-reports/browser-screenshots/player-story-960x600.png | 0 | not_run | 0 | 0 | 0 | no | canvas=1; size=960x600; webgl=true; webgpu=false; context=WebGL2RenderingContext; glError=0; fallback=false; renderMode=webgl; ready=true |

## Details

### player - story 960x600

- URL: http://bridge.invalid/
- Status: pass
- Screenshot evidence path: docs/validation-reports/browser-screenshots/player-story-960x600.png
- Viewport coverage: 960x600
- Screenshot review: required. Open the full-route and component screenshots and record observations in the screenshot review log from docs/browser-interaction-qa.md.
- Human-level composition review: required. Complete docs/composition-qa.md checks for first read, component rhythm, spatial balance, center-content preservation, visual dominance, visual noise, and user/player comprehension.
- Functional pass / composition fail: not_reviewed until the composition table is filled from screenshot inspection.
- Design comparison: required when DESIGN.md, docs/design-brief.md, mocks, or story design references exist.
- Console and network review: console clean; network clean.
- Keyboard focus probe: not_run; screenshot=not_captured
- 3D diagnostics: canvas=1; size=960x600 client=960x600; webgl=true; webgpu=false; context=WebGL2RenderingContext; vendor=Google Inc. (Google); renderer=ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver); glError=0; fallbackVisible=false; renderMode=webgl; sceneReady=true.

## Composition review log

Fill this table after opening the captured screenshots. Do not mark UI/browser pass while these fields are TBD/not_reviewed.

| Evidence | Route/state | Viewport | Intended dominance | Actual first read | Component rhythm | Spatial balance | Center-content preservation | Scene visual dominance | Visual noise | Comprehension | Status | Fix direction | Retest |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| docs/validation-reports/browser-screenshots/player-story-960x600.png | player | story 960x600 | TBD | TBD | not_reviewed | not_reviewed | not_reviewed | not_reviewed | not_reviewed | not_reviewed | partial | Fill human-level composition review from docs/composition-qa.md | not_run |

## Product-quality role applicability

Classify every role before claiming L2+ UI/game/product-quality pass. Use docs/role-gate-quality-map.md.

| Role | Applicability | Reason | Required evidence or not_applicable reason |
|---|---|---|---|
| Product Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| User Researcher | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Plan Quality Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Tech Lead | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| UX/Interaction Designer | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Visual Design Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Visual/Composition Director | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Frontend/UI Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Content/Copy Reviewer | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Accessibility Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| QA Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Exploratory Tester | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Performance Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Security Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Privacy Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Platform/SRE Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Release Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Agent Context Steward | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Game Design Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Human Playtest Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Support/Ops Reviewer | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Analytics/Learning Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| 3D/Rendering Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| License/Compliance Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |

## Product-quality role simulation

Fill this table before claiming L2+ UI/game/product-quality pass. Each active or consulted row needs a concrete concern and evidence, not generic approval.

| Role | Concrete concern | Evidence found | Status | Owner/fix |
|---|---|---|---|---|
| Product Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| User Researcher | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Plan Quality Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Tech Lead | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| UX/Interaction Designer | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Visual Design Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Visual/Composition Director | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Frontend/UI Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Content/Copy Reviewer | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Accessibility Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| QA Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Exploratory Tester | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Performance Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Security Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Privacy Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Platform/SRE Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Release Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Agent Context Steward | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Game Design Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Human Playtest Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Support/Ops Reviewer | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Analytics/Learning Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| 3D/Rendering Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| License/Compliance Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |

## Mandatory manual review handoff

This command captures real-browser evidence and non-destructive interaction probes. It does not replace story-specific functional tests, screenshot review, or human-level composition review. Before claiming UI/browser pass, complete the screenshot review log in docs/browser-interaction-qa.md, complete the composition review in docs/composition-qa.md, compare against design references when available, and retest matching screenshots after fixes.

## Game player-facing readiness

Player-facing readiness: pass
Agent self-play in player mode: not_run unless this command is paired with an interaction script or manual step log.
Human playtest request allowed: yes

This command checks for visible debug markers in DOM text/selectors and captures screenshots. It cannot inspect visual text rendered inside a canvas; reviewers must still inspect screenshots/frame sequences against DESIGN.md. For web3d projects, missing canvas/WebGL/WebGPU, visible fallback UI, or non-zero WebGL error is failing evidence; scene-ready absence is partial evidence unless another stable-render signal is documented.
