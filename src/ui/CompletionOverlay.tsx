import type { CSSProperties } from 'react';
import { formatTime, useGameStore } from '../game/state/gameStore';
import { useDialogFocus } from './useDialogFocus';

const celebrationPieces = Array.from({ length: 10 }, (_, index) => index);

export function CompletionOverlay() {
  const elapsed = useGameStore((state) => state.elapsedSeconds);
  const mode = useGameStore((state) => state.mode);
  const restartLevel = useGameStore((state) => state.restartLevel);
  const backToMenu = useGameStore((state) => state.backToMenu);
  const dialogRef = useDialogFocus<HTMLDivElement>();

  return (
    <section className="overlay completion-celebration" aria-label="Level complete">
      <div className="celebration-burst" aria-hidden="true">
        {celebrationPieces.map((piece) => <span key={piece} style={{ '--piece': piece } as CSSProperties} />)}
      </div>
      <div ref={dialogRef} className="modal completion-modal" role="dialog" aria-modal="true" aria-labelledby="complete-title">
        <div className="completion-ribbon">★ Playground Complete! ★</div>
        <div className="completion-buddies" aria-hidden="true">
          <span className="result-buddy blue"><i /></span>
          <span className="result-star">★</span>
          <span className="result-buddy coral"><i /></span>
        </div>
        <h2 id="complete-title">Great wobble!</h2>
        <div className="result-time"><small>Your time</small><strong>◷ {formatTime(elapsed)}</strong></div>
        <p>{mode !== 'solo' ? 'Both buddies reached the finish!' : 'You reached the finish gate!'}</p>
        <div className="reward-pill" aria-label="Playground star earned"><span>★</span> Playground Star Earned</div>
        <div className="completion-actions">
          <button className="dialog-button primary" onClick={restartLevel}>▶ Play Again</button>
          <button className="dialog-button secondary" onClick={backToMenu}>⌂ Back to Menu</button>
        </div>
      </div>
    </section>
  );
}
