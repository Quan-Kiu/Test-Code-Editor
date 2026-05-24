import { CapsuleCollider, CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Group, MathUtils, Vector3 } from 'three';
import type { PlayerId, Vector3Tuple } from '../types';
import { consumeJumpRequest, getCameraYaw, readControls } from '../input/inputController';
import { useGameStore } from '../state/gameStore';
import { CharacterModel } from './CharacterModel';

interface PlayerCharacterProps {
  playerId: PlayerId;
  startPosition: Vector3Tuple;
}

const HANGING_BUDDY_SPAWN: Vector3Tuple = [37.25, -0.55, 0];
const LINK_REST_DISTANCE = 1.7;
const MAX_LINK_IMPULSE = 0.27;
const MOVE_SPEED = 6.25;
const MOVE_ACCELERATION = 10.5;
const MOVE_DECELERATION = 15.5;
const JUMP_VELOCITY = 6.15;
const RESCUE_SAFE_TARGET: Vector3Tuple = [39.15, 1.2, 0];
const RESCUE_HOIST_RATE = 2.9;
const COYOTE_TIME_MS = 130;
const VISUAL_FOOT_OFFSET = -0.94;
const PLAYER_FALL_RECOVERY_Y = -3.25;

export function PlayerCharacter({ playerId, startPosition }: PlayerCharacterProps) {
  const body = useRef<RapierRigidBody>(null);
  const visualRoot = useRef<Group>(null);
  const statePublishFrame = useRef(0);
  const groundedContacts = useRef(0);
  const lastGroundedAt = useRef(-Infinity);
  const facingYaw = useRef(Math.PI);
  const jumpHeld = useRef(false);
  const status = useGameStore((state) => state.status);
  const checkpointPosition = useGameStore((state) => state.checkpointPosition);
  const respawnToken = useGameStore((state) => state.players[playerId].respawnToken);
  const rescueSetupToken = useGameStore((state) => state.rescueSetupToken);
  const finaleLaunchToken = useGameStore((state) => state.finaleLaunchToken);
  const appliedFinaleLaunchToken = useRef(0);
  const updatePlayerPosition = useGameStore((state) => state.updatePlayerPosition);
  const requestRespawn = useGameStore((state) => state.requestRespawn);

  useEffect(() => {
    if (!body.current) return;
    const offset = playerId === 'player2' ? [0, 0, 1.5] : [0, 0, 0];
    body.current.setTranslation({
      x: checkpointPosition[0] + offset[0],
      y: checkpointPosition[1] + offset[1],
      z: checkpointPosition[2] + offset[2],
    }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    groundedContacts.current = 0;
    lastGroundedAt.current = -Infinity;
    jumpHeld.current = false;
  }, [respawnToken, checkpointPosition, playerId]);

  useEffect(() => {
    if (!body.current || playerId !== 'player1' || finaleLaunchToken === 0 || appliedFinaleLaunchToken.current === finaleLaunchToken) return;
    body.current.applyImpulse({ x: 1.4, y: 5.4, z: 0 }, true);
    appliedFinaleLaunchToken.current = finaleLaunchToken;
  }, [finaleLaunchToken, playerId]);

  useEffect(() => {
    if (!body.current || playerId !== 'player2' || rescueSetupToken === 0) return;
    body.current.setTranslation({ x: HANGING_BUDDY_SPAWN[0], y: HANGING_BUDDY_SPAWN[1], z: HANGING_BUDDY_SPAWN[2] }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    groundedContacts.current = 0;
    lastGroundedAt.current = -Infinity;
    jumpHeld.current = false;
  }, [playerId, rescueSetupToken]);

  useFrame((_, delta) => {
    const rigidBody = body.current;
    if (!rigidBody || status !== 'playing') return;
    const controls = readControls(playerId);
    const jumpRequested = consumeJumpRequest(playerId) || (controls.jump && !jumpHeld.current);
    jumpHeld.current = controls.jump;
    const velocity = rigidBody.linvel();
    const cameraYaw = getCameraYaw();
    const movement = new Vector3();
    const inputMagnitude = Math.min(1, Math.hypot(controls.horizontal, controls.forward));

    if (inputMagnitude > 0.01) {
      const inputRight = controls.horizontal / inputMagnitude;
      const inputForward = -controls.forward / inputMagnitude;
      const right = new Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));
      const forward = new Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
      movement.addScaledVector(right, inputRight).addScaledVector(forward, inputForward).normalize();
      facingYaw.current = Math.atan2(movement.x, movement.z);
    }

    const targetVelocityX = movement.x * MOVE_SPEED * inputMagnitude;
    const targetVelocityZ = movement.z * MOVE_SPEED * inputMagnitude;
    const velocityResponse = inputMagnitude > 0.01 ? MOVE_ACCELERATION : MOVE_DECELERATION;
    const smoothedVelocityX = MathUtils.damp(velocity.x, targetVelocityX, velocityResponse, delta);
    const smoothedVelocityZ = MathUtils.damp(velocity.z, targetVelocityZ, velocityResponse, delta);

    rigidBody.setLinvel({
      x: smoothedVelocityX,
      y: velocity.y,
      z: smoothedVelocityZ,
    }, true);

    if (groundedContacts.current > 0) lastGroundedAt.current = performance.now();
    const canJump = performance.now() - lastGroundedAt.current <= COYOTE_TIME_MS;
    if (playerId === 'player1' && jumpRequested) {
      document.documentElement.dataset.player1JumpRequest = canJump ? 'accepted' : 'rejected';
    }
    if (jumpRequested && canJump) {
      rigidBody.setLinvel({ x: smoothedVelocityX, y: JUMP_VELOCITY, z: smoothedVelocityZ }, true);
      if (playerId === 'player1') document.documentElement.dataset.player1JumpApplied = String(performance.now());
      groundedContacts.current = 0;
      lastGroundedAt.current = -Infinity;
    }
    if (controls.reset) requestRespawn(playerId);

    if (visualRoot.current) {
      visualRoot.current.rotation.y = MathUtils.damp(visualRoot.current.rotation.y, facingYaw.current, 14, delta);
    }

    const state = useGameStore.getState();
    const linked = state.linkActive && (
      (playerId === 'player1' && (state.activeGrabs.player1.left === 'player2' || state.activeGrabs.player1.right === 'player2')) ||
      (playerId === 'player2' && (state.activeGrabs.player1.left === 'player2' || state.activeGrabs.player1.right === 'player2')) ||
      (playerId === 'player1' && (state.activeGrabs.player2.left === 'player1' || state.activeGrabs.player2.right === 'player1')) ||
      (playerId === 'player2' && (state.activeGrabs.player2.left === 'player1' || state.activeGrabs.player2.right === 'player1'))
    );
    if (playerId === 'player2' && state.rescuePhase === 'linked') {
      const current = rigidBody.translation();
      const safeTarget = new Vector3(...RESCUE_SAFE_TARGET);
      const currentPosition = new Vector3(current.x, current.y, current.z);
      const distance = currentPosition.distanceTo(safeTarget);
      if (distance > 0.04) {
        const nextPosition = currentPosition.lerp(safeTarget, Math.min(1, (RESCUE_HOIST_RATE * delta) / Math.max(distance, 0.001)));
        rigidBody.setTranslation({ x: nextPosition.x, y: nextPosition.y, z: nextPosition.z }, true);
        rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    } else if (linked) {
      const own = new Vector3(...state.players[playerId].position);
      const otherId: PlayerId = playerId === 'player1' ? 'player2' : 'player1';
      const other = new Vector3(...state.players[otherId].position);
      const displacement = other.sub(own);
      const stretch = Math.max(0, displacement.length() - LINK_REST_DISTANCE);
      if (stretch > 0) {
        const impulse = displacement.normalize().multiplyScalar(Math.min(MAX_LINK_IMPULSE, stretch * 0.065));
        rigidBody.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
      }
    }

    const position = rigidBody.translation();
    if (playerId === 'player2' && state.rescuePhase === 'linked' && position.y > 0.72) {
      state.markRescued();
      state.activateCheckpoint();
    }
    if (position.y < PLAYER_FALL_RECOVERY_Y) {
      if (playerId === 'player1') document.documentElement.dataset.player1FallRecovered = 'true';
      requestRespawn(playerId);
      return;
    }
    statePublishFrame.current += 1;
    if (statePublishFrame.current % 6 === 0) updatePlayerPosition(playerId, [position.x, position.y, position.z]);
    if (statePublishFrame.current % 3 === 0) {
      const dataset = document.documentElement.dataset;
      if (playerId === 'player1') {
        dataset.player1X = position.x.toFixed(3);
        dataset.player1Y = position.y.toFixed(3);
        dataset.player1Z = position.z.toFixed(3);
        dataset.player1Grounded = String(groundedContacts.current > 0);
        dataset.player1VelocityY = rigidBody.linvel().y.toFixed(3);
      } else {
        dataset.player2X = position.x.toFixed(3);
        dataset.player2Y = position.y.toFixed(3);
        dataset.player2Z = position.z.toFixed(3);
      }
    }
  });

  return (
    <RigidBody
      ref={body}
      name={playerId}
      userData={{ playerId }}
      position={startPosition}
      colliders={false}
      canSleep={false}
      ccd
      enabledRotations={[false, false, false]}
      linearDamping={1.45}
      angularDamping={6}
      friction={1}
      restitution={0.05}
    >
      <CapsuleCollider args={[0.66, 0.54]} friction={1} />
      <CuboidCollider
        args={[0.31, 0.07, 0.31]}
        position={[0, -1.23, 0]}
        sensor
        onIntersectionEnter={(event) => {
          if (!event.other.collider.isSensor()) {
            groundedContacts.current += 1;
            lastGroundedAt.current = performance.now();
          }
        }}
        onIntersectionExit={(event) => {
          if (!event.other.collider.isSensor()) {
            groundedContacts.current = Math.max(0, groundedContacts.current - 1);
            if (groundedContacts.current > 0) lastGroundedAt.current = performance.now();
          }
        }}
      />
      <group ref={visualRoot} position={[0, VISUAL_FOOT_OFFSET, 0]}>
        <CharacterModel playerId={playerId} celebratory={status === 'completed'} />
      </group>
    </RigidBody>
  );
}
