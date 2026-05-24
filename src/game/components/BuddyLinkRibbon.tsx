import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Quaternion, Vector3, type Group, type Mesh } from 'three';
import { readControls } from '../input/inputController';
import { useGameStore } from '../state/gameStore';

export function BuddyLinkRibbon() {
  const group = useRef<Group>(null);
  const cylinder = useRef<Mesh>(null);
  const mode = useGameStore((state) => state.mode);
  const status = useGameStore((state) => state.status);
  const setLinkActive = useGameStore((state) => state.setLinkActive);
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
    const grabbing = readControls('player1').grabbing || readControls('player2').grabbing;
    const active = mode === 'local-coop' && status === 'playing' && grabbing && distance < 4.2;
    group.current.visible = active;
    if (state.linkActive !== active) setLinkActive(active);
    if (!active) return;
    midpoint.addVectors(p1, p2).multiplyScalar(0.5);
    group.current.position.copy(midpoint);
    quaternion.setFromUnitVectors(up, vector.clone().normalize());
    group.current.quaternion.copy(quaternion);
    cylinder.current.scale.y = distance;
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={cylinder}>
        <cylinderGeometry args={[0.055, 0.055, 1, 10]} />
        <meshStandardMaterial color="#FFD37A" emissive="#FFD37A" emissiveIntensity={1.2} />
      </mesh>
      <pointLight color="#FFD37A" intensity={0.8} distance={3} />
    </group>
  );
}
