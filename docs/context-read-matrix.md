# Context Read Matrix

This file prevents context overload. Agents should read enough project context to work safely, but should not read the
entire playbook for every small task.

Canonical mode/runtime/project-type requirements live in `docs/mode-requirements.json`;
`docs/minimum-viable-playbook.md` explains that matrix for humans. This matrix only tells an agent which files to load
for common task types.

## 1. Default rule

Always read the runtime adapter first:

| Runtime | First file |
|---|---|
| Claude Code | `CLAUDE.md` |
| Generic agent | `AGENTS.md` |
| Hermes | `.hermes/context.md` |

Then read only the task-relevant files below.

## 2. Task read matrix

| Task type | Required context | Add when relevant |
|---|---|---|
| Game project or game-agent template adoption | `docs/game-project-adoption.md`, `docs/adoption-existing-project.md`, `docs/project-brief.md`, `docs/requirements.md`, `docs/product.md`, `docs/stories.md`, `docs/code-architecture.md`, `docs/validation.md`, `docs/risk-register.md`, `docs/evidence-ledger.md`, `docs/status-vocabulary.md` | `DESIGN.md`, `docs/component-contract.md`, `docs/browser-testing.md`, `docs/browser-interaction-qa.md`, `docs/visual-qa.md`, `docs/composition-qa.md`, `docs/test-matrix.md`; add `docs/production-readiness.md`, `docs/release.md`, and `docs/release-strategy.md` only for public/enduser release handoff |
| 3D web game or WebGL/WebGPU feature | `docs/game-project-adoption.md`, `docs/3d-web-game-architecture.md`, `docs/3d-asset-pipeline.md`, `docs/3d-browser-testing.md`, `docs/browser-interaction-qa.md`, `docs/composition-qa.md`, `DESIGN.md`, `docs/design-brief.md`, `docs/component-contract.md`, `docs/stories.md`, `docs/code-architecture.md`, `docs/validation.md` | `docs/3d-physics-workers.md` for physics/workers; `docs/3d-multiplayer-security.md` for multiplayer, anti-cheat, or asset protection; `docs/production-readiness.md` and `docs/release.md` for public release |
| Vague idea or new feature discovery | `docs/guided-build-workflow.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, `docs/plan-quality.md`, `docs/project-brief.md`, `docs/requirements.md`, `docs/product.md`, `docs/stories.md` | `DESIGN.md`, `docs/component-contract.md`, `docs/architecture.md` |
| Small UI/copy change | `DESIGN.md`, `docs/stories.md`, `docs/product.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, `docs/code-architecture.md`, `docs/validation.md` | `docs/design-system.md`, `docs/browser-testing.md`, `docs/browser-interaction-qa.md`, `docs/visual-qa.md`, `docs/composition-qa.md` |
| UI feature implementation | `DESIGN.md`, `docs/stories.md`, `docs/product.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, `docs/plan-quality.md`, `docs/code-architecture.md`, `docs/component-contract.md`, `docs/validation.md` | `docs/design-system.md`, `docs/browser-interaction-qa.md`, `docs/visual-qa.md`, `docs/composition-qa.md`, `docs/test-matrix.md` |
| API or data feature | `docs/stories.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/plan-quality.md`, `docs/api-contract.md`, `docs/data-model.md`, `docs/code-architecture.md`, `docs/validation.md` | `docs/security.md`, `docs/data-management.md`, `docs/testing-strategy.md`, `docs/observability.md` |
| AI/LLM feature implementation | `docs/stories.md`, `docs/agent-security.md`, `docs/tool-permissions.md`, `docs/testing-strategy.md`, `docs/observability.md`, `docs/code-architecture.md` | `docs/secure-sdlc.md`, `docs/threat-model.md`, `docs/api-contract.md` for provider/tool contracts |
| MCP/tool integration | `docs/agent-security.md`, `docs/tool-permissions.md`, `docs/api-contract.md`, `docs/testing-strategy.md`, `docs/observability.md` | `docs/secure-sdlc.md`, `docs/supply-chain-security.md`, `docs/threat-model.md` |
| Security-sensitive work | `docs/security.md`, `docs/agent-security.md`, `docs/secure-sdlc.md`, `docs/security-testing.md`, `docs/tool-permissions.md` | `docs/threat-model.md`, `docs/vulnerability-response.md`, `docs/security-exceptions.md` |
| Dependency or build change | `docs/dependency-policy.md`, `docs/supply-chain-security.md`, `docs/ci-cd.md`, `docs/tooling-enforcement.md` | `docs/examples/supply-chain-node-github-actions.md`, `docs/examples/supply-chain-docker.md` |
| Production release | `docs/production-readiness.md`, `docs/release-risk-classification.md`, `docs/release.md`, `docs/release-strategy.md`, `docs/observability.md`, `docs/evidence-ledger.md` | `docs/runbooks/`, `docs/data-management.md`, `docs/supply-chain-security.md`, `docs/project-validation.md` |
| Incident or rollback | `docs/incidents.md`, `docs/observability.md`, `docs/runbooks/`, `docs/release-strategy.md` | `docs/evidence-ledger.md`, `docs/vulnerability-response.md` |
| Playbook maintenance | `MANIFEST.md`, `MANIFEST.json`, `harness.config.json`, `.agent-harness/scripts/validate_harness.py`, `docs/playbook-governance.md`, `docs/project-validation.md`, `scripts/validate-playbook.mjs` | `docs/review-matrix.md` |

## 3. Stop reading rule

After the agent has enough context to produce a safe Implementation File Plan, it should stop loading more docs and
start planning. Extra reading is useful only when the task crosses a new risk boundary.

## 4. Escalation rule

Escalate to more context before coding when the change involves:

- authentication or authorization,
- payment, public API, file upload, or user-generated content,
- production data, migrations, backups, or deletion,
- new dependency, package manager, runtime, CI, or deployment change,
- ambiguous acceptance criteria,
- missing validation command,
- unknown owner for production release or incident response.
- AI/LLM prompts, retrieved context, generated tool calls, or model outputs affect user-visible behavior, costs,
  permissions, or stored data.
- game design artifacts such as GDDs, system maps, vertical slices, playtests, performance profiles, or public game
  release evidence affect implementation scope or release readiness.


## Quality-system hardening context

| Situation | Required docs | Add when relevant |
|---|---|---|
| Plan quality review or implementation planning | `docs/plan-quality.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, `docs/stories.md`, `docs/architecture.md`, `docs/code-architecture.md`, `docs/validation.md` | `docs/component-contract.md`, `docs/browser-interaction-qa.md`, `docs/composition-qa.md`, `docs/security.md`, `docs/performance-budget.md` when relevant |
| Quality-system hardening or readiness audit | `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, `docs/plan-quality.md`, `docs/roles-and-raci.md`, `docs/signoff-ledger.md`, `docs/traceability-matrix.md`, `docs/qa-test-cases.md`, `docs/hard-gates.md`, `docs/project-validation.md` | `docs/design-assets.md`, `docs/accessibility.md`, `docs/performance-budget.md`, `docs/license-compliance.md`, `docs/privacy.md`, `docs/security-asvs-map.md`, `docs/playtest-protocol.md` |
| UI/game design conformance | `DESIGN.md`, `docs/design-assets.md`, `design-assets/manifest.json`, `docs/browser-interaction-qa.md`, `docs/visual-qa.md`, `docs/composition-qa.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md` | `docs/accessibility.md`, `docs/performance-budget.md`, `docs/playtest-protocol.md` |
| Production quality release | `docs/production-readiness.md`, `docs/signoff-ledger.md`, `docs/evidence-ledger.md`, `docs/release-decision.md`, `docs/release-risk-classification.md` | `docs/security-asvs-map.md`, `docs/privacy.md`, `docs/license-compliance.md`, `docs/performance-budget.md` |
