# Game Sandbox-to-Local Workflow

Use this for web games, 3D/WebGL games, multiplayer prototypes, GDD-driven projects, vertical slices, and public demo
preparation.

## Core distinction

```txt
sandbox-complete != enduser-ready
browser automation != human playtest
debug playable != player playable
```

Debug evidence can prove implementation behavior. It cannot prove design quality, first-time comprehension, game feel,
or readiness for a human player to test.

## Required game workflow order

1. Idea intake: target player, platform, session length, fantasy, core verb, win/lose/reward loop.
2. Design intake: art direction, camera, world, player avatar, HUD, motion, audio/feedback, references and anti-references.
3. GDD-lite: core loop, rules, states, tuning ranges, out-of-scope items, player-facing copy.
4. Technical plan: engine/library, scene structure, state ownership, asset plan, debug tooling, validation commands.
5. Implementation with debug tools allowed behind explicit debug mode.
6. Developer debug test to prove mechanics and state.
7. Player-facing cleanup: hide dev UI, remove notes, trim HUD, align copy and visual treatment.
8. Design conformance test using normal player screenshots against `DESIGN.md` / `docs/design-brief.md`.
9. Agent self-play in normal player mode.
10. Human playtest request only after the player-facing readiness gate passes.
11. Improve game feel from evidence, then repeat the smallest next story.

## Evidence classes

| Evidence class | What it proves | What it cannot prove | Debug UI allowed? |
|---|---|---|---:|
| Developer debug test | mechanics, state, spawn/collision, deterministic rules, instrumentation | player comprehension, design fit, fun, public readiness | yes |
| Browser/WebGL smoke | build/start/render, console/network/WebGL health | human playtest or design quality by itself | no for player route |
| Design conformance test | normal route matches approved visual/player-facing direction | fun or retention | no |
| Agent self-play | a heuristic player-mode flow can be completed | real human comprehension/fun | no |
| Human playtest | real player comprehension, feel, pacing, friction | production safety unless release gates pass | no |

## Sandbox route can complete when

- build/export passes;
- deterministic unit/integration tests pass where relevant;
- local browser route renders from real app source;
- WebGL/canvas checks pass for 3D games when applicable;
- simulated multiplayer or bot/client tests pass when applicable;
- screenshot/frame evidence is captured for both debug-relevant states and normal player states;
- console/network errors are inspected;
- developer debug findings are separated from player-facing findings;
- player-facing readiness gate passes or is explicitly marked `partial/fail` with fixes planned before human playtest;
- sandbox playability/player-experience review is recorded in normal player mode;
- remaining real-world gaps are promoted to downstream blockers.

## Player-facing readiness gate before human playtest

Read `.agent-harness/checklists/game-player-facing-readiness.md` when available. Before asking a human to playtest, verify:

- normal route opens without debug flags;
- no visible TODO/NOTE/DEBUG text, dev panels, inspectors, collision boxes, grids, test buttons, seed panels, cheats, or developer-only labels;
- debug tools are isolated behind `?debug=1`, development-only flags, or documented dev hotkeys;
- start, gameplay, game-over/result, retry, pause, and HUD states are player-facing;
- camera, typography, spacing, color, animation, lighting, and placeholder assets match the design direction or are explicitly accepted as temporary;
- normal player screenshots/frame sequence were reviewed against `DESIGN.md` and `docs/design-brief.md`;
- the agent self-played one loop in player mode.

If this gate fails, do not ask the human for player playtest. Report `Human playtest request allowed: no` and list cleanup fixes.

## Sandbox playability review

Run this only in normal player mode, not with debug overlays visible. Record observations for:

| Area | Questions |
|---|---|
| First 30 seconds | Does the player understand what to do without developer notes? Is there a clear goal or cue? |
| Core loop | Can the player start, act, receive feedback, and reach a result? |
| Controls | Are movement, camera, input, and interaction responsive enough? |
| Feedback | Do collision, score, win/lose, errors, rewards, and progress feel clear? |
| HUD | Is important state readable without visual clutter or implementation details? |
| Design conformance | Does the actual screen match the approved art direction, camera, tone, HUD, and copy? |
| Pacing | Is there dead time, confusion, frustration, or lack of reward? |
| 3D readability | Are scale, lighting, camera, object affordance, and occlusion acceptable? |
| Multiplayer | Does simulated 2P/4P flow complete, and what still requires human playtest? |

This review is heuristic sandbox evidence. It does not replace human playtest.

## Downstream blockers for production-release-readiness

Promote these when they cannot be performed in the current environment:

- human 3-4 player playtest on real devices;
- physical mobile WebGL/device testing;
- public hosting rollback path;
- release owner;
- public URL smoke after deploy;
- real hosting/proxy rate-limit review;
- storefront/platform review if applicable.

## Final game route report

```txt
Developer debug test:
Design conformance test:
Player-facing readiness:
Agent self-play in player mode:
Human playtest request allowed:
Sandbox playability review:
Current route status:
Sandbox evidence status:
External/enduser readiness:
Downstream blockers:
Next route:
```

## Browser automation pack handoff

For local browser/WebGL game projects, the agent should add and use the browser evidence pack when selected by project type `game`:

- `playwright.config.mjs`
- `tests/browser/game-player-mode.spec.mjs`
- `tests/browser/game-debug-mode.spec.mjs`
- `scripts/browser-evidence.mjs`
- `docs/validation-reports/browser-evidence-template.md`

A browser report that is `blocked` because Playwright is unavailable is useful evidence, but it is not player-facing pass. Continue with setup or report the exact blocker.
