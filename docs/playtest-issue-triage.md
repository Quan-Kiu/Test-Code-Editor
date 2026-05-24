# Human Playtest Issue Triage — Wobble Buddies

Use this guide after each physical-controller/two-person session. It is intentionally separate from sandbox browser evidence.

## Severity

| Severity | Definition | Immediate action |
|---|---|---|
| blocker | Cannot start, continue or complete the intended task; controller unusable; repeated WebGL failure; participant safety/comfort concern | Stop affected route; create a fix story before more sessions on that path |
| high | Completion is possible only with coaching/retries or a major collision/camera/control problem substantially harms play | Log exact reproduction and prioritize before expanding the playtest sample |
| medium | Confusing feedback, intermittent snag, recovery surprise or visual/readability issue with a workaround | Group by pattern and address after confirming repeatability |
| low | Cosmetic, polish or preference item that does not impede comprehension or completion | Retain for later polish backlog |

## Categorization tags

Use one or more tags per issue: `controller`, `buddy-link`, `raised-hand`, `movement`, `jump`, `camera`, `crate-return`, `edge-recovery`, `collision`, `standard-preset`, `reduced-effects`, `performance`, `readability`, `completion`, `accessibility`.

## Reproduction standard

An actionable issue entry should contain:

1. anonymous session code and task ID;
2. device/browser/GPU/controller context;
3. graphics preset;
4. location/zone and steps leading to the event;
5. expected versus observed behavior;
6. frequency across attempts;
7. screenshot or short clip reference only when consent permits.

## Decisions after a session

| Finding | Decision |
|---|---|
| Any blocker or repeatable high issue | Pause expansion; open a targeted fix story with evidence. |
| Repeated misunderstanding of raised-hand/Buddy Link or crate recovery | Open a feedback/readability follow-up before more unmoderated testing. |
| Standard feels poor but Reduced effects materially helps on the same real device | Open a performance/profile story; do not claim release readiness. |
| Controller mapping/dead-zone/reconnect defect | Keep physical-controller gate failed for that model until retested. |
| No blocking issues in a small sample | Continue sessions; do not equate small-sample success with release approval. |

## Privacy and retention

Record only anonymous session codes and technical context necessary to reproduce issues. Do not store participant names, contact details, voice recordings or identifiable video in the project handoff. Consent-controlled media should live outside this archive with a reference ID only.
