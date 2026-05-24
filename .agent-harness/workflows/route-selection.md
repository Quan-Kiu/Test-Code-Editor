# Route Selection Workflow

Choose exactly one primary route before detailed work.

| Route | Use when | First action |
|---|---|---|
| `bootstrap-new-project` | fresh project/repo needs controls | resolve path/mode/runtime/type, dry-run install |
| `adopt-existing-project` | existing codebase needs harness/playbook | inspect repo shape, dry-run install, preserve architecture |
| `guided-build` | idea or requirements are unclear | ask 3-5 current-phase questions |
| `implement-story` | story/feature is defined | produce responsibility table and Implementation File Plan |
| `ui-browser-validation` | UI/source/browser validation requested | build, run real server, open real browser, collect evidence |
| `validate-project` | project/harness readiness validation requested | choose package-vs-project validation and run commands |
| `game-project-adoption` | game, GDD, vertical slice, playtest, or game-agent template | read game docs, produce Game Project Analysis |
| `production-release-readiness` | deploy, public release, rollback, user data, auth, real users, production traffic | classify release risk, require owner/evidence/rollback |
| `playbook-maintenance` | editing this harness/playbook | read manifest/governance, validate changed package |

Priority when multiple apply:

```txt
production-release-readiness > game-project-adoption > adopt-existing-project > bootstrap-new-project > ui-browser-validation > implement-story > validate-project > guided-build > playbook-maintenance
```

Always include route lifecycle fields for game/UI/demo/release tasks.
