# Design Brief — Playground Panic MVP

## Experience statement

A desktop player should instantly recognize a friendly cooperative playground, understand that the glowing gate is the goal, and feel invited to push objects and help a buddy rather than fear failure.

## Camera and environment

Use one shared perspective camera, looking diagonally across floating platforms so the route, interactable props and finish gate remain visible. Landscapes are composed from faceted grassy islands, toy-like wood/stone structures, clouds and softly glowing interaction landmarks.

## Required visible landmarks

Tutorial yard with box and tutorial hint; balance bridge; heavy door plus lever/switch; rescue gap that highlights Buddy Link; rope swing landmark; mid checkpoint; glowing finish gate.

## Motion and feedback

Buddy bodies bob and lean when moving; selected/grabbable targets glow; checkpoint emits cyan glow and toast; finish gate emits warm gold glow; completion adds confetti-style celebratory treatment.

## Accessibility constraints

Color identity is paired with labels and distinct placement; important UI text uses high-contrast charcoal/navy on cream panels; prompts do not rely solely on color; reduced-motion friendly UI transitions are supported through CSS media query.
