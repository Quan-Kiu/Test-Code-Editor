# Signoff Ledger

This ledger records who accepted each gate and what evidence supports the acceptance. It is not a status board; it is an audit trail.

## 1. Gate signoffs

| Gate ID | Gate | Role | Owner | Decision | Evidence ID/path | Date | Expiry/review date | Notes |
|---|---|---|---|---|---|---|---|---|
| SG-TEMPLATE-001 | Template placeholder row | Release Owner | TBD | not_started | docs/evidence-ledger.md | YYYY-MM-DD | YYYY-MM-DD | Replace in a real project. |
| SG-WB-005-001 | Local Co-op Run browser validation | QA Owner | AI-assisted local validation | approved_with_risks | EVD-WB-017, EVD-WB-019 | 2026-05-23 | 2026-06-23 | Virtual browser Gamepad wiring and both-buddy completion pass; physical-controller/human co-op not approved. |
| SG-WB-005-002 | Co-op visual/browser review | Visual QA Reviewer | AI-assisted local validation | approved_with_risks | EVD-WB-018 | 2026-05-23 | 2026-06-23 | Menu/shared-door/completion are legible; final-release art richness remains downstream. |
| SG-WB-007-001 | Pre-playtest readiness browser/accessibility gate | QA Owner / Accessibility Owner | AI-assisted local validation | approved_with_risks | EVD-WB-021, EVD-WB-022 | 2026-05-23 | 2026-06-23 | Controller badge, Reduced effects and focus containment pass in browser evidence; human/hardware evidence remains required. |
| SG-WB-007-002 | Pre-playtest performance boundary | Tech Lead | AI-assisted local validation | accepted_unknown | EVD-WB-024 | 2026-05-23 | 2026-06-23 | Runtime is measured and fallback exposed; 1.09 MB gzip runtime and real-device FPS remain unresolved. |

| SG-WB-008-001 | Movement/props/Buddy Link corrective browser gate | QA Owner / Visual QA Reviewer | AI-assisted local validation | approved_with_risks | EVD-WB-025 | 2026-05-24 | 2026-06-24 | Real browser evidence passes; feel still requires human review. |
| SG-WB-010-001 | Edge-fall recovery functional gate | QA Owner | AI-assisted local validation | approved_with_risks | EVD-WB-026, EVD-WB-027 | 2026-05-24 | 2026-06-24 | Recovery path passes; not a general collision-system approval. |
Allowed decisions: `not_started`, `approved`, `approved_with_risks`, `rejected`, `accepted_unknown`, `not_applicable`.

## 2. Required signoffs by route

| Route | Required roles | Required evidence |
|---|---|---|
| guided-build | Product Owner, Tech Lead | project brief, requirements, stories, architecture direction |
| implement-story | Tech Lead, QA Owner; add Visual Design Owner for UI/game | implementation file plan, traceability row, validation plan |
| ui-browser-validation | QA Owner, Visual QA Reviewer; add Accessibility Owner for public UI | browser evidence, screenshot review, design comparison, accessibility notes |
| game-project-adoption | Product Owner, Game Design Owner, QA Owner | GDD-lite, player-facing readiness, self-play, screenshot review |
| production-release-readiness | Release Owner, Security Owner, QA Owner, Platform/SRE Owner, Product Owner | release decision, rollback plan, evidence ledger, accepted unknowns |

## 3. Accepted unknowns and exceptions

| Unknown/Exception | Gate/Evidence ID | Role | Owner | Reason | Risk | Review date | Expiry | Mitigation |
|---|---|---|---|---|---|---|---|---|
| TBD | SG-TEMPLATE-001 | Release Owner | TBD | Template placeholder | medium | YYYY-MM-DD | YYYY-MM-DD | Replace with a real project decision. |
| Physical gamepad and human co-op have not been exercised | SG-WB-005-001 | QA Owner | Product/QA | Browser Gamepad API proves wiring only | high | 2026-06-01 | 2026-06-23 | Run physical-controller two-player acceptance before any public or release claim. |
| Deferred runtime remains above performance warning budget | SG-WB-007-002 | Tech Lead | Product/Engineering | Runtime optimization requires target-device evidence and a focused follow-up | high | 2026-06-01 | 2026-06-23 | Use Reduced effects during playtest and profile on actual GPU before release decision. |

| General collision tuning is not comprehensively validated | SG-WB-010-001 | QA Owner | Product/Engineering | WB-010 scopes recovery only, not every collider edge case | high | 2026-06-01 | 2026-06-24 | Observe stuck/fall/collision issues in human playtest and create focused follow-up if reproduced. |
Allowed risk values: `low`, `medium`, `high`, `critical`.

## 4. Non-negotiable rule

A release cannot be called ready when a required role is missing, a blocking gate has no evidence, or an accepted unknown has no owner, mitigation, review date, and expiry.

## WB-011 documentation-scope signoff

| Gate ID | Gate | Role | Owner | Decision | Evidence ID/path | Date | Expiry/review date | Notes |
|---|---|---|---|---|---|---|---|---|
| SG-WB-011-001 | Human playtest execution kit readiness | Human Playtest Owner / QA Owner | Product/Engineering | approved_with_risks | EVD-WB-028; `docs/validation-reports/wb-011-human-playtest-kit-validation.md` | 2026-05-24 | 2026-06-24 | Kit is ready to use; human sessions, physical-controller acceptance and real-device performance remain not_run. |

