# Game Player-Facing Readiness Checklist

Use this before asking a human to playtest a game. It is intentionally stricter than developer debug validation.

## Evidence classes

| Class | Purpose | May include debug UI? | Can count as human/player playtest? |
|---|---|---:|---:|
| Developer debug test | Prove mechanics, state, collision, spawning, networking, save/load, or performance instrumentation. | yes | no |
| Design conformance test | Prove the normal player route matches `DESIGN.md`, `docs/design-brief.md`, and HUD/UX intent. | no | no |
| Agent self-play in player mode | Prove the agent can complete the intended flow without developer-only hints. | no | no; heuristic only |
| Human playtest | Prove real player comprehension, feel, pacing, friction, and replay desire. | no | yes |

## Player-facing readiness gate

The agent must complete this gate before asking a human to playtest:

- [ ] Normal route opens without `?debug=1`, dev hotkeys, or forced debug flags.
- [ ] Debug overlays, FPS panels, collision boxes, spawn inspectors, coordinate grids, seed panels, cheats, test buttons, TODO/NOTE/DEBUG labels, and developer-only instructions are hidden by default.
- [ ] Any debug capability is isolated behind an explicit debug mode such as `?debug=1`, a development-only flag, or a documented dev hotkey.
- [ ] Start, gameplay, pause if present, result/game-over, and retry screens contain only player-facing copy.
- [ ] HUD shows the minimum useful player state and does not explain implementation details.
- [ ] Visual style, camera, lighting, typography, spacing, color, motion, and asset placeholders match the approved design direction or are explicitly marked as temporary and acceptable for this playtest.
- [ ] At least one normal-player screenshot/frame sequence is captured and reviewed against the design direction.
- [ ] Console/network/WebGL errors are inspected and blocking issues are fixed or called out.
- [ ] The agent self-plays one full loop in player mode before asking the human to test.

## Hard fail conditions

Mark player-facing readiness `fail` when a normal player screenshot or browser session shows any of these:

- visible TODO, NOTE, DEBUG, dev-only helper text, internal labels, or placeholder instructions not intended for the player;
- visible debug panel, inspector, collision helper, grid, FPS panel, seed/replay panel, cheat/test button, or fake QA controls;
- UI/HUD that contradicts the approved design direction without an explicit temporary-asset decision;
- player flow that requires reading developer notes to know what to do;
- start/gameplay/game-over/retry screens that still look like an internal test harness rather than a game;
- unreadable HUD, unclear camera, broken visual hierarchy, or interaction feedback too weak for first-time play.

## Required report snippet

```txt
Developer debug test: pass/fail/partial/not_run - <evidence>
Design conformance test: pass/fail/partial/not_run - <screenshot/frame evidence>
Player-facing readiness: pass/fail/partial/not_run - <normal player route evidence>
Agent self-play in player mode: pass/fail/partial/not_run - <flow completed and observations>
Human playtest request allowed: yes/no - <reason>
Human playtest: not_run|required before public/enduser release unless already completed
```

## Executable browser evidence before human playtest

Before asking for human playtest, prefer running:

```bash
node scripts/browser-evidence.mjs --url http://localhost:3000 --project-type game --debug-url http://localhost:3000?debug=1
```

If the command is blocked because Playwright is unavailable, record `blocked` and do not ask for player-facing playtest yet. If the report says `Human playtest request allowed: no`, create cleanup/design-conformance stories first.

## 3D web game addendum

For project type `game,web3d`, also run `.agent-harness/checklists/3d-web-game-readiness.md`. Normal player mode must
show camera, lighting, scale, collision affordances, interaction feedback, and HUD clearly enough for a first-time player.
Physics, wireframes, collider lines, grids, debug stats, seed/replay panels, and asset-inspection tools must remain behind
explicit debug mode.
