# Wobble Buddies: Playground

Browser-based 3D physics co-op prototype bootstrap built from the product brief, 16 approved concept boards, and the adopted agent engineering harness.

## Stack

- Vite + TypeScript + React
- React Three Fiber + Drei
- Rapier physics through `@react-three/rapier`
- Zustand state management
- Playwright / Chromium evidence runner

## Foundation slice available

The current slice contains a pastel 3D playground shell, title menu, solo/local co-op mode selection, HUD, pause/completion overlays, shared camera, player movement/jump/respawn, physics crates, five zone landmarks, checkpoint/finish sensors, and a visual Buddy Link foundation indicator.

Buddy Link physical rescue constraints, tuned rope swinging, complete heavy-door puzzle logic, visual polish to concept-board fidelity, and performance optimization are intentionally not claimed complete in this bootstrap.


## Continue in a new session

Start with [`NEXT_SESSION.md`](NEXT_SESSION.md) for the current status, deferred Git sync, exact next task (`GrabSystem` + `BuddyLinkSystem` rescue slice), acceptance criteria and Chromium/WebGL evidence requirements.

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run typecheck
npm run lint
npm run build
npm run validate:browser-pack
npm run validate:design-assets:required
npm run validate:project:mvp:web3d
```

The project includes Chromium evidence scripts and reports under `docs/validation-reports/`. In the validation sandbox, browser navigation to localhost was administratively blocked, so a CDP/fetch bridge loads the exact HTML/CSS/JS responses from the real Vite preview server into Chromium for evidence capture. No mock gameplay document is used.

## Key locations

- `src/` — app and WebGL scene implementation
- `design-assets/` — registered design reference set and manifest
- `docs/` — harness documentation, plans, architecture, and QA evidence
- `tests/browser/` — real Chromium interaction checks

### Chromium/WebGL evidence in this sandbox

Start the real preview server, then run the bridge evidence command under headed Chromium with Xvfb:

```bash
npm run build
npm run preview
# in another terminal
xvfb-run -a env CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run browser:evidence:game:bridge
xvfb-run -a env PW_HEADED=1 APP_URL=http://bridge.invalid/ REAL_SERVER_URL=http://127.0.0.1:4173 CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser:web3d
```

The direct evidence command remains available to show whether the environment permits navigation to the preview server:

```bash
xvfb-run -a env CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run browser:evidence:game:direct
```
