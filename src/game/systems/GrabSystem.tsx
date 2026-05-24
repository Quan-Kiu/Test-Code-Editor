export function GrabFeedbackRing({ active }: { active: boolean }) {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={active}>
      <ringGeometry args={[0.66, 0.78, 20]} />
      <meshBasicMaterial color="#FFF0A5" transparent opacity={0.9} />
    </mesh>
  );
}
