# Wobble Buddies: Playground — WB-011 Human Playtest Execution Kit Handoff

## Current readiness status

All locally addressable pre-playtest corrective slices through WB-010 remain validated in the sandbox. WB-011 adds the ready-to-use, privacy-safe execution kit for the next non-sandbox gate. **No real participant session or physical-controller acceptance has been performed yet.**

## Start here for the next session

1. Copy `docs/playtest-session-template.md` for an anonymous participant pair/device.
2. Follow `docs/playtest-protocol.md` in order: PT-WB-001 Rescue comprehension, PT-WB-002 Standard full co-op, then PT-WB-003 Reduced effects comparison.
3. Classify findings with `docs/playtest-issue-triage.md`.
4. Store only anonymized completed sheets under `docs/playtest-results/`; do not put identifying participant data or consent-controlled media in the handoff.
5. Return issue rows and session disposition so the next focused fix story can be scoped from real evidence.

## Required human evidence still not run

- Physical controller mapping, dead-zone and reconnect behavior.
- Two-person understanding of raised-hand/Buddy Link and crate/player recovery.
- Camera, movement, jump and collision feel during Standard co-op completion.
- Standard versus Reduced effects comparison on a real device/GPU.

## Final build measurement

| Surface | Gzip |
|---|---:|
| Menu/UI entry JS | **62.34 kB** |
| CSS | **5.04 kB** |
| Deferred scene glue | **7.10 kB** |
| Deferred WebGL/physics runtime | **1,089.19 kB** |

The runtime payload remains an open release-performance risk.

## WB-008 / WB-010 outcomes to observe with people

- Is movement noticeably smoother and the lower jump height still satisfying/reachable?
- Do players understand the raised-hand grab/Buddy Link state without explanation?
- When a crate falls and returns, is the feedback immediately understandable?
- When a player falls while pushing near an edge, does the automatic recovery feel forgiving rather than disruptive?
- Are there any remaining snag points, unexpected collisions or camera discomfort during co-op traversal?

## Browser evidence boundary

- Direct localhost is blocked in headed Chromium + Xvfb with `ERR_BLOCKED_BY_ADMINISTRATOR`.
- Short WB-008 interaction proofs pass through a headed Chromium + Xvfb real-server-byte bridge.
- Long or fall-heavy route proofs retain headless Chromium + Xvfb fallback evidence through the same real-byte bridge.
- Final proof build source: `http://127.0.0.1:4243`; final assets: `index-T5g-1raI.js`, `GameScene-gkvibftF.js`, `gameplay-webgl-runtime-HJx64JbS.js`.
- Virtual Gamepad API proves Player 2 browser wiring only; it is not physical-controller or human acceptance.

## Evidence files

- `docs/validation-reports/wb-008-movement-props-buddy-feedback-validation.md`
- `docs/validation-reports/wb-008-feedback-proof.json`
- `docs/validation-reports/wb-008-buddy-link-proof.json`
- `docs/validation-reports/wb-008-marker-proof.json`
- `docs/validation-reports/wb-010-edge-fall-recovery-validation.md`
- `docs/validation-reports/wb-010-edge-recovery-proof.json`
- `docs/validation-reports/wb-005-coop-route-proof.json`
- `docs/validation-reports/wb-008-screenshots/`
- `docs/validation-reports/wb-010-screenshots/`

## Required human playtest sequence

1. Connect a physical gamepad and confirm controller-readiness messaging and mapping/dead-zone behavior.
2. Play **Co-op Rescue** and ask players to describe the meaning of the raised hands and Buddy Link without coaching.
3. In **Play Solo**, intentionally push the tutorial crate off the island and observe comprehension of crate/player recovery.
4. Play **Local Co-op Run — Standard** and observe camera comfort, collision snag points, completion clarity and subjective performance.
5. Replay on **Reduced effects** when needed, capturing device/GPU/browser and comparative responsiveness.

## Commands for regression recheck

```bash
npm run lint
npm run typecheck
npm run build
npm run validate:browser-pack
npm run validate:design-assets:required
npm run validate:project:mvp:web3d
npm run validate:quality-system
REAL_SERVER_URL=http://127.0.0.1:<safe-port> xvfb-run -a node scripts/wb008-feedback-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<safe-port> xvfb-run -a node scripts/wb008-buddy-link-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<safe-port> xvfb-run -a node scripts/wb010-edge-recovery-proof.mjs
REAL_SERVER_URL=http://127.0.0.1:<safe-port> xvfb-run -a node scripts/wb005-coop-route-proof.mjs
```

## Non-claims

No physical-controller approval, human playtest completion, comprehensive collision-system signoff, real-device/GPU performance approval, commit, push, deployment or public release has been performed.
