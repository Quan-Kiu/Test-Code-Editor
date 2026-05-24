import { create } from 'zustand';
import { isRescuePracticeMode, type DoorPhase, type FinalePhase, type GameMode, type GraphicsPreset, type GameStatus, type GrabHand, type GrabTargetId, type PlayerId, type RescuePhase, type Vector3Tuple, type ZoneDefinition, type ZoneId } from '../types';

export const ZONES: ZoneDefinition[] = [
  { id: 'zone-1', number: 1, title: 'Tutorial Yard', hint: 'Move beside the glowing crate. Hold left or right grab to pull it.' },
  { id: 'zone-2', number: 2, title: 'Wobble Bridge', hint: 'Stay balanced as you cross the bridge.' },
  { id: 'zone-3', number: 3, title: 'Heavy Door Puzzle', hint: 'Find the lever and keep the path open.' },
  { id: 'zone-4', number: 4, title: 'Buddy Rescue Gap', hint: 'Reach the ledge, grab your buddy, and pull them safely upward.' },
  { id: 'zone-5', number: 5, title: 'Rope Swing Finale', hint: 'Build momentum and reach the glowing gate.' },
];

const START_SPAWN: Vector3Tuple = [-4, 2.2, 0];
const MID_SPAWN: Vector3Tuple = [40.5, 2.2, 0];
const RESCUE_PRACTICE_SPAWN: Vector3Tuple = [35.2, 2.2, 0];
const EMPTY_HANDS = (): Record<GrabHand, GrabTargetId | null> => ({ left: null, right: null });
const EMPTY_GRABS = (): Record<PlayerId, Record<GrabHand, GrabTargetId | null>> => ({
  player1: EMPTY_HANDS(),
  player2: EMPTY_HANDS(),
});

const targetLabel = (target: GrabTargetId): string => {
  if (target === 'tutorial-crate') return 'crate';
  if (target === 'heavy-crate') return 'heavy crate';
  return 'buddy';
};

interface PlayerRuntime {
  position: Vector3Tuple;
  respawnToken: number;
  finished: boolean;
}

interface GameState {
  mode: GameMode;
  graphicsPreset: GraphicsPreset;
  status: GameStatus;
  zone: ZoneId;
  activeCheckpointId: 'start' | 'mid';
  checkpointPosition: Vector3Tuple;
  elapsedSeconds: number;
  toast: string | null;
  toastToken: number;
  linkActive: boolean;
  activeGrabs: Record<PlayerId, Record<GrabHand, GrabTargetId | null>>;
  nearbyTargets: Record<PlayerId, GrabTargetId | null>;
  interactionMessage: string | null;
  rescuePhase: RescuePhase;
  rescueSetupToken: number;
  doorPhase: DoorPhase;
  finalePhase: FinalePhase;
  finaleLaunchToken: number;
  players: Record<PlayerId, PlayerRuntime>;
  startGame: (mode: GameMode) => void;
  setGraphicsPreset: (preset: GraphicsPreset) => void;
  backToMenu: () => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  setZone: (zone: ZoneId) => void;
  activateCheckpoint: () => void;
  updatePlayerPosition: (id: PlayerId, position: Vector3Tuple) => void;
  requestRespawn: (id: PlayerId) => void;
  restartFromCheckpoint: () => void;
  restartLevel: () => void;
  setPlayerFinished: (id: PlayerId, inFinish: boolean) => void;
  setLinkActive: (active: boolean) => void;
  setNearbyTarget: (id: PlayerId, target: GrabTargetId | null) => void;
  tryGrab: (id: PlayerId, hand: GrabHand, target: GrabTargetId) => void;
  releaseGrab: (id: PlayerId, hand: GrabHand) => void;
  clearGrabs: (message?: string | null) => void;
  stageRescue: () => void;
  markRescueLinked: () => void;
  markRescued: () => void;
  openHeavyDoor: () => void;
  readyFinale: () => void;
  triggerFinaleLaunch: () => void;
  releaseFinaleRope: () => void;
  clearToast: () => void;
}

const makePlayers = (mode: GameMode = 'solo'): Record<PlayerId, PlayerRuntime> => ({
  player1: { position: START_SPAWN, respawnToken: 0, finished: false },
  player2: { position: isRescuePracticeMode(mode) ? [-6, 2.2, 1.4] : [-4, 2.2, 1.45], respawnToken: 0, finished: false },
});

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'solo',
  graphicsPreset: 'standard',
  status: 'menu',
  zone: 'zone-1',
  activeCheckpointId: 'start',
  checkpointPosition: START_SPAWN,
  elapsedSeconds: 0,
  toast: null,
  toastToken: 0,
  linkActive: false,
  activeGrabs: EMPTY_GRABS(),
  nearbyTargets: { player1: null, player2: null },
  interactionMessage: null,
  rescuePhase: 'idle',
  rescueSetupToken: 0,
  doorPhase: 'closed',
  finalePhase: 'approach',
  finaleLaunchToken: 0,
  players: makePlayers(),
  setGraphicsPreset: (graphicsPreset) => set({ graphicsPreset }),
  startGame: (mode) => set((state) => {
    const rescuePractice = isRescuePracticeMode(mode);
    return {
      mode,
      status: 'playing',
      zone: rescuePractice ? 'zone-4' : 'zone-1',
      activeCheckpointId: 'start',
      checkpointPosition: rescuePractice ? RESCUE_PRACTICE_SPAWN : START_SPAWN,
      elapsedSeconds: 0,
      toast: null,
      toastToken: 0,
      linkActive: false,
      activeGrabs: EMPTY_GRABS(),
      nearbyTargets: { player1: null, player2: null },
      interactionMessage: rescuePractice ? 'Buddy needs help! Grab them from the rescue ledge.' : null,
      rescuePhase: rescuePractice ? 'staged' : 'idle',
      rescueSetupToken: rescuePractice ? state.rescueSetupToken + 1 : state.rescueSetupToken,
      doorPhase: 'closed',
      finalePhase: 'approach',
      finaleLaunchToken: 0,
      players: makePlayers(mode),
    };
  }),
  backToMenu: () => set({ status: 'menu', zone: 'zone-1', toast: null, linkActive: false, activeGrabs: EMPTY_GRABS(), interactionMessage: null, rescuePhase: 'idle', doorPhase: 'closed', finalePhase: 'approach', finaleLaunchToken: 0 }),
  pause: () => {
    if (get().status === 'playing') set({ status: 'paused', linkActive: false, activeGrabs: EMPTY_GRABS(), interactionMessage: null });
  },
  resume: () => {
    if (get().status === 'paused') set({ status: 'playing' });
  },
  tick: () => {
    if (get().status === 'playing') set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
  },
  setZone: (zone) => {
    if (get().status === 'playing' && get().zone !== zone) set({ zone });
  },
  activateCheckpoint: () => {
    if (get().activeCheckpointId !== 'mid') {
      set((state) => ({
        activeCheckpointId: 'mid',
        checkpointPosition: MID_SPAWN,
        toast: 'Checkpoint Reached!',
        toastToken: state.toastToken + 1,
      }));
    }
  },
  updatePlayerPosition: (id, position) => set((state) => ({
    players: {
      ...state.players,
      [id]: { ...state.players[id], position },
    },
  })),
  requestRespawn: (id) => set((state) => ({
    players: {
      ...state.players,
      [id]: { ...state.players[id], respawnToken: state.players[id].respawnToken + 1, finished: false },
    },
    toast: 'Back to checkpoint!',
    toastToken: state.toastToken + 1,
    linkActive: false,
    activeGrabs: EMPTY_GRABS(),
    interactionMessage: state.interactionMessage?.includes('returned to') ? state.interactionMessage : 'Returned to checkpoint — try again.',
  })),
  restartFromCheckpoint: () => set((state) => ({
    status: 'playing',
    linkActive: false,
    activeGrabs: EMPTY_GRABS(),
    interactionMessage: null,
    players: {
      player1: { ...state.players.player1, respawnToken: state.players.player1.respawnToken + 1, finished: false },
      player2: { ...state.players.player2, respawnToken: state.players.player2.respawnToken + 1, finished: false },
    },
  })),
  restartLevel: () => get().startGame(get().mode),
  setPlayerFinished: (id, inFinish) => {
    const state = get();
    const updated = {
      ...state.players,
      [id]: { ...state.players[id], finished: inFinish },
    };
    const complete = state.mode === 'solo'
      ? updated.player1.finished
      : updated.player1.finished && updated.player2.finished;
    set({
      players: updated,
      status: complete ? 'completed' : state.status,
      toast: complete ? null : state.toast,
      linkActive: complete ? false : state.linkActive,
      activeGrabs: complete ? EMPTY_GRABS() : state.activeGrabs,
    });
  },
  setLinkActive: (active) => {
    if (get().linkActive !== active) set({ linkActive: active });
  },
  setNearbyTarget: (id, target) => {
    if (get().nearbyTargets[id] !== target) {
      set((state) => ({ nearbyTargets: { ...state.nearbyTargets, [id]: target } }));
    }
  },
  tryGrab: (id, hand, target) => {
    const state = get();
    if (state.activeGrabs[id][hand] === target) return;
    if (state.activeGrabs[id][hand] !== null) return;
    set({
      activeGrabs: {
        ...state.activeGrabs,
        [id]: { ...state.activeGrabs[id], [hand]: target },
      },
      interactionMessage: `${hand === 'left' ? 'Left' : 'Right'} hand grabbed ${targetLabel(target)}. Release to let go.`,
    });
  },
  releaseGrab: (id, hand) => {
    const state = get();
    const target = state.activeGrabs[id][hand];
    if (!target) return;
    set({
      activeGrabs: {
        ...state.activeGrabs,
        [id]: { ...state.activeGrabs[id], [hand]: null },
      },
      interactionMessage: `${hand === 'left' ? 'Left' : 'Right'} hand released ${targetLabel(target)}.`,
    });
  },
  clearGrabs: (message = null) => set({ activeGrabs: EMPTY_GRABS(), linkActive: false, interactionMessage: message }),
  stageRescue: () => {
    const state = get();
    if (!isRescuePracticeMode(state.mode) || state.rescuePhase !== 'idle') return;
    set({
      rescuePhase: 'staged',
      rescueSetupToken: state.rescueSetupToken + 1,
      interactionMessage: 'Buddy needs help! Grab them from the rescue ledge.',
    });
  },
  markRescueLinked: () => {
    if (get().rescuePhase === 'staged') set({ rescuePhase: 'linked', interactionMessage: 'Buddy Link active — pull upward to rescue!' });
  },
  markRescued: () => {
    if (get().rescuePhase !== 'rescued') {
      set((state) => ({ rescuePhase: 'rescued', toast: 'Buddy Rescued!', toastToken: state.toastToken + 1, interactionMessage: 'Rescue complete — checkpoint ahead!' }));
    }
  },
  openHeavyDoor: () => {
    if (get().doorPhase !== 'open') {
      set((state) => ({ doorPhase: 'open', toast: 'Door Open!', toastToken: state.toastToken + 1, interactionMessage: 'Switch activated — the heavy door is open.' }));
    }
  },
  readyFinale: () => {
    if (get().finalePhase === 'approach') set({ finalePhase: 'ready', interactionMessage: 'Rope in reach — hold a grab hand to launch.' });
  },
  triggerFinaleLaunch: () => {
    if (get().finalePhase === 'ready') {
      set((state) => ({ finalePhase: 'swinging', finaleLaunchToken: state.finaleLaunchToken + 1, interactionMessage: 'Rope grabbed — swing toward the glowing gate!' }));
    }
  },
  releaseFinaleRope: () => {
    if (get().finalePhase === 'swinging') set({ finalePhase: 'launched', interactionMessage: 'Launch complete — land in the glowing gate!' });
  },
  clearToast: () => set({ toast: null }),
}));

export const formatTime = (elapsedSeconds: number): string => {
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
