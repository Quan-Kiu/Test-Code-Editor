import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useGameStore } from '../state/gameStore';
import { GrabFeedbackRing } from '../systems/GrabSystem';
import { useGrabConstraint } from '../systems/useGrabConstraint';
import type { GrabTargetId } from '../types';

interface PhysicsCrateProps {
  position: [number, number, number];
  heavy?: boolean;
  targetId: Extract<GrabTargetId, 'tutorial-crate' | 'heavy-crate'>;
}

export function PhysicsCrate({ position, heavy = false, targetId }: PhysicsCrateProps) {
  const body = useRef<RapierRigidBody>(null);
  const size = heavy ? 1.35 : 1.05;
  const near = useGameStore((state) => state.nearbyTargets.player1 === targetId);
  const grabbed = useGameStore((state) => state.activeGrabs.player1.left === targetId || state.activeGrabs.player1.right === targetId);
  useGrabConstraint(body, targetId);

  useFrame(() => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const current = rigidBody.translation();
    if (targetId === 'tutorial-crate') {
      const dataset = document.documentElement.dataset;
      dataset.tutorialCrateX = current.x.toFixed(3);
      dataset.tutorialCrateY = current.y.toFixed(3);
      dataset.tutorialCrateZ = current.z.toFixed(3);
    }
    if (current.y >= -3.25) return;
    rigidBody.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    rigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    const state = useGameStore.getState();
    state.clearGrabs(targetId === 'tutorial-crate' ? 'Crate returned to the tutorial start.' : 'Heavy crate returned to its start.');
    if (targetId === 'tutorial-crate') {
      document.documentElement.dataset.tutorialCrateRespawned = 'true';
    }
  });

  return (
    <RigidBody ref={body} name={targetId} position={position} colliders={false} mass={heavy ? 7 : 1.15} linearDamping={1.8} angularDamping={2} ccd>
      <CuboidCollider args={[size / 2, size / 2, size / 2]} friction={heavy ? 1.2 : 0.78} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color={heavy ? '#D49343' : '#E8AA51'}
          roughness={0.82}
          emissive={near || grabbed ? '#FFD37A' : '#000000'}
          emissiveIntensity={grabbed ? 0.48 : near ? 0.18 : 0}
        />
      </mesh>
      {[[-0.49, -0.49], [-0.49, 0.49], [0.49, -0.49], [0.49, 0.49]].map(([x, z], index) => (
        <mesh key={index} position={[x * size, 0, z * size]} scale={[0.1, 1.02, 0.1]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFF0D2" />
        </mesh>
      ))}
      <mesh position={[0, 0, size / 2 + 0.006]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 5]} />
        <meshStandardMaterial color="#FFD37A" emissive="#FFD37A" emissiveIntensity={grabbed ? 0.7 : 0.1} />
      </mesh>
      <GrabFeedbackRing active={near || grabbed} />
    </RigidBody>
  );
}
