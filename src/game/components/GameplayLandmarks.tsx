import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { readControls } from '../input/inputController';
import { useGameStore } from '../state/gameStore';
import { isFullTraversalMode, type PlayerId, type ZoneId } from '../types';
import { Flower, Tree } from './EnvironmentPieces';

const playerFromEvent = (objectName?: string): PlayerId | null => {
  if (objectName === 'player1' || objectName === 'player2') return objectName;
  return null;
};

export function WobbleBridge() {
  return (
    <RigidBody type="fixed" position={[11, -0.2, 0]} rotation={[0, 0, 0]} colliders={false}>
      <CuboidCollider args={[5.8, 0.22, 1.55]} friction={1.1} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[11.6, 0.42, 3.1]} />
        <meshStandardMaterial color="#6A98C9" roughness={0.8} />
      </mesh>
      {Array.from({ length: 10 }, (_, index) => (
        <mesh key={index} position={[-5.1 + index * 1.13, 0.27, 0]} castShadow>
          <boxGeometry args={[0.99, 0.18, 2.82]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#E9A772' : '#F18C91'} roughness={0.82} />
        </mesh>
      ))}
    </RigidBody>
  );
}

export function HeavyDoorLandmark() {
  const doorOpen = useGameStore((state) => state.doorPhase === 'open');
  const openHeavyDoor = useGameStore((state) => state.openHeavyDoor);

  return (
    <group position={[27.2, 0.5, 0]}>
      <RigidBody
        type="fixed"
        colliders={false}
        sensor
        position={[-4.85, 0.35, 0]}
        onIntersectionEnter={(event) => {
          if (playerFromEvent(event.other.rigidBodyObject?.name)) openHeavyDoor();
        }}
      >
        <CuboidCollider args={[1.3, 1.2, 2.1]} sensor />
      </RigidBody>
      <mesh castShadow position={[-2.5, 2.15, 0]}>
        <boxGeometry args={[0.7, 4.3, 0.7]} />
        <meshStandardMaterial color="#D4CCCF" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[2.5, 2.15, 0]}>
        <boxGeometry args={[0.7, 4.3, 0.7]} />
        <meshStandardMaterial color="#D4CCCF" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 4.25, 0]}>
        <boxGeometry args={[5.55, 0.75, 0.75]} />
        <meshStandardMaterial color="#D4CCCF" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[doorOpen ? -1.92 : -0.72, 2.08, 0]} rotation={[0, doorOpen ? -1.18 : -0.03, 0]}>
        <boxGeometry args={[2.25, 3.45, 0.26]} />
        <meshStandardMaterial color="#A96B45" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[doorOpen ? 1.92 : 0.72, 2.08, 0]} rotation={[0, doorOpen ? 1.18 : 0.03, 0]}>
        <boxGeometry args={[2.25, 3.45, 0.26]} />
        <meshStandardMaterial color="#A96B45" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 4.34, 0.48]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color={doorOpen ? '#70E2A1' : '#FFD37A'} emissive={doorOpen ? '#70E2A1' : '#F0A941'} emissiveIntensity={doorOpen ? 0.7 : 0.22} />
      </mesh>
      <Lever position={[-3.25, 0, -1.7]} active={doorOpen} />
      <FloorSwitch position={[-4.85, 0.05, 0]} active={doorOpen} />
      <Tree position={[4.4, 0.42, -2.1]} scale={0.72} />
      <Flower position={[-3.15, 0.44, 1.7]} />
      {doorOpen && <pointLight position={[0, 2.2, 0.8]} color="#70E2A1" intensity={1.7} distance={5.5} />}
    </group>
  );
}

function Lever({ position, active }: { position: [number, number, number]; active: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.42, 1]} />
        <meshStandardMaterial color="#7B95BE" />
      </mesh>
      <mesh castShadow position={[0, 1, 0]} rotation={[0, 0, active ? 0.48 : -0.48]}>
        <cylinderGeometry args={[0.09, 0.11, 1.35, 10]} />
        <meshStandardMaterial color="#805D53" />
      </mesh>
      <mesh castShadow position={[0.31, 1.58, 0]}>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial color={active ? '#70E2A1' : '#FF8A7A'} emissive={active ? '#70E2A1' : '#000000'} emissiveIntensity={active ? 0.5 : 0} />
      </mesh>
    </group>
  );
}

function FloorSwitch({ position, active }: { position: [number, number, number]; active: boolean }) {
  return (
    <group position={position}>
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[1.6, 0.16, 1.45]} />
        <meshStandardMaterial color="#E4D8C9" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[1.25, 0.09, 1.08]} />
        <meshStandardMaterial color={active ? '#70E2A1' : '#5AA7FF'} emissive={active ? '#70E2A1' : '#5AA7FF'} emissiveIntensity={active ? 0.75 : 0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.72, -0.5]}>
        <cylinderGeometry args={[0.045, 0.055, 1.08, 8]} />
        <meshStandardMaterial color="#987253" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 1.27, -0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 18]} />
        <meshStandardMaterial color={active ? '#70E2A1' : '#F7E7D1'} emissive={active ? '#70E2A1' : '#000000'} emissiveIntensity={active ? 0.42 : 0} />
      </mesh>
      <mesh position={[0, 1.27, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.17, 0.28, 18]} />
        <meshStandardMaterial color={active ? '#FFFFFF' : '#5AA7FF'} />
      </mesh>
    </group>
  );
}

export function RopeFinaleLandmark() {
  const finalePhase = useGameStore((state) => state.finalePhase);
  const readyFinale = useGameStore((state) => state.readyFinale);

  useFrame(() => {
    const state = useGameStore.getState();
    if (!isFullTraversalMode(state.mode) || state.status !== 'playing') return;
    const controls = readControls('player1');
    const grabbing = controls.leftGrab || controls.rightGrab;
    if (state.finalePhase === 'ready' && grabbing) state.triggerFinaleLaunch();
    if (state.finalePhase === 'swinging' && !grabbing) state.releaseFinaleRope();
  });

  const engaged = finalePhase === 'swinging' || finalePhase === 'launched';

  return (
    <group position={[49.2, 0, 0]}>
      <RigidBody
        type="fixed"
        colliders={false}
        sensor
        position={[0.35, 1.3, 0]}
        onIntersectionEnter={(event) => {
          if (playerFromEvent(event.other.rigidBodyObject?.name) === 'player1') readyFinale();
        }}
      >
        <CuboidCollider args={[2.35, 1.8, 2.65]} sensor />
      </RigidBody>
      <mesh castShadow position={[1.25, 5.6, 0]}>
        <boxGeometry args={[4.6, 0.35, 0.38]} />
        <meshStandardMaterial color="#9F704A" />
      </mesh>
      {[-0.25, 2.65].map((x) => (
        <mesh key={x} castShadow position={[x, 3.7, 0]} rotation={[0, 0, engaged ? -0.2 : 0]}>
          <cylinderGeometry args={[0.055, 0.055, 3.6, 10]} />
          <meshStandardMaterial color={engaged ? '#FFD37A' : '#C68D57'} emissive={engaged ? '#FFD37A' : '#000000'} emissiveIntensity={engaged ? 0.45 : 0} />
        </mesh>
      ))}
      <mesh castShadow position={[1.2, 1.92, 0]} rotation={[0, 0, engaged ? -0.34 : -0.14]}>
        <boxGeometry args={[3.45, 0.23, 0.42]} />
        <meshStandardMaterial color={engaged ? '#FFD37A' : '#AE784B'} emissive={engaged ? '#F0A941' : '#000000'} emissiveIntensity={engaged ? 0.42 : 0} />
      </mesh>
      <mesh position={[0.35, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.92, 20]} />
        <meshBasicMaterial color={engaged ? '#70E2A1' : '#FFD37A'} transparent opacity={0.9} />
      </mesh>
      {engaged && <pointLight position={[0.35, 1.15, 0]} color="#FFD37A" intensity={1.8} distance={5.5} />}
    </group>
  );
}

export function RescueGapLandmark() {
  const rescuePhase = useGameStore((state) => state.rescuePhase);
  return (
    <group position={[37.25, -2.05, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.35, 0.18, 1.55]} friction={1.2} />
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.7, 0.36, 3.1]} />
          <meshStandardMaterial color="#E7AD79" roughness={0.9} />
        </mesh>
      </RigidBody>
      <mesh position={[0, 0.28, -1.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.46, 0.64, 20]} />
        <meshBasicMaterial color={rescuePhase === 'rescued' ? '#70E2A1' : '#FFD37A'} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 1.05, 0]} color={rescuePhase === 'rescued' ? '#70E2A1' : '#FFD37A'} intensity={rescuePhase === 'idle' ? 0.2 : 1.15} distance={4.5} />
    </group>
  );
}

export function CheckpointBeacon() {
  const active = useGameStore((state) => state.activeCheckpointId === 'mid');
  const activateCheckpoint = useGameStore((state) => state.activateCheckpoint);
  return (
    <group position={[40.4, 0.5, -2.5]}>
      <RigidBody type="fixed" colliders={false} sensor onIntersectionEnter={(event) => {
        if (playerFromEvent(event.other.rigidBodyObject?.name)) activateCheckpoint();
      }}>
        <CuboidCollider args={[2.2, 1.6, 3.2]} sensor />
      </RigidBody>
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.72, 0.86, 0.18, 8]} />
        <meshStandardMaterial color="#DFD5CF" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.54, 0.68, 0.13, 8]} />
        <meshStandardMaterial color={active ? '#5AA7FF' : '#9FA7B7'} emissive={active ? '#5AA7FF' : '#000000'} emissiveIntensity={active ? 0.55 : 0} />
      </mesh>
      <mesh castShadow position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 3.1, 8]} />
        <meshStandardMaterial color="#9AA6BF" />
      </mesh>
      <mesh position={[0.36, 2.55, 0]} rotation={[0, 0, -0.08]}>
        <planeGeometry args={[0.86, 0.6]} />
        <meshStandardMaterial color={active ? '#5AA7FF' : '#8B94A8'} side={2} />
      </mesh>
      {active && <pointLight position={[0, 0.7, 0]} color="#74e6ff" intensity={2.2} distance={6} />}
    </group>
  );
}

export function FinishGate() {
  const setPlayerFinished = useGameStore((state) => state.setPlayerFinished);
  return (
    <group position={[55.5, 0.5, 0]}>
      <RigidBody
        type="fixed"
        colliders={false}
        sensor
        onIntersectionEnter={(event) => {
          const playerId = playerFromEvent(event.other.rigidBodyObject?.name);
          if (playerId) setPlayerFinished(playerId, true);
        }}
        onIntersectionExit={(event) => {
          const playerId = playerFromEvent(event.other.rigidBodyObject?.name);
          if (playerId) setPlayerFinished(playerId, false);
        }}
      >
        <CuboidCollider args={[2.2, 2.7, 2.4]} sensor />
      </RigidBody>
      <mesh castShadow position={[-2.15, 2.25, 0]}>
        <boxGeometry args={[0.55, 4.5, 0.8]} />
        <meshStandardMaterial color="#C9B7FF" />
      </mesh>
      <mesh castShadow position={[2.15, 2.25, 0]}>
        <boxGeometry args={[0.55, 4.5, 0.8]} />
        <meshStandardMaterial color="#C9B7FF" />
      </mesh>
      <mesh castShadow position={[0, 4.35, 0]}>
        <boxGeometry args={[4.8, 0.58, 0.8]} />
        <meshStandardMaterial color="#FFD37A" />
      </mesh>
      <mesh position={[0, 2.2, -0.06]}>
        <planeGeometry args={[3.8, 3.65]} />
        <meshStandardMaterial color="#FFD37A" emissive="#FFD37A" emissiveIntensity={0.78} transparent opacity={0.56} side={2} />
      </mesh>
      <mesh position={[0, 4.72, 0.38]}>
        <sphereGeometry args={[0.4, 5, 5]} />
        <meshStandardMaterial color="#FFD37A" emissive="#FFD37A" emissiveIntensity={0.55} />
      </mesh>
      <pointLight position={[0, 2.1, 0.6]} color="#FFD37A" intensity={3} distance={8} />
    </group>
  );
}

export function ZoneSensor({ id, position, size }: { id: ZoneId; position: [number, number, number]; size: [number, number, number] }) {
  const setZone = useGameStore((state) => state.setZone);
  const geometry = useMemo(() => ({ position, size }), [position, size]);
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      sensor
      position={geometry.position}
      onIntersectionEnter={(event) => {
        if (playerFromEvent(event.other.rigidBodyObject?.name)) {
          setZone(id);
          if (id === 'zone-4') useGameStore.getState().stageRescue();
        }
      }}
    >
      <CuboidCollider args={[geometry.size[0] / 2, geometry.size[1] / 2, geometry.size[2] / 2]} sensor />
    </RigidBody>
  );
}
