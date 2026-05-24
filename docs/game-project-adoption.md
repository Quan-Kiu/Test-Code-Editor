# Game Project Adoption Record — Wobble Buddies: Playground

## Adoption type

New browser Web3D project initialized from the supplied game design specification and approved concept boards, with Agent Engineering Harness installed for MVP evidence and workflow control.

## Game design intake

| Topic | Project decision |
|---|---|
| Fantasy | Two wobbling buddies help each other across a floating playground. |
| Platform | Desktop browser with WebGL; Chrome and Edge priority. |
| Session | Final demo aims for 3–7 minutes. |
| Core verbs | Move, jump, grab, pull, balance, swing, rescue, respawn. |
| Signature mechanic | Buddy Link hand connection for rescue and cooperative swing. |
| Visual direction | Pastel low-poly floating islands; blue and coral capsule buddies. |
| Failure | Fast respawn from checkpoint; no permanent death or violence. |
| Out of scope | Online play, combat, enemies, story progression and mobile controls. |

## Initial vertical slice decision

WB-001 establishes the player-facing shell and a real WebGL traversal foundation with landmarks and core state feedback. It does not claim final physical tuning for independent grabs, Buddy Link rescue forces or rope swing completion.

## Evidence separation

| Evidence class | WB-001 plan |
|---|---|
| Developer source/static validation | typecheck, lint and build |
| Browser/WebGL smoke | real Chromium canvas check and error capture |
| Design conformance | review menu, gameplay and pause screenshots against registered boards |
| Agent self-play | traverse foundation after browser checks |
| Human playtest | not requested during initialization |

## Player-facing findings status

Player-facing review begins after screenshot capture from the real app. Developer-only diagnostics remain outside normal mode; a future explicit debug route may be added for tuning only.
