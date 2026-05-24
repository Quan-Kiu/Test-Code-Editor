# Testing Strategy — Wobble Buddies MVP

## Test layers

| Layer | Purpose | Command / evidence | Current scope |
|---|---|---|---|
| Static validation | Type safety and lint integrity | `npm run typecheck`, `npm run lint` | required for WB-001 |
| Production build | Validate app packaging | `npm run build` | required for WB-001 |
| Harness evidence pack | Verify browser collection tooling | `npm run validate:browser-pack` | required for WB-001 |
| Design asset registry | Verify approved references exist | `npm run validate:design-assets:required` | required for WB-001 |
| WebGL readiness | Canvas, WebGL and normal-mode error check | `npm run test:browser:web3d` | required when local server runs |
| Interaction flow | Menu, play, pause and co-op-entry behavior | `tests/browser/foundation-flow.spec.mjs` | required for WB-001 |
| Playability tuning | Five-zone mechanical completion and gamepad flow | later WB-002 through WB-005 | not in bootstrap acceptance |

## Principles

Tests must load the real Vite-served application in system Chromium with WebGL flags. DOM-only checks do not prove 3D correctness. Normal player evidence must contain no developer-only panels. Screenshot review compares player route frames to `DESIGN.md` and registered concept boards.

## Bootstrap execution record

| Date | Story | Static/build | Browser/WebGL | Visual review | Outcome |
|---|---|---|---|---|---|
| 2026-05-23 | WB-001 | passed after source fixes | scheduled in this route | scheduled after capture | in_progress |
