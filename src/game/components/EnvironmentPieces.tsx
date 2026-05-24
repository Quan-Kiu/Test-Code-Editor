import { CuboidCollider, RigidBody } from '@react-three/rapier';
import type { ReactNode } from 'react';

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  children?: ReactNode;
}

export function FloatingPlatform({ position, size, color = '#7ED68C', children }: PlatformProps) {
  return (
    <>
      <RigidBody type="fixed" position={position} colliders={false}>
        <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} friction={1.2} />
        <mesh receiveShadow castShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
      </RigidBody>
      <group position={position}>
        <mesh position={[0, -size[1] / 2 - 1.2, 0]} castShadow>
          <coneGeometry args={[Math.max(size[0], size[2]) * 0.43, 2.7, 6]} />
          <meshStandardMaterial color="#81739B" roughness={1} />
        </mesh>
        {children}
      </group>
    </>
  );
}

export function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 1, 8]} />
        <meshStandardMaterial color="#B98554" />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <coneGeometry args={[0.65, 1.35, 6]} />
        <meshStandardMaterial color="#65B77B" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2, 0]}>
        <coneGeometry args={[0.48, 1.05, 6]} />
        <meshStandardMaterial color="#83C987" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Flower({ position, color = '#FF8AAB' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (Math.PI * 2 * index) / 5;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.13, 0.035, Math.sin(angle) * 0.13]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.11, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 8]} />
        <meshStandardMaterial color="#FFD37A" />
      </mesh>
    </group>
  );
}

export function CloudPuff({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[[0, 0, 0], [0.9, 0.15, 0], [-0.8, 0.05, 0], [0.25, 0.42, 0]].map((p, index) => (
        <mesh key={index} position={p as [number, number, number]}>
          <sphereGeometry args={[0.7, 10, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.65} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
