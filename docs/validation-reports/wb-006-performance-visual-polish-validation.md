# WB-006 — Performance and Visual Polish Validation

**Status:** validated for local sandbox scope, with performance risks retained  
**Date:** 2026-05-23  
**Route:** `implement-story` / `mvp` / `game,web3d` / L2

## Implemented slice

- Deferred the WebGL/physics scene behind `React.lazy`; the idle menu no longer mounts a Canvas or loads Three/Rapier gameplay code.
- Added play-intent prefetch on hover/focus so a player can begin loading the gameplay chunk before clicking a mode.
- Replaced the menu-only 3D ambience with lightweight CSS sky/title presentation and a height-compact layout.
- Reduced HUD obstruction by showing the context panel only at actionable tutorial, heavy-door, rope and rescue moments.
- Added a CSS-only completion celebration with buddy pair, reward treatment and responsive short-viewport composition.
- Unmounted the WebGL scene/HUD on completion so the result screen stops paying continuous rendering cost and can be captured reliably.
- Tuned locomotion speed from `5.7` to `7.0`; the full door/rope/finish route was rerun to confirm landmarks are not skipped.

## Build measurement

| Build surface | WB-004 baseline | WB-006 result | Interpretation |
|---|---:|---:|---|
| Initial/idle-menu JS gzip | 1,155.59 kB gameplay-loaded-at-menu bundle | **66.04 kB** entry JS gzip | Approximately 94% lower JS required before play intent. |
| CSS gzip | included in prior presentation; not isolated in baseline claim | **4.50 kB** | Lightweight CSS polish cost retained in entry. |
| Deferred WebGL gameplay JS gzip | not deferred | **1,090.31 kB** + **1.18 kB** Rapier helper | Still a large warning-risk chunk after the player elects to play. |

The initial route improves materially, but this is not a claim that total gameplay download or runtime frame performance now meets release budgets.

## Browser/WebGL evidence

### Environment boundary

- Direct-localhost attempt: **blocked** in headed Chromium + Xvfb with `net::ERR_BLOCKED_BY_ADMINISTRATOR`; report: `docs/validation-reports/wb-006-direct-probe.json`.
- Successful evidence browser mode: **headless Chromium + Xvfb fallback**.
- Bridge used: **yes**. The document shell is loaded without localhost navigation, and CSS/entry/dynamic module subresources are fulfilled from exact Vite preview responses fetched from `http://127.0.0.1:4186`; no mock HTML or mock game state was used.

### Initial-load proof

Report: `docs/validation-reports/wb-006-performance-proof.json`

- Idle menu requested only `index-*.css` and `index-*.js`; Canvas absent at idle.
- Hovering Play requested `GameScene-*.js`; clicking then created the gameplay Canvas.
- WebGL: **true**, WebGL2/SwiftShader, `glError=0`.
- Console/page/network errors: **0 / 0 / 0**.
- One-second SwiftShader diagnostic sample: approximately **11.7 fps**. This is recorded as an open performance risk, not a pass against real-device budgets.
- Screenshot: `docs/validation-reports/wb-006-screenshots/wb-006-menu-lightweight.png`.

### Completion regression proof

Report: `docs/validation-reports/wb-006-completion-route-proof.json`

| Checkpoint | Recorded time |
|---|---:|
| Heavy door opened | 11.82 s |
| Rope finale reached | 19.72 s |
| Rope held | 20.02 s |
| Launch triggered | 21.09 s |
| Completion visible | 23.34 s |

- WebGL during gameplay: **true**, WebGL2/SwiftShader, `glError=0`.
- Console/page/network errors: **0 / 0 / 0**.
- Completion screenshot after Canvas disposal: `docs/validation-reports/wb-006-screenshots/wb-006-completion-polished.png`.
- One final rerun closed the page after the door checkpoint before a fresh-display rerun passed; the failed report is retained at `docs/validation-reports/wb-006-completion-route-proof-failure-final-rerun.json` as evidence of sandbox SwiftShader/Xvfb instability.

## Composition review

- Idle menu now fits the evidence viewport without clipping controls and avoids paying for an unseen 3D scene; the tradeoff is intentionally flatter title imagery than the original concept board.
- Completion now carries a clear celebratory hierarchy, buddy pair, earned-star reward and visible retry/menu CTAs in the compact viewport.
- Full art fidelity, audio feedback, higher-detail environment styling and real-device performance remain future work.

## Remaining risks and boundary

- Deferred gameplay chunk remains approximately **1.09 MB gzip**, above the warning target.
- SwiftShader/Xvfb is a constrained software-render diagnostic, not evidence of player-facing frame-rate quality.
- No commit, push, deployment, public-release approval, full co-op validation or real-device playtest was performed.
