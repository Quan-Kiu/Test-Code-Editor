# Environment Scope Policy

Before claiming readiness, identify the current environment.

## GPT or restricted sandbox

Can usually provide install/build/test/browser/screenshot/simulated evidence. Cannot provide human playtest, real mobile
device, real public hosting, production owner, or public rollback proof unless those are explicitly available.

## Local developer machine

Can provide cleaner local evidence: real browser, real GPU/WebGL, device checks when available, real file system and
package manager behavior. It still cannot prove public hosting or production rollback until those environments are
exercised.

## Preview/public hosting

Can provide public URL smoke, hosted asset/network verification, deployment path, and rollback checks.

## Production/enduser

Requires owner, risk tier, validation evidence, smoke evidence, rollback plan, observability, and accepted unknowns when
applicable.

## Rule

A route may complete in the current environment when in-scope evidence passes. Missing evidence from a later environment
is a downstream blocker, not proof that the current route failed.
