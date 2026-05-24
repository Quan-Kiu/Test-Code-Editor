import { CharacterModel } from '../components/CharacterModel';

export function HeroBuddies() {
  return (
    <group>
      <group position={[-1.8, 1.05, 0.55]} rotation={[0, 0.35, 0]}>
        <CharacterModel playerId="player1" />
      </group>
      <group position={[2.1, 1.05, 0.45]} rotation={[0, -0.35, 0]}>
        <CharacterModel playerId="player2" />
      </group>
    </group>
  );
}
