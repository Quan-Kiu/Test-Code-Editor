# Product Quality System Checklist

Use this checklist before a story is reported done. It is designed to prevent narrow `functional pass` reports.

## Required quality scan

- [ ] Product value and non-goals are clear.
- [ ] Acceptance criteria are testable and mapped to evidence.
- [ ] Target quality level L0/L1/L2/L3/L4 is declared.
- [ ] Relevant roles from `docs/role-thinking-protocols.md` were simulated.
- [ ] Plan-quality gate from `docs/plan-quality.md` passed before coding.
- [ ] Code architecture and responsibility boundaries were reviewed.
- [ ] UI/game work includes browser evidence and composition QA.
- [ ] Accessibility impact was reviewed or explicitly marked not applicable with reason.
- [ ] Performance impact was reviewed or explicitly marked not applicable with reason.
- [ ] Security/privacy/data impact was reviewed or explicitly marked not applicable with reason.
- [ ] Deferred risks have owner, mitigation, and review date.
- [ ] Final status separates sandbox-complete from enduser-ready when relevant.

## Hard fail

Fail the quality scan when:

- a report says pass but only includes build/test status;
- role simulation contains generic `OK` rows without concrete concerns;
- UI/game work has screenshots but no human first-read/composition notes;
- medium/high-risk plan lacks alternatives, validation, or rollback;
- release is claimed ready without observability, rollback, and owner signoff.
