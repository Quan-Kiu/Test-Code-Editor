# Adopting This Playbook in an Existing Project

Use this guide when the codebase already exists. Do not rewrite the project to match the template. Add only enough
process to make agent-assisted work safer.

## 1. Start with a short audit

Capture current reality before changing docs:

| Area | Question | Output |
|---|---|---|
| Product | What does the app do today? | short summary in `docs/product.md` |
| Users/data | Are there real users, auth, payments, sensitive data, or production traffic? | selected mode in `docs/minimum-viable-playbook.md` |
| Architecture | What are the main modules, services, and boundaries? | summary in `docs/architecture.md` or `docs/code-architecture.md` |
| Validation | What commands actually exist? | `docs/validation.md` command table |
| Release | How does code reach users? | `docs/release.md` or `docs/ci-cd.md` |
| Risk | What could break users or data? | `docs/risk-register.md` |

## 2. Choose the smallest safe mode

- Use `learning` only for practice repos.
- Use `mvp` for portfolio/prototype repos.
- Use `real-project` for team/client/user-facing repos.
- Use `production` when there is production traffic, data, reliability expectation, security review, rollback
  requirement, or business impact.

## 3. Add docs incrementally

Start with these files even for an existing codebase:

```txt
AGENTS.md or CLAUDE.md or .hermes/context.md
docs/project-brief.md
docs/requirements.md
docs/product.md
docs/stories.md
docs/code-architecture.md
docs/validation.md
docs/git-workflow.md
```

For UI-heavy projects, add:

```txt
DESIGN.md
docs/component-contract.md
docs/browser-testing.md
```

For production projects, add production docs from `docs/minimum-viable-playbook.md` only after the baseline is captured.

## 4. Preserve existing architecture first

Do not ask the agent to reorganize the whole repo during adoption. First document current boundaries and known problems.
Refactor later through explicit stories.

Good first stories:

- document existing validation commands,
- add missing code ownership notes,
- split one all-in-one file behind tests,
- add a smoke test for one critical flow,
- add a release rollback section,
- add evidence ledger entries for existing CI/release proof.

## 4.1 If the codebase already has AI-generated code

Treat prior agent-generated code as a risk surface to document, not as a reason for a rewrite. Before adding new
agent-driven features:

1. Identify high-risk AI-generated areas from git history, comments, file shape, or team knowledge.
2. Run a code architecture audit against `docs/code-architecture.md`, especially for all-in-one files that mix UI,
   state, API, validation, and types.
3. Capture existing validation commands in `docs/validation.md`; if none exist, record `not_available` honestly and
   create a follow-up story.
4. Check dependencies added during AI-assisted work against `docs/dependency-policy.md` and
   `docs/supply-chain-security.md`.
5. Add tests or smoke checks around the highest-risk generated flow before asking an agent to extend it.
6. Create explicit refactor stories for generated files with unclear ownership instead of silently reorganizing the repo
   during feature work.

Do not label every AI-generated line in source comments. Prefer traceability through git history, story notes,
validation reports, and risk register entries unless the team has a documented annotation policy.

## 5. Create a baseline validation report

Run the project validator after filling the selected mode's required docs:

```bash
npm run validate:project:mvp
# or
npm run validate:project:production
```

If validation fails, record the gaps as stories. Do not mark the project ready until blockers are resolved or explicitly
accepted with exact matching gate/evidence ID, owner, reason, risk tier, review date, expiry, and mitigation.

## 6. Production adoption rule

A production repo can adopt the playbook in phases, but production release approval still requires:

- production readiness status,
- validation evidence,
- rollback plan,
- owner and decision date,
- evidence ledger entries,
- no unresolved placeholders unless they are recorded as `accepted_unknown` with exact matching gate/evidence ID, owner,
  reason, risk tier, review date, expiry, and mitigation.
