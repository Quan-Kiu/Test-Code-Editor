# Test Matrix — Wobble Buddies MVP

| Story | Unit/static | Build | Browser player flow | WebGL canvas | Visual comparison | Human playtest | Status |
|---|---|---|---|---|---|---|---|
| WB-002/WB-003 Grab/Buddy Link Rescue | pass | pass | pass_with_bridge_boundary | pass | rescue states evidenced | downstream | validated_sandbox |
| WB-004A Control Feel Stabilization | pass | pass | pass_with_browser_mode_limitation | pass | movement/jump/orbit evidenced | downstream | validated_sandbox |
| WB-004 Full Traversal and Finale | pass | pass | pass_with_bridge_boundary | pass | door/completion partial review | downstream | validated_sandbox |
| WB-006 Performance and Visual Polish | pass | pass_with_large_chunk_warning | pass_with_bridge_boundary | pass | menu/completion partial review | downstream | validated_sandbox_with_risks |
| WB-005 Local co-op route / Gamepad wiring | pass | pass_with_large_chunk_warning | pass_with_virtual_gamepad_boundary | pass | menu, shared-camera door and completion evidenced | physical/human downstream | validated_sandbox_with_risks |
| WB-007 Pre-Playtest Readiness Hardening | pass | pass_with_large_chunk_warning | pass_with_bridge_and_fallback_boundary | pass | menu/pause/reduced completion evidenced | **next required gate** | validated_for_human_playtest_entry_with_risks |

| WB-008 Movement, Props and Buddy-Link Feedback Fixes | pass | pass_with_large_chunk_warning | pass_with_bridge_boundary | pass | raised hand, upright target and crate recovery evidenced | downstream | validated_sandbox_with_risks |
| WB-010 Edge-Fall Recovery and Collision-Safety Follow-up | pass | pass_with_large_chunk_warning | pass_with_bridge_and_fallback_boundary | pass | recovery message/effect evidenced | **next required gate** | validated_for_human_playtest_entry_with_collision_scope_limitation |
| WB-011 Human Playtest Execution Kit | not_applicable | not_applicable | not_applicable | not_applicable | documentation review pass | **ready_to_run; not_run** | validated_documentation_scope |

## Remaining acceptance boundary

The next required validation is a real two-person session with a physical controller and target-device performance observations. Browser Gamepad API and SwiftShader/Xvfb evidence must not be reported as human or hardware signoff.
