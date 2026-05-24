import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { useRef } from 'react';
import { consumeOrbitDelta, setCameraYaw } from '../input/inputController';
import { useGameStore } from '../state/gameStore';
import { isCoopMode } from '../types';

const MENU_POSITION = new Vector3(10.5, 11.6, 18.8);
const MENU_TARGET = new Vector3(8.2, 0.9, 0);
const ORBIT_SENSITIVITY = 0.005;

export function SharedCamera() {
  const { camera } = useThree();
  const smoothedTarget = useRef(new Vector3(8.2, 0.9, 0));
  const desiredPosition = useRef(new Vector3());
  const targetPosition = useRef(new Vector3());
  const yaw = useRef(Math.atan2(7, 14.5));
  const pitch = useRef(0.5);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    const positionAlpha = 1 - Math.exp(-delta * 8.5);
    const targetAlpha = 1 - Math.exp(-delta * 12);

    if (state.status === 'menu') {
      desiredPosition.current.copy(MENU_POSITION);
      targetPosition.current.copy(MENU_TARGET);
    } else {
      const drag = consumeOrbitDelta();
      yaw.current -= drag.x * ORBIT_SENSITIVITY;
      pitch.current = MathUtils.clamp(pitch.current - drag.y * ORBIT_SENSITIVITY, 0.2, 1.05);
      setCameraYaw(yaw.current);

      const p1 = new Vector3(...state.players.player1.position);
      const p2 = isCoopMode(state.mode) ? new Vector3(...state.players.player2.position) : p1;
      targetPosition.current.addVectors(p1, p2).multiplyScalar(0.5).add(new Vector3(0, 0.7, 0));
      smoothedTarget.current.x = MathUtils.damp(smoothedTarget.current.x, targetPosition.current.x, 12, delta);
      smoothedTarget.current.z = MathUtils.damp(smoothedTarget.current.z, targetPosition.current.z, 12, delta);
      // Keep vertical motion visible during jumps while eliminating follow jitter.
      smoothedTarget.current.y = MathUtils.damp(smoothedTarget.current.y, targetPosition.current.y, 2.1, delta);

      const separation = p1.distanceTo(p2);
      const distance = 15.8 + Math.min(separation * 0.28, 4.3);
      const horizontalDistance = Math.cos(pitch.current) * distance;
      desiredPosition.current.set(
        smoothedTarget.current.x + Math.sin(yaw.current) * horizontalDistance,
        smoothedTarget.current.y + Math.sin(pitch.current) * distance,
        smoothedTarget.current.z + Math.cos(yaw.current) * horizontalDistance,
      );
    }

    if (state.status === 'menu') smoothedTarget.current.lerp(targetPosition.current, targetAlpha);
    camera.position.lerp(desiredPosition.current, positionAlpha);
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}
