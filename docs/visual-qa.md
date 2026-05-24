# Visual QA — Approved Reference Comparison

## Visual reference scope

The prototype visual baseline is the registered sixteen-image board set. The highest-priority implementation comparisons for WB-001 are menu, tutorial gameplay, pause and completion screens.

## Review matrix

| Route/state | Design reference | Viewport | Browser evidence | Severity if divergent | Status |
|---|---|---:|---|---|---|
| Menu settled | `design-assets/screens/06-main-menu.webp` | 1440×900 | captured in browser evidence run | high for hierarchy/color break | not_run |
| Zone 1 active | `design-assets/screens/07-zone-1-tutorial.webp` | 1440×900 | captured in browser evidence run | high for HUD/scene readability | not_run |
| Pause | `design-assets/screens/14-pause-screen.webp` | 1440×900 | captured in interaction test | medium for modal layout | not_run |
| Completion | `design-assets/screens/15-completion-screen.webp` | 1440×900 | captured after successful traversal | high for missing result feedback | not_run |
| Buddy rescue direction | `design-assets/screens/10-zone-4-buddy-rescue.webp` | 1440×900 | later Buddy Link story | high for signature mechanic | scheduled |

## Review dimensions

Review layout hierarchy, rounded panel treatment, palette fidelity, character silhouette/readability, camera framing, landmark affordance, text contrast, HUD obstruction and absence of player-facing diagnostics.

## Known bootstrap difference policy

Runtime art uses authored primitive meshes rather than final modeled assets. This difference is accepted for WB-001 when colors, shapes, landmark visibility and player-flow hierarchy remain recognizable. Mechanical fidelity for grab/link/swing is not claimed until later stories.
