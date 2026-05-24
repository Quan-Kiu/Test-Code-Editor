# Agent Adapter Contract

This file defines the minimum behavior every runtime adapter must preserve. Runtime adapters may be concise, but they
must not contradict or omit these controls.

Applies to:

- `CLAUDE.md` and `.claude/commands/`
- `AGENTS.md`, `.agent/memory-policy.md`, and `.agent/workflows/`
- `.hermes/context.md`, `.hermes/memory-policy.md`, and `.hermes/workflows/`

## 1. Required source-of-truth references

Every runtime adapter markdown file covered above must point back to these canonical docs instead of redefining them.
Short wrapper commands may keep the references in an adapter contract compliance block rather than duplicating the full
policy:

The main runtime entry files (`CLAUDE.md`, `AGENTS.md`, `.hermes/context.md`) should include the most important
references in their primary read list, not only in a footer compliance block. Short command/workflow wrappers may use a
compliance block when they delegate to the main runtime entry file.

| Required reference | Why it matters |
|---|---|
| `docs/context-read-matrix.md` | choose the smallest useful context for the task |
| `docs/mode-requirements.json` | keep mode/runtime/project-type requirements aligned with validation tooling |
| `docs/hard-gates.md` | enforce non-negotiable coding and release gates |
| `docs/tool-permissions.md` | separate allowed, ask-first, and forbidden tool actions |
| `docs/guided-build-workflow.md` | ask requirements before coding from vague ideas |
| `docs/workflows/implementation.md` | shared implementation workflow |
| `docs/project-validation.md` | choose package validation versus project validation |
| `docs/status-vocabulary.md` | use canonical status values |

## 2. Required behavior

Runtime adapters must instruct the agent to:

Runtime isolation rule: an adapter for one runtime must not require reading another runtime's adapter or updating
another runtime's state file as a normal source of truth. For example, Hermes should read `.hermes/context.md` and
`.hermes/project-state.md` plus shared docs, not `AGENTS.md` or `.agent/project-state.md`, for its baseline behavior.

1. read task-specific context from `docs/context-read-matrix.md` rather than loading the whole playbook blindly,
2. use `docs/mode-requirements.json` and `docs/minimum-viable-playbook.md` when choosing mode/runtime/project-type
   requirements,
3. follow `docs/hard-gates.md`,
4. ask guided-build questions before coding when requirements are unclear,
5. produce a responsibility table and Implementation File Plan before code changes,
6. run or honestly report validation using canonical statuses,
7. never claim pass for checks marked `not_run`, `not_available`, or `blocked`,
8. never install dependencies, run migrations, change secrets, commit, push, deploy, or perform destructive actions
   without explicit permission,
9. keep runtime project state concise, verified, and free of secrets,
10. update docs when behavior, architecture, validation, security, release, or operational assumptions change.

## 3. Adapter drift check

When editing a runtime adapter, check that it still references the required canonical docs above. The package validator
enforces this for the main runtime entry files and every markdown workflow/command wrapper under `.claude/commands/`,
`.agent/workflows/`, and `.hermes/workflows/`.

If an adapter needs a runtime-specific shortcut, keep the shortcut in the adapter but keep the policy in the canonical
doc.
