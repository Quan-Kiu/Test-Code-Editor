# 3D Browser Testing and Visual Regression

Use this guide for WebGL/WebGPU canvas testing, visual regression, headed/headless browser evidence, and performance
observability for 3D web games.

## 1. Canvas testing problem

A broken shader, missing texture, wrong camera, bad shadow, or invisible model may not change the DOM. DOM-only tests are
not sufficient for 3D apps. Browser evidence must include screenshots or frame sequences of the real canvas.

## 2. Scene ready sentinel

3D tests should wait for a product-owned readiness signal before screenshots. Prefer one of:

```js
canvas.dataset.ready = '1'
document.documentElement.dataset.sceneReady = '1'
window.__GAME_READY__ = true
```

The ready signal should be set only after the first stable render has completed and critical assets are loaded or a
player-facing fallback is shown. If no ready signal exists, tests may still capture screenshots, but the evidence is
`partial` for 3D correctness.

## 3. Required screenshot states

Capture at least:

| State | Evidence |
|---|---|
| Loading | progress or intentional loading screen. |
| First stable render | normal player route after scene-ready signal. |
| Interaction | movement/camera/select/hover/drag/tap frame. |
| Failure/fallback | WebGL/WebGPU unavailable or asset load failure when practical. |
| Debug route | physics/debug overlay only behind explicit debug URL when applicable. |
| Player route | no debug overlays or developer text. |
| Responsive/mobile | target mobile/tablet/desktop viewports and orientation when relevant. |

## 4. Visual regression policy

Use Playwright screenshot comparison when the project has stable visuals and a known environment. Keep baselines tied to
the same OS/browser/rendering mode where possible. For animated scenes, use deterministic seed/camera/time freeze or a
small sequence of representative frames.

Do not update baselines casually. A visual baseline update should explain the intentional design or rendering change.

## 5. Headless, headed, and GPU caveats

Headless browser tests are useful for fast smoke checks. Some CI/Linux environments may render WebGL/WebGPU differently or
lack GPU acceleration. If headless evidence is inconclusive, run a headed browser path with a display server such as Xvfb
when available, or mark GPU evidence as `blocked` and move it to local/developer-machine validation.

## 6. WebGPU/WebGL feature checks

3D evidence should record:

- WebGL/WebGL2 context availability;
- `navigator.gpu` availability when WebGPU is claimed;
- selected renderer/backend when the engine exposes it;
- fallback path when WebGPU is unavailable;
- console warnings/errors from shader compilation, context loss, and asset loading.

## 7. Performance evidence

For performance-sensitive 3D work, record project-defined budgets or best available proxies:

- FPS or frame time in normal player mode;
- draw calls, triangles, texture memory, active materials, or engine stats when exposed;
- network size and largest 3D assets;
- worker/main-thread symptoms for physics-heavy scenes;
- memory/disposal behavior after route exit/re-entry;
- mobile low-power and reduced-motion behavior when in scope.

Chrome DevTools MCP or equivalent browser instrumentation may be used when available, but absence of MCP does not block
sandbox completion. It does block claims that rely on low-level browser performance truth if no alternative evidence was
collected.

## 8. Recommended commands

```bash
node scripts/browser-evidence.mjs --self-check
PROJECT_TYPE=game,web3d node scripts/browser-evidence.mjs --url http://localhost:3000 --project-type game,web3d --debug-url http://localhost:3000?debug=1
PROJECT_TYPE=game,web3d APP_URL=http://localhost:3000 DEBUG_URL=http://localhost:3000?debug=1 npx playwright test
```

If Playwright is unavailable, record `blocked` and do not claim browser pass.
