# Browser Interaction QA Checklist

Use this checklist before claiming UI, game, web3d, or browser-surface validation pass.

## Applicability

- [ ] Project type identified: `ui`, `mixed`, `game`, `web3d`, `api`, `backend`, `cli`, `none`, or combination.
- [ ] Browser surface identified, or `not_applicable` reason recorded.
- [ ] Design reference identified when available: mock, `DESIGN.md`, `docs/design-brief.md`, or `docs/design-system.md`.
- [ ] Story-specific Browser Interaction Plan exists for non-trivial UI/browser work.

## Real browser setup

- [ ] Build command ran when available.
- [ ] Real local frontend/backend server is running.
- [ ] Chromium opened the real app route, not mock HTML.
- [ ] Localhost access mode recorded: direct, headed/Xvfb, CDP/fetch bridge, or blocked.
- [ ] Console errors, page errors, and failed network requests were collected.

## Functional interactions

- [ ] Mouse/pointer click or drag path executed for the primary flow.
- [ ] Hover state checked where relevant.
- [ ] Keyboard Tab/Shift+Tab focus path checked.
- [ ] Enter/Space/Esc/arrow/shortcut behavior checked where relevant.
- [ ] Form fill/validation/submit/error recovery checked where relevant.
- [ ] Mobile/touch viewport checked where relevant.
- [ ] For games, one agent self-play/player loop was attempted in normal player mode.
- [ ] For web3d, camera/orbit/pan/zoom/select/hover/tap and scene-ready evidence were checked.

## Screenshot capture

- [ ] Full route screenshots captured for target viewports.
- [ ] Component/region screenshots captured for meaningful states.
- [ ] Loading/empty/error/success states captured or explicitly noted as not reproducible.
- [ ] Modal/menu/dropdown/toast/tooltip states captured when present.
- [ ] Game/web3d frame sequence captured for dynamic canvas states when applicable.

## Screenshot review

- [ ] Screenshots were opened and visually reviewed.
- [ ] Text readability, contrast, hierarchy, spacing, and alignment checked.
- [ ] Clipping, overlap, overflow, z-index, sticky-layer, and scrollbar/form-control polish checked.
- [ ] Screenshots compared with design references when available.
- [ ] Human-level composition review completed using `docs/composition-qa.md`.
- [ ] Component rhythm, spatial balance, center-content preservation, visual dominance, visual noise, and comprehension were judged from screenshots.
- [ ] Functional pass / composition fail is used when interactions pass but the whole frame is visually weak.
- [ ] UI/UX improvement suggestions recorded for defects or weak affordances.
- [ ] Defects resulted in `fail` or `partial`, not pass.

## Retest

- [ ] Fixes were retested on the same route, viewport, interaction, and state.
- [ ] Before/after screenshot evidence is listed.
- [ ] Final report separates functional status from visual/design status.
