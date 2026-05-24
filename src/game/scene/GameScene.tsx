import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense, useEffect } from 'react';
import { useGameStore } from '../state/gameStore';
import { isCoopMode, isRescuePracticeMode } from '../types';
import { PlayerCharacter } from '../components/PlayerCharacter';
import { BuddyLinkSystem } from '../systems/BuddyLinkSystem';
import { PlaygroundLevel } from './PlaygroundLevel';
import { SharedCamera } from './SharedCamera';
import { HeroBuddies } from './HeroBuddies';

export function GameScene() {
  const status = useGameStore((state) => state.status);
  const mode = useGameStore((state) => state.mode);
  const coopMode = isCoopMode(mode);
  const graphicsPreset = useGameStore((state) => state.graphicsPreset);
  const reduced = graphicsPreset === 'reduced';

  useEffect(() => {
    document.documentElement.dataset.graphicsPreset = graphicsPreset;
    return () => { delete document.documentElement.dataset.graphicsPreset; };
  }, [graphicsPreset]);

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        shadows={!reduced}
        dpr={reduced ? 0.6 : [1, 1.5]}
        camera={{ position: [10, 11, 18], fov: 43, near: 0.1, far: 160 }}
        gl={{ antialias: !reduced, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.dataset.sceneReady = '1';
          document.documentElement.dataset.sceneReady = '1';
          document.body.dataset.renderMode = 'webgl';
          window.__GAME_READY__ = true;
        }}
      >
        <color attach="background" args={['#88C7F8']} />
        {!reduced && <fog attach="fog" args={['#C9ECFF', 36, 96]} />}
        <ambientLight intensity={1.25} />
        <hemisphereLight intensity={reduced ? 0.48 : 0.62} color="#FFFFFF" groundColor="#BBA7CF" />
        <directionalLight
          castShadow={!reduced}
          position={[15, 22, 14]}
          intensity={2.15}
          color="#FFF6E8"
          shadow-mapSize-width={reduced ? 256 : 1024}
          shadow-mapSize-height={reduced ? 256 : 1024}
        />
        <Suspense fallback={null}>
          <Physics gravity={[0, -14, 0]} paused={status !== 'playing'} timeStep={1 / 60}>
            <PlaygroundLevel />
            {status === 'menu' ? <HeroBuddies /> : (
              <>
                <PlayerCharacter playerId="player1" startPosition={[-4, 2.2, 0]} />
                {coopMode && <PlayerCharacter playerId="player2" startPosition={[-4, 2.2, 1.45]} />}
                {isRescuePracticeMode(mode) && <BuddyLinkSystem />}
              </>
            )}
          </Physics>
          <SharedCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
