# Generic Agent Memory Policy

This file defines what the agent should remember and where each type of durable project information belongs.

## 1. Core rule

Project docs are the source of truth.

Chat history is not enough.

The agent must update project files when durable project information changes.

## 2. What goes where

| Information type | Store in | Notes |
|---|---|---|
| Product behavior | `docs/product.md` | What the app should do |
| Requirements | `docs/requirements.md` | Testable user/system requirements |
| Architecture | `docs/architecture.md` | Stack, structure, data, API, auth |
| Code structure | `docs/code-architecture.md` | File/module boundaries and split rules |
| Important decisions | `docs/decisions/` | Why a choice was made |
| Story status | `docs/stories.md` | Planned/in progress/implemented/etc. |
| Validation evidence | `docs/test-matrix.md` and `docs/validation-reports/` | Commands, results, evidence |
| Browser test flows | `docs/browser-testing.md` | Reusable browser/manual checks |
| Current working state | `.agent/project-state.md` | Current phase, story, blockers, validation/browser/Git status for the generic-agent runtime |
| Git workflow | `docs/git-workflow.md` | Status checks, commit rules, push rules |
| Human-agent collaboration | `docs/human-agent-collaboration.md` | Ownership, conflict handling, review responsibilities |
| Hard gates | `docs/hard-gates.md` | Non-negotiable agent gates |
| Definition of Done | `docs/definition-of-done.md` | Done gates by mode |
| Agent security | `docs/agent-security.md` | Agent trust boundaries and tool risks |
| Secure SDLC | `docs/secure-sdlc.md` | Security gates by lifecycle phase |
| Supply chain security | `docs/supply-chain-security.md` | Dependency, CI, artifact, and release controls |
| Agent behavior rules | `AGENTS.md` | Generic-agent coding and working rules |
| Visual/UI rules | `DESIGN.md` | Design source of truth |

## 3. What to update after each story

After finishing or pausing a story, update:
- `docs/stories.md`
- `docs/test-matrix.md` when evidence changed
- runtime project state file

If behavior changed, update:
- `docs/product.md`

If architecture/code structure changed, update:
- `docs/architecture.md`
- `docs/code-architecture.md`
- `docs/decisions/` when needed

If browser testing flow changed, update:
- `docs/browser-testing.md`

If Git workflow changed, update:
- `docs/git-workflow.md`

## 4. What not to store

Do not store:
- secrets
- passwords
- API keys
- private tokens
- unnecessary personal information
- temporary chat-only comments
- guesses that are not marked as assumptions

## 5. Resume protocol

At the start of a new session, the agent should read:

1. `.agent/project-state.md`
2. `AGENTS.md`
3. `docs/context-read-matrix.md`
4. `docs/git-workflow.md`
5. current story in `docs/stories.md`
6. relevant product/architecture/code-architecture/validation/browser docs

Then summarize:
- current phase
- current story
- last known validation result
- last known browser result
- current Git state if known
- blockers
- recommended next step

## Adapter contract compliance

This memory policy follows `docs/agent-adapter-contract.md`. Keep these canonical references visible when editing this
file:

- `docs/context-read-matrix.md`
- `docs/mode-requirements.json`
- `docs/hard-gates.md`
- `docs/tool-permissions.md`
- `docs/guided-build-workflow.md`
- `docs/workflows/implementation.md`
- `docs/project-validation.md`
- `docs/status-vocabulary.md`
