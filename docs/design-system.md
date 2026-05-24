# Design System — Prototype Tokens

## Tokens

Runtime tokens are implemented as CSS custom properties mirroring `design-assets/brand/02-design-system.webp`: player blue `#5AA7FF`, buddy coral `#FF8A7A`, sky `#BCE5FF`, mint `#7ED6A6`, yellow `#FFD37A`, lavender `#C9B7FF`, cream `#FFF6E8`, charcoal `#2B2F3A`, success `#58C978`, warning `#FFA24A`.

## UI components

Buttons, hint cards, progress pills, toasts, pause dialog and completion dialog use rounded corners, soft shadows and readable text. The CSS token layer owns size, color and elevation consistency; React UI components own state and accessibility.
