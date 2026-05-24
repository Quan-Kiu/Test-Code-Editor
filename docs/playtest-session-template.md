# Human Playtest Session Template — Wobble Buddies

Use one copy of this sheet per participant pair and device. Store only an anonymous session code; do not record participant names, email addresses, audio/video, or identifiers unless separate consent and retention rules are established outside this handoff.

## Session metadata

| Field | Entry |
|---|---|
| Session code | `PT-WB-____` |
| Date / facilitator initials |  |
| Build / handoff source | `WB-008/WB-010 validated handoff` |
| Browser and version |  |
| Operating system |  |
| GPU / graphics mode |  |
| Display size / refresh rate |  |
| Physical controller model / connection type |  |
| Graphics preset tested first | `Standard` / `Reduced effects` |
| Consent for screenshots or short clips | `none` / `screenshots only` / `separately documented` |

## Entry checklist

| Check | Result | Notes |
|---|---|---|
| Game loads and title screen is legible | pass / fail |  |
| `P2 controller ready` appears with the physical controller | pass / fail |  |
| Player 2 stick, jump, grab/link and respawn mapping are understood | pass / fail |  |
| Standard preset selected for the first run | pass / fail |  |
| No developer/debug overlays are visible | pass / fail |  |

Stop the session and record a blocking issue when the game cannot be started, the controller cannot be made usable, WebGL is unavailable, or either participant is unable to continue safely/comfortably.

## PT-WB-001 — Co-op Rescue comprehension

**Prompt:** “Try to rescue your buddy. Talk out loud about what you think each control or visual cue means.” Do not explain Buddy Link or raised hands before the first attempt.

| Observation | Result / measurement | Notes |
|---|---|---|
| Time until either player attempts Buddy Link |  |  |
| Players correctly interpret raised-hand state without coaching | yes / no / partial |  |
| Buddy is rescued successfully | yes / no |  |
| Retry after an intentional release/failure is understood | yes / no / not tried |  |
| Confusing UI, camera or collision moment | none / issue ID |  |

Participant language, paraphrased without identifying information:

- “…”
- “…”

## PT-WB-002 — Standard full co-op run

**Prompt:** “Reach the finish together using Standard graphics.”

| Observation | Result / measurement | Notes |
|---|---|---|
| Start-to-finish completion time |  |  |
| Controller disconnect or dead-zone problem | none / issue ID |  |
| Camera comfort | 1 poor / 2 / 3 / 4 / 5 comfortable |  |
| Movement/jump feel | 1 poor / 2 / 3 / 4 / 5 good |  |
| Crate return is understood when demonstrated | yes / no / not encountered |  |
| Player edge recovery feels forgiving rather than disruptive | yes / no / not encountered |  |
| Collision snag/stuck/reset occurrence | none / issue ID |  |
| Completion clarity | 1 unclear / 2 / 3 / 4 / 5 clear |  |
| Both players would replay | yes / no / unsure |  |

## PT-WB-003 — Reduced effects comparison

Run only after Standard, ideally on the same device and pair.

| Observation | Standard | Reduced effects | Preference / notes |
|---|---:|---:|---|
| Completion time |  |  |  |
| Subjective responsiveness (1–5) |  |  |  |
| Visual readability (1–5) |  |  |  |
| Camera comfort (1–5) |  |  |  |
| Stutters or frame-pressure observations |  |  |  |

## Issue log

Use issue IDs such as `PT-WB-001-I01`; classify them using `docs/playtest-issue-triage.md`.

| Issue ID | Task / zone | What happened | Reproduction steps | Severity | Frequency | Preset | Controller / device context | Screenshot/clip reference if consented |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## Debrief

| Question | Notes |
|---|---|
| What was most fun? |  |
| What was most confusing? |  |
| Did the buddy connection feel understandable and satisfying? |  |
| Did any collision, camera, movement or recovery behavior feel unfair? |  |
| Which graphics preset would you choose on this device? |  |
| What one change would most improve the next session? |  |

## Session disposition

| Outcome | Selection | Notes |
|---|---|---|
| Continue gathering observations | yes / no |  |
| Create focused fix story before further testing | yes / no | Issue IDs:  |
| Physical-controller acceptance for this model | pass / fail / not_decided |  |
| Candidate for real-GPU performance profiling | yes / no |  |

This form records playtest evidence only after a real human session. Leaving the form blank does not constitute acceptance.
