# WB-004 Full Traversal and Finale Validation

Status: **pass with documented browser-evidence limitation**  
Date: 2026-05-23  
Story: `WB-004 — Full Traversal and Finale`

## Validated outcome

The Play Solo route is playable from Zone 1 through Zone 5 on the real built app:

1. The player crosses the tutorial yard and bridge after aligning the new camera-relative route view.
2. The Zone 3 floor switch opens the heavy door and displays player-facing open-path feedback.
3. The player reaches the Zone 5 rope marker, holds a grab hand, releases the rope and receives bounded launch feedback.
4. The player reaches the glowing finish gate and receives the `Great wobble!` completion overlay.

## Real-browser proof

| Item | Evidence |
|---|---|
| Browser mode used for successful traversal | **headless Chromium + Xvfb fallback** |
| Direct localhost probe | **blocked** in headed Chromium + Xvfb: `net::ERR_BLOCKED_BY_ADMINISTRATOR` |
| Bridge used | **yes** |
| App source | Real Vite preview server bytes from `http://127.0.0.1:4182` loaded through the retained fetch/content bridge; no mock HTML |
| WebGL | `available: true`; WebGL2 via SwiftShader; `glError: 0` |
| Console/page/network errors | `0 / 0 / 0` in the successful traversal report |
| Machine-readable run report | `docs/validation-reports/wb-004-self-play.json` |
| Completion screenshot | `docs/validation-reports/wb-004-self-play-screenshots/wb-004-completed.png` |
| Door-open screenshot | `docs/validation-reports/wb-004-self-play-screenshots/wb-004-door-open-latest.png` |
| Direct-navigation report | `docs/validation-reports/wb-004-correction-direct-probe.json` |

## Timed interaction evidence

The successful real-app run recorded these DOM-visible gameplay states:

| State | Time in report |
|---|---:|
| Play Solo started | 4.46 s |
| Camera aligned for camera-relative route traversal | 6.63 s |
| Heavy door opened | 13.24 s |
| Rope finale marker reached | 22.75 s |
| Rope acquired with left hand | 22.95 s |
| Rope released / launch feedback visible | 24.02 s |
| Completion overlay visible | 26.64 s |

## Evidence limitation retained honestly

The successful full traversal avoids intermediate full-page screenshots during the long SwiftShader session. Attempting an additional Zone 5 screenshot after a long render caused the Chromium page/context to close in this sandbox, while the same route without that intermediate capture completed and saved the final screenshot. Door, rope and launch progression are therefore evidenced by timed browser-visible text in `wb-004-self-play.json`, with rendered screenshots retained for the door-open and completion states.

The Playwright test spec has been updated to align the camera-relative route and avoid heavy intermediate screenshots, but the full Playwright reporter/trace runner is not claimed as passed in this constrained environment.

## Remaining risks / follow-up

- Bundle remains large at approximately `3,373.11 kB` minified / `1,155.59 kB` gzip.
- Full five-zone local co-op/gamepad-only traversal remains unvalidated.
- Human/device playtesting and richer art polish remain downstream work.
