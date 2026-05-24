# Role Thinking Protocols

This file teaches agents how to reason from each quality role before planning, coding, validating, or releasing.
It is not only a RACI table. It is a set of role lenses that help the agent see missing product risk.

Use this file when:

- creating a plan;
- reviewing a plan;
- validating a story;
- diagnosing why a product feels wrong despite passing tests;
- preparing release readiness.

## 1. Operating rule

For any L2+ story from `docs/product-quality-system.md`, run a role applicability scan from `docs/role-gate-quality-map.md`, then run role simulation before coding and again before reporting done. Each role must produce concrete concerns, not generic approval.

Valid role output:

```txt
As <role>, I see <specific risk or evidence>. I need <proof/fix/decision> before <gate> can pass.
```

Invalid role output:

```txt
Role reviewed: OK.
```

## 2. Role catalog

| Role | Thinks like | Primary question | Missing signals to catch | Evidence expected |
|---|---|---|---|---|
| Product Owner | user value and scope guardian | Are we solving the right problem now? | vague goal, scope creep, weak success metric, unclear non-goals | brief, requirements, story, acceptance criteria |
| User Researcher | real user observer | What will users misunderstand, hesitate on, or fail to complete? | untested assumptions, confusing mental model, no first-time-user lens | user scenarios, task walkthrough, playtest/interview notes |
| UX/Interaction Designer | task-flow designer | Is the next action obvious and feedback timely? | unclear affordance, dead end, weak error recovery, too many steps | flow screenshots, interaction notes, state coverage |
| Visual Design Owner | design conformance reviewer | Does the implementation match the approved visual direction and mood? | brand drift, typography mismatch, spacing system drift, wrong asset vibe | design references, asset manifest, screenshot comparison |
| Visual/Composition Director | whole-frame reviewer | Does the screen/scene read correctly in 3 seconds? | weak hierarchy, bad rhythm, imbalance, center drift, scene loses dominance | screenshots with first-read, balance, rhythm, dominance review |
| Content/Copy Reviewer | human language editor | Is every label, empty state, and error message specific and helpful? | vague copy, dev jargon, no action path, tone mismatch | copy table, error-state examples |
| Accessibility Owner | inclusive-use advocate | Can people use it without perfect vision, mouse, or motion tolerance? | missing focus, names, contrast, target size, reduced-motion path | keyboard/focus notes, contrast, names, responsive/touch evidence |
| Frontend/UI Owner | browser surface owner | Are UI boundaries, state, effects, responsive behavior, and components clean? | hidden state coupling, route bloat, inconsistent loading/error states | component responsibility table, browser evidence |
| Game Design Owner | player motivation designer | Is the loop understandable, satisfying, and replayable? | no goal clarity, weak feedback, unclear loss/win, bad pacing | player-facing readiness, playtest notes, tuning rationale |
| Human Playtest Owner | real-player observer | What did a real player/user actually notice, misunderstand, or enjoy? | agent self-play mistaken for human evidence, no friction notes, no playtest script | playtest script, observation notes, follow-up fixes |
| 3D/Rendering Owner | scene/runtime owner | Is the scene readable, performant, and robust across graphics paths? | camera clipping, poor LOD, excessive draw calls, canvas fallback fail | WebGL/WebGPU evidence, screenshots, frame budget, asset notes |
| Backend/API Owner | contract and state owner | Are data contracts safe, stable, and recoverable? | ambiguous errors, non-idempotent writes, data race, bad pagination | API contract, tests, data model |
| Data Owner | data lifecycle owner | Is data classified, migrated, retained, backed up, and recoverable? | destructive migration risk, no restore path, unclear retention | data management docs, migration dry run, backup/restore notes |
| Security Owner | abuse and control owner | What can be abused, leaked, escalated, injected, or misconfigured? | auth bypass, exposed secret, unsafe dependency, untrusted input | threat model, security tests, exceptions |
| Privacy Owner | user data minimization owner | Are collection, consent, retention, deletion, and third parties justified? | collecting too much, unclear consent, missing deletion, logs leak data | privacy doc, data classification, retention notes |
| Performance Owner | latency/frame/memory owner | Does it feel fast and remain within budget under target conditions? | no budget, unbounded re-render, heavy assets, memory growth | budget results, profiling, bundle/frame notes |
| QA Owner | evidence and regression owner | Can we prove the requirement and edge cases are covered? | only happy path tested, flaky evidence, no retest after fix | test matrix, validation report, evidence ledger |
| Exploratory Tester | skeptical human breaker | What happens when I use it weirdly, quickly, repeatedly, or out of order? | race conditions, focus traps, stale state, layout breaks | exploratory notes, bug repros |
| Platform/SRE Owner | production operator | Can we deploy, observe, rollback, and respond? | no health checks, no rollback, no runbook, unmonitored failure | CI/CD, observability, runbooks, release strategy |
| License/Compliance Owner | asset/legal checker | Can every third-party asset/library be used and shipped? | unknown font/model/audio license, missing attribution | asset manifest, license docs |
| Plan Quality Owner | planning critic | Is the plan precise, efficient, testable, and risk-aware? | file list without reasoning, no alternatives, no validation, no risk tier | plan-quality checklist, implementation file plan |
| Analytics/Learning Owner | learning-loop owner | How will we know whether the change works after release? | no success signal, no feedback/telemetry, no follow-up owner | success metric, analytics/feedback plan, learning review |
| Support/Ops Reviewer | supportability owner | Can a user or operator recover when this fails? | no troubleshooting path, unclear user-facing recovery, no escalation path | support notes, runbook, error recovery copy |
| Release Owner | final decision owner | Is the remaining risk acceptable for the target audience? | hidden blockers, no owner for deferred issues, no post-release watch | release decision, signoff ledger |
| Agent Context Steward | AI workflow safety owner | Does the agent have enough context, not too much, and a safe next step? | context drift, stale docs, repeated work, over-reading, missing memory update | context read matrix, project state, evidence summary |

## 3. How each role reviews a plan

Use this before coding. A plan is not strong if only the implementer understands it.

| Role | Plan review prompt |
|---|---|
| Product Owner | Does this plan deliver the smallest useful outcome and protect non-goals? |
| User Researcher | What assumption about user behavior is unverified, and how will we observe it? |
| UX/Interaction Designer | Does the plan include all user states: first use, loading, empty, success, error, permission, retry? |
| Visual Design Owner | What approved visual reference, mood, typography, and asset direction must the implementation match? |
| Visual/Composition Director | What screenshot/frame will prove the intended hierarchy, balance, rhythm, and dominance? |
| Accessibility Owner | What keyboard, focus, contrast, touch, reduced-motion, and semantics checks are planned? |
| Frontend/UI Owner | Which component owns each state/effect/API call, and what stays presentational? |
| Tech Lead | Are boundaries, dependencies, error paths, and future change points explicit? |
| Backend/API Owner | Are contracts, validation, idempotency, and error shapes specified before UI binds to them? |
| Security Owner | What abuse, auth, input, secret, dependency, or supply-chain risk is introduced? |
| Privacy Owner | What user data, logging, consent, retention, deletion, or third-party exposure is introduced? |
| Data Owner | Does the plan change schema, storage, migration, retention, or destructive data behavior? |
| Performance Owner | What budget or profiling check prevents slow UI or degraded FPS from slipping through? |
| QA Owner | What exact commands, manual checks, browsers, and data scenarios prove the acceptance criteria? |
| Platform/SRE Owner | What deploy, health, rollback, observability, or incident concern applies? |
| Analytics/Learning Owner | What success signal or learning loop will prove product value after release? |
| Support/Ops Reviewer | What recovery or troubleshooting path should exist for users/operators? |
| Release Owner | What blocks public release even if the sandbox story is done? |
| Agent Context Steward | What docs must be read now, and what should not be loaded to avoid context noise? |

## 4. Human-level role blind spots

These are common ways an agent misses issues. Check them explicitly.

| Role | Common blind spot | Countermeasure |
|---|---|---|
| Product Owner | accepts a feature because it was requested, not because it solves a problem | write problem, user, outcome, and non-goal before story |
| Tech Lead | focuses on architecture elegance but misses UX states | require state inventory and validation plan |
| Frontend/UI Owner | builds the visible path but hides side effects in components | require component/hook/service responsibility table |
| Visual Design Owner | accepts visual output that is polished but off-brief | compare screenshots against approved design references and asset manifest |
| Visual Reviewer | reviews one component instead of the whole scene | require full-frame composition screenshot review |
| QA Owner | reports functional pass but misses human comprehension | require first-time-user walkthrough and composition gate |
| Accessibility Owner | relies on automated checks only | require keyboard/focus/manual notes |
| Performance Owner | measures build size but not runtime feel | require interaction/frame/load budget evidence |
| Security Owner | reviews auth but ignores abuse through UI states or files | require abuse cases tied to user flows |
| Release Owner | treats local validation as enduser readiness | separate sandbox-complete from enduser-ready |
| Agent Context Steward | reads many docs but misses the one that changes the decision | use context-read matrix and role-specific escalation |

## 5. Role simulation template

Paste this into plans and validation reports when the work is L2+. Start with applicability so roles are not silently omitted.

```md
## Role applicability

| Role | Applicability | Reason | Required evidence or not_applicable reason |
|---|---|---|---|
| Product Owner | active/consulted/not_applicable |  |  |
| User Researcher | active/consulted/not_applicable |  |  |
| Plan Quality Owner | active/consulted/not_applicable |  |  |
| Tech Lead | active/consulted/not_applicable |  |  |
| UX/Interaction Designer | active/consulted/not_applicable |  |  |
| Visual Design Owner | active/consulted/not_applicable |  |  |
| Visual/Composition Director | active/consulted/not_applicable |  |  |
| Frontend/UI Owner | active/consulted/not_applicable |  |  |
| Content/Copy Reviewer | active/consulted/not_applicable |  |  |
| Accessibility Owner | active/consulted/not_applicable |  |  |
| QA Owner | active/consulted/not_applicable |  |  |
| Exploratory Tester | active/consulted/not_applicable |  |  |
| Game Design Owner | active/consulted/not_applicable |  |  |
| Human Playtest Owner | active/consulted/not_applicable |  |  |
| 3D/Rendering Owner | active/consulted/not_applicable |  |  |
| Backend/API Owner | active/consulted/not_applicable |  |  |
| Data Owner | active/consulted/not_applicable |  |  |
| Security Owner | active/consulted/not_applicable |  |  |
| Privacy Owner | active/consulted/not_applicable |  |  |
| Performance Owner | active/consulted/not_applicable |  |  |
| Platform/SRE Owner | active/consulted/not_applicable |  |  |
| License/Compliance Owner | active/consulted/not_applicable |  |  |
| Analytics/Learning Owner | active/consulted/not_applicable |  |  |
| Support/Ops Reviewer | active/consulted/not_applicable |  |  |
| Release Owner | active/consulted/not_applicable |  |  |
| Agent Context Steward | active/consulted/not_applicable |  |  |

## Role simulation

| Role | Concrete concern | Evidence needed or found | Status | Owner |
|---|---|---|---|---|
| Product Owner |  |  |  |  |
| User Researcher |  |  |  |  |
| Plan Quality Owner |  |  |  |  |
| Tech Lead |  |  |  |  |
| UX/Interaction Designer |  |  |  |  |
| Visual Design Owner |  |  |  |  |
| Visual/Composition Director |  |  |  |  |
| Frontend/UI Owner |  |  |  |  |
| Content/Copy Reviewer |  |  |  |  |
| Accessibility Owner |  |  |  |  |
| QA Owner |  |  |  |  |
| Exploratory Tester |  |  |  |  |
| Game Design Owner |  |  |  |  |
| Human Playtest Owner |  |  |  |  |
| 3D/Rendering Owner |  |  |  |  |
| Backend/API Owner |  |  |  |  |
| Data Owner |  |  |  |  |
| Security Owner |  |  |  |  |
| Privacy Owner |  |  |  |  |
| Performance Owner |  |  |  |  |
| Platform/SRE Owner |  |  |  |  |
| License/Compliance Owner |  |  |  |  |
| Analytics/Learning Owner |  |  |  |  |
| Support/Ops Reviewer |  |  |  |  |
| Release Owner |  |  |  |  |
| Agent Context Steward |  |  |  |  |
```

At least one row may be `not_applicable`, but only with a reason tied to the story scope.

## 6. Escalation rule

A role must block or escalate when:

- the role has a concrete concern with no evidence;
- the role's concern is marked `not_applicable` without reason;
- a high-impact issue is deferred without owner, mitigation, and review date;
- the agent is about to claim done while any role has `fail`, `blocked`, or unresolved `partial`.

