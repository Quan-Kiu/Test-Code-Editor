# Product Quality System

This file defines the end-to-end product quality operating model for agent-assisted projects.
It exists because a product can pass code, build, and UI smoke tests while still failing as a human experience.

Use this file together with:

- `docs/role-thinking-protocols.md` for role-by-role review thinking;
- `docs/role-gate-quality-map.md` for canonical role names, gate ownership, and cross-file coverage;
- `docs/plan-quality.md` for planning depth before implementation;
- `docs/hard-gates.md` for non-negotiable stop gates;
- `docs/evidence-ledger.md` for proof.

## 1. Quality principle

Quality is not one gate. Quality is the combined result of product fit, user comprehension, architecture, implementation,
interaction, composition, performance, accessibility, reliability, security, content, release safety, and learning after
release.

A claim of quality must answer four questions:

1. **Why should this exist?** Product value, target user, core job, non-goals.
2. **Can people understand and use it?** Mental model, flow, wording, feedback, error recovery, accessibility.
3. **Can the system sustain it?** Architecture, boundaries, data, performance, reliability, security, maintainability.
4. **Can we prove it?** Real browser/runtime evidence, tests, screenshots, measurements, role signoff, known risks.

## 2. Human-level product-quality lens

Before reporting done, review the product as these people would experience it:

| Lens | Looks for | Typical hidden failure |
|---|---|---|
| First-time user | Can I understand what this is and what to do first? | Feature works, but the first screen has no clear purpose or next action. |
| Returning user | Can I resume quickly without re-learning? | State, navigation, and labels are inconsistent across sessions. |
| Power user | Can I move efficiently and recover from mistakes? | Useful shortcuts, bulk actions, or error recovery are absent. |
| Distracted user | Can I succeed with partial attention? | Too much text, weak hierarchy, unclear feedback. |
| Mobile/touch user | Are targets, viewport, scrolling, and gestures usable? | Desktop layout passes but mobile density, sticky bars, or tap areas fail. |
| Keyboard/screen-reader user | Can I navigate and understand state without visual-only cues? | Visual UI passes, but focus, names, order, or live feedback fail. |
| Player, for games | Is the goal clear, feedback satisfying, and next retry compelling? | Game runs, but the player does not know why they lost or what to try next. |
| Maintainer | Can I safely change this later? | Working code hides behavior inside one large file or implicit coupling. |
| Operator | Can I deploy, detect, rollback, and support it? | Feature ships with no observability, runbook, or rollback path. |

## 3. Quality dimensions

Use this matrix to avoid narrow reviews. Every substantial story should classify each row as `pass`, `fail`, `partial`,
`not_applicable`, or `blocked`.

| Dimension | Review question | Minimum evidence |
|---|---|---|
| Product value | Does the story solve a real user problem and avoid scope creep? | Project brief, story, acceptance criteria, non-goals. |
| Requirement clarity | Are success, failure, edge cases, and states testable? | Requirements, story acceptance criteria, test matrix. |
| Plan quality | Does the plan prove responsibility boundaries, risks, alternatives, and validation? | Implementation File Plan plus plan-quality review. |
| Architecture | Are modules, data flow, dependencies, and ownership understandable? | Architecture docs, code architecture review, decision records. |
| Data integrity | Are data schema, migrations, retention, and destructive actions safe? | Data model, data management docs, tests or dry runs. |
| API/contract | Are inputs, outputs, error states, idempotency, and versioning clear? | API contract, contract tests, example payloads. |
| UI structure | Are components, state, services, schemas, and side effects separated? | Component responsibility table, file plan, code review. |
| Interaction UX | Can users complete the core task with clear feedback and recovery? | Browser interaction evidence, flow screenshots, manual notes. |
| Composition UX | Is the whole screen balanced, rhythmic, dominant, and readable as a scene? | Composition QA report and screenshot review. |
| Content/copy | Is wording human, specific, actionable, and consistent? | Screen copy review, error-message review, empty/loading/success text. |
| Accessibility | Is the surface usable with keyboard, assistive tech, contrast, touch, reduced motion? | Accessibility checklist, browser evidence, automated/manual checks. |
| Performance | Does it meet load, interaction, runtime, memory, and frame budgets? | Performance budget results, profiler or browser metrics. |
| Reliability | Does it handle retries, offline/timeout states, concurrency, and recovery? | Test cases, fault scenarios, runbook for critical flows. |
| Security | Are auth, authorization, input handling, secrets, abuse, and supply chain covered? | Security docs, threat model, dependency checks, exceptions. |
| Privacy | Is data collection minimized, explained, retained safely, and deletable when required? | Privacy docs, data classification, consent/retention notes. |
| Asset/license | Are fonts, models, textures, audio, icons, and references allowed for use? | Design asset registry, license compliance, source links. |
| Browser/device | Does it work on the real target browsers, viewports, devices, and graphics paths? | Real browser evidence, responsive screenshots, WebGL/WebGPU checks when relevant. |
| Observability | Can problems be detected and understood after release? | Logs, metrics, traces, alerts, dashboards, runbook references. |
| Release safety | Can the team roll forward/back and communicate risk? | Release strategy, release decision, rollback plan, signoffs. |
| Learning loop | Did QA/playtest findings create specific fixes or accepted risks? | Evidence ledger, playtest notes, retest evidence. |

## 4. Product-quality lifecycle gates

Do not treat these as paperwork. Each gate exists to catch a different failure mode.

| Gate | Blocks | Required question | Evidence owner |
|---|---|---|---|
| Intent gate | Discovery -> planning | What user, problem, outcome, non-goal, and success signal are we optimizing for? | Product Owner |
| Scope gate | Planning -> story slicing | What is in scope now, what is deferred, and why? | Product Owner |
| Systems gate | Story -> implementation plan | What architecture/data/API/security/performance constraints shape the solution? | Tech Lead |
| Plan-quality gate | Plan -> coding | Does the plan cover files, responsibilities, alternatives, risks, validation, and rollback? | Plan Quality Owner / Tech Lead |
| Component contract gate | UI plan -> UI coding | Who owns state, effects, API/storage calls, schema, presentation, and composition? | Frontend/UI Owner |
| Implementation gate | Coding -> validation | Does the implementation match the plan without hidden scope expansion? | Implementer |
| Code-architecture gate | Validation -> done | Is the code maintainable, testable, and separated by responsibility? | Tech Lead |
| Functional QA gate | UI/API works -> product works | Do happy paths, edge cases, states, and regressions actually pass? | QA Owner |
| Human UX gate | Functional pass -> user pass | Would a real user/player understand, trust, and enjoy the flow? | UX / Human Playtest Owner |
| Composition gate | Screenshot exists -> visual pass | Is the whole frame visually balanced, readable, and correctly dominant? | Visual QA Reviewer |
| Accessibility gate | Visual pass -> inclusive pass | Can users with keyboard, assistive tech, low vision, touch, and motion needs use it? | Accessibility Owner |
| Performance gate | Feature works -> sustainable runtime | Does it stay within load, interaction, memory, and frame budgets? | Performance Owner |
| Security/privacy gate | Feature works -> safe feature | Are abuse, data, secrets, permissions, and third-party risks covered? | Security / Privacy Owner |
| Release gate | Local done -> enduser-ready | Is deploy, rollback, observability, communication, and post-release watch ready? | Release Owner |

## 5. Review depth levels

Use the depth level that matches the risk.

| Level | Use when | Required depth |
|---|---|---|
| L0 Smoke | tiny internal non-UI change | Build/lint/test status and changed-file summary. |
| L1 Functional | simple feature or bug | Acceptance criteria, edge cases, validation, no scope creep. |
| L2 Experience | any UI, game, onboarding, content-heavy, or workflow change | Browser interaction, screenshot review, composition, accessibility, copy, responsive behavior. |
| L3 System | auth, API, data, performance, payment, multiplayer, persistence, production release | Threat model triggers, data integrity, observability, rollback, release risk, role signoff. |
| L4 Product | launch, demo, public release, major feature, game vertical slice | All L2/L3 plus user/playtest notes, competitive/market assumptions, telemetry plan, post-release learning. |

If in doubt, choose the higher level. Downscoping requires a named owner and reason in the evidence ledger.

## 6. Role-simulation review loop

For work that reaches L2 or higher, the agent must simulate the relevant roles twice: once before coding to improve the plan, and again before reporting done to verify evidence. Use `docs/role-gate-quality-map.md` to decide which roles are active, consulted, or not applicable.

```txt
Role applicability summary:
- Active roles:
- Consulted roles:
- Not applicable roles with reasons:

Role simulation summary:
- Product Owner would worry about:
- Plan Quality Owner would worry about:
- Tech Lead would worry about:
- UX/Interaction Designer would worry about:
- Visual/Composition Director would worry about:
- Frontend/UI Owner would worry about, if browser/UI work:
- Content/Copy Reviewer would worry about, if user-visible text changes:
- QA Owner would worry about:
- Exploratory Tester would worry about, if flow complexity is L2+:
- Accessibility Owner would worry about, if UI/browser work:
- Performance Owner would worry about:
- Security/Privacy/Data owners would worry about, if data/trust boundaries exist:
- Platform/SRE and Release Owner would worry about, if release/enduser readiness is claimed:
- Open concerns and fixes:
```

A shallow statement like `all roles reviewed` is invalid. Each active or consulted role must name at least one concrete concern, evidence item, or reason it is not applicable. Empty table cells are placeholders, not evidence.

## 7. Hard-fail patterns

The story is not done when any of these are true:

- Functional tests pass, but no human-readable product risk assessment exists.
- Browser screenshot exists, but no first-read, rhythm, balance, dominance, or comprehension review exists for UI/game work.
- The plan lists files but does not explain responsibilities, alternatives, risks, validation, and rollback.
- A role signoff is claimed without evidence location.
- A role is omitted from L2+ work without an applicability reason from `docs/role-gate-quality-map.md`.
- A release is marked ready while observability, rollback, or accepted risks are missing.
- A product-quality concern is deferred without owner, impact, mitigation, and review date.

## 8. Evidence format

Every quality finding should be written as:

```txt
Finding ID:
Role/Lens:
Surface:
Evidence:
Impact on user/system:
Severity: blocker/high/medium/low
Fix direction:
Retest evidence:
Status: pass/fail/partial/blocked/accepted_unknown
Owner:
```

