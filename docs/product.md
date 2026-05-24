# Product Behavior — Wobble Buddies: Playground

## Player journey

Menu → choose solo or local co-op → enter Tutorial Yard → cross playful physical landmarks → activate mid checkpoint → reach glowing finish gate → view completion result → replay or return to menu.

## Screens and player-facing copy

| State | Required UI and copy |
|---|---|
| Menu | Logo, “Grab, wobble, and save your buddy.”, `Play Solo`, `Local Co-op`, compact controls. |
| Playing | Timer, zone/progress cue, contextual hint, `R Respawn`; no debug information. |
| Buddy rescue cue | “Grab your buddy to pull them up!” near rescue gap. |
| Checkpoint | Temporary `Checkpoint Reached!` toast and illuminated beacon. |
| Paused | `Resume`, `Restart from Checkpoint`, `Restart Level`, `Back to Menu`. |
| Completed | `Playground Complete!`, elapsed time, `Play Again`, `Back to Menu`. |

## Core mechanics intent

Movement carries mild inertia and a soft bobbing visual. Physics interactions are obvious and forgiving. Buddy Link is activated by grabbing the other player at close range, visually signaled by connected hands/glow, and eventually provides spring-like rescue and swing cooperation.

## Bootstrap implementation boundary

The initial build contains a complete player-facing shell and an interactable traversal foundation. Advanced physical constraints and level-puzzle tuning are scheduled after foundation evidence; they are not represented as complete merely because their landmarks are present in the scene.
