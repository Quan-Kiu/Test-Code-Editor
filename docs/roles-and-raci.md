# Roles and RACI

This file is the canonical RACI map for project planning, implementation, quality gates, and release decisions. Canonical role names and gate ownership must stay aligned with `docs/role-gate-quality-map.md`.

## 1. Operating rule

Every real-project or production gate must have one accountable owner. Agents can prepare evidence, run validation, and propose fixes, but a high-risk gate is not accepted until the named role signs off in `docs/signoff-ledger.md`.

For solo projects, one person may hold multiple roles, but the role name must still be recorded so the decision is traceable.

## 2. Core roles

| Role | Accountable for | Required before | Evidence location |
|---|---|---|---|
| Product Owner | Goal, scope, out-of-scope decisions, acceptance criteria, launch priority | guided build, story approval, release decision | `docs/project-brief.md`, `docs/requirements.md`, `docs/stories.md`, `docs/signoff-ledger.md` |
| Plan Quality Owner | Planning depth, target quality level, assumptions, alternatives, role simulation, validation and rollback logic | non-trivial implementation plan | `docs/plan-quality.md`, `docs/product-quality-system.md`, `docs/evidence-ledger.md` |
| User Researcher | User assumptions, first-time comprehension, task friction, motivation and hesitation points | L2+ UX/game/product validation | `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, playtest or user notes |
| UX/Interaction Designer | Task flow, affordance, feedback, recovery, state coverage, and mental model | UI/game implementation and validation | `docs/product.md`, `docs/component-contract.md`, `docs/browser-interaction-qa.md` |
| Tech Lead | Architecture, file boundaries, dependency risk, maintainability, performance direction | implementation, high-risk refactor, release | `docs/architecture.md`, `docs/code-architecture.md`, `docs/decisions/` |
| Frontend/UI Owner | Browser surface, component contracts, responsive behavior, UI state completeness | UI implementation and UI validation | `docs/component-contract.md`, `docs/browser-interaction-qa.md` |
| Backend/API Owner | API behavior, data contracts, jobs, persistence, error states | API/backend implementation and release | `docs/api-contract.md`, `docs/data-model.md`, `docs/testing-strategy.md` |
| Game Design Owner | Core loop, player motivation, pacing, feedback, difficulty, tutorial and retry loop | game implementation and playtest | `DESIGN.md`, `docs/design-brief.md`, `docs/playtest-protocol.md` |
| 3D/Rendering Owner | Camera, scene readability, rendering path, asset budgets, FPS, fallbacks, canvas layering | WebGL/WebGPU/3D implementation and validation | `docs/3d-web-game-architecture.md`, `docs/3d-browser-testing.md`, `docs/performance-budget.md` |
| Visual Design Owner | Approved design images, visual hierarchy, brand, spacing, typography, mood | design conformance and visual QA | `docs/design-assets.md`, `design-assets/manifest.json`, `docs/visual-qa.md` |
| Visual/Composition Director | Whole-frame composition, first read, component rhythm, spatial balance, center preservation, and scene dominance | composition QA and human-level visual pass | `docs/composition-qa.md`, `docs/product-quality-system.md`, screenshot evidence |
| Content/Copy Reviewer | Labels, microcopy, empty/loading/error/success copy, tone, and actionability | public UI/game flows and error states | `docs/product.md`, `docs/requirements.md`, validation reports |
| QA Owner | Test matrix, browser evidence, regression coverage, release evidence quality | validation pass and release readiness | `docs/qa-test-cases.md`, `docs/test-matrix.md`, `docs/evidence-ledger.md` |
| Exploratory Tester | Human misuse, odd sequencing, repeated actions, fast clicks, stale state, and edge-case discovery | L2+ validation and critical flows | `docs/qa-test-cases.md`, `docs/evidence-ledger.md`, validation reports |
| Visual QA Reviewer | Screenshot review, design comparison, readability, mobile visual defects | UI/game validation pass | `docs/visual-qa.md`, `docs/composition-qa.md`, `docs/browser-interaction-qa.md` |
| Accessibility Owner | Keyboard flow, focus, names/labels, contrast, reduced motion, touch usability | public UI release | `docs/accessibility.md`, validation reports |
| Performance Owner | Web vitals, frame rate, bundle size, memory, backend latency budget | public release and production readiness | `docs/performance-budget.md`, `docs/engineering-metrics.md` |
| Security Owner | Threat model, abuse cases, secure SDLC, exceptions, dependency and supply-chain risk | real-project release and production | `docs/security.md`, `docs/security-asvs-map.md`, `docs/threat-model.md`, `docs/security-exceptions.md` |
| Data Owner | Data classification, migration, backup/restore, retention, privacy | persistent data changes and release | `docs/data-management.md`, `docs/privacy.md`, runbooks |
| Privacy Owner | Data minimization, consent, retention, deletion, logging, and third-party data exposure | user-data changes and release | `docs/privacy.md`, `docs/data-management.md`, `docs/security.md` |
| Platform/SRE Owner | Environments, CI/CD, deploy, rollback, monitoring, incidents | production readiness | `docs/environments.md`, `docs/ci-cd.md`, `docs/observability.md`, `docs/runbooks/` |
| Analytics/Learning Owner | Success signals, telemetry/feedback plan, post-release learning loop | L4 product launch, experiment, major release | `docs/product-quality-system.md`, `docs/evidence-ledger.md`, validation reports |
| Support/Ops Reviewer | Troubleshooting, user/operator recovery, supportability, escalation path | supported external release | `docs/runbooks/`, `docs/incidents.md`, validation reports |
| Release Owner | Final release decision, accepted unknowns, rollback readiness, post-release watch | public/enduser release | `docs/production-readiness.md`, `docs/release-decision.md`, `docs/signoff-ledger.md` |
| License/Compliance Owner | Fonts, models, textures, music, icons, screenshots, third-party terms | asset use and public release | `docs/license-compliance.md`, `design-assets/manifest.json` |
| Human Playtest Owner | Playtest script, participant notes, player friction, fun/readability findings | public game demo or release | `docs/playtest-protocol.md`, `docs/evidence-ledger.md` |
| Agent Context Steward | Correct context selection, project-state updates, stale-doc avoidance, and safe next-step continuity | long-running or multi-agent work | `docs/context-read-matrix.md`, runtime project-state files, `docs/evidence-ledger.md` |

## 3. RACI matrix

| Workstream | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Project brief and scope | Product Owner | Product Owner | Tech Lead, Visual Design Owner, User Researcher | QA Owner, Release Owner |
| Plan quality review | Implementer | Plan Quality Owner | Product Owner, Tech Lead, QA Owner, UX/Interaction Designer | Release Owner |
| Architecture and file boundaries | Tech Lead | Tech Lead | Security Owner, Performance Owner | Product Owner |
| Implementation plan | Implementer | Tech Lead | Product Owner, QA Owner | Release Owner |
| UI implementation | Frontend/UI Owner | Tech Lead | Visual Design Owner, Accessibility Owner | Product Owner |
| Human-level UX and composition | UX/Interaction Designer, Visual/Composition Director | QA Owner | Product Owner, Accessibility Owner, Performance Owner | Release Owner |
| API/backend implementation | Backend/API Owner | Tech Lead | Security Owner, Data Owner | Product Owner |
| Design asset approval | Visual Design Owner | Visual Design Owner | Product Owner, QA Owner | Implementer |
| Browser interaction QA | QA Owner | QA Owner | Frontend/UI Owner, Accessibility Owner | Product Owner |
| Exploratory QA | Exploratory Tester | QA Owner | Product Owner, Tech Lead, UX/Interaction Designer | Release Owner |
| Visual QA | Visual QA Reviewer | QA Owner | Visual Design Owner | Release Owner |
| Security review | Security Owner | Security Owner | Tech Lead, Data Owner | Release Owner |
| Performance review | Performance Owner | Performance Owner | Tech Lead, Frontend/UI Owner, Backend/API Owner, 3D/Rendering Owner | Release Owner |
| Game playability | Game Design Owner | Product Owner | QA Owner, Human Playtest Owner | Release Owner |
| Production readiness | Release Owner | Release Owner | Platform/SRE Owner, Security Owner, Privacy Owner, QA Owner, Product Owner, Support/Ops Reviewer | All stakeholders |
| Product-quality final review | QA Owner | Release Owner | Product Owner, Plan Quality Owner, Tech Lead, UX/Interaction Designer, Visual/Composition Director, Accessibility Owner, Performance Owner, Security Owner, Privacy Owner, Platform/SRE Owner, Analytics/Learning Owner, Support/Ops Reviewer | All stakeholders |

## 4. Role simulation requirement

For L2+ work, the accountable owner must ensure role applicability was classified using `docs/role-gate-quality-map.md` and role simulation was performed using `docs/role-thinking-protocols.md`.
The simulation must name concrete concerns, evidence, status, and owner for each relevant role. Generic approval such as
`reviewed OK` does not count as signoff.

Minimum required simulated roles for UI/game/product-facing work:

- Product Owner
- Plan Quality Owner
- Tech Lead
- UX/Interaction Designer
- Visual/Composition Director
- QA Owner
- Accessibility Owner
- Performance Owner
- Security Owner and Privacy Owner when data, auth, storage, networking, third-party tools, analytics, logs, or release are involved
- Frontend/UI Owner and Content/Copy Reviewer for browser/UI text/state changes
- Game Design Owner, Human Playtest Owner, and 3D/Rendering Owner when game/Web3D work applies
- Platform/SRE Owner, Analytics/Learning Owner, Support/Ops Reviewer, and License/Compliance Owner when release/enduser readiness applies
- Release Owner for public/enduser readiness

## 5. Signoff rule

A role signoff must be recorded in `docs/signoff-ledger.md` when any of these are true:

- the work targets real users, production, payment, auth, user data, public API, or multiplayer state;
- the feature changes architecture, persistence, security posture, release behavior, or public UI;
- a gate is accepted as unknown or not applicable;
- QA finds a defect that is deferred rather than fixed.
