import { lazy, Suspense, useEffect } from 'react';
import { installInputController } from '../game/input/inputController';
import { useGameStore } from '../game/state/gameStore';
import { MenuScreen } from '../ui/MenuScreen';
import { HUD } from '../ui/HUD';
import { PauseOverlay } from '../ui/PauseOverlay';
import { CompletionOverlay } from '../ui/CompletionOverlay';
import { loadGameScene } from './gameSceneLoader';

const LazyGameScene = lazy(loadGameScene);

function GameplayLoading() {
  return (
    <div className="scene-loading" role="status" aria-live="polite">
      <span className="loading-buddy blue" aria-hidden="true" />
      <span className="loading-buddy coral" aria-hidden="true" />
      <strong>Rolling into the playground…</strong>
    </div>
  );
}

export function GameApp() {
  const status = useGameStore((state) => state.status);
  const tick = useGameStore((state) => state.tick);
  const pause = useGameStore((state) => state.pause);
  const resume = useGameStore((state) => state.resume);

  useEffect(() => installInputController(), []);

  useEffect(() => {
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [tick]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.code !== 'Escape') return;
      if (status === 'playing') pause();
      if (status === 'paused') resume();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [status, pause, resume]);

  const gameplayVisible = status === 'playing' || status === 'paused';

  return (
    <main className={`game-shell ${status === 'completed' ? 'completion-shell' : ''}`} aria-label="Wobble Buddies Playground application">
      {status === 'menu' && <MenuScreen />}
      {gameplayVisible && (
        <Suspense fallback={<GameplayLoading />}>
          <LazyGameScene />
        </Suspense>
      )}
      {gameplayVisible && <HUD />}
      {status === 'paused' && <PauseOverlay />}
      {status === 'completed' && <CompletionOverlay />}
    </main>
  );
}
