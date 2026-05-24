# 3D Web Game Readiness Checklist

Use this checklist for project type `game,web3d` before claiming a browser 3D game slice is complete.

## Architecture and agent gates

- [ ] Project type is recorded as `game,web3d` or an equivalent explicit 3D-web scope.
- [ ] Engine/runtime decision is documented: Three.js/R3F, Babylon.js, PlayCanvas, or other.
- [ ] Rendering target and fallback are documented: WebGL2, WebGPU, or progressive enhancement.
- [ ] ECS/data-oriented rules are explicit if the project uses ECS.
- [ ] File boundaries separate game, render, physics, assets, input, network, UI, and dev-only tooling.

## Assets and rendering

- [ ] Asset source/license/budget are recorded for imported 3D models and textures.
- [ ] Runtime GLB/glTF assets are optimized or intentionally left as temporary blockouts.
- [ ] Texture compression/fallback strategy is documented.
- [ ] Loading and failed-asset fallback are player-facing.
- [ ] Normal player screenshots show no missing textures, broken scale, z-fighting, or debug helpers.

## Physics and performance

- [ ] Physics timestep and worker/main-thread boundary are documented.
- [ ] SharedArrayBuffer use, if any, records secure context and cross-origin isolation requirements.
- [ ] Colliders/debug physics are visible only in explicit debug mode.
- [ ] FPS/frame-time or project-defined performance evidence is recorded when performance matters.
- [ ] Disposal/cleanup is checked for route exit/reload.

## Multiplayer and security

- [ ] Client/server trust boundary is documented.
- [ ] Competitive/economy-critical state is server-authoritative or risk-accepted.
- [ ] Room/realm separation is tested for multiplayer scenes.
- [ ] Asset protection claims are realistic: obfuscation/encryption is deterrence, not DRM.

## Browser evidence

- [ ] Browser build/start command was run or marked blocked.
- [ ] Normal player mode screenshot/frame sequence was captured.
- [ ] Debug mode screenshot was captured when debug tools exist.
- [ ] Scene-ready signal exists or screenshot evidence is marked partial for 3D correctness.
- [ ] Console/network/shader/asset errors were inspected.
- [ ] Human playtest, real-device GPU checks, and public URL smoke are downstream release gates unless performed.
