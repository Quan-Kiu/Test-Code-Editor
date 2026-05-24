# Composition QA — WB-001

## Composition review target

Compare real application frames against the approved concept boards for menu, tutorial gameplay, pause and completion. Review the whole frame rather than only component presence.

| Review area | Acceptance expectation |
|---|---|
| Visual dominance | Logo/menu CTA dominate start screen; gameplay keeps characters and route dominant. |
| Spatial balance | Overlay cards leave central play area readable and avoid covering objectives. |
| Rhythm and hierarchy | Large rounded title, medium cards and compact HUD preserve concept-board hierarchy. |
| Center-content preservation | Character, box, bridge and finish gate remain readable beneath overlays. |
| Noise | No diagnostics or excessive text in normal play. |
| Comprehension | Goal and controls are clear during first view. |

## Evidence review table

| State | Expected reference | Actual screenshot | Dominance | Balance | Readability | Noise | Result | Action |
|---|---|---|---|---|---|---|---|---|
| Menu | `design-assets/screens/06-main-menu.webp` | captured during Chromium run | not_run | not_run | not_run | not_run | not_run | capture and inspect |
| Tutorial gameplay | `design-assets/screens/07-zone-1-tutorial.webp` | captured during Chromium run | not_run | not_run | not_run | not_run | not_run | capture and inspect |
| Pause | `design-assets/screens/14-pause-screen.webp` | captured during Chromium run | not_run | not_run | not_run | not_run | not_run | capture and inspect |
| Completion | `design-assets/screens/15-completion-screen.webp` | `docs/validation-reports/wb-004-self-play-screenshots/wb-004-completed.png` | pass | partial | pass | partial | partial | add celebration/characters/reward polish in WB-006 |


## WB-004 review addendum

Door-open and completion comparison results are detailed in `docs/validation-reports/wb-004-composition-review.md`. Zone 5 rope progression is verified through live browser state transitions in `docs/validation-reports/wb-004-self-play.json`; a supplemental intermediate screenshot closes the software-rendered Chromium page in this sandbox and is not treated as final art evidence.
