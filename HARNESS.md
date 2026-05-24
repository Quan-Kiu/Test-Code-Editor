# Agent Engineering Harness

Use this file as the first read for any AI coding agent working in this repository.

This harness is a repo-local operating system for AI-assisted software projects. It replaces skill-specific runtime
behavior with file-based instructions, gates, workflows, and evidence rules that can be read by generic agents,
Codex-style agents, Claude Code, Hermes, Cursor-like agents, or human developers.

## 1. Required routing block

For every non-trivial software project task, classify exactly one primary route before analysis, advice, file edits, or
commands.

```txt
Route: <bootstrap-new-project|adopt-existing-project|guided-build|implement-story|ui-browser-validation|validate-project|game-project-adoption|production-release-readiness|playbook-maintenance>
Mode: <learning|mvp|real-project|production|unknown>
Runtime: <generic|claude|hermes|unknown>
Project type: <none|ui|api|backend|cli|mixed|game|web3d|comma-separated|unknown>
Assumptions: <only assumptions needed to proceed>
Next action: <next workflow step, command, or focused question>
Project context intake: <pass|partial|blocked|not_available|not_applicable>
Blocked by: <missing facts/approval only if truly blocking>
```

Route priority when several routes apply:

```txt
production-release-readiness
> game-project-adoption
> adopt-existing-project
> bootstrap-new-project
> ui-browser-validation
> implement-story
> validate-project
> guided-build
> playbook-maintenance
```

## 2. Project Context Intake

Before project-specific implementation, validation, or release claims, inspect and read in this order:

1. Resolve the project root.
2. Read the runtime entrypoint if present: `AGENTS.md`, `CLAUDE.md`, or `.hermes/context.md`.
3. Read runtime state/memory files for the selected runtime: `.agent/project-state.md`, `.agent/memory-policy.md`,
   `.hermes/project-state.md`, or `.hermes/memory-policy.md` when present.
4. Read core controls: `docs/hard-gates.md`, `docs/context-read-matrix.md`, `docs/mode-requirements.json`,
   `docs/project-validation.md`, `docs/validation.md`, `docs/stories.md`, `docs/product-quality-system.md`, `docs/role-gate-quality-map.md`, `docs/role-thinking-protocols.md`, and `docs/plan-quality.md` when present.
5. Inspect project scripts and metadata: `package.json`, lockfiles, CI files, framework config, and existing validation
   scripts.
6. Read task-specific docs from `docs/context-read-matrix.md` or `.agent-harness/workflows/route-selection.md`.

Do not claim project-specific pass without intake. If files are missing, mark intake `partial` or `blocked` and propose
adoption/bootstrap.

## 3. Non-negotiable gates

```txt
No route classification -> no workflow action.
No project context intake -> no project-specific implementation, validation, or release claim.
No Implementation File Plan -> no coding.
No plan-quality review -> no non-trivial coding.
No L2+ role-applicability scan and pre-code role simulation -> no coding.
No post-validation product-quality role review -> no L2+ done.
No component responsibility table -> no UI coding.
No validation evidence -> do not claim pass.
All-in-one file created -> story is not done.
Weak code structure -> refactor before reporting done.
No explicit user request -> do not commit or push.
Production deploy -> release checklist required.
Template-placeholder validation -> not production release evidence.
No 3D architecture/asset/physics/testing plan -> no 3D game implementation claim.
Client-authoritative competitive/economy state -> not production multiplayer ready.
Client-side asset obfuscation/encryption -> deterrence only, not DRM or secure asset protection.
```

A valid Implementation File Plan lists each file, action, responsibility, reason, and risk. UI work also needs a
Component/Hook/Service/Schema responsibility table. A functional/browser pass is not a product-quality pass; L2+ work also needs role applicability, pre-code role simulation, and post-validation role review.

## 4. Route lifecycle and handoff

For game, UI, validation, demo, or release work, report these fields separately:

```txt
Current route status: <complete|partial|blocked|fail|not_run|not_applicable>
Sandbox evidence status: <pass|partial|blocked|fail|not_run|not_applicable>
External/enduser readiness: <ready|ready_with_risks|not_ready|not_applicable>
Downstream blockers: <external-only blockers that belong to a later route>
Next route: <route or none>
```

A route may be `complete` when every in-scope task and every evidence item available in the current environment passed
or was honestly classified. Do not keep a current sandbox/local route blocked because of real-world gates that belong to
a later route. Promote them to `Downstream blockers` and name the next route.

## 5. Environment scope rule

Distinguish the current environment before making claims:

| Environment | What can be completed | What cannot be claimed without extra evidence |
|---|---|---|
| GPT/sandbox | install/build/test/browser/simulated evidence available in sandbox | real-device, public URL, human playtest, real hosting/proxy, production owner |
| Local developer machine | clean install/build/test, real browser, real GPU/WebGL, local device checks when available | public URL smoke, shared rollback, production owner unless recorded |
| Preview/public hosting | public URL smoke, hosted asset/network verification, rollback path | human acceptance unless playtest/review is recorded |
| Production/enduser | full readiness only after release gates pass | nothing should be inferred from local-only evidence |

Sandbox-complete is not enduser-ready. Enduser/public readiness requires real-world evidence when applicable.

## 6. Game workflow requirement

For game projects, always read `docs/game-project-adoption.md` when present. Browser automation and WebGL checks are
technical evidence, not human playtest. Debug-playable builds are not player-playable builds. Before asking a human to
playtest, the agent must run the player-facing readiness gate: debug UI hidden by default, no TODO/NOTE/DEBUG/dev panels
in normal mode, player screens aligned with `DESIGN.md` / `docs/design-brief.md`, normal-player screenshots captured,
and one agent self-play loop completed. Add a sandbox playability review when human playtest is unavailable, then hand
off real-device and human playtest gaps to `production-release-readiness`.

For browser 3D games, use project type `game,web3d` and read `docs/3d-web-game-architecture.md`, `docs/3d-asset-pipeline.md`, `docs/3d-physics-workers.md`, `docs/3d-multiplayer-security.md`, and `docs/3d-browser-testing.md`. Do not code 3D gameplay until engine/rendering target, asset pipeline, physics/threading, multiplayer authority, and canvas evidence plan are explicit.

## 7. Validation and reporting

Run documented validation commands. If a command is missing, report `not_available`. If it was not run, report
`not_run`. Never convert `partial`, `blocked`, `not_available`, or `not_run` into `pass`.

Final responses after implementation should include:

```txt
Done
Validation
Route lifecycle
Files changed
Risks and downstream blockers
Next route or next recommended story
```

## 8. Ask-first actions

Ask before dependency install/upgrade, database migration, production deploy, external browser target, secret
creation/deletion/rotation, destructive cleanup, git add/commit/push, broad rewrite, or overwriting existing files.

## Product-quality operating system

Use these files as the synchronized quality source before planning, implementation, validation, or done/release claims:

- `docs/product-quality-system.md` defines product-quality layers and lifecycle gates.
- `docs/role-gate-quality-map.md` is the canonical role/gate ownership map and conflict-resolution source.
- `docs/role-thinking-protocols.md` defines role-specific blind spots, evidence, and review behavior.
- `docs/plan-quality.md` upgrades planning with assumptions, alternatives, risk, validation, and rollback.
- `docs/composition-qa.md` applies when a user-facing screen, game scene, or browser surface is in scope.

For L2+ work, the agent must classify each canonical role as `active`, `consulted`, or `not_applicable` with a reason. The report must distinguish pre-code role simulation from post-validation role review. Functional tests, DOM checks, or green smoke tests cannot replace human/product-quality review.
