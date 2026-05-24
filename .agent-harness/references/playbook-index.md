# Harness Playbook Index

Use this index to load only the docs needed for the current task. Paths here are valid after the harness is installed
into a project. In the distributable harness package, installable project docs are staged before installation.

## Core entrypoints

| File | Use when |
|---|---|
| `HARNESS.md` | Main operating contract for all agents. Read first. |
| `AGENTS.md` | Generic/Codex/Cursor/ChatGPT-style agent entrypoint. |
| `CLAUDE.md` | Claude Code entrypoint. |
| `.hermes/context.md` | Hermes entrypoint. |
| `START-HERE.md` | Orientation for modes, runtimes, project types, and first prompts. |
| `FIRST-5-MINUTES.md` | Minimal safe start or bootstrap prompt. |

## Canonical source-of-truth docs

| Area | Canonical file |
|---|---|
| hard gates | `docs/hard-gates.md` |
| mode/runtime/project-type requirements | `docs/mode-requirements.json` |
| context loading | `docs/context-read-matrix.md` |
| guided build | `docs/guided-build-workflow.md` |
| implementation workflow | `docs/workflows/implementation.md` |
| game project adoption | `docs/game-project-adoption.md` |
| project validation | `docs/project-validation.md` |
| browser interaction QA | `docs/browser-interaction-qa.md` |
| composition QA | `docs/composition-qa.md` |
| product-quality system | `docs/product-quality-system.md` |
| role-gate quality map | `docs/role-gate-quality-map.md` |
| role-thinking protocols | `docs/role-thinking-protocols.md` |
| plan quality | `docs/plan-quality.md` |
| production readiness | `docs/production-readiness.md` |
| evidence ledger | `docs/evidence-ledger.md` |
| release risk | `docs/release-risk-classification.md` |
| tool permissions | `docs/tool-permissions.md` and `docs/tool-permissions.json` |
| status vocabulary | `docs/status-vocabulary.md` |
| playbook governance | `docs/playbook-governance.md` |
| quality system | `docs/roles-and-raci.md`, `docs/signoff-ledger.md`, `docs/traceability-matrix.md` |
| design assets | `docs/design-assets.md`, `design-assets/manifest.json` |
| accessibility | `docs/accessibility.md` |
| performance budget | `docs/performance-budget.md` |
| license compliance | `docs/license-compliance.md` |
| privacy | `docs/privacy.md` |
| security control map | `docs/security-asvs-map.md` |
| playtest protocol | `docs/playtest-protocol.md` |

## Task-specific docs

### Discovery and requirements

Read:

- `docs/guided-build-workflow.md`
- `docs/product-quality-system.md`
- `docs/role-gate-quality-map.md`
- `docs/role-thinking-protocols.md`
- `docs/plan-quality.md`
- `docs/project-brief.md`
- `docs/requirements.md`
- `docs/product.md`
- `docs/stories.md`
- `docs/architecture.md`

### Game projects and game-agent templates

Read:

- `docs/game-project-adoption.md`
- `docs/adoption-existing-project.md`
- `docs/project-brief.md`
- `docs/requirements.md`
- `docs/product.md`
- `docs/stories.md`
- `docs/code-architecture.md`
- `docs/validation.md`
- `docs/risk-register.md`
- `docs/definition-of-done.md`
- `docs/evidence-ledger.md`

Add for UI/HUD/browser games:

- `DESIGN.md`
- `docs/component-contract.md`
- `docs/browser-testing.md`
- `docs/browser-interaction-qa.md`
- `docs/visual-qa.md`
- `docs/test-matrix.md`

Add for public demos, live ops, multiplayer, accounts, analytics, cloud saves, player data, or storefront releases:

- `docs/production-readiness.md`
- `docs/release.md`
- `docs/release-strategy.md`
- `docs/observability.md`
- `docs/security.md`
- `docs/threat-model.md`
- `docs/evidence-ledger.md`

### Route completion and sandbox handoff

Read:

- `HARNESS.md`
- `.agent-harness/workflows/game-sandbox-to-local.md`
- `docs/playbook-contract.md`
- `docs/status-vocabulary.md`
- `docs/validation.md`
- `docs/game-project-adoption.md` for game-local route completion
- `docs/production-readiness.md` for public/enduser release gates

Use this when a sandbox route appears blocked only by human, real-device, public-hosting, rollback, release-owner, or
hosting/proxy checks that belong to the next route.

### Implementation and code architecture

Read:

- `docs/hard-gates.md`
- `docs/workflows/implementation.md`
- `docs/product-quality-system.md`
- `docs/role-gate-quality-map.md`
- `docs/role-thinking-protocols.md`
- `docs/plan-quality.md`
- `docs/code-architecture.md`
- `docs/code-review.md`
- `docs/validation.md`
- `docs/testing-strategy.md`
- `docs/test-matrix.md`

### UI, browser, and visual QA

Read:

- `DESIGN.md`
- `docs/design-system.md`
- `docs/component-contract.md`
- `docs/browser-testing.md`
- `docs/browser-interaction-qa.md`
- `docs/visual-qa.md`
- `docs/design-critique.md`

### Production release and operations

Read:

- `docs/production-readiness.md`
- `docs/release.md`
- `docs/release-strategy.md`
- `docs/release-risk-classification.md`
- `docs/observability.md`
- `docs/incidents.md`
- `docs/runbooks/`
- `docs/evidence-ledger.md`
- `docs/engineering-metrics.md`

## Loading rule

Load `HARNESS.md`, then the selected runtime entrypoint, then the smallest task-specific set. Stop reading once you can
produce a safe Implementation File Plan. Escalate context before coding when the task touches auth, payments, public
APIs, file uploads, user data, migrations, dependencies, CI/CD, deployment, secrets, AI tool calls, unclear acceptance
criteria, game public release, or enduser readiness.

## Web3D additions

For `game,web3d` tasks, load these docs progressively:

| Need | Read |
|---|---|
| Architecture and engine choice | `docs/3d-web-game-architecture.md` |
| Models, textures, compression, licensing | `docs/3d-asset-pipeline.md` |
| Rapier/WASM, workers, timestep, SharedArrayBuffer | `docs/3d-physics-workers.md` |
| Multiplayer authority, anti-cheat, asset protection limits | `docs/3d-multiplayer-security.md` |
| Canvas testing, visual regression, WebGPU/WebGL evidence | `docs/3d-browser-testing.md` |
| Final 3D readiness gate | `.agent-harness/checklists/3d-web-game-readiness.md` |

## Quality-system additions

For real-project or production hardening, load `docs/roles-and-raci.md`, `docs/signoff-ledger.md`, `docs/traceability-matrix.md`, `docs/qa-test-cases.md`, and then add design/accessibility/performance/security/privacy/license/playtest docs according to project type.
