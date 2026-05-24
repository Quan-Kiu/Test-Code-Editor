# Definition of Done

This file owns Definition of Done by project mode.

Story scope belongs in `docs/stories.md`.
Hard gates belong in `docs/hard-gates.md`.
Validation commands belong in `docs/validation.md`.
Production readiness belongs in `docs/production-readiness.md`.

## 1. Universal done gates

Every non-trivial story is done only when:

- [ ] Acceptance criteria are satisfied.
- [ ] Out-of-scope changes are avoided or disclosed.
- [ ] Implementation File Plan was created before coding.
- [ ] Plan-quality review was completed for non-trivial work using `docs/plan-quality.md`.
- [ ] Role applicability was classified for L2+ work using `docs/role-gate-quality-map.md`.
- [ ] Product-quality role simulation was completed before coding and after validation for L2+ work using `docs/role-thinking-protocols.md`.
- [ ] Target quality level L0/L1/L2/L3/L4 was declared or the story was explicitly trivial.
- [ ] Code structure follows `docs/code-architecture.md`.
- [ ] No avoidable all-in-one file was introduced.
- [ ] Validation status is reported honestly.
- [ ] UI changes include source-backed browser/manual evidence when source is available: build, real backend if needed,
  real headless Chromium, real SPA route, screenshot/frame log, trace/video/step logs when useful, console/network
  review, user/system impact for issues, and UI/UX improvement notes.
- [ ] Changed files and risks are summarized.
- [ ] Agent did not commit/push unless explicitly requested.

## 2. Done by mode

| Gate | Learning | MVP | Real Project | Production |
|---|---|---|---|---|
| Implementation File Plan | required | required | required | required |
| Plan-quality review | recommended | required for non-trivial work | required | required |
| Role applicability scan | optional | required for L2+ work | required for product-facing/system work | required |
| Product-quality role simulation | optional | required before coding and before done for L2+ work | required for product-facing/system work | required |
| Component responsibility table for UI | required for UI | required for UI | required for UI | required for UI |
| Lint/typecheck | if available | required if available | required | required |
| Automated tests | optional with reason | required for logic | required | required |
| Browser/manual test | UI only | UI only | required for critical flows | required for critical flows |
| Screenshot/frame UI QA evidence | UI only | UI only | required for UI changes | required for UI changes |
| Code architecture review | manual | required | required | required |
| Security review | optional | trigger-based | required for auth/data/API | required |
| Agent security review | optional | trigger-based | trigger-based | required for agent-assisted release |
| Observability | optional | basic errors | required for critical flows | SLO/alerts/runbooks required |
| Release checklist | no | lightweight | required | required with owner |
| Rollback plan | no | optional | required | tested or rehearsed |
| Unresolved TBD policy | allowed | allowed with notes | owner required | blocks release unless mapped `accepted_unknown` exists |

## 3. Production done gates


## 3.1 Sandbox-complete versus enduser-ready

For sandbox-built UI/game work, do not collapse local completion and public/enduser readiness into one status.

- `sandbox-complete` means the current route's available build, test, browser/WebGL, screenshot, debug/QA,
  simulated-play, and sandbox playability evidence has passed or been honestly classified.
- `enduser-ready` means the applicable production/enduser gates also pass, including real devices, human playtest,
  public URL smoke, release owner, rollback, observability, and incident path when relevant.

A story, local demo, or vertical slice may be done for its current sandbox route while the public release remains
`not_ready`. Record the downstream blockers instead of keeping the current route open indefinitely.


Production work is not done until evidence exists for:

- validation commands,
- plan-quality, role applicability, and product-quality role simulation evidence,
- security review when triggered,
- supply-chain gates when dependencies/build changed,
- SLO/observability gates for critical flows,
- release strategy and rollback plan,
- production readiness status,
- unresolved `TBD` review.

## 4. Unresolved TBD policy

For Production mode, unresolved `TBD`, `TODO`, or placeholder values in required docs block release unless each item
has:

- owner,
- reason it is intentionally unknown,
- risk tier,
- due date or review date,
- expiry date,
- mitigation,
- exact matching gate/evidence ID or decision record.

Allowed status label:

```txt
accepted_unknown
```

Do not use `accepted_unknown` to hide missing critical information.
