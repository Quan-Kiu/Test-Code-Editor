import { useEffect } from 'react';
import { formatTime, useGameStore, ZONES } from '../game/state/gameStore';

export function HUD() {
  const elapsedSeconds = useGameStore((state) => state.elapsedSeconds);
  const zone = useGameStore((state) => state.zone);
  const mode = useGameStore((state) => state.mode);
  const toast = useGameStore((state) => state.toast);
  const toastToken = useGameStore((state) => state.toastToken);
  const linkActive = useGameStore((state) => state.linkActive);
  const nearbyTarget = useGameStore((state) => state.nearbyTargets.player1);
  const interactionMessage = useGameStore((state) => state.interactionMessage);
  const player1Hands = useGameStore((state) => state.activeGrabs.player1);
  const rescuePhase = useGameStore((state) => state.rescuePhase);
  const doorPhase = useGameStore((state) => state.doorPhase);
  const finalePhase = useGameStore((state) => state.finalePhase);
  const clearToast = useGameStore((state) => state.clearToast);
  const definition = ZONES.find((item) => item.id === zone) ?? ZONES[0];
  const contextHint = zone === 'zone-4' && mode === 'solo'
    ? 'Cross the rescue ledge and touch the beacon checkpoint.'
    : definition.hint;

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(clearToast, 2200);
    return () => window.clearTimeout(timeout);
  }, [toast, toastToken, clearToast]);

  const showContext = mode === 'local-coop' || zone === 'zone-1' || zone === 'zone-3' || zone === 'zone-5';
  const fullCoopRun = mode === 'local-coop-run';

  const rescueCopy = rescuePhase === 'rescued'
    ? 'Buddy rescued! Reach the checkpoint together.'
    : linkActive
      ? 'Buddy Link active — pull upward!'
      : rescuePhase === 'staged'
        ? 'Buddy is hanging below. Grab to rescue!'
        : 'Grab your buddy to pull them up!';

  return (
    <section className="hud" aria-label="Gameplay status">
      <div className="hud-top">
        <div className="timer-pill" aria-label={`Elapsed time ${formatTime(elapsedSeconds)}`}>
          <span className="timer-icon">◷</span>
          <strong>{formatTime(elapsedSeconds)}</strong>
          <small>TIME</small>
        </div>
        <div className="progress-card">
          <strong>ZONE {definition.number} — {definition.title.toUpperCase()}</strong>
          <div className="progress-track" aria-hidden="true">
            {ZONES.map((item) => (
              <span key={item.id} className={item.number <= definition.number ? 'active' : ''} />
            ))}
            <span className="goal-dot">★</span>
          </div>
        </div>
        <div className="star-pill"><span>★</span> 0 / 1</div>
      </div>

      {showContext && <aside className="context-card">
        <strong>{definition.title}</strong>
        <p>{contextHint}</p>
        {zone === 'zone-1' && nearbyTarget === 'tutorial-crate' && <p className="buddy-prompt">Target ready: hold left or right grab.</p>}
        {zone === 'zone-3' && <p className="buddy-prompt" data-testid="door-status">{doorPhase === 'open' ? 'Door open — follow the glowing path.' : 'Step on the blue switch to open the door.'}</p>}
        {zone === 'zone-5' && mode !== 'local-coop' && <p className="buddy-prompt" data-testid="finale-status">{finalePhase === 'approach' ? 'Reach the glowing rope marker.' : finalePhase === 'ready' ? 'Hold a grab hand to swing.' : finalePhase === 'swinging' ? 'Rope held — release toward the gate!' : 'Launched — reach the finish gate!'}</p>}
        {zone === 'zone-4' && mode === 'local-coop' && <p className="buddy-prompt">Mouse: left/right hand · P2: Shift or /</p>}
      </aside>}

      {zone === 'zone-4' && mode === 'local-coop' && (
        <div className={`rescue-callout ${linkActive || rescuePhase === 'rescued' ? 'linked' : ''}`} role="status" data-testid="rescue-status">
          {rescueCopy}
        </div>
      )}

      {(player1Hands.left || player1Hands.right) && (
        <div className="hand-state-strip" aria-label="Raised hand status">
          {player1Hands.left && <strong className="hand-state active">LEFT HAND ↑ {player1Hands.left === 'player2' ? 'BUDDY LINK' : 'GRABBING'}</strong>}
          {player1Hands.right && <strong className="hand-state active">RIGHT HAND ↑ {player1Hands.right === 'player2' ? 'BUDDY LINK' : 'GRABBING'}</strong>}
        </div>
      )}

      {interactionMessage && (
        <div className={`interaction-feedback ${mode === 'local-coop' && zone === 'zone-4' ? 'rescue-feedback' : ''}`} role="status" data-testid="interaction-feedback">{interactionMessage}</div>
      )}
      {toast && <div className="toast" role="status">✓ {toast}</div>}

      <div className="respawn-pill"><span className="keycap key-small">R</span> Respawn · Space Jump · Drag / Middle mouse Orbit</div>
      {mode === 'local-coop' && (
        <div className="buddy-status">
          <span className="buddy-dot blue" />
          <span className="buddy-dot coral" />
          <div><strong>Rescue Practice</strong><small>Link, pull, and release safely.</small></div>
        </div>
      )}
      {fullCoopRun && (
        <div className="buddy-status coop-run-status" data-testid="coop-run-status">
          <span className="buddy-dot blue" />
          <span className="buddy-dot coral" />
          <div><strong>Local Co-op Run</strong><small>P2: gamepad / arrows · Both reach finish.</small></div>
        </div>
      )}
    </section>
  );
}
