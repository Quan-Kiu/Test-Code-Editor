# Design Direction — Wobble Buddies: Playground

## Visual source of truth

The sixteen approved prototype concept boards are registered in `design-assets/manifest.json`. Runtime UI must align with their art direction and not embed board screenshots as fake gameplay.

## Art direction

- 3D low-poly playground floating in a bright blue sky with soft clouds.
- Pastel surfaces, rounded corners, cheerful lighting and non-threatening gaps.
- Primitive/blockout geometry is acceptable for the prototype when it remains readable and polished.
- No copied characters, map layouts or assets from reference games.

## Character language

Player 1 is pastel blue; Player 2 is coral pink. Both use capsule bodies with large rounded heads, long dangling arms, short feet and minimal black facial features. Motion should read as bouncy, slightly unstable and friendly.

## Color tokens

| Token | Value | Usage |
|---|---|---|
| Player 1 Blue | `#5AA7FF` | Blue buddy, primary actions |
| Player 2 Coral | `#FF8A7A` | Coral buddy, co-op actions |
| Sky Blue | `#BCE5FF` | Atmosphere, light UI accents |
| Mint Green | `#7ED6A6` | Safe environment / success support |
| Soft Yellow | `#FFD37A` | Stars, finish highlights |
| Lavender | `#C9B7FF` | Shadowed terrain accents |
| Warm Cream | `#FFF6E8` | Cards and dialog surfaces |
| Charcoal UI | `#2B2F3A` | Body text |
| Success Green | `#58C978` | Saved/completion state |
| Warning Orange | `#FFA24A` | Prompt accents |

## UI composition rules

- Overlay cards are warm cream, softly elevated and heavily rounded.
- Primary buttons use saturated blue; local co-op secondary emphasis uses coral.
- HUD remains sparse: timer, zone/progress, contextual hint and respawn shortcut only.
- Player-facing mode never shows scene diagnostics, coordinates, helper grids, physics colliders or implementation terms.

## Screen mapping

| Screen/state | Reference asset |
|---|---|
| Brand/key visual | `design-assets/screens/01-cover-key-visual.webp` |
| Menu | `design-assets/screens/06-main-menu.webp` |
| Zone 1 tutorial HUD | `design-assets/screens/07-zone-1-tutorial.webp` |
| Zone 2 bridge HUD | `design-assets/screens/08-zone-2-bridge.webp` |
| Zone 3 door puzzle HUD | `design-assets/screens/09-zone-3-door-puzzle.webp` |
| Zone 4 rescue moment | `design-assets/screens/10-zone-4-buddy-rescue.webp` |
| Zone 5 rope finale | `design-assets/screens/11-zone-5-rope-swing.webp` |
| Pause | `design-assets/screens/14-pause-screen.webp` |
| Completion | `design-assets/screens/15-completion-screen.webp` |
| Full flow | `design-assets/flows/16-prototype-flow.webp` |

## Implementation fidelity target

The first rendered slice must match the color, typography rhythm, rounded HUD, buddy silhouettes, floating-island atmosphere and clear goal hierarchy. Detailed environment mesh fidelity and tuned physics animation are iterative MVP work.
