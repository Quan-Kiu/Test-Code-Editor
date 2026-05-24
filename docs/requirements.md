# Requirements — MVP Foundation Slice

## Functional requirements

| ID | Requirement | Current story status |
|---|---|---|
| FR-001 | Show title screen with `Play Solo`, `Local Co-op`, controls and visual identity. | in_scope |
| FR-002 | Render a 3D floating playground scene with pastel low-poly primitives. | in_scope |
| FR-003 | Allow Player 1 movement, jump, pause and checkpoint reset using desktop input. | in_scope |
| FR-004 | Spawn blue Player 1 and coral Player 2 in local co-op mode with shared framing. | in_scope |
| FR-005 | Present box, bridge, door/lever, rescue-gap, rope and finish landmarks. | in_scope |
| FR-006 | Activate shared checkpoint feedback and allow fast respawn. | in_scope |
| FR-007 | Show a finish state and restart action after reaching the finish target. | in_scope |
| FR-008 | Implement independent grab constraints, tuned Buddy Link rescue and full rope swing traversal. | validated_sandbox |
| FR-009 | Validate Player 2 Gamepad API play from start to finish. | validated_sandbox_virtual_gamepad_boundary |
| FR-010 | Expose controller readiness and a selectable reduced-effects fallback before human playtest. | validated_sandbox_preplaytest |
| FR-011 | Provide a privacy-safe, structured execution kit for real two-person/physical-controller human playtesting. | validated_documentation_scope; sessions_not_run |

## Non-functional requirements

| ID | Requirement | Validation |
|---|---|---|
| NFR-001 | WebGL canvas renders in real Chromium from real local server. | browser evidence and canvas readiness test |
| NFR-002 | Normal player route contains no developer-only overlays or visible instrumentation. | player mode browser test |
| NFR-003 | Target close to 60 FPS on typical desktop; bootstrap scene avoids excessive rigid bodies. | diagnostic capture; deeper performance tuning later |
| NFR-004 | Static geometry uses fixed colliders; dynamic physics remains limited to gameplay objects and players. | code review and scene inspection |
| NFR-005 | UI is legible at desktop viewport and preserves pastel design direction. | screenshot comparison |
| NFR-006 | Pause and completion modal controls are keyboard focusable, contained and recoverable. | WB-007 browser focus evidence |
| NFR-007 | Graphics fallback lowers render work without changing success conditions. | WB-007 reduced-effects route proof |
| NFR-008 | Human-playtest artifacts store anonymous technical/session observations only and do not claim acceptance before real sessions occur. | WB-011 kit review and completed-session requirement |

## Controls for foundation slice

| Action | Player 1 | Local co-op Player 2 foundation |
|---|---|---|
| Move | W A S D | Gamepad left stick; arrow-key fallback for sandbox verification |
| Jump | Space | Gamepad south button; Enter fallback |
| Grab/link input | Hold left/right mouse button when near an eligible teammate/object | Left/right trigger foundation mapping |
| Respawn | R | Gamepad east button foundation mapping |
| Pause | Escape | Escape |

## Failure and completion rules

Falling below the playground or pressing reset respawns the affected active player at the most recent checkpoint. Solo completion occurs when Player 1 enters the finish gate. Cooperative completion requires both buddies inside the finish area.
