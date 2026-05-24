# Design Assets

This directory stores the visual design references that `DESIGN.md`, design docs, QA reports, and implementation plans can cite directly.

Use this folder for exported PNG/JPG/WebP/SVG references from Figma, screenshots from reference products, wireframes, HUD layouts, game scene mood boards, component state references, and approved visual target frames.

## Required rule

Design files are not decoration. Any player-facing or user-facing UI work should identify the relevant image reference from `design-assets/manifest.json` before implementation and compare real browser screenshots against that reference during QA.

## Directory structure

| Directory | Purpose |
|---|---|
| `screens/` | Full-screen references such as landing page, dashboard, game start, gameplay, result, retry, settings. |
| `components/` | Component-level references such as buttons, cards, forms, HUD widgets, inventory slots, modals. |
| `states/` | State references such as loading, empty, error, success, hover, focus, active, disabled. |
| `flows/` | Ordered user/player flow images, storyboards, before/after sequences, interaction frames. |
| `brand/` | Logo, palette, typography, icon, illustration, material, lighting, and art-direction references. |
| `references/` | External inspiration screenshots or moodboard material. Only keep files that are licensed/allowed for internal reference. |

## Naming convention

Use stable, descriptive names:

```txt
<area>--<screen-or-component>--<state>--<viewport-or-ratio>--v<version>.<ext>
```

Examples:

```txt
screens/home--settled--desktop-1440--v1.png
screens/gameplay--active--mobile-390--v1.png
components/button-primary--hover--v1.png
states/form-login--error--mobile-390--v1.png
flows/onboarding--step-01--desktop-1440--v1.png
brand/palette--dark-cinematic--v1.png
```

## Manifest

Every design image that should be treated as source-of-truth must be registered in `design-assets/manifest.json`.

Minimum entry:

```json
{
  "id": "screen.home.settled.desktop.v1",
  "path": "design-assets/screens/home--settled--desktop-1440--v1.png",
  "type": "screen",
  "status": "approved",
  "source": "figma",
  "owner": "design",
  "viewport": "1440x900",
  "usedBy": ["DESIGN.md", "docs/visual-qa.md"],
  "notes": "Primary reference for home settled state."
}
```

## Status values

| Status | Meaning |
|---|---|
| `draft` | May guide exploration but cannot be used as final QA pass reference. |
| `approved` | Source of truth for implementation and visual QA. |
| `superseded` | Kept for history only; must point to replacement when possible. |
| `reference-only` | Inspiration or moodboard; do not copy directly. |
| `placeholder` | Temporary reference; acceptable only with explicit temporary-asset policy. |

## QA requirement

## Composition and role-quality requirement

Design references must support human-level composition review, not only visual matching. When adding or approving references, record the intended first-read path, scene/content dominance, rhythm, spatial balance, center/focal safe zone, and relevant role concerns in `design-assets/manifest.json` notes or the linked design doc. Use `docs/composition-qa.md` and `docs/role-gate-quality-map.md` during QA.


Visual QA reports should cite both:

1. the expected design reference from `design-assets/manifest.json`; and
2. the actual browser screenshot captured from the real app.

A story cannot claim visual/design conformance when the relevant design reference is missing, stale, superseded, or not cited.
