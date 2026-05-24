# Design Assets Registry — Wobble Buddies

## Registry source

`design-assets/manifest.json` is the authoritative inventory of sixteen approved prototype concept boards. Assets are project-created visual references, not copied third-party game assets and not runtime substitutes for the real scene.

## Implementation reference map

| Area | Manifest ID | Image path | Status | Implementation target | Risk |
|---|---|---|---|---|---|
| Brand system | `02.design.system` | `design-assets/brand/02-design-system.webp` | approved | CSS tokens and rounded component language | low |
| Character silhouettes | `03.character.sheet` | `design-assets/brand/03-character-sheet.webp` | approved | 3D blue/coral buddy primitives | medium |
| Menu | `06.main.menu` | `design-assets/screens/06-main-menu.webp` | approved | Start menu composition | medium |
| Active gameplay HUD | `07.zone.1.tutorial` | `design-assets/screens/07-zone-1-tutorial.webp` | approved | HUD and initial scene | medium |
| Pause | `14.pause.screen` | `design-assets/screens/14-pause-screen.webp` | approved | Pause dialog | low |
| Completion | `15.completion.screen` | `design-assets/screens/15-completion-screen.webp` | approved | Result dialog | low |
| Prototype loop | `16.prototype.flow` | `design-assets/flows/16-prototype-flow.webp` | approved | State-flow traceability | medium |

## Usage policy

Runtime uses coded geometry and UI components. Screenshot evidence from the real browser is compared with these boards; it is never replaced by the board image itself. Any future imported asset requires source and license review.

## Visual QA mapping

| Expected manifest ID | Expected image | Actual browser screenshot | Viewport/state | Result | Difference / defect |
|---|---|---|---|---|---|
| `06.main.menu` | `design-assets/screens/06-main-menu.webp` | generated during evidence run | desktop/menu | not_run | inspect after capture |
| `07.zone.1.tutorial` | `design-assets/screens/07-zone-1-tutorial.webp` | generated during evidence run | desktop/gameplay | not_run | inspect after capture |
| `14.pause.screen` | `design-assets/screens/14-pause-screen.webp` | generated during evidence run | desktop/paused | not_run | inspect after capture |
