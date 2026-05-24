# Tool Permissions — Wobble Buddies Local Handoff

## Allowed without additional approval

- Read and edit files inside the restored local working copy for the scoped story.
- Run lint, typecheck, production build and documented project validators.
- Run real Chromium/Xvfb browser evidence against the locally served Vite application.
- Create local screenshots, JSON evidence, validation summaries and handoff archives.

## Ask first

- Add or upgrade dependencies, or alter the lockfile beyond an exact `npm ci` restoration needed to validate this handoff.
- Commit, push, open pull requests, modify remote repositories or publish packages.
- Deploy, expose a public URL or connect production services.
- Use user credentials, external paid services or new downloaded assets/models.

## Forbidden in this handoff

- Claim physical-controller, human playtest, real-GPU performance or release readiness without direct evidence.
- Replace real app rendering with mocked HTML or fabricated screenshots.
- Store credentials or personally identifying playtest material in the archive.

An exact `npm ci` from the checked-in lockfile is permitted only when the handoff archive omits `node_modules` and validation cannot otherwise run; it is a restoration step, not a dependency change.
