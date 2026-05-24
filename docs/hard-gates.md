# Hard Gates

This file owns the non-negotiable gates for AI agent work.

Other files may summarize these gates, but this file is the canonical source of truth.

## Core gates

```txt
No Implementation File Plan -> no coding.
No plan-quality review -> no non-trivial coding.
No L2+ role-applicability scan and pre-code role simulation -> no coding.
No post-validation product-quality role review -> no L2+ done.
No component responsibility table -> no UI coding.
No browser interaction and screenshot-review evidence -> no UI/browser pass.
All-in-one file created -> story is not done.
Weak code structure -> refactor before reporting done.
No validation evidence -> do not claim pass.
No explicit user request -> do not commit or push.
Production deploy -> release checklist required.
```

## What each gate means

| Gate | Meaning | Evidence expected |
|---|---|---|
| No Implementation File Plan -> no coding | Before code changes, the agent must list files to create/edit and each file's responsibility. | Implementation File Plan in chat, story, or task notes. |
| No plan-quality review -> no non-trivial coding | Before non-trivial work, the agent must explain intent, target quality level, assumptions, role concerns, alternatives, risks, validation, and rollback. | `docs/plan-quality.md` checklist or Plan quality review section. |
| No L2+ role-applicability scan and pre-code role simulation -> no coding | Experience/system/product work must classify active/consulted/not_applicable roles and capture concrete role concerns before implementation. | Role applicability plus role simulation from `docs/role-gate-quality-map.md` and `docs/role-thinking-protocols.md`. |
| No post-validation product-quality role review -> no L2+ done | L2+ work must be reviewed again after evidence exists, from product, UX, composition, QA, accessibility, performance, security/privacy, and release lenses before claiming done. | Role simulation table with evidence links and unresolved owner/fix entries. |
| No component responsibility table -> no UI coding | UI work must identify components, hooks, services, schemas, and state ownership. | Component/Hook/Service table. |
| All-in-one file created -> story is not done | A story is incomplete if UI, state, API/persistence, validation, and types are avoidably mixed into one large file. | Code architecture review passes. |
| Weak code structure -> refactor before reporting done | Working code with poor boundaries is not enough. | Refactor completed or risk explicitly accepted. |
| No browser interaction and screenshot-review evidence -> no UI/browser pass | Applicable browser surfaces require real Chromium interactions, component/state screenshots, screenshot review, and design comparison when available. | Browser interaction plan, screenshot paths, reviewed observations, severity, and retest evidence. |
| No validation evidence -> do not claim pass | The agent must not claim validation succeeded unless commands were run. | Validation summary or validation report. |
| No explicit user request -> do not commit or push | The agent may inspect Git and propose commits, but must not commit/push without explicit permission. | User request recorded before commit/push. |
| Production deploy -> release checklist required | Production deployment requires release and readiness review. | Release checklist and production readiness status. |

## Implementation File Plan minimum

A valid Implementation File Plan should include:

| Field | Required? | Description |
|---|---:|---|
| File path | yes | File to create/edit/delete. |
| Action | yes | create/edit/delete/rename. |
| Responsibility | yes | What this file owns. |
| Reason | yes | Why this file is needed for the story. |
| Risk | recommended | Any risk or coupling to watch. |

Weak example:

```txt
I will update App.tsx and implement the feature.
```

Strong example:

```md
| File | Action | Responsibility | Reason |
|---|---|---|---|
| `src/features/tasks/types.ts` | create | Task domain types | Keep types out of UI |
| `src/features/tasks/hooks/useTasks.ts` | create | Task state/actions | Keep state separate from components |
| `src/features/tasks/services/taskStorage.ts` | create | Persistence | Keep localStorage out of UI |
| `src/features/tasks/components/TaskForm.tsx` | create | Form UI | Presentational component |
```

## UI responsibility table minimum

For UI stories, include:

| Field | Required? | Description |
|---|---:|---|
| Name | yes | Component/hook/service/schema name. |
| Type | yes | component/hook/service/schema/util/type. |
| Responsibility | yes | What it owns. |
| Owns state? | yes | yes/no and which state. |
| Calls API/storage? | yes | yes/no and through which service. |

## Plan-quality minimum

A valid plan-quality review should include:

| Field | Required? | Description |
|---|---:|---|
| Target quality level | yes | L0/L1/L2/L3/L4 from `docs/product-quality-system.md`, with reason. |
| Role applicability before coding | yes for L2+ | Active/consulted/not_applicable roles from `docs/role-gate-quality-map.md`, with reasons. |
| Role simulation before coding | yes for L2+ | Concrete concerns from the relevant roles, not generic approval. |
| Assumptions and unknowns | yes | What could be wrong and how it will be validated or contained. |
| Alternatives considered | yes for medium/high risk | Simpler, safer, or more scalable options and why they were chosen/rejected. |
| Validation plan | yes | Commands, browser/manual checks, screenshots/traces, and retest path. |
| Fallback/rollback | yes | How to de-scope, revert, or safely stop if implementation risk grows. |

Weak example:

```txt
I will update the UI and then test it.
```

Strong example:

```txt
Target quality level: L2 Experience because this changes the main onboarding screen.
Product concern: first-time users may not know the primary action.
Composition concern: hero illustration may overpower the CTA on mobile.
Alternative rejected: modal onboarding, because it interrupts repeat users.
Validation: build, route screenshot at 1440 and 390 widths, keyboard flow, composition review, retest after fixes.
Rollback: keep old route behind feature flag until browser evidence passes.
```

## Validation honesty

Allowed validation statuses:

- `pass`
- `fail`
- `partial`
- `not_available`
- `not_applicable`
- `not_run`
- `blocked`

Never convert `partial`, `not_run`, or `not_applicable` into `pass`.
Never hide failing commands.
If a failure is unrelated to the current story, say so clearly and provide evidence.

## Git safety

The agent may run read-only Git commands such as:

```bash
git status --short
git branch --show-current
git diff
```

The agent must not run these commands unless explicitly asked:

```bash
git add
git commit
git push
```

## Production gate

Before production deployment, require:

- validation summary,
- browser/manual or smoke test evidence when relevant,
- known risks,
- rollback plan,
- production readiness status,
- release owner.


## Quality-system gates

These gates are mandatory for real-project and production work.

- No role owner for a high-risk gate -> no release readiness.
- No traceability row linking requirement, story, implementation, test, and evidence -> no story done claim.
- No Browser Interaction Plan -> no UI/game implementation claim.
- No browser interaction plus component/state screenshots plus reviewed screenshot log -> no UI/browser pass.
- Approved design assets exist but no design-to-screenshot comparison -> no design conformance pass.
- No accessibility evidence for public browser UI -> no production UI readiness.
- No performance budget or measurement for public UI/API/game -> no production readiness.
- External asset without license/allowed-use record -> no public release.
- User/player data without data inventory, retention, and privacy owner -> no production readiness.
- Security-relevant work without threat/control mapping -> no production readiness.
- Web3D route without canvas/WebGL/WebGPU diagnostics and frame screenshots -> no Web3D pass.
- Game route without player-facing readiness and agent self-play -> no sandbox playability pass.
- Public game/demo without human playtest or accepted unknown -> no enduser readiness.
