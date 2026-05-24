# Code Architecture — Foundation Slice

## Source boundaries

```txt
src/
  app/                  Game application orchestration
  game/
    components/         R3F/Rapier rendered gameplay entities
    input/              keyboard, pointer and gamepad input
    scene/              Canvas scene, camera and level composition
    state/              Zustand state store
    types.ts            shared domain types
  ui/                   player-facing React overlay screens
  styles/               tokens and layout styling
```

## Rules

- React DOM overlays never manipulate Rapier bodies directly; they issue state/actions.
- Scene components read small state slices and expose sensor events back to the store.
- Dynamic bodies are limited to active players and intentionally physical props.
- Debug diagnostics are omitted from normal mode; any future debug UI must be gated by `?debug=1`.
