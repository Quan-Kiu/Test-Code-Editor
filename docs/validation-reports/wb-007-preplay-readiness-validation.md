# WB-007 — Pre-Playtest Readiness Hardening Validation

Status: **pass with physical-controller, human-playtest and performance risks**  
Date: 2026-05-23  
Route: `implement-story` · Mode: `mvp` · Project type: `game,web3d` · Quality: `L2`

## Implemented slice

- Restored `docs/tool-permissions.md` with conservative local-validation boundaries.
- Added Player 2 controller-presence UI while keeping keyboard fallback explicit.
- Added Standard and Reduced effects presets; Reduced effects lowers internal render DPR to `0.6` and reduces render effects without modifying route or physics success conditions.
- Added autofocus, focus wrapping and restoration behavior for Pause and Completion dialogs.
- Isolated the deferred WebGL/physics runtime bundle from UI and scene glue for honest size measurement.

## Static and build evidence

| Check | Result |
|---|---|
| `npm run lint` | pass |
| `npm run typecheck` | pass |
| `npm run build` | pass; deferred runtime warning retained |
| Menu/UI entry JS | **62.20 kB gzip** |
| CSS | **4.95 kB gzip** |
| Deferred scene glue | **6.58 kB gzip** |
| Deferred WebGL/physics runtime | **1,089.19 kB gzip** |

## Browser evidence boundary

| Field | Evidence |
|---|---|
| Direct browser mode | headed Chromium + Xvfb |
| Localhost direct | blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`; `wb-007-direct-probe.json` |
| Short interactive evidence | headed Chromium + Xvfb bridge when stable; fallback retained where wrapper/page stability required |
| Long route evidence | headless Chromium + Xvfb fallback through real-server-byte bridge |
| App source | real Vite preview bytes; no mocked HTML/game state |
| WebGL | WebGL2 / SwiftShader, `glError=0` in passing proofs |
| Browser errors in pass evidence | `0` console / `0` page / `0` network failures |

## Readiness interaction proof

| Area | Result | Evidence |
|---|---|---|
| Controller-status UI | keyboard fallback becomes controller-ready under browser Gamepad API input | `wb-007-preplay-readiness-proof.json`, `wb-007-menu-controller-quality.png` |
| Reduced effects application | selected preset reaches WebGL scene and remains playable | `wb-007-preplay-readiness-proof.json`, `wb-007-reduced-effects-gameplay.png` |
| Pause accessibility | autofocus and forward/backward focus wrap pass | `wb-007-preplay-readiness-proof.json`, `wb-007-pause-focus-controller.png` |
| Completion accessibility | completion autofocus pass after reduced-effects route | `wb-007-reduced-effects-coop-route-proof.json`, `wb-007-reduced-effects-completion.png` |
| Rescue regression | Co-op Rescue still opens its hanging-buddy setup | `wb-005-rescue-practice-regression.json` |
| Standard co-op regression | both buddies complete the standard route | `wb-005-coop-route-proof.json` |

## Route measurements

| Route | Door | Rope | Launch | Completion | Result |
|---|---:|---:|---:|---:|---|
| Local Co-op Run — Reduced effects | 16.29 s | 22.97 s | 24.02 s | 26.23 s | pass |
| Local Co-op Run — Standard | 21.61 s | 31.52 s | 33.23 s | 36.12 s | pass |

## Performance boundary

Reduced effects completed the same functional route and yielded an approximately **11.8 fps** SwiftShader/Xvfb sample in the retained readiness proof. This is functional sandbox evidence only; no performance improvement is claimed. It does not meet a release frame-rate claim and does not replace profiling on actual target hardware.

## Remaining required human evidence

- Physical gamepad mapping, reconnect and dead-zone behavior.
- Two-person rescue and full-run comprehension/comfort observations.
- Real target-device GPU performance for Standard and Reduced effects.
- Release visual/audio/polish acceptance.

WB-007 is validated for entry into human playtesting, not for release.


- Production sourcemaps are disabled in the playtest artifact because repeated map generation for the large deferred WebGL runtime stalled sandbox builds; this does not remove the open runtime payload/performance risk.
