# Bootstrap Validation Report — WB-001

## Scope delivered

Foundation slice for **Wobble Buddies: Playground** under harness route `bootstrap-new-project`, mode `mvp`, runtime `generic`, project type `game,web3d`.

Implemented in this slice:

- Real React Three Fiber + Rapier WebGL scene served by Vite.
- Pastel UI shell aligned to the approved design direction: title menu, solo/local co-op choices, HUD, pause and completion overlays.
- Player movement, jump, respawn, shared camera foundation, physics crates and five zone landmarks.
- Checkpoint and finish-zone sensors, plus Buddy Link visual/proximity foundation.
- Registered reference package of 16 generated design boards in `design-assets/manifest.json`.

Not claimed complete:

- Tuned Buddy Link physical rescue constraint, robust grab joints and fully playable rope swing.
- Completed heavy-door puzzle logic and end-to-end level completion tuning.
- Concept-board level scene fidelity, performance budget completion or production release readiness.

## Harness adoption

| Check | Result | Evidence |
|---|---|---|
| Harness dry-run selection | pass; 117 selected files | `docs/validation-reports/logs/harness-dry-run.txt` |
| Non-destructive harness merge | pass; 117 copied, 0 overwritten project files | `docs/validation-reports/logs/harness-merge.txt` |
| Browser evidence pack self-check | pass | `docs/validation-reports/logs/browser-pack-validation.log` |
| Design asset registry | pass; required assets present | `docs/validation-reports/logs/design-assets-validation.log` |
| MVP Web3D project validation | pass; 55 required paths checked | `docs/validation-reports/logs/project-validation.log` |

## Build validation

| Command | Result | Note |
|---|---|---|
| `npm run typecheck` | pass | TypeScript project builds without type errors. |
| `npm run lint` | pass | ESLint passes after browser-bridge and sensor fixes. |
| `npm run build` | pass with warning | Production build succeeds; bundled 3D JS is approximately 3.36 MB minified / 1.15 MB gzip and requires later code-splitting/performance work. |

## Browser / WebGL evidence

| Evidence | Result |
|---|---|
| Browser mode | Chromium headed under `xvfb-run` |
| Chromium launch flags | `--no-sandbox --enable-webgl --use-angle=swiftshader --disable-gpu-sandbox` |
| Localhost direct | **blocked**: `ERR_BLOCKED_BY_ADMINISTRATOR` on `http://127.0.0.1:4173/` |
| Bridge used | yes — CDP/fetch content bridge |
| App source | real Vite preview server; exact HTML/CSS/JS responses were loaded into Chromium because direct navigation is blocked |
| WebGL | `true`; `WebGL2RenderingContext`; renderer reports ANGLE SwiftShader |
| GL error | `0` |
| Scene readiness | `renderMode=webgl`, `sceneReady=true` |
| Console/page errors | `0` in passing browser evidence run |
| Network failures | `0` in passing browser evidence run |

Evidence files:

- Functional/WebGL report: `docs/validation-reports/browser-evidence.md`
- Direct-navigation blocker proof: `docs/validation-reports/browser-evidence-direct-blocked.md`
- Real render screenshot: `docs/validation-reports/browser-screenshots/player-desktop-1440x900.png`
- Flow screenshots: `docs/validation-reports/browser-screenshots/flows/`

## Defect fixed during evidence run

Initial browser interaction exposed an incorrect zone transition because dynamic physics crates triggered zone sensors. Zone and checkpoint sensor callbacks now filter intersections to named player rigid bodies only, keeping the opening HUD at Zone 1 until a player enters another zone.

## Current quality status

**Bootstrap foundation: validated.** Functional browser/WebGL evidence is present. **Visual fidelity and gameplay tuning remain partial** and are tracked as follow-on work in the design comparison and sandbox playability notes.
