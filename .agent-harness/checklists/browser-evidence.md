# Browser Evidence Checklist

Use this checklist before claiming UI/game browser validation pass.

## Setup

- [ ] Build command was run when available.
- [ ] Real local app/server is running.
- [ ] Normal player/user URL is defined.
- [ ] Debug URL is explicit and separate when debug tooling exists.
- [ ] Browser evidence command or Playwright specs ran against the real app, not a mock.

## Evidence

- [ ] Screenshots captured for normal route and meaningful states.
- [ ] Viewports include mobile and desktop at minimum.
- [ ] Console errors reviewed.
- [ ] Network failures reviewed.
- [ ] Report saved under `docs/validation-reports/`.
- [ ] Any blocked browser setup is reported as blocked, not pass.

## Game-specific player-facing gate

- [ ] Normal mode has no TODO/NOTE/DEBUG/dev-only text.
- [ ] Normal mode has no visible dev panel, FPS overlay, collision helper, coordinate grid, spawn inspector, seed/replay panel, cheat, test button, or fake QA control.
- [ ] Debug tools, if present, are isolated behind explicit debug mode.
- [ ] Screenshots are compared against `DESIGN.md` and `docs/design-brief.md`.
- [ ] Agent self-play in normal player mode completed before asking for human playtest.


## Interaction and screenshot-review gate

- [ ] `docs/browser-interaction-qa.md` was applied for the selected project type.
- [ ] `docs/composition-qa.md` was applied for human-level whole-frame review.
- [ ] Mouse/pointer interactions were performed for the primary flow or marked `not_applicable` with reason.
- [ ] Keyboard interactions were performed for the primary flow or marked `not_applicable` with reason.
- [ ] Component/region screenshots were captured for meaningful states.
- [ ] Screenshots were opened and reviewed, not only generated.
- [ ] Screenshots were compared against design references when available.
- [ ] Composition findings include component rhythm, spatial balance, center-content preservation, visual dominance, visual noise, and comprehension.
- [ ] UI/UX findings include severity and suggested fix direction.
- [ ] Fixes were retested with matching before/after screenshots.
