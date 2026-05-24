# Implementation File Plan — WB-001 Bootstrap Foundation

## Story and acceptance criteria

Implement a playable, design-aligned Web3D foundation slice that renders from a real Vite app, supports core menu/gameplay/pause/finish flow, provides basic physics movement and interactions, and produces browser/WebGL evidence.

## Role review

| Role | Applicability | Review focus |
|---|---|---|
| Product/Game Design | active | core loop and out-of-scope boundary |
| Visual/UI Design | active | supplied board fidelity and readable HUD |
| Frontend/Web3D | active | component separation, rendering and input |
| QA/Browser Evidence | active | real Chromium interaction and screenshots |
| Performance | consulted | limited dynamic bodies and WebGL diagnostics |
| Security/Privacy | consulted | no network/user data in scope |
| Release | not_applicable | no deployment or public release requested |

## Plan-quality review

Requirements, design references, architecture boundary, input assumptions, validation method and risk boundaries are explicit enough for an L2 MVP bootstrap story. The primary risk is mistaking visual landmarks for fully tuned gameplay; documentation and reporting explicitly separate these.

## Implementation file plan

| File / group | Action | Responsibility | Reason | Risk | Validation |
|---|---|---|---|---|---|
| `package.json`, config files | update/create | Build and dependency contract | Run real React/Web3D app alongside harness scripts | Dependency/runtime mismatch | install, typecheck, build |
| `src/main.tsx`, `src/app/GameApp.tsx` | create | App entry and screen flow | Establish playable shell | State transition bug | browser interaction |
| `src/game/state/*`, `src/game/types.ts` | create | Typed game state and actions | Isolate gameplay lifecycle | Timer/checkpoint drift | unit reasoning + e2e |
| `src/game/input/*` | create | Desktop/gamepad input | Provide movement foundation | repeat/blur input | manual/e2e controls |
| `src/game/scene/*`, `src/game/components/*` | create | WebGL scene, level, physics entities | Build real 3D vertical slice | WebGL/physics error | canvas test/screenshot |
| `src/ui/*`, `src/styles/*` | create | Menu/HUD/modals and visual tokens | Match approved boards | clutter/readability | design screenshot review |
| `design-assets/**`, `docs/**` | update/create | Source-of-truth direction and evidence | Apply harness and preserve design traceability | stale docs | validator/report review |
| `tests/browser/*`, `playwright.config.mjs` | update | Browser flows and WebGL evidence | Validate player-facing route | environment sensitivity | real Chromium with xvfb |

## Browser interaction plan

| Flow | Interaction | Expected evidence |
|---|---|---|
| Menu | Click `Play Solo` | Canvas remains real; HUD appears with Zone 1 prompt |
| Gameplay | Keyboard movement and jump; move into checkpoint/finish path | Character moves; checkpoint toast and completion screen captured |
| Recovery | Press `R`; press `Escape`; click `Resume` | Respawn/pause UI state captured |
| Local co-op shell | Return to menu and click `Local Co-op` | Coral buddy appears with shared framing |
| WebGL | Load route in Chromium using SwiftShader flags | `webgl: true`, no fallback, no page/console errors |

---

# Implementation File Plan — WB-002 / WB-003 Grab System + Buddy Link Rescue Slice

## Route and scope

```txt
Route: implement-story
Mode: mvp
Runtime: generic
Project type: game,web3d
Target quality level: L2
Assumptions: real-browser proof uses the real Vite server bytes through direct localhost when allowed, otherwise the existing fetch bridge; local co-op keyboard fallback is acceptable for sandbox rescue evidence; no package upgrades, deployment or Git synchronization are in scope.
Next action: implement independent hand state, bounded physical pull constraints and the Zone 4 rescue setup, then capture fresh Chromium/WebGL evidence.
Project context intake: pass
Blocked by: none for implementation; public/human/device readiness remains downstream.
```

## Acceptance criteria in scope

- Player 1 independently acquires/releases a nearby tutorial crate with left or right grab input and receives visible state feedback.
- Local co-op Zone 4 stages a safe hanging-buddy rescue attempt with a short retry path.
- A nearby buddy can be linked using an independent hand; a bounded spring-like physical correction visibly pulls the hanging buddy toward safety without an unbounded impulse.
- Release immediately clears the link, and respawn clears interaction state.
- A story-specific browser path captures object-grab and Buddy Link rescue states from the real app with WebGL/error reporting.

## Pre-code role applicability and simulation

| Role | Applicability | Concern before coding | Planned control/evidence |
|---|---|---|---|
| Product/Game Design | active | Rescue must read as the first signature-mechanic payoff, not an unexplained physics shortcut. | Zone-4 staged ledge, instruction copy and self-play screenshot. |
| Visual/UI Design | active | Target/link feedback must be readable over the pastel scene and match the rescue reference. | Emissive target feedback, HUD status and composition review. |
| Frontend/Web3D | active | Interaction logic must stay out of DOM overlays and avoid unstable physics. | Dedicated systems/state boundaries and clamped impulses. |
| QA/Browser Evidence | active | Mechanic claims need new real-browser proof, not WB-001 screenshots. | Story-specific Playwright flow plus browser evidence report. |
| Performance | consulted | Continuous constraints and effects could create frame/physics instability. | Limit active links to two hand slots and cap impulse magnitude. |
| Accessibility | consulted | Grab success/release cannot rely on glow alone. | Text status in HUD plus color treatment. |
| Security/Privacy | not_applicable | No network, identity, persistence, asset-protection or data scope changes. | Boundary retained. |
| Release | not_applicable | No public release/deploy requested. | Promote real-device/human proof downstream only. |

## Alternatives and fallback

| Option | Decision | Reason / fallback |
|---|---|---|
| Full Rapier joint graph with articulated hand bodies | Deferred | Higher instability and tuning cost for this MVP rescue slice; revisit after the bounded-force interaction is evidenced. |
| Bounded spring-like impulses between real Rapier rigid bodies | Selected | Gives physical pull/release behavior with explicit caps and simple recovery. |
| Teleport-only rescue success | Rejected | Would not prove a physical Buddy Link mechanic. |

Rollback: remove the staged Zone-4 rescue activation and interaction systems while retaining WB-001 landmarks if browser evidence exposes unstable motion or regression.

## Component / system responsibility table

| Name | Type | Responsibility | Owns state? | Calls storage/API? |
|---|---|---|---|---|
| `gameStore` interaction slice | state | Hand targets, feedback, rescue phase/token and clear-on-respawn behavior. | yes — serializable gameplay state | no |
| `inputController` | service | Independent left/right grab inputs for mouse/keyboard/gamepad fallback. | transient input only | no |
| `useGrabConstraint` / `GrabFeedbackRing` | hook/component | Acquire nearby grabbable props, apply bounded pull impulse, render highlight. | no — reads/writes interaction slice | no |
| `BuddyLinkSystem` | system/component | Acquire buddy target, render connection and stage bounded rescue behavior. | no — reads/writes interaction slice | no |
| `PlayerCharacter` | component | Apply link correction on the real player rigid body and honor rescue relocation. | Rapier body only | no |
| `RescueGapLandmark` | scene component | Safe lower ledge and visual affordance for Zone 4. | no | no |
| `HUD` | UI component | Text feedback for target, link, release and rescue status. | no | no |
| `buddy-link-rescue.spec.mjs` | browser test | Prove object acquisition, staged rescue/link/release with real render. | no | no |

## Implementation file plan

| File | Action | Responsibility | Reason | Risk | Validation |
|---|---|---|---|---|---|
| `src/game/types.ts` | edit | Interaction domain types | Keep hand/target/rescue contracts typed. | Type coupling | typecheck |
| `src/game/state/gameStore.ts` | edit | Interaction/rescue state/actions | Make feedback and recovery deterministic. | stale grab state | browser release/respawn checks |
| `src/game/input/inputController.ts` | edit | Independent hand mapping | Meet left/right acquisition/release criterion. | input collision | browser interaction |
| `src/game/systems/GrabSystem.tsx`, `src/game/systems/useGrabConstraint.ts` | create | Object-grab bounded force and visual focus | Isolate prop interaction physics. | jitter | self-play/screenshots |
| `src/game/systems/BuddyLinkSystem.tsx` | create | Buddy acquisition/ribbon/rescue resolution | Isolate signature mechanic orchestration. | exploding pulls | capped-force browser flow |
| `src/game/components/PhysicsCrate.tsx` | edit | Wire grabbable crates to system | Validate object-grab before buddy link. | both crates competing | nearest/hand locking |
| `src/game/components/PlayerCharacter.tsx` | edit | Apply bounded buddy pull and rescue setup | Make connection physical. | respawn/link overlap | rescue/release test |
| `src/game/components/GameplayLandmarks.tsx` | edit | Rescue ledge/safe-zone visuals | Make Zone 4 playable/readable. | route obstruction | screenshot review |
| `src/game/scene/PlaygroundLevel.tsx`, `src/game/scene/GameScene.tsx` | edit | Compose systems/scene setup | Stage rescue in real canvas. | render regression | canvas readiness |
| `src/ui/HUD.tsx`, `src/styles/index.css` | edit | Player-readable interaction feedback | Satisfy non-color feedback and composition. | visual clutter | browser screenshot review |
| `tests/browser/buddy-link-rescue.spec.mjs`, `package.json` | create/edit | Story regression/evidence command | New evidence for WB-002/003. | timing sensitivity | Chromium test |
| `docs/stories.md`, `docs/validation.md`, `docs/evidence-ledger.md`, `.agent/project-state.md` | edit | Story/evidence/state memory | Honest lifecycle traceability. | premature done claim | update after results |

## Browser interaction plan

| Flow | Interaction | Expected evidence |
|---|---|---|
| Object grab | Solo → move beside tutorial crate → hold/release left mouse | Text feedback changes to grabbed/released and crate highlight/physical response renders. |
| Buddy rescue | Local co-op → traverse Player 1 to Zone 4 → acquire hanging Player 2 → release | Safe rescue setup, visible link/pull feedback and immediate unlink state. |
| Recovery | Drop/reset during interaction | Active hand/link clears and checkpoint retry remains valid. |
| WebGL | Run headed Chromium with SwiftShader flags against real server bytes | `webgl: true`, errors recorded, screenshot paths retained. |


---

# Implementation File Plan — WB-004 Full Traversal and Finale

## Route and scope

```txt
Route: implement-story
Mode: mvp
Runtime: generic
Project type: game,web3d
Target quality level: L2
Assumptions: Play Solo is the full five-zone route for this story; Local Co-op Rescue remains the already-validated Zone 4 practice entry; real-browser evidence will use the retained real-server bridge when sandbox blocks direct localhost; existing dependency cache may be reused without installing/upgrading packages.
Next action: implement a readable door progression gate and rope-finale traversal, then self-play the five-zone solo route in real Chromium/WebGL and review composition.
Project context intake: pass
Blocked by: public/human/device playtests and full local-co-op five-zone traversal are downstream stories.
```

## Outcome, boundaries and alternatives

- **Outcome:** a first-time solo player can cross Zone 1–5, understand the switch/rope actions from HUD feedback, and receive the existing completion overlay.
- **In scope:** traversable Zone 1→2 transition, door switch/open feedback, rope-handle grab/launch interaction, finish completion, browser evidence and composition review.
- **Out of scope:** full two-player five-zone route, physically swinging rope pendulum tuning, gamepad-only traversal, production performance optimization, release/deploy.
- **Chosen approach:** forgiving sensor-assisted actions that preserve the low-poly landmark visuals while keeping traversal stable in software-rendered browser proof.
- **Rejected alternative:** a fully constraint-driven rope/weighted co-op door in this story, because it increases tuning risk before a reliable start-to-finish route exists.
- **Rollback:** remove the WB-004 state/actions and interaction systems and retain WB-002/003 rescue practice files and evidence.

## Acceptance criteria

- Solo player can move through each zone in order without hidden collision blockers and activate a readable heavy-door switch progression step.
- Zone 3 door visibly opens after switch activation and communicates the resulting path state in the player-facing HUD.
- Zone 5 offers a visible rope handle interaction; grabbing it provides bounded launch assistance and feedback before reaching the glowing finish gate.
- Real Chromium/WebGL evidence from the real built app records door-open, rope/launch and completion states without console/page errors.
- Composition review compares Zone 3, Zone 5 and completion frames to approved concept boards and records remaining visual debt.

## Implementation file plan

| File | Action | Responsibility | Reason | Risk | Validation |
|---|---|---|---|---|---|
| `src/game/types.ts` | update | Traversal interaction state types/targets | Keep story state typed | state drift | typecheck |
| `src/game/state/gameStore.ts` | update | Door/finale lifecycle and feedback actions | Central serializable progress ownership | stale state on restart | browser self-play/restart |
| `src/game/components/GameplayLandmarks.tsx` | update | Door switch sensor, animated door, rope handle/finale sensors | Render and sense story landmarks only | collision blocks path | Chromium traversal |
| `src/game/components/PlayerCharacter.tsx` | update | Consume bounded rope-launch effect while player controls remain owned here | Apply physical player effect at body boundary | unstable impulse | self-play/WebGL |
| `src/game/scene/PlaygroundLevel.tsx` | update | Compose story landmarks and route geometry | Make route contiguous/readable | level gaps | browser run |
| `src/ui/HUD.tsx` | update | Contextual door/rope feedback | First-time comprehension | UI clutter | screenshot review |
| `src/styles/index.css` | update only if needed | Player-facing affordance styling | Preserve visual hierarchy | overlay occlusion | composition review |
| `tests/browser/full-traversal-finale.spec.mjs` | create | Targeted WB-004 real-server bridge flow | Repeatable route evidence | SwiftShader timeouts | targeted run/bounded manual proof |
| `docs/*`, `.agent/project-state.md`, `NEXT_SESSION.md` | update after evidence | Traceability, evidence, honest handoff | Keep source of truth current | overclaim | validator/report review |

## Component / hook / state responsibility table

| Boundary | Owns | Must not own |
|---|---|---|
| `gameStore` | door/finale phase, user-facing progression messages, completion state | Rapier body operations or rendering |
| `HeavyDoorLandmark` | switch sensor, door visual/collider state | player velocity or HUD layout |
| `RopeFinaleLandmark` | rope affordance/sensor and visual state | global input handling |
| `PlayerCharacter` | bounded body impulse after finale action is active | deciding landmark progression rules |
| `HUD` | readable prompt/status copy | collision/game-physics transitions |
| Browser test | player actions and visible/error evidence | mock HTML or implementation shortcuts |

## Plan-quality review and role applicability scan

| Role | Applicability | Pre-code concern / evidence target |
|---|---|---|
| Product Owner | active | Complete solo five-zone payoff without broadening co-op scope. |
| Plan Quality Owner | active | Scope remains sensor-assisted MVP, not a rope-physics rewrite. |
| Tech Lead | active | State/render/physics/input boundaries remain separated. |
| UX/Interaction Designer | active | Switch and rope next actions must be discoverable through normal HUD feedback. |
| Visual Design Owner / Visual-Composition Director | active | Compare door, finale and completion frames to approved boards. |
| Frontend/UI Owner | active | HUD additions remain sparse and do not cover play area. |
| Content/Copy Reviewer | consulted | No internal or debug wording reaches player-facing copy. |
| Accessibility Owner | consulted | Existing keyboard path remains usable; status text remains visible. |
| QA Owner / Exploratory Tester | active | Self-play route, respawn/restart and console error proof. |
| Game Design Owner | active | Progression beats teach action then reward completion. |
| Human Playtest Owner | consulted | Human fun/readability evidence deferred explicitly downstream. |
| 3D/Rendering Owner | active | Real Chromium/WebGL/canvas evidence and bounded physics stability. |
| Performance Owner | active | Existing large bundle remains tracked; no new heavy asset/dependency. |
| Security / Privacy / Data / Backend API | not_applicable | Local client-only story adds no auth, data, network, upload or persistence surface. |
| Platform/SRE / Release / Support / Analytics | not_applicable | No deployment/public release/telemetry/support boundary in this local route. |
| License/Compliance Owner | consulted | Only existing project-created primitives/assets are used. |
| Agent Context Steward | active | Story/state/handoff and evidence must be updated after validation. |

## Browser interaction and evidence plan

| Flow | Action | Expected visible evidence |
|---|---|---|
| Start | Choose `Play Solo`, move past crate and bridge | Zone advances from Tutorial Yard to Wobble Bridge. |
| Door | Enter Zone 3 and step on switch | Door moves open; HUD reports path open. |
| Rescue checkpoint | Continue across safe route | Zone 4/checkpoint feedback remains reachable without co-op-only blocker. |
| Finale | Move to rope handle and hold grab, then release/continue | Rope/launch status appears; player reaches Zone 5 gate. |
| Completion | Enter finish gate | `Playground Complete!` overlay shown. |
| WebGL | Load built app in headed Chromium via real-server bridge | `webgl=true`, `glError=0`, zero page/console errors, screenshot paths saved. |

---

# WB-004A Control Feel Stabilization — Camera, Facing, Grounding and Jump

## Route and scope amendment

```txt
Route: implement-story
Mode: mvp
Runtime: generic
Project type: game,web3d
Target quality level: L2 Experience
Assumptions: the user-reported control defects supersede finale evidence until the core locomotion feels usable; mouse orbit must not remove the existing two-hand grab proof; the real-server bridge remains required for Chromium validation in this sandbox.
Next action: stabilize the playable controller foundation, then resume WB-004 self-play finale validation.
Project context intake: pass
Blocked by: no implementation blocker; human feel acceptance remains downstream after sandbox evidence.
```

## User-facing defects addressed

- Camera target/position must damp smoothly rather than snap as store positions arrive.
- Player must visibly turn toward movement direction.
- Camera must support held-mouse drag orbit without stealing established left/right grab actions.
- Player mesh must stand on the collider/floor instead of appearing suspended above it.
- Jump must trigger reliably from grounded contact rather than a vertical-speed heuristic.

## Plan-quality and alternatives

- **Selected:** ground sensor + coyote window, camera-relative locomotion, delta-based damped orbit camera, middle-mouse or Alt+left drag orbit, visual model offset to collider feet, CCD, and the fixed physics timestep retained after variable-step testing destabilized the SwiftShader route.
- **Rejected:** using ordinary left/right drag for orbit, because those buttons are already the Buddy Link hand inputs and would regress WB-002/003.
- **Rejected:** retaining `abs(verticalVelocity)` as jump eligibility, because it permits mid-air false positives and denies landing-edge jumps.
- **Risk:** variable timestep may expose tunnelling in software rendering; existing CCD and real-browser traversal retest contain this risk.
- **Rollback:** restore fixed camera/world controls while retaining only the grounded jump and model/collider alignment fix if orbit or timestep creates a traversal regression.

## Pre-code role applicability and simulation

| Role | Applicability | Concern before coding | Planned control/evidence |
|---|---|---|---|
| Product/Game Design | active | A playful character is unusable when jump, facing, or view control feels broken. | Self-play on tutorial platform and traversal retry. |
| UX/Composition | active | Orbit control must be discoverable without obscuring HUD. | Compact control copy in menu/HUD and screenshot review. |
| Frontend/Web3D | active | Frame-rate-dependent lerps and stale transform sampling create judder. | Delta-based damping and per-frame transform publication. |
| Physics | active | Grounding/floating fixes must not reintroduce fall-through. | Foot sensor + CCD + real WebGL movement/jump checks. |
| QA/Browser Evidence | active | “Smooth” cannot be asserted from build output alone. | Headed Chromium interaction screenshot/report and error capture. |
| Accessibility | consulted | A mouse-only camera option should not hide keyboard controls. | Movement/jump remain keyboard; camera orbit is supplemental. |
| Security/Privacy/Release | not_applicable | No network, persistence or public release change. | Boundary retained. |

## Component / system responsibility table

| Name | Type | Responsibility | Owns state? | Calls API/storage? |
|---|---|---|---|---|
| `inputController` | service | Keyboard/grab input plus transient non-conflicting orbit drag deltas. | yes — transient input only | no |
| `SharedCamera` | scene controller | Smooth target follow and orbit pose from drag deltas. | yes — local camera refs only | no |
| `PlayerCharacter` | physics component | Camera-relative velocity, grounded jump and visual facing at rigid-body boundary. | Rapier body/refs only | no |
| `CharacterModel` wrapper in player | presentation boundary | Offset rendered feet to physical capsule without altering world logic. | no | no |
| `GameScene` | scene composition | Retain the fixed physics step proven stable for software-rendered evidence. | no | no |
| `MenuScreen` / `HUD` | UI | Expose new camera/jump controls to players. | no | no |

## Implementation File Plan

| File | Action | Responsibility | Reason | Risk | Validation |
|---|---|---|---|---|---|
| `src/game/input/inputController.ts` | edit | Orbit delta capture and camera yaw sharing | Support held-mouse orbit while preserving hand buttons | pointer/grab conflict | Chromium controls |
| `src/game/scene/SharedCamera.tsx` | edit | Delta-based target/pose damping and orbit | Remove judder and fixed angle | motion comfort | browser render |
| `src/game/components/PlayerCharacter.tsx` | edit | Grounded jump, camera-relative motion, visual facing/feet offset | Correct core control feel | collider/ground regressions | jump/traversal proof |
| `src/game/scene/GameScene.tsx` | edit | Fixed-step stability boundary retained after trial | Prevent SwiftShader entry/crash regression while CCD remains active | slow wall-clock proof | state-driven browser proof |
| `src/ui/MenuScreen.tsx`, `src/ui/HUD.tsx` | edit | Control affordance copy | Make orbit/jump discoverable | clutter | screenshot review |
| `docs/implementation-plan.md`, `.agent/project-state.md` | edit | Story amendment and lifecycle memory | Trace user-found defects honestly | stale status | final update |

# WB-006 — Performance and Visual Polish Slice (2026-05-23)

```txt
Route: implement-story
Mode: mvp
Runtime: generic
Project type: game,web3d
Target quality level: L2 Experience with focused performance evidence
Assumptions: WB-002/003 rescue and WB-004 solo completion stay functionally unchanged; initial-menu WebGL ambience may be replaced by lightweight presentation to defer Three/Rapier until Play; no new dependency, asset download, deployment or Git mutation is permitted.
Next action: split gameplay/WebGL from initial menu bundle, polish completion/HUD composition, re-measure build and validate real-browser completion regression.
Project context intake: pass
Blocked by: no coding blocker; real-device FPS and public readiness remain downstream.
```

## Goal and acceptance criteria

- Reduce the JavaScript downloaded for the initial menu by deferring the WebGL/physics scene until a player starts a mode.
- Preserve the already-validated solo completion and co-op rescue entry behaviors after loading the gameplay chunk.
- Reduce instructional obstruction during quiet traversal zones while retaining actionable prompts at tutorial, door, rope and rescue moments.
- Enrich the completion moment with lightweight CSS/DOM celebration and buddy/reward treatment aligned to the approved completion board, without increasing asset weight.
- Record production-build bundle output and a real Chromium/WebGL gameplay proof from actual Vite preview bytes.

## Plan-quality and alternatives

- **Selected:** `React.lazy` gameplay scene boundary triggered only after mode selection, with intent-prefetch on Play hover/focus to smooth scene entry; a lightweight CSS menu backdrop replaces menu-only WebGL hero rendering; completion disposes the active Canvas before the CSS celebration view to stop unnecessary GPU rendering after success; locomotion speed increases from `5.7` to `7.0` so the proven long route remains playable and testable under fixed-step software-render constraints.
- **Rejected:** add texture/model/audio assets for visual richness, because bundle reduction and license/evidence scope would conflict with this focused slice.
- **Rejected:** tune physics, traversal timing or rescue mechanics during polish, because those slices already carry evidence and unnecessary behavior changes increase regression risk.
- **Risk:** menu is less 3D than the prior WebGL-backed title state; mitigate by adding CSS buddy silhouettes/sky shapes and comparing screenshot composition.
- **Risk:** first Play action incurs dynamic chunk load; mitigate with a clear loading state and intent-prefetch on hover/focus.
- **Risk:** faster locomotion could skip landmarks; contain with CCD already present and a full door/rope/finish regression run.
- **Rollback:** restore eager `GameScene` import and prior HUD/completion markup if dynamic-load or traversal validation fails.

## Pre-code role applicability and simulation

| Role | Applicability | Concern before coding | Planned control/evidence |
|---|---|---|---|
| Product/Game Design | active | Polish must not break the proven five-zone loop. | Run full solo completion proof after changes. |
| Performance Owner | active | The large Three/Rapier payload currently ships on first menu load. | Vite chunk report before/after plus runtime sample. |
| UX/Composition | active | Dense onboarding panels obscure the playable view; completion lacks celebration hierarchy. | Menu/HUD/completion screenshots and board comparison. |
| Frontend/Web3D | active | Lazy scene boundary must keep Canvas readiness/error visibility intact. | Small loading component and real bridge/WebGL proof. |
| Accessibility | consulted | Reduced overlays and decorative celebration must preserve readable status and reduced-motion behavior. | Semantic status retained; CSS-only decoration marked hidden. |
| Security/Privacy/Release | not_applicable | No network, storage, auth, dependency or deployment boundary changes. | Boundary retained in handoff. |

## Component / system responsibility table

| Name | Type | Responsibility | Owns state? | Calls API/storage? |
|---|---|---|---|---|
| `GameApp` | composition boundary | Decide whether lightweight menu or lazy gameplay scene is mounted; render load affordance. | reads status only | no |
| `MenuScreen` | presentation | Render low-cost title/backdrop and mode selection before WebGL load. | no | no |
| `HUD` | presentation | Show actionable guidance only where it helps play. | no | no |
| `CompletionOverlay` | presentation | Render celebration/reward treatment without heavyweight assets. | no | no |
| `GameScene` | WebGL boundary | Unchanged gameplay/physics render loaded after Play. | reads store | no |

## Implementation File Plan

| File | Action | Responsibility | Reason | Risk | Validation |
|---|---|---|---|---|---|
| `src/app/GameApp.tsx` | edit | Lazy WebGL boundary and load fallback | Keep Three/Rapier out of menu initial bundle | loading/regression | build chunks + browser completion |
| `src/ui/MenuScreen.tsx`, `src/styles/index.css` | edit | Lightweight backdrop and presentation | Preserve inviting menu without Canvas weight | less depth | screenshot review |
| `src/ui/HUD.tsx`, `src/styles/index.css` | edit | Context visibility/density | Free screen space in traversal | missing guidance | interaction checkpoints |
| `src/ui/CompletionOverlay.tsx`, `src/styles/index.css` | edit | Finale celebration | Close visible gap to design board with no assets | decorative clutter | composition review |
| `scripts/wb006-performance-proof.mjs` | add | Browser runtime/load evidence | Measure current bundle path and completion regression | sandbox render limits | Chromium bridge proof |
| `docs/performance-budget.md`, `docs/evidence-ledger.md`, `.agent/project-state.md`, `NEXT_SESSION.md` | edit | Measure/status memory | Honest handoff and open-risk tracking | stale claims | validator suite |

# WB-005 — Local Co-op Route / Gamepad Wiring Slice (2026-05-23)

```txt
Route: implement-story
Mode: mvp
Runtime: generic
Project type: game,web3d
Target quality level: L2 Experience with sandbox input evidence
Assumptions: the validated Local Co-op Rescue practice entry remains intact; a separate Local Co-op Run mode may expose the five-zone route; browser Gamepad API evidence validates input wiring only and does not replace a physical-controller or human playtest signoff.
Next action: add a separate co-op traversal mode, make both buddies required at finish, drive Player 2 through the browser Gamepad API in Chromium, and retain physical-gamepad validation as downstream.
Project context intake: pass
Blocked by: no coding blocker; physical gamepad/human co-op acceptance cannot be claimed from sandbox tooling.
```

## Goal and acceptance criteria

- Preserve **Local Co-op Rescue** as the already-evidenced Zone 4 practice mode.
- Add **Local Co-op Run** as a distinct menu choice spawning both buddies at the start of the five-zone path.
- Player 1 retains keyboard/mouse input; Player 2 accepts controller axes/buttons with the documented keyboard fallback.
- Shared camera frames both moving buddies, door/rope traversal remains playable, and completion occurs only after both buddies reach the finish gate.
- Real Chromium/WebGL evidence records Player 2 movement through the Gamepad API, shared-camera route progression and co-op completion; physical controller validation remains an explicit follow-up.

## Plan-quality and alternatives

- **Selected:** extend `GameMode` with a separate route mode, reuse validated world/physics landmarks, enable the existing shared camera and player-two body across the new route, and make the rope finale available to Player 1 while Player 2 follows through the finish sensor.
- **Rejected:** repurpose `Local Co-op Rescue`, because it would regress the validated signature-mechanic practice entry and its recorded evidence.
- **Rejected:** claim real controller readiness from a virtual gamepad, because browser API wiring does not prove physical ergonomics, dead zones or human coordination.
- **Risk:** the shared camera may widen too far or move unevenly when players separate; contain with a browser screenshot/report at route completion and retain downstream human tuning.
- **Risk:** a second body may miss a narrow platform or finish sensor; contain with state-driven full-route evidence requiring both finish flags.
- **Rollback:** remove the new menu mode and route-specific conditions while leaving validated Rescue Practice and solo paths untouched.

## Pre-code role applicability and simulation

| Role | Applicability | Concern before coding | Planned control/evidence |
|---|---|---|---|
| Product/Game Design | active | A new co-op route must not overwrite rescue practice. | Separate mode button and regression boundaries. |
| UX/Interaction Designer | active | Player 2 controls and completion dependency must be discoverable. | HUD/menu copy and completion screenshot review. |
| Frontend/Web3D | active | Mode branching must reuse scene boundaries without duplicating physics. | Small mode predicates in store/scene/landmarks. |
| QA/Browser Evidence | active | Gamepad input cannot be claimed without observing movement in real Canvas runtime. | Chromium Gamepad API injection, telemetry, WebGL/error report. |
| Accessibility | consulted | Keyboard fallback must remain present for a local second player. | Arrow/Enter/Shift/Slash copy retained. |
| Performance Owner | consulted | An extra UI mode must not eagerly load WebGL or grow gameplay meaningfully. | Build output comparison and menu lazy-load gate. |
| Release Owner | not_applicable | No deployment or external hardware certification. | Handoff explicitly retains physical-gamepad blocker. |

## Component / system responsibility table

| Name | Type | Responsibility | Owns state? | Calls API/storage? |
|---|---|---|---|---|
| `types` / `gameStore` | state contract | Distinguish rescue practice from full co-op run and enforce two-player completion. | yes — lifecycle state | no |
| `MenuScreen` / `HUD` / `CompletionOverlay` | UI | Select and explain co-op traversal without obscuring route play. | no | no |
| `GameScene` / `SharedCamera` | scene composition | Spawn/frame Player 2 for either co-op mode. | reads mode/positions | no |
| `RopeFinaleLandmark` | gameplay landmark | Permit full-route finale progression while practice mode remains scoped to rescue. | reads/updates finale phase | no |
| `PlayerCharacter` | physics component | Emit non-production telemetry for Player 2 browser-input proof. | Rapier body/refs only | no |
| `scripts/wb005-coop-route-proof.mjs` | QA script | Drive P1 plus virtual Gamepad API P2 through real built app and report proof boundary. | test-only runtime | no |

## Implementation File Plan

| File | Action | Responsibility | Reason | Risk | Validation |
|---|---|---|---|---|---|
| `src/game/types.ts`, `src/game/state/gameStore.ts` | edit | New co-op route state and spawn/lifecycle semantics | Keep practice mode intact while adding full run | mode regressions | typecheck + route proof |
| `src/game/scene/GameScene.tsx`, `src/game/scene/SharedCamera.tsx` | edit | Spawn/frame both buddies in new mode | Shared local co-op play | framing/perf | browser/WebGL evidence |
| `src/game/components/GameplayLandmarks.tsx`, `src/game/components/PlayerCharacter.tsx` | edit | Finale condition and P2 telemetry | Complete route and observe controller movement | sensor/input bug | co-op proof |
| `src/ui/MenuScreen.tsx`, `src/ui/HUD.tsx`, `src/ui/CompletionOverlay.tsx`, `src/styles/index.css` | edit | Co-op mode selection and control/status copy | Make feature visible and readable | compact layout | screenshots |
| `scripts/wb005-coop-route-proof.mjs`, `package.json` | add/edit | Real browser Gamepad API proof | Test P2 wiring and both-player finish | virtual input scope | Chromium report |
| `docs/stories.md`, `docs/test-matrix.md`, `.agent/project-state.md`, `NEXT_SESSION.md`, `docs/evidence-ledger.md` | edit | Status/evidence memory | Honest handoff | stale claims | quality-system validators |

# WB-008 — Movement, Props and Buddy-Link Feedback Fixes (2026-05-24)

```txt
Route: implement-story
Mode: mvp
Project type: game,web3d
Goal: resolve control-feel and interaction-readability observations before human playtest while deferring broad collision redesign.
```

| File | Action | Responsibility | Validation |
|---|---|---|---|
| `src/game/components/PlayerCharacter.tsx` | edit | Damped movement, lower jump/speed, assisted rescue hoist | `wb008-feedback-proof`, `wb008-buddy-link-proof` |
| `src/game/components/PhysicsCrate.tsx` | edit | Crate reset after leaving the island; readable return feedback | `wb010-edge-recovery-proof` |
| `src/game/components/GameplayLandmarks.tsx` | edit | Upright switch target visual | `wb008-marker-proof` |
| `src/game/components/CharacterModel.tsx`, `src/ui/HUD.tsx`, `src/styles/index.css` | edit | Raised-hand visual/HUD feedback | `wb008-feedback-proof`, screenshot review |
| `scripts/wb008-*.mjs`, `package.json` | add/edit | Real Chromium evidence harnesses | JSON reports + screenshots |

# WB-010 — Edge-Fall Recovery and Collision-Safety Follow-up (2026-05-24)

```txt
Route: implement-story
Mode: mvp
Project type: game,web3d
Goal: prevent long unresponsive falls during crate-edge interactions without claiming general collision resolution.
```

| File | Action | Responsibility | Validation |
|---|---|---|---|
| `src/game/components/PlayerCharacter.tsx` | edit | Early automatic fall recovery threshold and telemetry | `wb010-edge-recovery-proof` |
| `src/game/state/gameStore.ts` | edit | Recovery feedback copy and crate-message priority | browser screenshot/text assertion |
| `scripts/wb010-edge-recovery-proof.mjs`, `package.json` | add/edit | Physical push/fall/recovery proof | real Chromium/WebGL JSON report |
| `docs/*`, `.agent/project-state.md`, `NEXT_SESSION.md` | edit | Traceability and handoff status | quality-system validators |

---

# WB-011 — Human Playtest Execution Kit

## Route and boundary

```txt
Route: human-playtest-preparation
Mode: mvp
Project type: game,web3d
Quality level: L2
Input: WB-008/WB-010 sandbox-validated handoff
Output: privacy-safe real-session kit and triage workflow
Non-claim: no participants, physical controllers or target GPUs were exercised by this documentation route
```

## Outcome

Prepare a facilitator to run the first physical-controller/two-person sessions against the already validated application without losing the known observation topics or storing identifying data in the handoff.

## Deliverables and validation

| Artifact | Responsibility | Validation |
|---|---|---|
| `docs/playtest-session-template.md` | Capture anonymous PT-WB-001/002/003 observations and dispositions | Review against open risk register and existing session sequence |
| `docs/playtest-issue-triage.md` | Define severity, reproduction and stop/continue decisions | Review for actionable fix-story inputs |
| `docs/playtest-results/README.md` | Define no-PII storage/naming boundary | Privacy/data-minimization review |
| `docs/playtest-protocol.md` | Join sequence, forms and expected output | Cross-reference validation |
| Governance ledgers/state | Mark kit ready while leaving real sessions `not_run` | Quality-system validators |

## Next external gate

Run PT-WB-001, PT-WB-002 and PT-WB-003 with real participants, a physical gamepad and recorded device/GPU context. A focused fix story should be opened only from reproduced human/hardware findings.

