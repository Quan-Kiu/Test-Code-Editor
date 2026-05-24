# Harness-first rule

Read `HARNESS.md` first. This repository uses the Agent Engineering Harness. Follow the routing block, Project Context
Intake, route lifecycle fields, sandbox/local/enduser distinction, and ask-first gates in `HARNESS.md` before applying
the runtime-specific guidance below.

# AGENTS.md

This file defines behavior for generic AI coding agents.

## Role

You are a coding assistant working with the user to build a project incrementally and safely.

Your job is not only to write code, but also to help maintain product clarity, code structure, validation evidence, and
project memory.

## Project source of truth

Before product or code changes, read these files when relevant:

1. `docs/hard-gates.md`
2. `docs/definition-of-done.md`
3. `docs/project-brief.md`
4. `docs/requirements.md`
5. `docs/product.md`
6. `docs/architecture.md`
7. `docs/code-architecture.md`
8. `docs/stories.md`
9. `docs/guided-build-workflow.md` when requirements are unclear or the user asks to build step by step
10. `docs/context-read-matrix.md` to choose task-specific docs without overloading context
11. `docs/mode-requirements.json` for exact mode/runtime/project-type requirements
12. `docs/tool-permissions.md` for allowed, ask-first, and forbidden actions
13. `docs/product-quality-system.md`
14. `docs/role-gate-quality-map.md`
15. `docs/role-thinking-protocols.md`
16. `docs/plan-quality.md`
17. `docs/validation.md`
18. `docs/agent-security.md` when agent security or AI/LLM risks are involved
19. `docs/secure-sdlc.md` when security/auth/data/API risks are involved
20. `docs/supply-chain-security.md` when dependencies/build/release artifacts change
21. `docs/browser-testing.md`
22. `docs/composition-qa.md` when UI/game/browser surfaces are involved
23. `docs/3d-web-game-architecture.md` when project type includes `web3d`
24. `docs/3d-asset-pipeline.md` when 3D assets change
25. `docs/3d-physics-workers.md` when physics/workers change
26. `docs/3d-multiplayer-security.md` when multiplayer/security/asset protection is in scope
27. `docs/3d-browser-testing.md` when WebGL/WebGPU/canvas testing is in scope
28. `docs/git-workflow.md`
29. `.agent/project-state.md`
30. relevant files in `docs/decisions/`

If a required file is missing or incomplete, say so and help create or update it.

## Single source of truth map

- Product behavior lives in `docs/product.md`.
- Guided requirement elicitation lives in `docs/guided-build-workflow.md`.
- Visual/UI rules live in `DESIGN.md`.
- Code structure rules live in `docs/code-architecture.md`.
- Component plans live in `docs/component-contract.md`.
- Browser testing details live in `docs/browser-testing.md`.
- Validation commands live in `docs/validation.md`.

- Product-quality lifecycle lives in `docs/product-quality-system.md`.
- Canonical role/gate ownership lives in `docs/role-gate-quality-map.md`.
- Role-specific thinking lives in `docs/role-thinking-protocols.md`.
- Plan depth and review rules live in `docs/plan-quality.md`.
- Human-level composition review lives in `docs/composition-qa.md`.

- Decision rationale lives in `docs/decisions/`.
- Git rules live in `docs/git-workflow.md`.
- Current generic-agent project state lives in `.agent/project-state.md`. Do not update another runtime state file
  unless the user explicitly selects that runtime.

## Default workflow

For every non-trivial task:

1. Identify whether this is guided discovery or implementation of an existing story.
2. If the user is starting from an idea, follow `docs/guided-build-workflow.md` and ask only the current phase
   questions.
3. Identify the relevant story or create a draft story.
4. Check whether the requirement is clear.
5. Ask only the most important missing questions.
6. Declare target quality level, run plan-quality review, and simulate relevant roles for L2+ work.
7. Create an Implementation File Plan before coding.
8. Check whether a decision record is needed.
9. Implement only the selected scope.
10. Run available validation commands.
11. For UI changes with source available, build first, start the real backend if needed, render the real SPA in real
    headless Chromium, capture screenshot/frame evidence, retain trace/video/step logs when useful, inspect
    console/network, and report UI/UX improvement opportunities.
12. Provide browser/manual test steps for UI changes.
13. Run code architecture and product-quality role review.
14. Summarize changed files, risks, and next steps.
15. Propose a commit message after validation, but do not commit unless explicitly asked.
16. Update project state.
17. Update docs if behavior, architecture, validation, browser testing, Git workflow, or code architecture changed.

## Code architecture rules

Before coding a story, create an Implementation File Plan.

Do not put UI, state management, API/persistence, validation, types, and business logic into one large file.

Use feature-based structure by default:

```txt
src/features/<feature>/
├─ components/
├─ hooks/
├─ services/
├─ schemas/
├─ types.ts
├─ constants.ts
├─ utils.ts
└─ index.ts
```

A story is not done if the implementation creates an avoidable all-in-one file.

## Validation rules

Run available commands in this order when relevant:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run e2e`
5. `npm run build`

If a command is missing, report it as missing. Never claim a command passed if it was `not_run`.

## Git rules

The agent may inspect Git state and propose commits.

The agent must not create commits unless the user explicitly asks.

The agent must never push unless the user explicitly asks.



## Context and permission updates

Use `docs/context-read-matrix.md`, `docs/mode-requirements.json` to choose task-specific docs instead of loading the
whole playbook for every task.

Use `docs/tool-permissions.md` for concrete allowed, ask-first, and forbidden actions. In particular, dependency
installation, migrations, commits, pushes, deploys, and secret changes require explicit user approval.

Use `docs/workflows/implementation.md` as the canonical implementation workflow. Runtime-specific command files are
wrappers, not independent sources of truth.

Use `docs/project-validation.md` to choose between package validation and initialized project validation. Use
`docs/playbook-contract.md` for canonical cross-doc rules that must not drift.

## Adapter contract compliance

This adapter follows `docs/agent-adapter-contract.md`. Keep these canonical references visible when editing this file:

- `docs/context-read-matrix.md`
- `docs/hard-gates.md`
- `docs/tool-permissions.md`
- `docs/guided-build-workflow.md`
- `docs/workflows/implementation.md`
- `docs/project-validation.md`
- `docs/status-vocabulary.md`

## Route completion reporting

For game, UI, demo, validation, and release tasks, report current-route status separately from enduser/public readiness:

```txt
Current route status:
Sandbox evidence status:
External/enduser readiness:
Downstream blockers:
Next route:
```

Do not keep a sandbox-local route open only because human playtest, real-device checks, public URL smoke, rollback,
release owner, or hosting/proxy evidence belongs to a later `production-release-readiness` route.


## Quality hardening workflow

For real-project, production, UI, game, or Web3D work, read the quality-system docs before implementation or release claims:

- `docs/product-quality-system.md`
- `docs/role-thinking-protocols.md`
- `docs/plan-quality.md`
- `docs/roles-and-raci.md`
- `docs/signoff-ledger.md`
- `docs/traceability-matrix.md`
- `docs/qa-test-cases.md`
- `docs/design-assets.md`
- `docs/accessibility.md`
- `docs/performance-budget.md`
- `docs/license-compliance.md`
- `docs/privacy.md`
- `docs/security-asvs-map.md`
- `docs/playtest-protocol.md` for game work

Use `npm run validate:quality-system` to check the docs and validators are wired correctly. Template validation is not project readiness evidence.
