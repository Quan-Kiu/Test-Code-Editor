# Accessibility Gates

This file defines the minimum accessibility quality bar for browser surfaces, games, generated reports, docs sites, admin UI, and public marketing pages.

## 1. Applicability

Accessibility gates apply to any user-visible browser surface. For a terminal-only CLI or headless service, mark the gate `not_applicable` with a reason in the validation report.

## 2. Required checks

| Area | Requirement | Evidence |
|---|---|---|
| Keyboard navigation | Main flow works with Tab, Shift+Tab, Enter/Space, Escape, and documented shortcuts | browser interaction report |
| Focus visibility | Focus ring is visible on every interactive element and background | screenshot review |
| Accessible names | Buttons, links, inputs, menus, dialogs, and canvas overlays have useful accessible names | DOM/accessibility audit |
| Forms | Labels, error messages, invalid state, recovery, and double-submit behavior are clear | form interaction evidence |
| Dialogs | Focus starts inside the dialog, is trapped while open, and returns to trigger on close | browser interaction evidence |
| Contrast | Essential text meets the project contrast budget in `docs/visual-qa.md` and `docs/performance-budget.md` | computed contrast or screenshot review |
| Motion | Reduced-motion mode disables decorative motion without hiding content | browser evidence |
| Touch | Tap targets are usable on mobile, with no accidental horizontal overflow | mobile screenshot and interaction evidence |
| Non-color signal | Error/success/selection states are not communicated by color alone | screenshot review |
| Game UI | Controls, prompts, HUD, pause, retry, and result screens are readable and not hidden by scene effects | gameplay screenshots |

## 3. Accessibility report table

| Check | Status | Evidence ID/path | Owner | Notes |
|---|---|---|---|---|
| Keyboard navigation | pass | `docs/validation-reports/wb-007-preplay-readiness-proof.json` | Accessibility Owner | Menu choice, Escape Pause and modal controls exercised in browser evidence. |
| Focus visibility | partial | `docs/validation-reports/wb-007-screenshots/wb-007-pause-focus-controller.png` | Accessibility Owner | Visible focused modal action reviewed; full every-control audit remains human-session follow-up. |
| Accessible names | pass | `docs/validation-reports/wb-007-preplay-readiness-proof.json` | Accessibility Owner | Named play modes, graphics choice and Pause/Completion dialogs used by role/test ID locators. |
| Dialog focus containment | pass | `docs/validation-reports/wb-007-preplay-readiness-proof.json`, `docs/validation-reports/wb-007-reduced-effects-coop-route-proof.json` | Accessibility Owner | Pause autofocus/wrap and Completion autofocus verified. |
| Contrast | partial | `docs/validation-reports/wb-007-screenshots/` | Visual QA Reviewer | Readable screenshots reviewed; formal contrast computation remains downstream. |
| Reduced motion / graphics fallback | pass | `docs/validation-reports/wb-007-preplay-readiness-proof.json`, `docs/validation-reports/wb-007-reduced-effects-coop-route-proof.json` | Accessibility Owner | Reduced effects applies in scene and completes the co-op route. |
| Mobile/touch | not_run | `docs/evidence-ledger.md` | Accessibility Owner | Desktop WebGL human playtest route only; mobile is outside current slice. |

Allowed statuses: `not_run`, `pass`, `fail`, `partial`, `blocked`, `not_available`, `not_applicable`.

## 4. Release rule

Public UI/game release cannot be `ready` when keyboard navigation, focus visibility, contrast, names/labels, or mobile touch evidence is missing for the primary flow.
