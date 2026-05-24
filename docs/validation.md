# Validation — Wobble Buddies Foundation

## Local commands

| Command | Purpose | Expected for WB-001 |
|---|---|---|
| `npm run lint` | Source lint check | pass |
| `npm run typecheck` | TypeScript safety | pass |
| `npm run build` | Vite production build | pass |
| `npm run validate:browser-pack` | Harness evidence pack self-check | pass |
| `npm run test:browser:web3d` | Canvas/WebGL readiness against real app route | pass when server and Chromium available |
| `npm run test:browser:buddy-rescue` | WB-002/WB-003 automated regression path | implemented; currently times out under headed SwiftShader/report overhead in this sandbox |
| `node scripts/browser-evidence.mjs ... --no-component-shots --no-keyboard-probe` | Retained WB-002/WB-003 WebGL evidence through real-server bridge | pass: see `docs/validation-reports/wb-002-003-webgl-evidence.md` |
| `node scripts/wb004-controls-proof.mjs` with `REAL_SERVER_URL` | WB-004A grounded jump/orbit/facing proof via real-server bridge | pass in headless Chromium + Xvfb fallback; see `docs/validation-reports/wb-004a-control-feel-validation.md` |
| `node scripts/wb004-self-play.mjs` with `REAL_SERVER_URL` and `WB_BROWSER_MODE=headless-fallback` | WB-004 solo door → rope → finish proof via real-server bridge | pass report saved in `docs/validation-reports/wb-004-self-play.json`; see `docs/validation-reports/wb-004-full-traversal-validation.md` |
| `npm run validate:project:mvp:web3d` | Playbook project validation | pass in the current WB-004 handoff |
| `npm run test:browser:performance-polish` with `REAL_SERVER_URL` under fresh Xvfb | WB-006 idle-menu lazy-load and WebGL boundary proof via real-server-byte bridge | pass: see `docs/validation-reports/wb-006-performance-proof.json` |
| `npm run test:browser:completion-polish` with `REAL_SERVER_URL` under fresh Xvfb | WB-006 completion regression after polish | pass on fresh-display rerun; one failed rerun retained as sandbox instability evidence |

| `npm run test:browser:rescue-practice-regression` with `REAL_SERVER_URL` under fresh Xvfb | WB-005 regression that preserves the validated Zone 4 `Co-op Rescue` entry | pass: see `docs/validation-reports/wb-005-rescue-practice-regression.json` |
| `npm run test:browser:shared-camera` with `REAL_SERVER_URL` under fresh Xvfb | WB-005 Player 2 virtual Gamepad wiring and shared-camera opened-door proof | pass: see `docs/validation-reports/wb-005-shared-camera-proof.json` |
| `npm run test:browser:local-coop-run` with `REAL_SERVER_URL` under fresh Xvfb | WB-005 both-buddy five-zone completion proof | pass within virtual browser Gamepad boundary; physical-controller and human co-op evidence remain downstream |

## Browser target

Desktop Chromium with WebGL enabled. Automated evidence must use the actual Vite-served application, capture console/page errors, report WebGL status, and save screenshots for review.

## WB-007 pre-playtest readiness evidence

| Command / path | Scope | Current result |
|---|---|---|
| `npm run test:browser:preplay-direct` with `REAL_SERVER_URL` under headed Xvfb | Direct-localhost boundary | documented blocked: `ERR_BLOCKED_BY_ADMINISTRATOR` |
| `npm run test:browser:preplay-readiness` with `REAL_SERVER_URL` under fresh Xvfb | Controller badge, Reduced effects, Pause focus containment, WebGL | pass; see `docs/validation-reports/wb-007-preplay-readiness-proof.json` |
| `WB_GRAPHICS_PRESET=reduced npm run test:browser:local-coop-run` with `REAL_SERVER_URL` | Reduced-effects route and Completion autofocus | pass; see `docs/validation-reports/wb-007-reduced-effects-coop-route-proof.json` |
| `npm run test:browser:local-coop-run` with `REAL_SERVER_URL` | Standard-route regression after readiness changes | pass; see `docs/validation-reports/wb-005-coop-route-proof.json` |

These proofs establish sandbox readiness for a human playtest session only. Physical controller behavior, human co-op usability and real-device/GPU performance remain required outside this environment.

## WB-011 human-playtest execution kit

| Artifact / check | Scope | Current result |
|---|---|---|
| `docs/playtest-session-template.md` | Anonymous real-session capture for PT-WB-001/002/003 | pass |
| `docs/playtest-issue-triage.md` | Severity, reproduction and stop/continue decision guidance | pass |
| `docs/playtest-results/README.md` | No-PII storage and naming rules | pass |
| `docs/validation-reports/wb-011-human-playtest-kit-validation.md` | Cross-check against remaining pre-release risks | pass |

WB-011 does not alter the already evidenced game artifact. The next required validation remains real two-person sessions with a physical controller and target-device observations; their status is `not_run` until supplied.

