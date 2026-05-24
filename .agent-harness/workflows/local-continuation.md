# Local Continuation Workflow

Use this after a project was completed in GPT/sandbox and downloaded to a local machine.

## Goal

Turn sandbox evidence into local evidence without pretending that sandbox proof is enough for real-device or enduser
release readiness.

## Steps

1. Read `HARNESS.md` and the runtime entrypoint.
2. Read `.agent/project-state.md` or the selected runtime state file.
3. Read `docs/stories.md`, `docs/validation.md`, `docs/evidence-ledger.md`, `docs/risk-register.md`, and any validation
   reports.
4. Identify the last completed route, sandbox evidence status, downstream blockers, and next route.
5. Run clean dependency install from the lockfile.
6. Run local validation commands from `docs/validation.md`.
7. Run real browser/UI/game checks locally.
8. Record local gaps separately from sandbox gaps.
9. Update `docs/validation-reports/`, `docs/evidence-ledger.md`, `docs/stories.md`, and runtime project state.
10. If public/enduser work remains, route to `production-release-readiness`.

## Required status output

```txt
Previous sandbox route:
Sandbox evidence status:
Local validation status:
Real-device status:
Human playtest status:
Public/enduser readiness:
Downstream blockers:
Next route:
```

## Do not

- Do not trust sandbox evidence as local proof.
- Do not claim public readiness from local-only evidence.
- Do not commit, push, deploy, or change secrets unless explicitly asked.
