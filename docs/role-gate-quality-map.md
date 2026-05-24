# Role Gate Quality Map

This file is the cross-check between roles, lifecycle gates, and product-quality evidence. Use it when auditing whether the playbook is only testing functionality or actually covering the whole product.

## 1. Canonical role set

Use these role names consistently in plans, reports, signoffs, and generated browser evidence. A story does not need every role to be active, but every substantial story must classify each role as `active`, `consulted`, or `not_applicable with reason`.

| Role | Primary quality risk it owns | Usually active when |
|---|---|---|
| Product Owner | Wrong problem, weak outcome, scope creep, unclear non-goals | any user-facing or product-scope change |
| User Researcher | Assumptions about real user behavior are untested | onboarding, workflow, game loop, launch, major UX change |
| Plan Quality Owner | Plan is shallow, unbounded, untestable, or ignores alternatives | any non-trivial work |
| Tech Lead | Architecture, boundaries, maintainability, dependency direction | any implementation beyond a one-line fix |
| UX/Interaction Designer | Flow, states, affordance, feedback, recovery | UI, game, form, onboarding, navigation, workflow |
| Visual Design Owner | Approved design direction, brand, spacing system, typography, mood, reference assets | design conformance, UI/game visual direction |
| Visual/Composition Director | Whole-frame hierarchy, rhythm, balance, center preservation, scene dominance | UI/game/visual surface |
| Frontend/UI Owner | Component/state/effect/API boundaries, responsive behavior, browser surface | UI/browser work |
| Content/Copy Reviewer | Labels, empty/error/success text, tone, developer jargon leakage | public UI, errors, onboarding, game instructions |
| Accessibility Owner | Keyboard, focus, names, contrast, touch, reduced motion, assistive tech | any public UI/browser surface |
| QA Owner | Acceptance coverage, edge cases, regression proof, retest evidence | validation and release gates |
| Exploratory Tester | Weird order, repeated actions, race conditions, stress, stale state | L2+ flows, games, complex UI, release candidates |
| Game Design Owner | Goal clarity, feedback loop, pacing, retry motivation, fun | game work |
| Human Playtest Owner | Real player/user observation, friction, fun/readability, comprehension | public game demo, L4 product, major UX flow |
| 3D/Rendering Owner | Camera, canvas, rendering path, asset budget, FPS, fallback | WebGL/WebGPU/3D work |
| Backend/API Owner | Contract, validation, idempotency, error shape, server state | API/backend/service work |
| Data Owner | Schema, migration, retention, backup/restore, destructive actions | persistent data or migration work |
| Security Owner | Abuse, authz/authn, injection, secrets, dependency and supply-chain risk | auth/data/API/file upload/public release |
| Privacy Owner | Data minimization, consent, logging, retention, deletion, third parties | user data, analytics, logs, third-party services |
| Performance Owner | Load, interaction latency, FPS, memory, bundle, runtime budget | public UI, 3D/game, backend, heavy assets |
| Platform/SRE Owner | Deploy, health, monitoring, rollback, runbook, incident response | real-project/production/release work |
| License/Compliance Owner | Asset/library/font/model/audio rights and attribution | third-party assets/libraries/public release |
| Analytics/Learning Owner | Success signals, telemetry, feedback loop, post-release learning | L4 launch, experiment, major product change |
| Support/Ops Reviewer | Supportability, troubleshooting, user-facing recovery path | production or externally supported release |
| Release Owner | Final risk decision, accepted unknowns, downstream blockers | public/enduser release or demo handoff |
| Agent Context Steward | Context drift, stale docs, over-reading, missing memory/project-state update | long-running, multi-agent, handoff, playbook maintenance |

## 2. Gate-to-role map

Every gate has one accountable owner and several reviewers. If the accountable owner is missing, the gate cannot be marked pass.

| Gate | Accountable role | Required reviewers | Evidence that must exist | Common false pass |
|---|---|---|---|---|
| Intent gate | Product Owner | User Researcher, Tech Lead | user, problem, outcome, non-goals, success signal | feature requested, but no problem or outcome is stated |
| Scope gate | Product Owner | Plan Quality Owner, Tech Lead | in-scope/out-of-scope, smallest useful slice | plan quietly expands into refactor or redesign |
| Systems gate | Tech Lead | Backend/API, Data, Security, Performance | architecture/data/API/security/performance constraints | coding starts before constraints are known |
| Plan-quality gate | Plan Quality Owner | Product, Tech, UX, QA, Security/Privacy, Performance | target level, role concerns, alternatives, risks, validation, rollback | file list is treated as a plan |
| Component/contract gate | Frontend/UI Owner or Backend/API Owner | Tech Lead, QA, Accessibility | responsibility table, state/effect/contract ownership | everything goes into one component/service |
| Implementation gate | Implementer/Tech Lead | QA, Product as needed | changed files match plan, no hidden scope expansion | working code but unplanned side effects |
| Functional QA gate | QA Owner | Product, Tech, Exploratory Tester | acceptance checks, edge cases, retest evidence | happy path only |
| Human UX gate | UX/Interaction Designer | Product, User Researcher, Accessibility, QA, Human Playtest Owner when applicable | first-time walkthrough, state coverage, comprehension notes | user can click but does not understand |
| Composition gate | Visual/Composition Director | Visual Design Owner, UX, Frontend/UI, QA, Game/3D when relevant | screenshot/frame review for rhythm, balance, center, dominance, noise | screenshot exists, but whole-frame review is empty |
| Content/copy gate | Content/Copy Reviewer | Product, UX, Accessibility | copy table or reviewed examples for labels/errors/empty states | internal/dev language leaks into product |
| Accessibility gate | Accessibility Owner | Frontend/UI, QA, UX | keyboard/focus/names/contrast/touch/reduced-motion evidence | automated checks only |
| Performance gate | Performance Owner | Tech, Frontend/UI, Backend/API, 3D as relevant | budget, measurement, trace/profile or reasoned not_applicable | build succeeds but runtime feels slow |
| Security/privacy gate | Security Owner / Privacy Owner | Tech, Data, Backend/API, Release | threat/data review, controls, exceptions, third-party notes | no review because feature looks UI-only |
| Asset/license gate | License/Compliance Owner | Visual Design Owner, 3D/Rendering Owner, Release Owner | source/license/attribution/allowed-use records | asset looks good but license unknown |
| Release gate | Release Owner | Product Owner, QA Owner, Platform/SRE Owner, Security Owner, Privacy Owner, Performance Owner, Support/Ops Reviewer | release decision, rollback, observability, signoff, downstream blockers | sandbox-complete is reported as enduser-ready |
| Learning loop gate | Analytics/Learning Owner | Product, QA, Support/Ops | success signal, telemetry or feedback plan, follow-up owner | launch has no way to learn whether it worked |

## 3. Quality layer map

Use this to avoid checking only one layer of the product.

| Layer | What can go wrong | Roles that must look | Evidence examples |
|---|---|---|---|
| Product intent | solves wrong problem or too much scope | Product Owner, User Researcher, Plan Quality Owner | brief, non-goals, acceptance criteria |
| Requirements and states | edge cases untestable or missing | Product Owner, QA Owner, UX/Interaction Designer | story, test matrix, state inventory |
| Architecture and boundaries | hard-to-change code, hidden coupling | Tech Lead, Frontend/UI Owner, Backend/API Owner, Data Owner | file plan, component/contract table, code review |
| Human task flow | next action unclear, poor feedback, no recovery | UX/Interaction Designer, User Researcher, QA Owner, Accessibility Owner | browser walkthrough, flow screenshots |
| Visual composition | screen feels wrong despite no functional bug | Visual Design Owner, Visual/Composition Director, UX/Interaction Designer, Frontend/UI Owner, QA Owner | screenshot review, first read, rhythm/balance/dominance findings |
| Content/copy | user does not understand labels or errors | Content/Copy Reviewer, Product Owner, UX/Interaction Designer, Accessibility Owner | copy review, error examples |
| Inclusive access | keyboard/screen-reader/touch/reduced-motion users blocked | Accessibility Owner, Frontend/UI Owner, QA Owner | keyboard/focus/contrast/touch evidence |
| Runtime quality | slow, unstable, memory-heavy, low FPS | Performance Owner, Tech Lead, 3D/Rendering Owner, Backend/API Owner | budgets, traces, frame/load metrics |
| Safety and data | abuse, leakage, destructive action, privacy risk | Security Owner, Privacy Owner, Data Owner, Backend/API Owner | threat/data review, test cases, exceptions |
| Operations and release | cannot deploy, detect, roll back, or support | Platform/SRE Owner, Release Owner, Support/Ops Reviewer | runbook, observability, rollback, release decision |
| Learning | no signal to improve after release | Analytics/Learning Owner, Product Owner, QA Owner | success metrics, telemetry or feedback plan |

## 4. Role applicability rule

For L2+ work, plans and reports should include a role applicability table before detailed role simulation.

```md
| Role | Applicability | Reason | Required evidence or not_applicable reason |
|---|---|---|---|
| Product Owner | active/consulted/not_applicable |  |  |
```

Rules:

- `active` means the role can block the gate.
- `consulted` means the role gives risk input but may not block by itself.
- `not_applicable` must name the story boundary that makes the role irrelevant.
- If the role is active and status is `partial`, `fail`, or `blocked`, the story cannot claim full pass.

## 5. Conflict resolution

When roles disagree, do not average them into pass. Use this order:

1. Safety, privacy, legal, and destructive-data blockers win over UX polish.
2. Release Owner decides whether accepted unknowns are shippable, but cannot override missing evidence silently.
3. Product Owner may downscope, but must record non-goals and follow-up.
4. Tech Lead may reject a solution that is too costly to maintain even if the UI appears correct.
5. Visual/UX issues may block L2+ done when they harm comprehension, dominance, accessibility, or trust.

## 6. Minimum audit output

A serious audit should include:

```md
## Role/gate audit

| Gate | Accountable role | Status | Evidence | Missing or conflicting signals | Required fix |
|---|---|---|---|---|---|

## Role coverage audit

| Role | Applicability | Status | Evidence | Blind spot checked | Required fix |
|---|---|---|---|---|---|
```

Do not report `pass` when a role/gate has only generic text, placeholder values, or evidence that belongs to a different gate.
