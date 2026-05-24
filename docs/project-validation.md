# Project Validation

This file explains the difference between validating the released playbook package and validating a real project that
has been initialized from the playbook.

## 1. Two validation targets

| Target | Command | Expected on blank template | Expected on initialized project |
|---|---|---:|---:|
| Package/template hygiene | `npm run validate:all` | pass, including template matrix coverage | pass |
| Filled examples | `npm run validate:examples` | reports `not_available` with exit 0 in the lean harness export because filled examples are not shipped | use `npm run validate:examples:strict` only when a release package is expected to ship filled examples |
| Project readiness by mode/runtime/type | `node scripts/validate-project.mjs --mode <mode> --runtime <runtime> --project-type <type>` or `npm run validate:project:<mode>` | fail when required project fields are still placeholders | pass after the project fills required docs |
| Project readiness with template placeholders allowed | `npm run validate:template:<mode>` | pass schema checks | not recommended for release approval |

The package validator proves that this distributed template is internally consistent with `docs/playbook-contract.md`
and the manifest. It does not prove that a product built from the template is ready for production.

The project validator proves that an initialized project has filled the required files for its chosen mode, runtime
adapter, and project type. Required path lists are loaded from `docs/mode-requirements.json`, the machine-readable
source of truth also used by `scripts/init-project.mjs`.

Progressive fill is the intended workflow: start with `npm run init:project -- --route new` or `npm run init:project --
--route existing`, fill only known facts, run validation, then use the first failures as the next fill list. A blank
template passing with `--allow-template-placeholders` means the package structure is healthy; it does not mean the
product is ready.

## 2. Command shape

```bash
node scripts/validate-project.mjs \
  --mode <learning|mvp|real-project|production> \
  --runtime <generic|claude|hermes> \
  --project-type <none|ui|api|backend|cli|mixed|game|web3d> \
  [--root <project-root>] \
  [--summary]
```

Defaults are `--runtime generic` and `--project-type none` when omitted. Use `--summary` for grouped output on blank
templates or large projects. Use `--root` when validating an initialized project from outside its directory.

Examples:

```bash
node scripts/validate-project.mjs --mode mvp --runtime generic --project-type ui
node scripts/validate-project.mjs --mode real-project --runtime claude --project-type api
node scripts/validate-project.mjs --mode production --runtime hermes --project-type mixed
```

Use `--allow-template-placeholders` only when checking the distributed blank template. Do not use it as production
release evidence. Filled examples are not shipped in the lean harness export; `npm run validate:examples` reports
`not_available` with exit 0 so normal package hygiene is not noisy. Use `npm run validate:examples:strict` only in
packages that are expected to ship filled examples, and use project validation for the current repo.

## 3. Commands

```bash
node scripts/validate-playbook.mjs --help
npm run validate:all

node scripts/validate-project.mjs --help
npm run validate:project:learning
npm run validate:project:mvp
npm run validate:project:mvp:ui
npm run validate:project:real
npm run validate:project:production
npm run validate:examples                  # informational not_available in lean export
npm run validate:examples:strict           # fail if filled examples are expected but absent
npm run validate:drift
npm run validate:regression
```

## 4. Production release rule

Production release approval must use the package validator and the project validator with the actual runtime and project
type:

```bash
npm run validate:all
node scripts/validate-project.mjs --mode production --runtime <runtime> --project-type <type>
```

A production project is not ready when any required production doc still contains unresolved `TBD`, `TODO`, or `FIXME`,
unless the uncertainty is explicitly recorded as an `accepted_unknown` with gate/evidence mapping, owner, reason, risk,
review date, expiry, and mitigation. Production validation also derives readiness from the gates: missing release risk
tier, applicable blocking gate failures, missing/expired required evidence on applicable gates, expired accepted
unknowns in production readiness or the evidence ledger, broad/non-exact accepted-unknown mappings, or mismatched
release-decision status fail even when the written final status says `ready` or `ready_with_risks`.

## 5. What project validation checks

The project validator checks:

- required paths for the selected mode, runtime, and project type from `docs/mode-requirements.json`, using explicit
  `modeOrder`,
- runtime adapter requirements such as `AGENTS.md` + `.agent/project-state.md` + `.agent/memory-policy.md`, `CLAUDE.md`
  + `.claude/commands/`, or `.hermes/context.md` + `.hermes/project-state.md` + `.hermes/memory-policy.md` +
  `.hermes/workflows/`,
- project-type add-ons such as UI docs or API contract docs,
- required production documents for production mode,
- unresolved placeholders in mode-critical documents,
- production gate status values plus conditional `Applies when` and `Risk tier` fields, including risk-tier
  applicability for derived readiness,
- `accepted_unknown` entries with gate/evidence mapping, owner, reason, risk, review date, expiry, and mitigation,
  including expiry checks against the decision date,
- `not_applicable` production gates with a documented reason,
- evidence ledger rows with evidence ID, type, scope, owner, date, and retention status; required evidence referenced by
  passed blocking gates must be retained or linked, not missing or expired,
- security exception severity/status/expiry fields,
- final production decision placeholders, missing release risk tier for `ready`/`ready_with_risks`, and conflicts
  between written readiness status, derived readiness status, and optional `docs/release-decision.md` status,
- evidence/status vocabulary drift,
- basic heading/schema presence in key documents.
- documentation drift against `docs/playbook-contract.md`.
- lean-export regression expectations from `docs/review-matrix.md` through the harness validator.
- shared semantic readiness checks from `scripts/lib/production-readiness-semantics.mjs`, used by both project and
  example validation.

Package validation additionally checks manifest coverage, stale references, broken markdown links, broken markdown
anchors, broken backticked shipped-file paths, example placeholder semantics, runtime adapter contract references,
machine-readable permission policy shape, explicit mode order, and release package hygiene.

## 6. npm scripts

Use the scripts in `package.json` for normal work:

```bash
npm run validate:all
npm run validate:template:learning
npm run validate:template:mvp
npm run validate:template:mvp:ui
npm run validate:template:real
npm run validate:template:production
npm run validate:project:learning
npm run validate:project:mvp
npm run validate:project:mvp:ui
npm run validate:project:real
npm run validate:project:production
npm run validate:examples                  # informational not_available in lean export
npm run validate:examples:strict           # fail if filled examples are expected but absent
npm run init:project -- --mode mvp --runtime generic --project-type ui
```

The `validate:template:*` commands are for the blank template only. They must not be used as production release approval
evidence.


## 7. Reading validation failures

A blank template is expected to fail normal project validation because project-specific fields still contain
placeholders. That does not mean the package is broken. Use these commands intentionally:

```bash
# Template/package health
npm run validate:all

# Real project readiness
node scripts/validate-project.mjs --mode production --runtime generic --project-type api --summary
```

`--summary` groups repeated placeholder failures by file/category so the first remediation path is visible before the
full details.
