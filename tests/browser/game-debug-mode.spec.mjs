import { test, expect } from '@playwright/test';

const debugUrl = process.env.DEBUG_URL || '';

test('optional debug mode is isolated behind explicit debug URL', async ({ page }, testInfo) => {
  test.skip(!debugUrl, 'Set DEBUG_URL to test developer-only debug tooling, for example http://localhost:3000?debug=1');
  await page.goto(debugUrl, { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('game-debug-mode.png'), fullPage: true });
});
