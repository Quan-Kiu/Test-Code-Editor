# Composition QA Checklist

Use this checklist before claiming that a UI, game, Web3D scene, or generated browser surface is visually ready.

## Applicability

- [ ] Real browser screenshots or frame sequences exist for the route/state/viewport being judged.
- [ ] `docs/composition-qa.md`, `docs/visual-qa.md`, and `docs/browser-interaction-qa.md` were applied together.
- [ ] Functional status and composition status are reported separately.
- [ ] Design/product intent source is identified, or `not_available` is explained.

## Human first-read

- [ ] The intended dominant subject/action is named.
- [ ] The actual first, second, and third visual reads are recorded from the screenshot.
- [ ] The eye path supports the intended task, story, mood, or player goal.
- [ ] The user/player can understand the next action without developer notes.

## Whole-frame composition

- [ ] Component rhythm is checked for cadence, density, grouping, padding, and repeated element consistency.
- [ ] Spatial balance is checked across left/right, top/bottom, foreground/background, and negative space.
- [ ] Center-content preservation is checked across responsive states, scroll, overlays, camera movement, and animation where applicable.
- [ ] Scene visual dominance is checked for game/Web3D/hero surfaces.
- [ ] Visual noise from borders, glow, labels, icons, shadows, motion, copy, and debug UI is checked.
- [ ] HUD/panels/overlays support the scene or task instead of stealing dominance.

## Fail discipline

- [ ] Functional pass is not converted into visual/composition pass.
- [ ] Composition defects result in `partial` or `fail`, not `pass`.
- [ ] Debug/developer artifacts in normal player/user mode are hard-failed.
- [ ] Any partial/fail row includes a concrete fix direction.
- [ ] Fixes are retested with matching before/after screenshots.
