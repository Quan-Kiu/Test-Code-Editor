# Performance Budget — Desktop WebGL MVP

WB-007 is validated for local pre-playtest entry only. Build-size and comparative fallback behavior are measured here; real-device frame profiling and public Core Web Vitals remain downstream evidence rather than inferred results.

## 1. Web UI budgets

| Metric | Target | Warning threshold | Blocking threshold | Current evidence |
|---|---:|---:|---:|---|
| LCP | ≤ 2.5 s on production-like desktop | > 2.5 s | > 4.0 s before public release | not_run in sandbox; requires hosted/performance capture |
| INP | ≤ 200 ms | > 200 ms | > 500 ms before public release | not_run in sandbox; requires real interaction profiling |
| CLS | ≤ 0.10 | > 0.10 | > 0.25 before public release | not_run in sandbox; gameplay overlays reviewed visually |
| Idle-menu entry JS gzip | ≤ 100 kB goal | > 100 kB | > 250 kB before public release review | **62.20 kB gzip** after WB-007 readiness UI and runtime segmentation; pass for sandbox menu entry |
| Deferred gameplay/WebGL JS gzip | ≤ 750 kB goal | > 750 kB | > 1.25 MB before public release review | **6.58 kB gzip** scene glue plus **1,089.19 kB gzip** deferred WebGL/physics runtime after player intent; warning/open risk |

## 2. API/backend budgets

No API, backend, persistence, authentication or network gameplay service exists in this local MVP route. Backend latency, error-rate and throughput budgets are **not_applicable** until such a boundary is introduced.

## 3. Game and Web3D budgets

| Metric | Target | Warning threshold | Blocking threshold | Current evidence |
|---|---:|---:|---:|---|
| Stable FPS | 60 fps preferred | under 45 sustained | under 30 sustained before player-facing release | **11.8 fps approximate** one-second SwiftShader/Xvfb Reduced effects sample in the retained WB-007 proof; diagnostic only, fails any player-facing performance claim |
| Frame time p95 | ≤ 22 ms desktop goal | > 22 ms | > 33 ms before release | not_run; one-second software-render FPS sample is not a p95 frame-time profile |
| Dynamic rigid bodies in MVP scene | fewer than 8 | 8–16 | over 16 without review | small bounded player/prop set by scene inspection |
| Draw calls | under 150 goal | 150–250 | over 250 without review | not_run; renderer diagnostics downstream |
| Route load/page errors | 0 | 1 non-critical | any blocking error | WB-007 Standard and Reduced effects co-op bridge proofs recorded **0 console/page/network errors** on passing runs |
| Canvas fallback rate | 0% on desktop target | any fallback investigation | visible fallback during claimed WebGL run | WB-007 Standard/Reduced route proofs recorded WebGL2/SwiftShader with `glError=0`; menu intentionally defers Canvas until play intent |

## 4. Performance evidence log

| Date | Story | Environment | Evidence | Result | Remaining risk |
|---|---|---|---|---|---|
| 2026-05-23 | WB-002/WB-003 | Headed Chromium/Xvfb, SwiftShader, real-server bridge | `docs/validation-reports/wb-002-003-webgl-evidence.md` | WebGL canvas rendered without recorded page/console errors | Bundle remains large; full traversal not covered in that run. |
| 2026-05-23 | WB-004 | Vite production build in sandbox | `npm run build` | JS output 3,373.11 kB minified / 1,155.59 kB gzip | Code splitting/performance profiling required before public route. |
| 2026-05-23 | WB-004 | Headless Chromium + Xvfb fallback, SwiftShader, real-server bridge | `docs/validation-reports/wb-004-full-traversal-validation.md` | Five-zone solo traversal completed; WebGL2 `glError=0`; zero console/page/network errors | Direct localhost and intermediate Zone 5 screenshot capture remain sandbox limitations. |
| 2026-05-23 | WB-006 | Vite production build in sandbox | `npm run build` | Idle-menu entry: **210.29 kB / 66.04 kB gzip** JS; CSS **15.79 kB / 4.54 kB gzip**; WebGL scene deferred to intent: **3,162.94 kB / 1,090.31 kB gzip** | Initial payload improved materially; gameplay chunk remains above warning threshold. |
| 2026-05-23 | WB-006 | Headless Chromium + Xvfb fallback, SwiftShader, real-server dynamic-subresource bridge | `docs/validation-reports/wb-006-performance-proof.json`, `docs/validation-reports/wb-006-completion-route-proof.json` | Menu has no Canvas at idle; intent loads GameScene; solo route completes with WebGL2 `glError=0`; no console/page/network errors | Software renderer sample (~11.7 fps) is not acceptable release-performance evidence. |
| 2026-05-23 | WB-005 | Headless Chromium + Xvfb fallback, SwiftShader, real-server dynamic-subresource bridge | `docs/validation-reports/wb-005-coop-route-proof.json` | Three-mode UI plus two-body route retains deferred chunk boundary; WebGL2 `glError=0`; no recorded browser errors | Payload remains over warning threshold; physical gamepad/runtime FPS downstream. |
| 2026-05-23 | WB-007 | Vite production build in sandbox | `npm run build`, `docs/validation-reports/wb-007-preplay-readiness-validation.md` | Menu **62.20 kB gzip**; scene glue **6.58 kB gzip**; deferred WebGL/physics runtime **1,089.19 kB gzip** | Runtime remains above warning threshold; segmentation is measurement, not removal. |
| 2026-05-23 | WB-007 | Chromium + Xvfb real-server-byte bridge, SwiftShader | `docs/validation-reports/wb-007-preplay-readiness-proof.json`, `docs/validation-reports/wb-007-reduced-effects-coop-route-proof.json` | Reduced effects applies and completes co-op route; sample approx. **11.8 fps**; WebGL2 `glError=0`; no pass-run browser errors | Diagnostic software-render comparison only; real GPU and human-session evidence required. |

## Follow-up decision

WB-007 validates a pre-playtest fallback and honest runtime segmentation: WebGL/physics remains deferred until play intent, and Reduced effects reduces sandbox render pressure while preserving completion. Public/enduser readiness remains `not_ready`: the deferred runtime is still over 1 MB gzip and SwiftShader evidence is not a real-device frame-rate claim.


- Production sourcemaps are disabled in the playtest artifact because repeated map generation for the large deferred WebGL runtime stalled sandbox builds; this does not remove the open runtime payload/performance risk.
