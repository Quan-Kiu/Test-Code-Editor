# Playtest Protocol — Wobble Buddies

## Entry rule

Human playtesting may begin after the retained WB-007/WB-008/WB-010 sandbox evidence is reviewed: normal mode contains no developer-only UI, browser/WebGL checks pass through the documented real-server-byte boundary, controller/preset controls are legible, automated traversal has completed, movement/feedback recovery corrections are evidenced, and the remaining collision scope limitation is understood. This entry rule does not declare release readiness.

Use `docs/playtest-session-template.md` for each anonymous participant pair/device and `docs/playtest-issue-triage.md` for defects or friction. Keep completed anonymous results under `docs/playtest-results/` only after real sessions occur.

## Sessions

| Session ID | Stage | Participants | Goal | Status | Evidence target |
|---|---|---|---|---|---|
| PT-WB-001 | Buddy Link practice | two local players, one physical gamepad | comprehension of grab/release/raised-hand/rescue retry | ready_to_run | completed anonymous session sheet, controller identity, consent-controlled screenshot/clip reference only when permitted |
| PT-WB-002 | Standard full co-op run | two local players, physical gamepad | movement/jump feel, route pacing, camera comfort, crate/edge recovery, finale/completion clarity | ready_to_run | timed run, issue IDs, subjective ratings and device context |
| PT-WB-003 | Reduced effects comparison | same players on same or constrained device | responsiveness/readability fallback comparison | ready_to_run | device/GPU/browser, preset comparison and preference |

## Before each session

1. Assign an anonymous session code and open a copy of `docs/playtest-session-template.md`.
2. Record browser, OS, device/GPU, display and physical controller model/connection type.
3. Confirm `P2 controller ready` appears before beginning co-op play.
4. Begin with Standard; use Reduced effects only as an intentional comparison or performance fallback.
5. Confirm no participant-identifying data or unconsented media will be stored in this handoff.
6. Record any reconnect, dead-zone, camera, jump, Buddy Link, crate return, stuck/fall/reset or readability issue using the triage guide.

## Execution sequence

1. Run PT-WB-001 without initially explaining Buddy Link or the raised-hand cue; observe comprehension.
2. Run PT-WB-002 through a full Standard co-op completion; intentionally include crate return and edge recovery when reasonable.
3. Run PT-WB-003 only after Standard, so preference and responsiveness comparison share the same players/device.
4. Stop and triage before further sessions when a blocker or repeatable high-severity issue appears.

## Required session outputs

- One completed anonymous session template per participant pair/device.
- One issue row for each observed defect or meaningful friction point, with severity and reproduction details.
- Technical device/controller/preset context sufficient for reproducing controller or performance issues.
- A clear decision: continue testing, open a focused fix story, or hold a physical-controller model for retest.

## Non-claims

Automated evidence uses virtual browser Gamepad input and SwiftShader/Xvfb. WB-011 validates only the execution kit and privacy-safe capture structure. It is not the human playtest itself, is not physical-controller certification, is not real-GPU performance approval and does not authorize public release.
