# Output Templates

Use these templates to keep playbook outputs consistent.

## Implementation File Plan

```md
| File | Action | Responsibility | Reason | Risk |
|---|---|---|---|---|
| `path/to/file` | create/edit/delete/rename | What this file owns | Why this file is needed | Coupling, migration, validation, or rollback risk |
```

Minimum fields: file path, action, responsibility, reason. Include risk for production, security, data, or cross-cutting
changes.

## UI Responsibility Table

```md
| Name | Type | Responsibility | Owns state? | Calls API/storage? |
|---|---|---|---|---|
| `TaskForm` | component | presentational input and submit UI | no | no |
| `useTasks` | hook | task state and actions | yes, task collection | via `taskStorage` |
| `taskStorage` | service | persistence boundary | no | localStorage only |
| `Task` | type | domain shape | no | no |
```

Use this before UI coding.

## Story output

```md
## Story: [name]

### User outcome
[What the user can do after this story]

### Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Error/empty/loading state covered when applicable
- [ ] Validation command identified

### Out of scope
- Item 1

### Implementation File Plan
[table]

### Validation plan
- Command/check 1
- Command/check 2
```

## Browser Interaction Plan

```md
## Browser Interaction Plan: <Story/Route>

| Field | Value |
|---|---|
| Project type | ui/mixed/game/web3d/api/backend/cli/none |
| Browser surface | route/docs/admin/report/game/etc. |
| Local URL | TBD |
| Design reference | DESIGN.md / docs/design-brief.md / mock / not_available |

### Flow coverage
| Flow/state | Mouse/pointer | Keyboard | Viewport | Expected result | Screenshot/component evidence |
|---|---|---|---|---|---|
| Happy path | TBD | TBD | TBD | TBD | TBD |
| Error/empty/loading | TBD | TBD | TBD | TBD | TBD |

### Screenshot review log
| Evidence | State/component | Design reference | Observation | Severity | Suggested fix | Retest |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | none/low/medium/high/blocker | TBD | TBD |
```

## Validation summary

```md
| Check | Command or evidence | Status | Notes |
|---|---|---|---|
| Build | `npm run build` | pass/fail/partial/not_run/blocked | exact result |
| Unit tests | `npm test` | pass/fail/partial/not_run/blocked | exact result |
| Browser route | screenshot/trace path | pass/fail/partial/not_run/blocked | browser, route, console/network notes |
| Mouse/keyboard interactions | step log/screenshots | pass/fail/partial/not_run/not_applicable | click/hover/Tab/Enter/Esc/forms/canvas actions |
| Component screenshot review | reviewed screenshot log | pass/fail/partial/not_run | component/state images opened and reviewed; design comparison when available |

### Evidence
- Screenshot: `path/to/screenshot.png`
- Trace/video/step log: `path/to/log`
- Console/network findings: [summary]

### Residual risks
- Risk 1
```

## Code review output

```md
## Overall assessment
[ready / changes needed / blocked]

## Critical findings
- Finding, impact, file, suggested fix

## Important findings
- Finding, impact, file, suggested fix

## Nice-to-have findings
- Finding, impact, file, suggested fix

## Validation evidence reviewed
- Command/evidence and status

## Files that should change
- `path`: reason
```

## Production readiness output

```md
## Production readiness decision
Status: ready / ready_with_risks / not_ready / blocked
Release risk tier: low / medium / high / critical
Release owner: [name or missing]

## Blocking gates
| Gate | Applies? | Status | Owner | Evidence ID | Notes |
|---|---|---|---|---|---|

## Required evidence
| Evidence ID | Type | Scope | Owner | Date | Retention status |
|---|---|---|---|---|---|

## Accepted unknowns
| Unknown | Gate or evidence mapping | Owner | Reason | Risk | Review date | Expiry | Mitigation |
|---|---|---|---|---|---|---|---|

## Rollback and incident readiness
- Rollback plan:
- Smoke test:
- Observability:
- Incident contact/path:

## Final recommendation
[clear recommendation with residual risks]
```



## Route completion and handoff output

Use this after game, UI, validation, demo, or release work where current-route completion and enduser readiness may
differ.

```md
## Route status

| Field | Status | Evidence / reason |
|---|---|---|
| Current route | `<route>` | why this route was selected |
| Current route status | complete/partial/blocked/fail/not_run/not_applicable | current-route evidence only |
| Sandbox evidence status | pass/partial/blocked/fail/not_run/not_applicable | build/test/browser/WebGL/simulated/debug evidence |
| External/enduser readiness | ready/ready_with_risks/not_ready/not_applicable | public/enduser gates only |
| Downstream blockers | listed or none | human/device/public-hosting/rollback/owner gaps |
| Next route | `<route>` or none | usually `production-release-readiness` for public release |
```

Do not write `public demo ready` when only local/sandbox evidence passed. Use `local demo route complete / public demo
not_ready` when external gates remain.

## Final response after implementation

```md
## Done
- What changed

## Validation
| Check | Status | Evidence |
|---|---|---|

## Notes
- Risks, limitations, or follow-up
```

Never say validation passed unless the relevant check actually ran and passed.

## Plan-quality review output

```md
## Plan-quality review

| Field | Value |
|---|---|
| Target quality level | L0/L1/L2/L3/L4 + reason |
| Smallest useful outcome |  |
| Non-goals |  |
| Main assumptions |  |
| Highest risk |  |
| Fallback/rollback |  |

### Role applicability before coding
| Role | Applicability | Reason | Required evidence or not_applicable reason |
|---|---|---|---|
| Product Owner | active/consulted/not_applicable |  |  |
| User Researcher | active/consulted/not_applicable |  |  |
| Plan Quality Owner | active/consulted/not_applicable |  |  |
| Tech Lead | active/consulted/not_applicable |  |  |
| UX/Interaction Designer | active/consulted/not_applicable |  |  |
| Visual Design Owner | active/consulted/not_applicable |  |  |
| Visual/Composition Director | active/consulted/not_applicable |  |  |
| Frontend/UI Owner | active/consulted/not_applicable |  |  |
| Content/Copy Reviewer | active/consulted/not_applicable |  |  |
| Accessibility Owner | active/consulted/not_applicable |  |  |
| QA Owner | active/consulted/not_applicable |  |  |
| Exploratory Tester | active/consulted/not_applicable |  |  |
| Game Design Owner | active/consulted/not_applicable |  |  |
| Human Playtest Owner | active/consulted/not_applicable |  |  |
| 3D/Rendering Owner | active/consulted/not_applicable |  |  |
| Backend/API Owner | active/consulted/not_applicable |  |  |
| Data Owner | active/consulted/not_applicable |  |  |
| Security Owner | active/consulted/not_applicable |  |  |
| Privacy Owner | active/consulted/not_applicable |  |  |
| Performance Owner | active/consulted/not_applicable |  |  |
| Platform/SRE Owner | active/consulted/not_applicable |  |  |
| License/Compliance Owner | active/consulted/not_applicable |  |  |
| Analytics/Learning Owner | active/consulted/not_applicable |  |  |
| Support/Ops Reviewer | active/consulted/not_applicable |  |  |
| Release Owner | active/consulted/not_applicable |  |  |
| Agent Context Steward | active/consulted/not_applicable |  |  |

### Role simulation before coding
| Role | Concrete concern | Plan response | Status |
|---|---|---|---|
| Product Owner |  |  | pass/partial/fail/blocked/not_applicable |
| User Researcher |  |  | pass/partial/fail/blocked/not_applicable |
| Plan Quality Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Tech Lead |  |  | pass/partial/fail/blocked/not_applicable |
| UX/Interaction Designer |  |  | pass/partial/fail/blocked/not_applicable |
| Visual Design Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Visual/Composition Director |  |  | pass/partial/fail/blocked/not_applicable |
| Frontend/UI Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Content/Copy Reviewer |  |  | pass/partial/fail/blocked/not_applicable |
| Accessibility Owner |  |  | pass/partial/fail/blocked/not_applicable |
| QA Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Exploratory Tester |  |  | pass/partial/fail/blocked/not_applicable |
| Game Design Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Human Playtest Owner |  |  | pass/partial/fail/blocked/not_applicable |
| 3D/Rendering Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Backend/API Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Data Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Security Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Privacy Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Performance Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Platform/SRE Owner |  |  | pass/partial/fail/blocked/not_applicable |
| License/Compliance Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Analytics/Learning Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Support/Ops Reviewer |  |  | pass/partial/fail/blocked/not_applicable |
| Release Owner |  |  | pass/partial/fail/blocked/not_applicable |
| Agent Context Steward |  |  | pass/partial/fail/blocked/not_applicable |

### Alternatives considered
| Option | Pros | Cons | Decision |
|---|---|---|---|
|  |  |  | choose/reject |
```

Use this before any non-trivial coding. A file list without role concerns, risks, validation, and fallback is not enough.

## Product-quality final review output

```md
## Product-quality review

| Dimension | Status | Evidence | Owner/fix |
|---|---|---|---|
| Product value | pass/partial/fail/blocked/not_applicable |  |  |
| Requirement clarity | pass/partial/fail/blocked/not_applicable |  |  |
| Architecture | pass/partial/fail/blocked/not_applicable |  |  |
| Interaction UX | pass/partial/fail/blocked/not_applicable |  |  |
| Composition UX | pass/partial/fail/blocked/not_applicable |  |  |
| Accessibility | pass/partial/fail/blocked/not_applicable |  |  |
| Performance | pass/partial/fail/blocked/not_applicable |  |  |
| Security/privacy/data | pass/partial/fail/blocked/not_applicable |  |  |
| Release safety | pass/partial/fail/blocked/not_applicable |  |  |

Final quality status: pass/partial/fail/blocked
```
