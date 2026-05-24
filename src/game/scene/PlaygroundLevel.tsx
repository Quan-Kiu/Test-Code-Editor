import { FloatingPlatform, Tree, Flower, CloudPuff } from '../components/EnvironmentPieces';
import { PhysicsCrate } from '../components/PhysicsCrate';
import { CheckpointBeacon, FinishGate, HeavyDoorLandmark, RescueGapLandmark, RopeFinaleLandmark, WobbleBridge, ZoneSensor } from '../components/GameplayLandmarks';

export function PlaygroundLevel() {
  return (
    <group>
      <FloatingPlatform position={[0, -0.5, 0]} size={[13, 1, 10]}>
        <Tree position={[-4.4, 0.5, -3.1]} scale={0.85} />
        <Tree position={[3.8, 0.5, -3.4]} scale={0.62} />
        <Flower position={[-2.1, 0.52, 2.8]} />
        <Flower position={[3, 0.52, 2.5]} color="#FFF0A5" />
      </FloatingPlatform>
      <PhysicsCrate position={[0.8, 1.05, 2.2]} targetId="tutorial-crate" />
      <ZoneSensor id="zone-1" position={[0, 1.6, 0]} size={[13, 4, 11]} />

      <WobbleBridge />
      <ZoneSensor id="zone-2" position={[11, 1.7, 0]} size={[12, 4, 5]} />

      <FloatingPlatform position={[23.3, -0.5, 0]} size={[12.2, 1, 10]} color="#7ACF8B">
        <Tree position={[4.2, 0.5, 3.1]} scale={0.68} />
        <Flower position={[-3.4, 0.52, 2.8]} />
      </FloatingPlatform>
      <HeavyDoorLandmark />
      <PhysicsCrate position={[21.2, 1.25, 2.4]} heavy targetId="heavy-crate" />
      <ZoneSensor id="zone-3" position={[24.2, 1.8, 0]} size={[13, 4, 10]} />

      <FloatingPlatform position={[29.85, -0.72, 0]} size={[1.5, 0.36, 2.8]} color="#E7AD79" />
      <FloatingPlatform position={[34.3, -0.5, 0]} size={[7.8, 1, 9]} color="#82D58E">
        <Tree position={[-2.2, 0.5, -3.15]} scale={0.7} />
      </FloatingPlatform>
      <FloatingPlatform position={[41.8, -0.5, 0]} size={[6.4, 1, 8.4]} color="#78CC89">
        <Flower position={[1.3, 0.52, 2.8]} />
      </FloatingPlatform>
      <FloatingPlatform position={[38.05, -0.72, 0]} size={[2.2, 0.36, 2.8]} color="#E7AD79" />
      <RescueGapLandmark />
      <CheckpointBeacon />
      <ZoneSensor id="zone-4" position={[37.8, 1.8, 0]} size={[11, 4, 10]} />

      <FloatingPlatform position={[50.8, -0.5, 0]} size={[13.2, 1, 10]} color="#7BD28E">
        <Tree position={[-4.5, 0.5, 3.25]} scale={0.68} />
        <Tree position={[4.8, 0.5, -3.25]} scale={0.68} />
        <Flower position={[1.7, 0.52, 2.7]} />
        <Flower position={[4.2, 0.52, 2.3]} color="#FFF1A5" />
      </FloatingPlatform>
      <RopeFinaleLandmark />
      <FinishGate />
      <ZoneSensor id="zone-5" position={[49.6, 1.8, 0]} size={[15, 5, 11]} />

      <CloudPuff position={[-4, -3.5, -10]} scale={2.8} />
      <CloudPuff position={[17, -4.5, -11]} scale={3.5} />
      <CloudPuff position={[39, -4, -10]} scale={3.8} />
      <CloudPuff position={[57, -4, -11]} scale={3.1} />
      <CloudPuff position={[6, 10, -18]} scale={1.9} />
      <CloudPuff position={[42, 11, -18]} scale={2.1} />
    </group>
  );
}
