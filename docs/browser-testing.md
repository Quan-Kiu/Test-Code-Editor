# Browser Testing — MVP Foundation

## Target route and browser mode

- Player route: `/` served by the real Vite server.
- Game route begins after selecting `Play Solo` or `Local Co-op`.
- Primary automated browser: system Chromium launched through Playwright in headed mode under `xvfb-run` with `--no-sandbox --enable-webgl --use-angle=swiftshader`.
- Fallback only when headed launch is unavailable: headless Chromium under `xvfb-run` using the same WebGL flags.

## Required checks

1. Title screen visually resembles the menu reference and can enter play.
2. Canvas exists, draws at non-zero size, reports WebGL and raises no visible fallback.
3. Keyboard and mouse-driven player flow renders without blocking errors.
4. Pause, respawn, checkpoint and completion player-facing states are captured.
5. No visible developer-only diagnostics appear in normal mode.
6. Captured screenshots are opened and reviewed against the reference boards.

## Evidence report fields

Record browser mode, localhost accessibility, bridge usage, app source, URL, screenshot paths, console/page errors, request failures and WebGL true/false.

## WB-006 sandbox bridge boundary

For the current sandbox, headed Chromium + Xvfb direct navigation to the local Vite preview server is blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`. The retained validation fallback is headless Chromium + Xvfb with the real-server-byte bridge: the document shell is loaded without local navigation and CSS/entry/dynamic module responses are fetched from the actual Vite preview server and delivered to Chromium unchanged. This is not mock gameplay.

Use a fresh Xvfb display for each long SwiftShader route run:

```bash
REAL_SERVER_URL=http://127.0.0.1:<port> xvfb-run -a node scripts/wb006-performance-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<port> xvfb-run -a node scripts/wb006-completion-route-proof.mjs
```

Retain failures as well as passes when software-render context closure occurs; the latest WB-006 failure-before-pass is recorded in `docs/validation-reports/wb-006-completion-route-proof-failure-final-rerun.json`.

## WB-005 local co-op and Gamepad API evidence

WB-005 retains the same sandbox browser boundary as WB-006: headed Chromium + Xvfb proves direct localhost is blocked, while passing gameplay evidence uses headless Chromium + Xvfb through the real-Vite-byte bridge. The bridge supplies the actual Vite preview document dependencies and dynamic chunks; it does not mock game state or render output.

Required WB-005 evidence paths:

```bash
REAL_SERVER_URL=http://127.0.0.1:<port> xvfb-run -a node scripts/wb005-rescue-practice-regression.mjs
REAL_SERVER_URL=http://127.0.0.1:<port> xvfb-run -a node scripts/wb005-shared-camera-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<port> xvfb-run -a node scripts/wb005-coop-route-proof.mjs
```

The Player 2 automation replaces `navigator.getGamepads()` with a virtual browser Gamepad API state inside real Chromium so input wiring and in-app movement can be measured. This proof must not be described as physical-controller signoff or human co-op playtest evidence.

## WB-007 pre-playtest readiness evidence

WB-007 adds controller-presence messaging, a Reduced effects setting and focus-contained Pause/Completion dialogs. Short readiness and rescue checks should first be attempted with headed Chromium + Xvfb through the real-server-byte bridge. Long SwiftShader route sessions may close a headed page intermittently; retain any failure report and use headless Chromium + Xvfb fallback on a fresh display for the long functional proof.

```bash
REAL_SERVER_URL=http://127.0.0.1:<safe-port> WB_HEADED=true xvfb-run -a node scripts/wb007-preplay-readiness-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<safe-port> WB_GRAPHICS_PRESET=reduced xvfb-run -a node scripts/wb005-coop-route-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<safe-port> xvfb-run -a node scripts/wb005-coop-route-proof.mjs
```

Record browser mode, direct-localhost result, bridge use, app source, WebGL state, graphics preset, screenshot paths, browser error arrays and whether virtual Gamepad or physical gamepad generated input. Virtual Gamepad evidence is never physical-controller or human-playtest signoff.


## WB-008 / WB-010 corrective evidence

WB-008 validates lower jump/movement feedback, raised-hand grab/link state and the upright switch target through real Chromium/WebGL evidence. WB-010 validates only the edge-fall recovery behavior: a real physics push sends the crate beyond the ledge, the crate returns, and the falling player automatically returns to a playable checkpoint with readable messaging. This is not a comprehensive collision-system signoff.

Required evidence paths:

- `docs/validation-reports/wb-008-feedback-proof.json`
- `docs/validation-reports/wb-008-buddy-link-proof.json`
- `docs/validation-reports/wb-008-marker-proof.json`
- `docs/validation-reports/wb-010-edge-recovery-proof.json`
- `docs/validation-reports/wb-005-coop-route-proof.json`

Record browser mode, blocked direct-localhost result, bridge use, real preview source, WebGL state, error arrays and screenshots. The long co-op route may complete and write evidence before the Xvfb wrapper exits; retain the written report and note wrapper teardown behavior rather than misreporting app failure.
