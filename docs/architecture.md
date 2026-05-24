# Architecture — Web3D MVP

## Technical decision

Use Vite and TypeScript for build/runtime, React for application/UI composition, React Three Fiber and Drei for rendering/helpers, Rapier through `@react-three/rapier` for lightweight physics, Zustand for game/UI state, and browser Keyboard/Mouse/Gamepad APIs for input.

## Layer map

| Layer | Responsibility |
|---|---|
| App shell | Game status, menu/pause/completion flow and CSS token system. |
| UI overlay | HUD, modal panels, player prompts and input copy. |
| Scene | Lighting, camera, floating-island level presentation and scene readiness signal. |
| Gameplay | Player controller, respawn/checkpoint/finish triggers and physics objects. |
| Input | Keyboard/mouse and gamepad polling abstraction. |
| State | Small serializable Zustand game state; no persistence in MVP. |
| Evidence | Harness validators and Chromium screenshot/canvas checks. |

## Trust and persistence boundary

The prototype is entirely local and client-authored. No competitive scoring, economy, player data, authentication, network state or persistent save exists in this MVP route.
