# ADR-0001 — Browser Web3D Prototype Stack

**Status:** accepted for MVP bootstrap  
**Date:** 2026-05-23

## Decision

Use Vite, TypeScript, React, React Three Fiber, Drei, Rapier and Zustand for the Wobble Buddies browser prototype.

## Rationale

This matches the supplied product specification, supports declarative 3D scenes plus DOM overlays, enables lightweight physics for gameplay primitives, and keeps local-prototype state compact.

## Consequences

The prototype targets desktop WebGL and requires real browser validation. High-fidelity ragdoll, online multiplayer and production security are not introduced in this route.
