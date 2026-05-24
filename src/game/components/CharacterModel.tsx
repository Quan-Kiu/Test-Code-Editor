import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import type { PlayerId } from '../types';
import { useGameStore } from '../state/gameStore';

const palette = {
  player1: { body: '#5AA7FF', shadow: '#438ee9' },
  player2: { body: '#FF8A7A', shadow: '#ec7165' },
} as const;

interface CharacterModelProps {
  playerId: PlayerId;
  celebratory?: boolean;
}

export function CharacterModel({ playerId, celebratory = false }: CharacterModelProps) {
  const animated = useRef<Group>(null);
  const colors = palette[playerId];
  const leftTarget = useGameStore((state) => state.activeGrabs[playerId].left);
  const rightTarget = useGameStore((state) => state.activeGrabs[playerId].right);
  const leftRaised = leftTarget !== null;
  const rightRaised = rightTarget !== null;

  useFrame(({ clock }) => {
    if (!animated.current) return;
    const t = clock.elapsedTime + (playerId === 'player2' ? 1.1 : 0);
    const wobble = Math.sin(t * (celebratory ? 8 : 2.5)) * (celebratory ? 0.075 : 0.03);
    animated.current.rotation.z = wobble;
    animated.current.position.y = celebratory ? Math.abs(Math.sin(t * 5)) * 0.22 : 0;
  });

  return (
    <group ref={animated}>
        <mesh castShadow position={[0, 0.8, 0]} scale={[0.98, 1.15, 0.86]}>
          <capsuleGeometry args={[0.55, 0.74, 8, 16]} />
          <meshStandardMaterial color={colors.body} roughness={0.56} />
        </mesh>
        <mesh castShadow position={leftRaised ? [-0.84, 1.32, 0.06] : [-0.64, 0.73, 0]} rotation={[0, 0, leftRaised ? -1.28 : -0.18]}>
          <capsuleGeometry args={[0.12, 0.62, 6, 10]} />
          <meshStandardMaterial color={colors.body} emissive={leftRaised ? '#FFD37A' : '#000000'} emissiveIntensity={leftRaised ? 0.48 : 0} roughness={0.55} />
        </mesh>
        {leftRaised && <pointLight position={[-0.95, 1.48, 0.15]} color="#FFD37A" intensity={1.1} distance={2.4} />}
        <mesh castShadow position={rightRaised ? [0.84, 1.32, 0.06] : [0.64, 0.73, 0]} rotation={[0, 0, rightRaised ? 1.28 : 0.18]}>
          <capsuleGeometry args={[0.12, 0.62, 6, 10]} />
          <meshStandardMaterial color={colors.body} emissive={rightRaised ? '#FFD37A' : '#000000'} emissiveIntensity={rightRaised ? 0.48 : 0} roughness={0.55} />
        </mesh>
        {rightRaised && <pointLight position={[0.95, 1.48, 0.15]} color="#FFD37A" intensity={1.1} distance={2.4} />}
        <mesh castShadow position={[-0.27, -0.04, 0]} scale={[1, 0.65, 1]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color={colors.shadow} roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0.27, -0.04, 0]} scale={[1, 0.65, 1]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color={colors.shadow} roughness={0.65} />
        </mesh>
        <mesh position={[-0.2, 1.13, 0.47]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#132037" />
        </mesh>
        <mesh position={[0.2, 1.13, 0.47]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#132037" />
        </mesh>
        <mesh position={[0, 0.94, 0.49]} scale={[1, 0.65, 0.5]}>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color="#17233a" />
        </mesh>
        <mesh position={[0, 0.97, 0.55]} scale={[0.65, 0.25, 0.25]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ff9e8e" />
        </mesh>
    </group>
  );
}
