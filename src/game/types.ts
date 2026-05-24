export type GameMode = 'solo' | 'local-coop' | 'local-coop-run';
export type GraphicsPreset = 'standard' | 'reduced';

export const isCoopMode = (mode: GameMode): boolean => mode === 'local-coop' || mode === 'local-coop-run';
export const isRescuePracticeMode = (mode: GameMode): boolean => mode === 'local-coop';
export const isFullTraversalMode = (mode: GameMode): boolean => mode === 'solo' || mode === 'local-coop-run';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'completed';
export type PlayerId = 'player1' | 'player2';
export type ZoneId = 'zone-1' | 'zone-2' | 'zone-3' | 'zone-4' | 'zone-5';
export type Vector3Tuple = [number, number, number];
export type GrabHand = 'left' | 'right';
export type GrabTargetId = 'tutorial-crate' | 'heavy-crate' | 'player1' | 'player2';
export type RescuePhase = 'idle' | 'staged' | 'linked' | 'rescued';
export type DoorPhase = 'closed' | 'open';
export type FinalePhase = 'approach' | 'ready' | 'swinging' | 'launched';

export interface ZoneDefinition {
  id: ZoneId;
  number: number;
  title: string;
  hint: string;
}
