# 3D Web Game Architecture — MVP Foundation

## Render target

React Three Fiber renders to a WebGL canvas. WebGL2/WebGL is the supported browser rendering target; a player-facing fallback panel appears only when canvas initialization fails.

## Scene boundaries

| Boundary | Responsibility |
|---|---|
| Scene root | Canvas, readiness sentinel, lighting, fog/sky and physics wrapper |
| Environment | Fixed colliders, islands and gameplay landmark meshes |
| Active bodies | Players and explicitly pushable crate only for bootstrap |
| Camera | Shared camera centered on active buddy positions |
| Overlay | DOM HUD outside canvas, design-token driven |

## Performance posture

Use low-poly primitives and a small number of rigid bodies, fixed colliders for scenery, shadow budget appropriate to a desktop prototype, and no imported runtime textures or 3D models in the bootstrap slice.
