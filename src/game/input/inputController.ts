import type { PlayerId } from '../types';

const heldKeys = new Set<string>();
const pressedKeys = new Set<string>();
const heldMouseButtons = new Set<number>();
let installed = false;
let orbitDeltaX = 0;
let orbitDeltaY = 0;
let cameraYaw = Math.atan2(7, 14.5);

const preventGameplayScroll = (event: KeyboardEvent): void => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
    event.preventDefault();
  }
};

const isOrbitDragActive = (): boolean => heldMouseButtons.has(1) || (heldKeys.has('AltLeft') && heldMouseButtons.has(0));

export const installInputController = (): (() => void) => {
  if (installed) return () => undefined;
  installed = true;

  const keyDown = (event: KeyboardEvent) => {
    preventGameplayScroll(event);
    if (!heldKeys.has(event.code)) pressedKeys.add(event.code);
    heldKeys.add(event.code);
  };
  const keyUp = (event: KeyboardEvent) => heldKeys.delete(event.code);
  const pointerDown = (event: MouseEvent) => {
    heldMouseButtons.add(event.button);
    if (event.button === 1) event.preventDefault();
  };
  const pointerMove = (event: MouseEvent) => {
    if (!isOrbitDragActive()) return;
    orbitDeltaX += event.movementX;
    orbitDeltaY += event.movementY;
  };
  const pointerUp = (event: MouseEvent) => heldMouseButtons.delete(event.button);
  const clear = () => {
    heldKeys.clear();
    pressedKeys.clear();
    heldMouseButtons.clear();
    orbitDeltaX = 0;
    orbitDeltaY = 0;
  };
  const disableMenu = (event: MouseEvent) => event.preventDefault();

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  window.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);
  window.addEventListener('blur', clear);
  window.addEventListener('contextmenu', disableMenu);

  return () => {
    installed = false;
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
    window.removeEventListener('mousedown', pointerDown);
    window.removeEventListener('mousemove', pointerMove);
    window.removeEventListener('mouseup', pointerUp);
    window.removeEventListener('blur', clear);
    window.removeEventListener('contextmenu', disableMenu);
    clear();
  };
};

export const consumeOrbitDelta = (): { x: number; y: number } => {
  const delta = { x: orbitDeltaX, y: orbitDeltaY };
  orbitDeltaX = 0;
  orbitDeltaY = 0;
  return delta;
};

export const setCameraYaw = (yaw: number): void => {
  cameraYaw = yaw;
};

export const getCameraYaw = (): number => cameraYaw;

export interface ControlSnapshot {
  horizontal: number;
  forward: number;
  jump: boolean;
  leftGrab: boolean;
  rightGrab: boolean;
  grabbing: boolean;
  reset: boolean;
}

const pressed = (code: string): boolean => {
  if (!pressedKeys.has(code)) return false;
  pressedKeys.delete(code);
  return true;
};


export const consumeJumpRequest = (playerId: PlayerId): boolean => pressed(playerId === 'player1' ? 'Space' : 'Enter');

const readGamepad = (): ControlSnapshot | null => {
  const gamepad = navigator.getGamepads?.().find((pad) => pad !== null);
  if (!gamepad) return null;
  const deadzone = (value: number) => Math.abs(value) > 0.18 ? value : 0;
  const leftGrab = Boolean(gamepad.buttons[6]?.pressed);
  const rightGrab = Boolean(gamepad.buttons[7]?.pressed);
  return {
    horizontal: deadzone(gamepad.axes[0] ?? 0),
    forward: deadzone(gamepad.axes[1] ?? 0),
    jump: Boolean(gamepad.buttons[0]?.pressed),
    leftGrab,
    rightGrab,
    grabbing: leftGrab || rightGrab,
    reset: Boolean(gamepad.buttons[1]?.pressed),
  };
};

export const readControls = (playerId: PlayerId): ControlSnapshot => {
  if (playerId === 'player2') {
    const gamepad = readGamepad();
    if (gamepad) return gamepad;
    const leftGrab = heldKeys.has('ShiftRight');
    const rightGrab = heldKeys.has('Slash');
    return {
      horizontal: Number(heldKeys.has('ArrowRight')) - Number(heldKeys.has('ArrowLeft')),
      forward: Number(heldKeys.has('ArrowDown')) - Number(heldKeys.has('ArrowUp')),
      jump: heldKeys.has('Enter'),
      leftGrab,
      rightGrab,
      grabbing: leftGrab || rightGrab,
      reset: pressed('Backspace'),
    };
  }

  const leftGrab = heldMouseButtons.has(0) && !heldKeys.has('AltLeft');
  const rightGrab = heldMouseButtons.has(2);
  return {
    horizontal: Number(heldKeys.has('KeyD')) - Number(heldKeys.has('KeyA')),
    forward: Number(heldKeys.has('KeyS')) - Number(heldKeys.has('KeyW')),
    jump: heldKeys.has('Space'),
    leftGrab,
    rightGrab,
    grabbing: leftGrab || rightGrab,
    reset: pressed('KeyR'),
  };
};
