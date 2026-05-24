export async function loadGameScene() {
  const module = await import('../game/scene/GameScene');
  return { default: module.GameScene };
}

let gameplayPrefetch: Promise<unknown> | null = null;

export function preloadGameScene() {
  gameplayPrefetch ??= loadGameScene();
  return gameplayPrefetch;
}
