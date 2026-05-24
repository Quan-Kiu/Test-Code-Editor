# WB-008 — Movement, Props and Buddy-Link Feedback Fixes Validation

Status: **pass with sandbox/browser boundary**  
Date: **2026-05-24**

## Scope

WB-008 addresses direct play-feedback issues observed before human playtest: smoother acceleration/deceleration, reduced movement and jump force, a visible raised-hand interaction state, tutorial-crate recovery after falling, an upright switch target landmark, and a rescue-practice Buddy Link that can be understood and completed without relying on underside-collider traversal.

## Implemented behavior

- Player horizontal locomotion uses damped acceleration/deceleration instead of instant target velocity changes.
- Running speed is reduced to `6.25`; jump impulse is reduced to `6.15`.
- Active grab/Buddy Link state is visible through raised glowing hands and HUD badges.
- Tutorial crate returns to its start after falling below the island and communicates that recovery to the player.
- Zone 3 keeps its functional floor sensor while adding an upright target on a stand for readable landmark direction.
- Rescue Practice uses a bounded assisted-hoist path for the linked buddy, avoiding a known platform-underside blockage without claiming general collision resolution.

## Browser evidence

| Proof | Mode | Evidence | Outcome |
|---|---|---|---|
| Direct localhost boundary | headed Chromium + Xvfb | `docs/validation-reports/wb-008-direct-probe.json` | blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`, documented |
| Movement, reduced jump and raised-hand feedback | headed Chromium + Xvfb bridge | `docs/validation-reports/wb-008-feedback-proof.json` | pass; WebGL true, `glError=0`, jump rise `0.949` |
| Buddy Link practice rescue | headed Chromium + Xvfb bridge | `docs/validation-reports/wb-008-buddy-link-proof.json` | pass; staged `y=-0.55` to rescued `y=1.199` |
| Upright Zone 3 marker | headless Chromium + Xvfb fallback | `docs/validation-reports/wb-008-marker-proof.json` | pass; screenshot captured |
| Crate recovery | superseded by WB-010 edge proof | `docs/validation-reports/wb-010-edge-recovery-proof.json` | pass; crate returns and fall recovery verified together |

## Non-claims

WB-008 does not certify all platform/collider interactions, physical controller usability, two-person human comprehension, real-device performance or public release readiness.
