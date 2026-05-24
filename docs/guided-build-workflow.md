# Guided Build Workflow

This file defines the companion workflow for an agent that helps the user turn a vague idea into requirements, stories,
component contracts, implementation plans, and validated code.

Use this workflow when:

- the user has an idea but no clear requirements yet,
- the user wants the agent to ask questions step by step,
- the project is being initialized,
- a feature is too vague to implement safely,
- UI/data/API/security scope is not yet clear.

This file does not replace `docs/requirements.md`, `docs/product.md`, `docs/stories.md`, or
`docs/component-contract.md`. It tells the agent how to fill or update those files with the user.

For non-trivial work, also use `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, and `docs/plan-quality.md` so planning includes product value, human UX, technical risk, and validation evidence.

## Core rule

Do not jump from idea to code.


## Stop conditions before coding

Stop and ask the user before coding if any of these are true:

- acceptance criteria are not testable,
- product behavior is ambiguous for the current story,
- auth, payment, admin permissions, file upload, or user-generated content is involved,
- production data can be created, modified, migrated, exported, or deleted,
- a new external dependency or tool is needed,
- UI states are missing for loading, empty, error, success, or permission-denied cases,
- validation commands are unknown,
- the Implementation File Plan would create an all-in-one file.
- the plan does not declare a target quality level from `docs/product-quality-system.md`;
- L2+ work lacks role applicability from `docs/role-gate-quality-map.md` or role simulation from `docs/role-thinking-protocols.md`;
- medium/high-risk work lacks alternatives, validation, and rollback in `docs/plan-quality.md`.

The agent must guide the user through the smallest useful set of questions, convert answers into project docs, then
build one validated slice at a time.

## Question style

Ask only the highest-value missing questions.

Good questions are:

- specific,
- answerable in one or two sentences,
- tied to a document field,
- tied to a build decision,
- limited to the current phase.

Avoid asking a long questionnaire all at once. Prefer short batches of 3 to 5 questions, then summarize what is known
and what remains unknown.

## Workflow phases

### Phase 0: Select mode and runtime

Ask or infer:

| Question | Records into |
|---|---|
| What are we building? | `docs/project-brief.md` |
| Is this Learning, MVP, Real Project, or Production? | `docs/minimum-viable-playbook.md` mode selection |
| Which runtime should be used: Claude, Hermes, or generic agent? | runtime adapter files |
| Is this UI, API, backend, CLI, automation, or mixed? | `docs/architecture.md` |

Output:

```txt
Guided build setup:
- Mode:
- Runtime:
- Project type:
- Required docs to initialize:
- Open questions:
```

### Phase 1: Product brief

Ask enough to define the project without over-specifying it.

| Question | Records into |
|---|---|
| Who is the primary user? | `docs/project-brief.md`, `docs/product.md` |
| What problem are they solving? | `docs/project-brief.md` |
| What is the smallest useful outcome? | `docs/project-brief.md`, `docs/stories.md` |
| What is explicitly out of scope? | `docs/project-brief.md`, `docs/stories.md` |

Output:

```txt
Project brief draft:
- Project name:
- One-sentence summary:
- Target users:
- Problem statement:
- MVP scope:
- Non-goals:
```

### Phase 2: Product behavior and acceptance criteria

Convert product intent into testable behavior.

| Question | Records into |
|---|---|
| What should the user be able to do first? | `docs/product.md`, `docs/stories.md` |
| What happens when the happy path succeeds? | `docs/product.md` |
| What are the most important edge cases? | `docs/product.md`, `docs/test-matrix.md` |
| What should never happen? | `docs/requirements.md`, `docs/security.md` if relevant |

Output:

```txt
Behavior summary:
- Core flow:
- Rules:
- Edge cases:
- Out of scope:
- Unknowns:
```

### Phase 3: Story slicing

Slice work into the smallest buildable story.

A good first story:

- creates visible or testable value,
- has clear acceptance criteria,
- avoids unrelated refactors,
- avoids production-risky changes unless the user explicitly selected production scope,
- can be validated with existing or documented commands.

Output story format:

```txt
Story ID:
Goal:
User story:
Acceptance criteria:
Out of scope:
Validation plan:
Browser/manual plan, if UI:
Risk level:
```

### Phase 3.5: Product-quality and role-thinking scan

Before architecture planning, classify the work and simulate the relevant roles.

Output:

```txt
Product-quality scan:
- Target quality level: L0/L1/L2/L3/L4 because:
- Product risk:
- UX/composition risk:
- Technical risk:
- Security/privacy/data risk:
- Performance/release risk:
- Roles that must be simulated before coding:
```

Role applicability before coding:

| Role | Applicability | Reason | Required evidence or not_applicable reason |
|---|---|---|---|
| Product Owner | active/consulted/not_applicable | TBD | TBD |
| User Researcher | active/consulted/not_applicable | TBD | TBD |
| Plan Quality Owner | active/consulted/not_applicable | TBD | TBD |
| Tech Lead | active/consulted/not_applicable | TBD | TBD |
| UX/Interaction Designer | active/consulted/not_applicable | TBD | TBD |
| Visual/Composition Director | active/consulted/not_applicable | TBD | TBD |
| QA Owner | active/consulted/not_applicable | TBD | TBD |
| Accessibility Owner | active/consulted/not_applicable | TBD | TBD |
| Performance Owner | active/consulted/not_applicable | TBD | TBD |
| Security Owner | active/consulted/not_applicable | TBD | TBD |
| Privacy Owner | active/consulted/not_applicable | TBD | TBD |
| Release Owner | active/consulted/not_applicable | TBD | TBD |

Role simulation before coding:

| Role | Concern | Plan response | Status |
|---|---|---|---|
| Product Owner | TBD | TBD | pass/partial/fail/blocked |
| Plan Quality Owner | TBD | TBD | pass/partial/fail/blocked |
| Tech Lead | TBD | TBD | pass/partial/fail/blocked |
| UX/Interaction Designer | TBD | TBD | pass/partial/fail/blocked |
| Visual/Composition Director | TBD | TBD | pass/partial/fail/blocked |
| QA Owner | TBD | TBD | pass/partial/fail/blocked |

Do not mark a role `pass` unless the plan has a concrete response and evidence path.

### Phase 4: Architecture and component planning

Before code, the agent must decide where responsibilities belong.

For UI features, create a Component/Hook/Service table:

| Unit | Type | Responsibility | Owns state? | Calls API/storage? |
|---|---|---|---|---|
| TBD | component/hook/service/schema/type | TBD | yes/no | yes/no |

For non-UI features, create a module responsibility table:

| Module/file | Responsibility | Input | Output | Side effects |
|---|---|---|---|---|
| TBD | TBD | TBD | TBD | none/API/db/file system |

Records into:

- `docs/architecture.md`,
- `docs/code-architecture.md`,
- `docs/component-contract.md` for UI,
- `docs/api-contract.md` for APIs,
- `docs/data-model.md` for persistent data,
- `docs/decisions/` when a major trade-off is chosen.

### Phase 5: Plan-quality review and Implementation File Plan

Before coding, output a plan-quality review and the exact planned file changes. The plan must satisfy `docs/plan-quality.md`.

Minimum plan-quality review:

```txt
Plan-quality review:
- Target quality level:
- Assumptions and unknowns:
- Alternatives considered:
- Role simulation before coding:
- Architecture and state impact:
- UX/composition/accessibility impact:
- Performance/security/privacy/release impact:
- Validation plan:
- Fallback/rollback:
```

```txt
Implementation File Plan:
| File | Create/Edit | Responsibility | Why needed | Risk |
|---|---|---|---|---|
| TBD | create/edit | TBD | TBD | low/medium/high |
```

The plan must prove that UI, state, API/persistence, validation, and types are not being collapsed into one avoidable
all-in-one file.

### Phase 6: Build one slice

Implement only the approved or selected story.

Rules:

- do not expand scope silently,
- do not add dependencies without explaining and getting approval when risk is medium/high,
- do not commit or push unless explicitly asked,
- update docs when behavior or architecture changes,
- keep route/page files thin.

### Phase 7: Validate and review

Run or document the relevant validation commands from `docs/validation.md`.

For UI, include browser/manual checks from `docs/browser-testing.md`.

Output:

```txt
Validation summary:
- lint:
- typecheck:
- tests:
- build:
- browser/manual checks:
- `not_run` and why:
```

Then run code architecture review using `docs/code-review.md` and `docs/code-architecture.md`.

For L2+ work, also run a product-quality review using `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, and `docs/role-thinking-protocols.md`.
The final validation summary must separate functional status, UX/composition status, accessibility/performance/security status when applicable, and release readiness.

### Phase 8: Update memory and propose next slice

Update the selected runtime state file:

- `.agent/project-state.md`, or
- `.hermes/project-state.md`.

Record:

- current story,
- completed scope,
- validation evidence,
- remaining risks,
- user decisions,
- next recommended story.

Do not treat runtime state as product truth. Product truth must stay in `docs/` and `DESIGN.md`.

## Guided build output contract

When the user says something like "help me build this", "ask me requirements", "build with me step by step", or "start
from my idea", the agent should respond in this shape:

```txt
I will guide this as a step-by-step build, not jump straight to code.

Known so far:
- ...

Questions for this phase:
1. ...
2. ...
3. ...

After your answers, I will draft/update:
- docs/project-brief.md
- docs/requirements.md
- docs/product.md
- docs/stories.md
```

If enough information already exists, skip unnecessary questions and move to the next phase with explicit assumptions.

## Escalation rules

Ask for explicit approval before:

- changing auth, authorization, payments, secrets, production config, database schema, or destructive data behavior,
- adding new dependencies in real/production projects,
- replacing a working architecture,
- deleting files or broad refactoring,
- deploying, committing, or pushing.

## Done for a guided build slice

A guided build slice is done only when:

- the relevant docs are updated,
- the story has acceptance criteria,
- the Implementation File Plan was created before code,
- code follows the planned responsibilities,
- validation evidence is reported honestly,
- project state is updated,
- the next slice is proposed but not started silently.
