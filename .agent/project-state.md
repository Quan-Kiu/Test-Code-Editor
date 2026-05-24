# Project State — Wobble Buddies: Playground

## Active route

```txt
Route: implement-story
Mode: mvp
Runtime: generic
Project type: game,web3d
Target quality level: l2
Assumptions: sandbox Chromium/WebGL evidence validates local functionality only; physical-controller, two-person playtest, real-GPU performance and broad collision feel remain external acceptance work.
Next action: run PT-WB-001/002/003 real sessions using the WB-011 anonymous session template and triage guide; return completed anonymous observations for any focused fix story.
Project context intake: pass; docs/tool-permissions.md retains conservative boundaries.
Blocked by: no remaining locally reproducible blocker before human playtest; release readiness remains blocked by human/hardware/device evidence, runtime payload, and broader collision-feel observations.
```

## Current story

`WB-011 — Human Playtest Execution Kit` — **validated_documentation_scope; human_sessions_not_run**

Recently validated gameplay corrective slice: `WB-010 — Edge-Fall Recovery and Collision-Safety Follow-up` — **validated_with_collision_scope_limitation**

Recently validated corrective slice: `WB-008 — Movement, Props and Buddy-Link Feedback Fixes` — **validated_with_risks**.

Previously validated sandbox slices retained as regression foundations: WB-002/WB-003 rescue, WB-004A controls, WB-004 solo traversal/finale, WB-006 lazy-load/presentation, WB-005 local co-op/Gamepad API route and WB-007 pre-playtest readiness.


## WB-011 delivered boundary

- A privacy-safe session template now covers Buddy Link comprehension, Standard full co-op and Reduced effects comparison.
- The triage guide captures controller/device/preset context, severity and reproduction without storing participant identity.
- `docs/playtest-results/` is reserved for completed anonymous real-session sheets only.
- This documentation validation permits execution of a human playtest; it is not human-playtest, physical-controller, real-GPU or release signoff.

## WB-008 delivered boundary

- Player locomotion now eases toward and away from target speed; maximum run speed is `6.25` and jump impulse is `6.15`.
- Active grab/Buddy Link uses a visible raised-hand pose plus HUD badge.
- Tutorial crate returns from a fall below the island and communicates its return.
- Zone 3 has an upright target marker while retaining the existing floor sensor for gameplay.
- Rescue Practice uses a bounded assisted-hoist path because the hanging buddy was blocked by the underside of the platform; this does not approve general collider behavior.

## WB-010 delivered boundary

- Player fall recovery now triggers at `y < -3.25` rather than allowing a long fall before respawn.
- Recovery copy is clearer, and crate-return messaging retains priority when player/crate recovery happen together.
- Browser evidence demonstrates a real physics push over the ledge, crate return, automatic player recovery and retained co-op/Buddy Link regressions.
- WB-010 is recovery hardening only; general collision/contact tuning remains a human-playtest observation and possible follow-up.

## Final browser evidence status

- Current final build served from Vite preview at `http://127.0.0.1:4243` uses `index-T5g-1raI.js`, `GameScene-gkvibftF.js` and `gameplay-webgl-runtime-HJx64JbS.js`.
- Direct localhost: headed Chromium + Xvfb is blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`; see `docs/validation-reports/wb-008-direct-probe.json`.
- WB-008 movement/raised-hand: pass in headed Chromium + Xvfb bridge; WebGL true, `glError=0`, jump rise `0.949`.
- WB-008 Buddy Link: pass in headed Chromium + Xvfb bridge; staged `y=-0.55` to rescued `y=1.199`.
- WB-008 marker: pass in headless Chromium + Xvfb fallback; upright target screenshot retained.
- WB-010 edge recovery: pass in headless Chromium + Xvfb fallback; crate max `z=7.134`, automatic player recovery in `1093 ms` after fall observation.
- Local Co-op Run regression: pass in headless Chromium + Xvfb fallback; completion at `36.38s`, virtual Gamepad boundary retained.

## Build and open risks

- Current build: menu/UI entry **62.34 kB gzip**, CSS **5.04 kB gzip**, scene glue **7.10 kB gzip**, deferred WebGL/physics runtime **1,089.19 kB gzip**.
- The deferred runtime remains above the warning budget and prevents any release-performance claim pending real-device profiling and/or optimization.
- Physical gamepad behavior, human co-op comprehension, edge/collision feel and target-device frame performance remain mandatory human/hardware validation topics.
- No commit, push, deployment or public-release approval has been performed.
