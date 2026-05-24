import { useGameStore } from '../game/state/gameStore';
import { useDialogFocus } from './useDialogFocus';

export function PauseOverlay() {
  const resume = useGameStore((state) => state.resume);
  const restartFromCheckpoint = useGameStore((state) => state.restartFromCheckpoint);
  const restartLevel = useGameStore((state) => state.restartLevel);
  const backToMenu = useGameStore((state) => state.backToMenu);
  const dialogRef = useDialogFocus<HTMLDivElement>();

  return (
    <section className="overlay veil" aria-label="Paused game">
      <div ref={dialogRef} className="modal pause-modal" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <h2 id="pause-title">Paused</h2>
        <p>Take a breath, then wobble on!</p>
        <button className="dialog-button primary" onClick={resume}>▶ Resume</button>
        <button className="dialog-button secondary" onClick={restartFromCheckpoint}>↻ Restart from Checkpoint</button>
        <button className="dialog-button secondary" onClick={restartLevel}>↻ Restart Level</button>
        <button className="dialog-button coral" onClick={backToMenu}>⌂ Back to Menu</button>
        <div className="controls-reminder"><strong>Controls Reminder</strong><span><b>WASD</b> Move</span><span><b>Space</b> Jump</span><span><b>R</b> Respawn</span></div>
      </div>
    </section>
  );
}
