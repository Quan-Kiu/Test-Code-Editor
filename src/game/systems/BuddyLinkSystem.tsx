import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Quaternion, Vector3, type Group, type Mesh } from 'three';
import { readControls } from '../input/inputController';
import { useGameStore } from '../state/gameStore';
import type { GrabHand, PlayerId } from '../types';

const HANDS: GrabHand[] = ['left', 'right'];
const LINK_REACH = 4.8;

const oppositeBuddy = (playerId: PlayerId): PlayerId => playerId === 'player1' ? 'player2' : 'player1';

export function BuddyLinkSystem() {
  const group = useRef<Group>(null);
  const cylinder = useRef<Mesh>(null);
  const vector = useMemo(() => new Vector3(), []);
  const midpoint = useMemo(() => new Vector3(), []);
  const up = useMemo(() => new Vector3(0, 1, 0), []);
  const quaternion = useMemo(() => new Quaternion(), []);

  useFrame(() => {
    if (!group.current || !cylinder.current) return;
    const state = useGameStore.getState();
    const p1 = new Vector3(...state.players.player1.position).add(new Vector3(0, 0.95, 0));
    const p2 = new Vector3(...state.players.player2.position).add(new Vector3(0, 0.95, 0));
    vector.subVectors(p2, p1);
    const distance = vector.length();

    if (state.mode === 'local-coop' && state.status === 'playing') {
      (['player1', 'player2'] as PlayerId[]).forEach((playerId) => {
        const controls = readControls(playerId);
        const target = oppositeBuddy(playerId);
        if (distance < LINK_REACH) {
          state.setNearbyTarget(playerId, target);
          HANDS.forEach((hand) => {
            const held = hand === 'left' ? controls.leftGrab : controls.rightGrab;
            if (held) state.tryGrab(playerId, hand, target);
          });
        }
        HANDS.forEach((hand) => {
          const held = hand === 'left' ? controls.leftGrab : controls.rightGrab;
          if (!held && state.activeGrabs[playerId][hand] === target) state.releaseGrab(playerId, hand);
        });
      });
    }

    const latest = useGameStore.getState();
    const active = latest.mode === 'local-coop' && latest.status === 'playing' && (
      HANDS.some((hand) => latest.activeGrabs.player1[hand] === 'player2') ||
      HANDS.some((hand) => latest.activeGrabs.player2[hand] === 'player1')
    );
    group.current.visible = active;
    latest.setLinkActive(active);
    if (!active) return;
    latest.markRescueLinked();
    midpoint.addVectors(p1, p2).multiplyScalar(0.5);
    group.current.position.copy(midpoint);
    quaternion.setFromUnitVectors(up, vector.clone().normalize());
    group.current.quaternion.copy(quaternion);
    cylinder.current.scale.y = distance;
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={cylinder}>
        <cylinderGeometry args={[0.07, 0.07, 1, 10]} />
        <meshStandardMaterial color="#FFD37A" emissive="#FFD37A" emissiveIntensity={1.5} />
      </mesh>
      <pointLight color="#FFD37A" intensity={1.1} distance={4} />
    </group>
  );
}
