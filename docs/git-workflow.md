# Git Workflow

This file owns Git safety, branch guidance, commit rules, commit message conventions, and push rules.

Human/agent collaboration and conflict handling belongs in `docs/human-agent-collaboration.md`.

## 1. Core rule

The agent may inspect Git state and propose commits.

The agent must not create commits unless the user explicitly asks.

The agent must never push unless the user explicitly asks.

## 2. Branching guidance

- Small learning project: working on `main` is acceptable if the user prefers simplicity.
- Real project, client project, or portfolio project: prefer one feature branch per story.
- Production project: prefer protected main branch with CI gates.

Recommended branch format:

```txt
feature/US-001-create-task
fix/US-002-empty-title-validation
docs/update-playbook
security/fix-authz-check
release/v0.1.0
```

Before starting a story:

```bash
git branch --show-current
git status --short
```

If the current branch is `main` or `master`, ask whether the user wants a feature branch unless direct-to-main is
explicitly chosen.

## 3. Commit permission

Do not run:

```bash
git add
git commit
git push
```

unless the user explicitly asks.

Allowed without explicit commit request:

```bash
git status --short
git diff
git diff --stat
git log --oneline -5
git branch --show-current
```

## 4. Conventional Commits

When proposing or creating commits, use Conventional Commits format.

Format:

```txt
<type>(optional-scope): <short imperative summary>
```

Common types:

| Type | Use for |
|---|---|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `docs` | Documentation-only change |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `test` | Tests only |
| `chore` | Tooling, config, maintenance |
| `perf` | Performance improvement |
| `build` | Build system/dependencies |
| `ci` | CI/CD changes |
| `security` | Security fix or hardening |

Examples:

```txt
feat(tasks): add task creation flow
fix(auth): reject expired refresh tokens
docs(playbook): add production readiness gates
security(api): enforce tenant ownership checks
ci(validation): add dependency audit gate
```

Breaking changes:

```txt
feat(api)!: replace v1 task response format
```

or include footer:

```txt
BREAKING CHANGE: task response now wraps data in an envelope.
```

## 5. Semantic versioning guidance

Use semantic versioning when publishing packages or releases:

| Version part | Change type |
|---|---|
| major | breaking changes |
| minor | backward-compatible features |
| patch | backward-compatible fixes |

For apps without public package releases, use release tags when helpful:

```txt
v0.1.0
v0.1.1
v1.0.0
```

## 6. Trunk-based vs feature branches

| Strategy | Use when | Notes |
|---|---|---|
| Feature branches | Most solo/team projects | Easier review and story isolation. |
| Trunk-based development | Mature CI + feature flags + small changes | Reduces merge drift but requires strong automated gates. |

If using trunk-based development:

- keep changes small,
- use feature flags for incomplete/risky work,
- require fast CI,
- keep main releasable,
- avoid long-lived branches.

## 7. Never commit

- `.env`
- `.env.local`
- API keys
- access tokens
- passwords
- private credentials
- unrelated local files
- temporary debug files
- large generated artifacts unless intentionally part of docs/evidence
- production data exports

## 8. Pre-commit and commitlint

Recommended for Real Project and Production:

- pre-commit hooks for formatting/linting changed files,
- secret scanning before commit,
- commit message linting for Conventional Commits,
- staged-file validation to keep commits fast.

Common JavaScript examples:

```txt
husky
lint-staged
commitlint
gitleaks
```

Do not bypass hooks unless the user explicitly accepts the risk.
