# Dependency Policy — Web3D Prototype

## Approved bootstrap dependencies

| Dependency group | Purpose | Risk | Decision | Evidence |
|---|---|---|---|---|
| React / React DOM | UI application runtime | low | approved for MVP | installation lockfile and build |
| Three / React Three Fiber / Drei | WebGL rendering and helpers | medium | approved for MVP visual scene | canvas evidence and build warning tracking |
| React Three Rapier | local physics bodies and colliders | medium | approved for lightweight MVP physics | browser smoke and later tuning |
| Zustand | local application state | low | approved for lifecycle state | typecheck/build |
| Vite / TypeScript / ESLint | build and static validation | low | approved for local tooling | command results |
| Playwright | system Chromium evidence runner | low | approved for local QA only | browser evidence report |

## Update rule

New runtime dependencies, major-version changes, third-party models, textures or audio must be reviewed for purpose, package/license status, bundle/performance impact and validation coverage before adoption.
