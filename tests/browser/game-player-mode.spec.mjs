import { loadRealApp } from './helpers/real-server-bridge.mjs';
import { test, expect } from '@playwright/test';

const appUrl = process.env.APP_URL || '/';
const forbiddenPlayerText = /\b(TODO|NOTE|DEBUG|DEV\s*ONLY|INTERNAL|TEST\s*BUTTON|COLLISION|SPAWN\s*INSPECTOR|COORDINATE\s*GRID|SEED\s*PANEL|REPLAY\s*PANEL|CHEAT|QA\s*CONTROL)\b/i;
const forbiddenVisibleSelector = '[data-debug], [data-dev], [data-testid*="debug" i], [data-testid*="dev" i], [class*="debug" i], [class*="dev-panel" i], [id*="debug" i], [id*="dev-panel" i]';

test('normal player mode is clean enough for player-facing review', async ({ page }, testInfo) => {
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));

  await loadRealApp(page, appUrl);
  await page.screenshot({ path: testInfo.outputPath('game-player-mode.png'), fullPage: true });

  const bodyText = await page.locator('body').innerText().catch(() => '');
  const visibleDevNodes = await page.locator(forbiddenVisibleSelector).evaluateAll((nodes) => nodes.filter((node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  }).length).catch(() => 0);

  expect(bodyText, 'normal player mode must not expose TODO/NOTE/DEBUG/dev-only text').not.toMatch(forbiddenPlayerText);
  expect(visibleDevNodes, 'normal player mode must not expose visible debug/dev panels').toBe(0);
  expect(consoleErrors, 'blocking console/page errors').toEqual([]);
  expect(failedRequests, 'failed network requests').toEqual([]);
});
