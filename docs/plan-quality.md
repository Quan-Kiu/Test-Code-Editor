# Plan Quality

This file raises the standard for planning. A plan is not a task list. A plan is a product, technical, UX, risk, and
validation argument that proves the next implementation slice is the right slice and can be verified.

Use this file before coding any non-trivial story.

## 1. Plan-quality principle

A high-quality plan must be:

- **specific**: names exact files, responsibilities, states, data, and commands;
- **bounded**: states what will not be changed;
- **role-aware**: classifies relevant roles with `docs/role-gate-quality-map.md` and simulates their concrete concerns;
- **risk-aware**: names technical, product, UX, security, performance, and release risks;
- **evidence-led**: defines how success and failure will be proven;
- **adaptable**: includes alternatives and rollback/de-scope path.

## 2. Plan quality gate

No coding starts until the plan answers these sections.

| Section | Required answer |
|---|---|
| Intent | What user/system problem is being solved and what is out of scope? |
| Target quality level | L0/L1/L2/L3/L4 from `docs/product-quality-system.md`, with reason. |
| Assumptions | What is assumed, how risky is it, and how will it be validated or constrained? |
| Role applicability | Which roles are active, consulted, or not applicable, and why? |
| Role simulation | What would each relevant active/consulted role worry about before coding? |
| Alternatives | What simpler, safer, or more scalable options were considered and rejected? |
| Architecture impact | What modules, data flow, dependencies, boundaries, or contracts change? |
| UX/state impact | What user states, flows, copy, empty/error/loading/success states change? |
| Composition impact | What screenshots/frames must show rhythm, balance, dominance, and center preservation? |
| Accessibility impact | What keyboard/focus/label/contrast/touch/reduced-motion checks apply? |
| Performance impact | What load, interaction, memory, bundle, FPS, or asset budget applies? |
| Security/privacy impact | What trust boundary, input, auth, secret, data, or third-party risk changes? |
| File plan | Exact create/edit/delete list with responsibility, reason, risk, and validation. |
| Validation plan | Commands, browser/manual checks, test data, screenshots, traces, and retest path. |
| Fallback/rollback | How to revert, de-scope, or safely ship partial work. |

## 3. Deep planning template

```md
## Plan quality review

### Intent
- User/system problem:
- Smallest useful outcome:
- Non-goals:
- Target quality level: L0/L1/L2/L3/L4 because:

### Assumptions and unknowns
| Assumption/unknown | Risk | Validation or containment | Owner |
|---|---|---|---|
|  | low/medium/high |  |  |

### Role applicability before coding
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

### Role simulation before coding
| Role | Concern | Plan response | Status |
|---|---|---|---|
| Product Owner |  |  |  |
| User Researcher |  |  |  |
| Plan Quality Owner |  |  |  |
| Tech Lead |  |  |  |
| UX/Interaction Designer |  |  |  |
| Visual Design Owner |  |  |  |
| Visual/Composition Director |  |  |  |
| Frontend/UI Owner |  |  |  |
| Content/Copy Reviewer |  |  |  |
| Accessibility Owner |  |  |  |
| QA Owner |  |  |  |
| Exploratory Tester |  |  |  |
| Game Design Owner |  |  |  |
| Human Playtest Owner |  |  |  |
| 3D/Rendering Owner |  |  |  |
| Backend/API Owner |  |  |  |
| Data Owner |  |  |  |
| Security Owner |  |  |  |
| Privacy Owner |  |  |  |
| Performance Owner |  |  |  |
| Platform/SRE Owner |  |  |  |
| License/Compliance Owner |  |  |  |
| Analytics/Learning Owner |  |  |  |
| Support/Ops Reviewer |  |  |  |
| Release Owner |  |  |  |
| Agent Context Steward |  |  |  |

### Alternatives considered
| Option | Pros | Cons | Decision |
|---|---|---|---|
|  |  |  | choose/reject |

### Architecture and responsibility plan
| Area | Decision | Reason | Risk |
|---|---|---|---|
| Module boundaries |  |  |  |
| State ownership |  |  |  |
| API/storage/data |  |  |  |
| Error handling |  |  |  |
| Dependencies |  |  |  |

### Implementation File Plan
| File | Action | Responsibility | Why needed | Risk | Validation evidence |
|---|---|---|---|---|---|
|  | create/edit/delete |  |  | low/medium/high |  |

### UX, composition, and accessibility plan
| Surface/state | User intent | Visual/composition risk | Accessibility risk | Evidence to capture |
|---|---|---|---|---|
|  |  |  |  |  |

### Validation plan
| Check | Command or method | Expected evidence | Status owner |
|---|---|---|---|
| lint/typecheck |  |  |  |
| unit/integration |  |  |  |
| browser interaction |  |  |  |
| screenshot/composition |  |  |  |
| accessibility |  |  |  |
| performance |  |  |  |
| security/privacy |  |  |  |

### Fallback and rollback
- De-scope path:
- Revert path:
- Known risks if shipped:
- Post-implementation retest:
```

## 4. Planning depth by story type

| Story type | Extra required thinking |
|---|---|
| UI feature | component table, states inventory, responsive plan, browser evidence, composition evidence |
| Game feature | player goal, feedback loop, loss/win clarity, retry motivation, playtest observation |
| 3D/WebGL | camera, scene dominance, asset budget, LOD, frame budget, fallback path |
| API/backend | contract, validation, idempotency, data migration, error shape, observability |
| Auth/permissions | threat model trigger, authorization matrix, negative tests |
| Data/destructive action | backup/restore, dry run, confirmation UX, audit trail |
| Performance-sensitive | budget, profiling method, worst-case data, regression guard |
| Production release | rollback, monitoring, owner signoff, communication, post-release watch |

## 5. Anti-patterns that block planning

A plan fails when it contains:

- a file list without responsibilities;
- `update App.tsx` as the only UI plan;
- no reason why this slice is the smallest useful slice;
- no mention of loading/empty/error/success states for UI;
- no role applicability scan and role simulation for L2+ work;
- no alternatives considered for medium/high risk decisions;
- no validation commands or screenshot evidence path;
- no fallback when the chosen implementation turns out too risky;
- unbounded dependencies or vague `improve/refactor everything` scope.

## 6. Plan scoring rubric

Use this rubric when reviewing plan quality.

| Score | Meaning | Allowed action |
|---:|---|---|
| 0 | No plan or only vague intent | Block coding. |
| 1 | File list exists, but responsibilities/risks/validation are missing | Revise plan. |
| 2 | Basic plan with files, acceptance, and validation | Accept only for L0/L1. |
| 3 | Role-aware plan with risks, alternatives, UX states, and validation | Accept for L2. |
| 4 | System-aware plan with security/data/performance/release thinking | Accept for L3. |
| 5 | Product-quality plan with user research/playtest/release learning loop | Accept for L4. |

Do not use score 4 or 5 unless the plan includes concrete evidence paths, not just good intentions.

