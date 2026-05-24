# Workflow Cheatsheet

## Mode selection

| Mode | Use when | Minimum posture |
|---|---|---|
| `learning` | practice apps, freshers, exercises | clear requirements, stories, validation, clean structure |
| `mvp` | portfolio projects, early product, solo builds | architecture, component contracts, validation coverage |
| `real-project` | real users or team collaboration | security, contracts, CI/CD, release and risk tracking |
| `production` | production traffic, sensitive data, auth, payments, rollback requirements | measurable gates, evidence, observability, secure SDLC, runbooks |

## Runtime selection

| Runtime | First file | State/memory files |
|---|---|---|
| `generic` | `AGENTS.md` | `.agent/project-state.md`, `.agent/memory-policy.md` |
| `claude` | `CLAUDE.md` | `.claude/commands/` |
| `hermes` | `.hermes/context.md` | `.hermes/project-state.md`, `.hermes/memory-policy.md` |

## Guided build phases

1. Clarify project brief: goal, user, success criteria, constraints.
2. Clarify requirements: functional requirements, non-functional requirements, out-of-scope items.
3. Clarify product behavior: states, flows, edge cases, copy, error behavior.
4. Draft stories: one small buildable story at a time with acceptance criteria.
5. Draft architecture and responsibility tables.
6. Produce Implementation File Plan.
7. Implement only planned files.
8. Validate and report evidence.

Ask only 3 to 5 focused questions per phase. Do not ask broad questionnaires when one phase can move forward.


## Game project adoption checklist

Use this when the project is a Godot, Unity, Unreal, web game, custom-engine game, or game-specific agent/studio
template.

1. Preserve the existing game workflow and engine structure.
2. Read `docs/game-project-adoption.md`, `docs/adoption-existing-project.md`, `DESIGN.md`, `docs/design-brief.md`,
   `docs/browser-testing.md`, `docs/visual-qa.md`, and `.agent-harness/checklists/game-player-facing-readiness.md`.
3. Complete design intake before player-facing implementation: references, anti-references, camera, HUD, world, avatar,
   motion/feedback, temporary asset policy, and accessibility constraints.
4. Map game concept, art direction, GDDs, system maps, UX/HUD specs, ADRs, vertical slice, playtests, sprint plans, QA
   reports, and release checklists to playbook controls.
5. Create or update baseline docs: `docs/project-brief.md`, `docs/requirements.md`, `docs/product.md`, `DESIGN.md`,
   `docs/design-brief.md`, `docs/stories.md`, `docs/code-architecture.md`, `docs/component-contract.md`,
   `docs/validation.md`, `docs/risk-register.md`, `docs/definition-of-done.md`, and `docs/evidence-ledger.md`.
6. Produce a Game Project Analysis before coding when asked to analyze, improve, or adopt a game workflow.
7. Separate developer debug test, design conformance test, player-facing readiness, sandbox playability review, and human
   playtest.
8. Do not ask a human to player-test while normal mode shows TODO/NOTE/DEBUG text, dev panels, collision helpers, test
   buttons, seed panels, or developer-only labels.
9. Do not claim gameplay, vertical-slice, playtest, performance, or public release gates passed without evidence.

## Implementation checklist

Before code:

- Story and acceptance criteria are explicit.
- Implementation File Plan exists.
- UI responsibility table exists for UI work.
- File boundaries avoid all-in-one implementation.
- Risk boundaries are identified.
- Ask-first actions are not performed without explicit approval.

During code:

- Keep UI, state, API/storage, schema/types, and validation separated.
- Prefer editing existing files over creating parallel abstractions.
- Update plan if new files become necessary.
- Avoid dependency installs unless approved.
- Avoid commit/push unless explicitly requested.

After code:

- Run documented validation commands.
- Capture browser evidence for UI changes when applicable, including mouse/keyboard interactions, component/state screenshots, screenshot review, and design comparison when available.
- Report every failing command honestly.
- Update runtime state with concise non-secret facts when applicable.

## Validation statuses

Use only these statuses:

- `pass`: command/check ran and succeeded.
- `fail`: command/check ran and failed.
- `partial`: some evidence exists but coverage is incomplete.
- `not_available`: required tool or environment is unavailable.
- `not_applicable`: check genuinely does not apply, with reason.
- `not_run`: check was not run.
- `blocked`: cannot proceed until dependency, approval, or environment is available.

Never convert `partial`, `not_run`, or `not_applicable` into `pass`.

## Ask-first actions

Ask before:

- dependency install or upgrade,
- database migration or data-modifying script,
- infrastructure/DNS/bucket/queue changes,
- secrets creation/deletion/rotation,
- external or production browser targets,
- git add/commit/push,
- deployment or release,
- destructive cleanup,
- broad file overwrites.

Read-only inspection, planned edits, documented validation, and local browser validation are generally allowed inside
the task scope.

## Route completion and sandbox handoff

For game/UI/demo tasks, report current-route completion separately from public/enduser readiness:

```txt
Current route status:
Sandbox evidence status:
External/enduser readiness:
Downstream blockers:
Next route:
```

A sandbox-local route may complete when all in-scope sandbox evidence passes. Missing human playtest, real-device
WebGL/mobile checks, public URL smoke, release owner, rollback verification, or real hosting/proxy rate-limit review
should become downstream blockers for `production-release-readiness`, not blockers that keep `game-project-adoption`
open indefinitely.

Browser automation is not a human playtest. Use sandbox playability review for heuristic player-experience findings,
then require human playtest before public/enduser release.

## Web3D game route addendum

For 3D browser games, use `--project-type game,web3d` and read:

- `docs/3d-web-game-architecture.md`
- `docs/3d-asset-pipeline.md`
- `docs/3d-physics-workers.md`
- `docs/3d-multiplayer-security.md`
- `docs/3d-browser-testing.md`
- `.agent-harness/checklists/3d-web-game-readiness.md`

Do not implement 3D gameplay until engine/rendering target, asset pipeline, physics/threading, multiplayer authority, and
canvas evidence plan are explicit. Use real browser screenshots/frame sequences for canvas evidence; DOM-only checks do
not prove 3D correctness.


## Browser interaction QA gate

Read `docs/browser-interaction-qa.md` for any applicable browser surface. Project-type defaults:

| Type | Gate |
|---|---|
| `ui` | required for meaningful UI changes |
| `mixed` | required for UI plus API-backed states |
| `game` | required for player-facing readiness and sandbox playability |
| `web3d` | required for canvas/WebGL/WebGPU evidence and 3D interactions |
| `api` / `backend` / `cli` | required only when the work changes browser docs, admin UI, dashboards, generated HTML reports, or demos |
| `none` | usually not applicable |

A UI/browser pass requires real Chromium, user-like mouse/keyboard/touch interactions, screenshots of screens and
components/states, screenshot review with observations, design comparison when available, UI/UX recommendations for
issues, and matching retest screenshots after fixes.


## Quality system checklist

Before claiming high-quality output for a real project:

1. Role owners are recorded in `docs/roles-and-raci.md` and gate decisions are recorded in `docs/signoff-ledger.md`.
2. Requirements, stories, design assets, tests, and evidence are linked in `docs/traceability-matrix.md`.
3. UI/game work has a Browser Interaction Plan, component/state screenshots, screenshot review, design comparison, and retest evidence.
4. Accessibility, performance, license, privacy, and security-control docs are applicable or explicitly marked not_applicable with reasons.
5. Game work has agent self-play; public game/demo release has human playtest or an accepted unknown.
