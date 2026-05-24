import { useFrame } from '@react-three/fiber';
import type { RefObject } from 'react';
import { Vector3 } from 'three';
import type { RapierRigidBody } from '@react-three/rapier';
import { readControls } from '../input/inputController';
import { useGameStore } from '../state/gameStore';
import type { GrabHand, GrabTargetId } from '../types';

const HANDS: GrabHand[] = ['left', 'right'];
const ACQUIRE_DISTANCE = 2.85;
const SPRING_STRENGTH = 0.055;
const MAX_IMPULSE = 0.24;

export function useGrabConstraint(body: RefObject<RapierRigidBody | null>, targetId: GrabTargetId): void {
  useFrame(() => {
    const rigidBody = body.current;
    const state = useGameStore.getState();
    if (!rigidBody || state.status !== 'playing') return;

    const playerPosition = new Vector3(...state.players.player1.position);
    const objectPosition = rigidBody.translation();
    const distance = playerPosition.distanceTo(new Vector3(objectPosition.x, objectPosition.y, objectPosition.z));
    const controls = readControls('player1');

    if (distance < ACQUIRE_DISTANCE) {
      state.setNearbyTarget('player1', targetId);
      HANDS.forEach((hand) => {
        const held = hand === 'left' ? controls.leftGrab : controls.rightGrab;
        if (held) state.tryGrab('player1', hand, targetId);
      });
    } else if (state.nearbyTargets.player1 === targetId && !state.activeGrabs.player1.left && !state.activeGrabs.player1.right) {
      state.setNearbyTarget('player1', null);
    }

    HANDS.forEach((hand) => {
      const held = hand === 'left' ? controls.leftGrab : controls.rightGrab;
      if (!held && state.activeGrabs.player1[hand] === targetId) state.releaseGrab('player1', hand);
    });

    const latest = useGameStore.getState();
    const grabbed = HANDS.some((hand) => latest.activeGrabs.player1[hand] === targetId);
    if (!grabbed) return;
    const anchor = playerPosition.clone().add(new Vector3(1.05, 0.25, 0));
    const displacement = anchor.sub(new Vector3(objectPosition.x, objectPosition.y, objectPosition.z));
    const impulse = displacement.multiplyScalar(SPRING_STRENGTH);
    if (impulse.length() > MAX_IMPULSE) impulse.setLength(MAX_IMPULSE);
    rigidBody.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
  });
}
