# Risk Register — MVP Bootstrap

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| WebGL unavailable in target browser | No playable canvas | Provide fallback panel; collect Chromium WebGL evidence | open |
| Physics tuning feels unstable | Player frustration | Limit dynamic bodies and iterate after self-play | open |
| Landmarks mistaken for finished mechanics | Scope misunderstanding | Report WB-001 boundary and track WB-002–004 | controlled |
| Virtual Gamepad wiring is validated but physical-controller/human co-op behavior is unvalidated | Co-op friction or controller-specific defects | Retain browser Gamepad API evidence for wiring only; require real controller and human playtest before release claim | open |
| Deferred WebGL/physics runtime remains about 1.09 MB gzip | Slow load or frame pressure on target devices | Keep menu lazy-load, expose Reduced effects and profile/optimize on real hardware before release | open |
| SwiftShader/Xvfb long headed routes can close pages intermittently | Automated evidence instability | Retain failed headed reports and use fresh-display headless fallback only for long functional proof | controlled |
| Generated visual boards contain non-runtime copy differences | UI drift | Runtime copy follows specification and design tokens | controlled |
| Human playtest observations could be stored with identifying participant material | Privacy/compliance issue and unusable handoff evidence | Use anonymous session codes, no-PII storage rules and consent-separated media references from WB-011 kit | controlled |
