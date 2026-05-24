# Plan Quality Checklist

Use before coding any non-trivial feature.

## Minimum acceptable plan

- [ ] Intent, user/system problem, smallest useful outcome, and non-goals are written.
- [ ] Target quality level is selected and justified.
- [ ] Assumptions/unknowns are listed with validation or containment.
- [ ] Relevant roles were simulated before coding.
- [ ] Alternatives were considered for medium/high-risk decisions.
- [ ] Architecture, state, API/storage, data, error, and dependency impacts are explicit.
- [ ] Implementation File Plan lists exact files, action, responsibility, reason, risk, and validation evidence.
- [ ] UI/game plan covers loading, empty, error, success, permission, responsive, and composition states when relevant.
- [ ] Accessibility, performance, security, privacy, and release impacts are reviewed or marked not applicable with reason.
- [ ] Validation plan includes commands, real browser/manual checks when applicable, screenshots/traces, and retest path.
- [ ] Fallback, rollback, or de-scope path is written.

## Block coding when

- plan score is below the required level in `docs/plan-quality.md`;
- plan only says `edit App.tsx` or similar all-in-one implementation;
- no validation command or evidence path is known;
- user-facing work has no human-level UX/composition evidence plan.
