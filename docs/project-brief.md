# Project Brief — Wobble Buddies: Playground

## Product goal

Create a playable desktop-browser prototype of a lighthearted 3D physics co-op platformer where two soft, wobbly buddies traverse a floating pastel playground and help or accidentally destabilize each other.

## Target player and platform

- Players: one or two local players on one desktop/laptop.
- Target runtime: modern WebGL-capable desktop browser, prioritizing Chrome and Edge.
- Session target for the final demo: 3–7 minutes with a clear goal in the first 30 seconds.

## Core experience pillars

1. Wobbly movement that feels amusing and controllable.
2. Readable physics interaction: push, pull, grab, balance, swing, respawn.
3. Cooperative payoff through `Buddy Link`, the hand-to-hand rescue/link mechanic.
4. Quick recovery from failure and a cheerful pastel presentation.

## MVP feature scope

A single demo map named `Playground Panic`, supporting solo testing and local co-op, shared camera, checkpoint/respawn, finish gate, UI states, two wobble characters, physics props, and a meaningful Buddy Link rescue moment.

## Initial bootstrap slice scope

The initialization story establishes the repository, harness, design assets, WebGL scene, menu/HUD/pause/completion UI, character controller foundation, key gameplay landmarks, checkpoint and finish feedback, and browser evidence. Fine-tuned grab constraints, complete rope swing tuning, gamepad completion flow, and full five-zone puzzle balancing remain subsequent stories.

## Explicitly out of scope

Online multiplayer, lobby/chat, combat, enemies, inventory, mobile controls, split-screen, cosmetic systems, story progression, and production deployment.

## Success criteria for this initialization

- Real Vite application starts and renders a WebGL canvas from project source.
- Player-facing UI follows the supplied boards: rounded pastel UI, blue/coral buddies, floating-island playground.
- The foundation flow can be entered from menu, controlled in browser, paused, respawned, and completed locally.
- Browser evidence records render, interaction, errors, WebGL state, and screenshots from real Chromium.
