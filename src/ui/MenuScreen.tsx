import { useEffect, useState } from 'react';
import { useGameStore } from '../game/state/gameStore';
import type { GameMode } from '../game/types';
import { preloadGameScene } from '../app/gameSceneLoader';

const controls = [
  { key: 'W A S D', label: 'Move' },
  { key: 'SPACE', label: 'Jump' },
  { key: 'L / R MOUSE', label: 'Grab' },
  { key: 'MID DRAG', label: 'Camera' },
  { key: 'R', label: 'Respawn' },
];

function useControllerPresent() {
  const [present, setPresent] = useState(false);
  useEffect(() => {
    const update = () => setPresent(Boolean(navigator.getGamepads?.().some((pad) => pad?.connected)));
    update();
    const timer = window.setInterval(update, 500);
    window.addEventListener('gamepadconnected', update);
    window.addEventListener('gamepaddisconnected', update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('gamepadconnected', update);
      window.removeEventListener('gamepaddisconnected', update);
    };
  }, []);
  return present;
}

export function MenuScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const graphicsPreset = useGameStore((state) => state.graphicsPreset);
  const setGraphicsPreset = useGameStore((state) => state.setGraphicsPreset);
  const controllerPresent = useControllerPresent();
  const launch = (mode: GameMode) => startGame(mode);

  return (
    <section className="menu-screen" aria-label="Start menu">
      <div className="menu-sky" aria-hidden="true">
        <span className="menu-cloud cloud-one" />
        <span className="menu-cloud cloud-two" />
        <span className="menu-island" />
        <span className="menu-buddy menu-buddy-blue"><i /></span>
        <span className="menu-buddy menu-buddy-coral"><i /></span>
      </div>
      <div className="brand-lockup">
        <p className="brand-eyebrow">3D Physics Co-op Playground</p>
        <h1 className="logo">
          <span className="logo-blue">Wobble</span>
          <span className="logo-coral">Buddies:</span>
          <span className="logo-pill">Playground</span>
        </h1>
        <p className="tagline">Grab, wobble, and save your buddy.</p>
      </div>

      <div className="menu-card">
        <div className="mode-grid" aria-label="Select play mode">
          <button className="mode-button mode-solo" type="button" onPointerEnter={preloadGameScene} onFocus={preloadGameScene} onClick={() => launch('solo')}>
            <span className="button-icon">▶</span><span><strong>Play Solo</strong><small>Take on the playground.</small></span>
          </button>
          <button className="mode-button mode-coop" type="button" onPointerEnter={preloadGameScene} onFocus={preloadGameScene} onClick={() => launch('local-coop')}>
            <span className="button-icon buddies-icon">●●</span><span><strong>Co-op Rescue</strong><small>Practice the Buddy Link save.</small></span>
          </button>
          <button className="mode-button mode-run" type="button" onPointerEnter={preloadGameScene} onFocus={preloadGameScene} onClick={() => launch('local-coop-run')}>
            <span className="button-icon buddies-icon">●●</span><span><strong>Local Co-op Run</strong><small>Cross all five zones together.</small></span>
          </button>
        </div>
        <div className="preplay-row">
          <div className="quality-picker" aria-label="Graphics quality">
            <span>Graphics</span>
            <button type="button" data-testid="graphics-standard" aria-pressed={graphicsPreset === 'standard'} onClick={() => setGraphicsPreset('standard')}>Standard</button>
            <button type="button" data-testid="graphics-reduced" aria-pressed={graphicsPreset === 'reduced'} onClick={() => setGraphicsPreset('reduced')}>Reduced effects</button>
          </div>
          <p className="controller-status" data-testid="gamepad-status" data-connected={controllerPresent}>
            P2 <strong>{controllerPresent ? 'controller ready' : 'keyboard fallback'}</strong>
          </p>
        </div>
        <div className="controls-title">Controls</div>
        <div className="control-grid">
          {controls.map((control) => <div className="control-item" key={control.label}><span className="keycap">{control.key}</span><span>{control.label}</span></div>)}
        </div>
        <p className="gamepad-note">WebGL loads on play intent · Co-op Run: Player 2 uses gamepad or arrow keys.</p>
      </div>
    </section>
  );
}
