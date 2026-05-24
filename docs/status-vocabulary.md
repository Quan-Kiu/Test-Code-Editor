# Status Vocabulary

This file keeps project status words consistent across stories, validation reports, production gates, evidence, and risk
tracking.

## 1. Story status

| Status | Meaning |
|---|---|
| planned | scoped but not started |
| in_progress | being implemented or reviewed |
| implemented | code change exists but validation/acceptance is not complete |
| validated | required validation evidence exists |
| blocked | cannot continue without decision, dependency, or missing information |
| accepted | human/product owner accepted the story |
| retired | no longer planned or superseded |

## 2. Validation status

| Status | Meaning |
|---|---|
| not_run | command/check was not run |
| pass | check passed |
| fail | check failed |
| blocked | check could not run because of missing dependency/environment |
| partial | some checks passed but required validation is incomplete; must list missing checks and next action |
| not_available | no applicable command/tool exists yet |
| not_applicable | not relevant to this project/change |

## 3. Coverage status

| Status | Meaning |
|---|---|
| implemented | automated coverage exists |
| manual_only | manually checked, not automated |
| missing | required coverage is absent |
| blocked | cannot add coverage yet |
| not_applicable | not relevant |
| flaky | exists but not reliable enough for release gating |

## 4. Production gate status

| Status | Meaning | Release impact |
|---|---|---|
| not_started | gate has no evidence yet | blocks if gate is required |
| in_progress | evidence is being gathered | blocks if gate is required |
| pass | evidence satisfies the gate | does not block |
| fail | evidence shows the gate is not satisfied | blocks |
| accepted_unknown | unresolved uncertainty was explicitly accepted with exact matching gate/evidence ID, owner, reason, risk tier, review date, expiry, and mitigation | may release only if policy allows |
| not_applicable | gate does not apply and reason is documented | does not block |

## 5. Production readiness status

| Status | Meaning |
|---|---|
| not_ready | at least one blocking gate is missing, failed, or unapproved |
| ready_with_risks | all blockers are pass/not_applicable or accepted with explicit risk ownership |
| ready | all required gates pass and no unresolved blocking risk remains |

## 5.1 Review result status

| Status | Meaning |
|---|---|
| pass | review found no blocking issue for the reviewed scope |
| pass_with_risks | review can proceed only with explicit non-blocking risks or follow-ups recorded |
| fail | review found at least one issue that must be fixed before the scope is accepted |
| blocked | review could not complete because required evidence, environment, or decision is missing |



## 5.2 Route completion and handoff status

Use route status only for the route currently being executed. Do not use it to approve a later public/enduser release.

| Status | Meaning |
|---|---|
| complete | all in-scope current-route work is finished and current-environment evidence is available or honestly classified |
| partial | current route has useful evidence, but in-scope work remains incomplete |
| blocked | current route cannot continue because a required current-route dependency, approval, or environment is missing |
| fail | current route evidence shows the route objective is not satisfied |
| not_run | current route check was not attempted |
| not_applicable | route does not apply to this task |

Downstream blockers are not route failures. They are gaps that belong to the next route, commonly
`production-release-readiness` for public/enduser release gates.

## 6. Evidence retention status

| Status | Meaning |
|---|---|
| retained | evidence is stored in a durable location |
| linked | evidence is available through a durable link |
| expired | evidence was intentionally removed after retention period |
| missing | evidence should exist but cannot be found |

Use these exact values in project docs unless a team has documented a replacement vocabulary.
