import { loadRealApp } from './helpers/real-server-bridge.mjs';
import { test, expect } from '@playwright/test';

const appUrl = process.env.APP_URL || '/';

test.use({ viewport: { width: 720, height: 450 } });
test.setTimeout(100_000);

function captureErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => errors.push(`${request.url()} ${request.failure()?.errorText || ''}`));
  return errors;
}

async function alignCameraToRoute(page) {
  const bounds = await page.locator('canvas').boundingBox();
  if (!bounds) throw new Error('Canvas missing before traversal input');
  const x = bounds.x + bounds.width * 0.5;
  const y = bounds.y + bounds.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down({ button: 'middle' });
  await page.mouse.move(x + 92, y, { steps: 8 });
  await page.mouse.up({ button: 'middle' });
  await page.waitForTimeout(200);
}

async function moveRightUntil(page, locator, timeout = 45_000) {
  await page.keyboard.down('KeyD');
  try {
    await expect(locator).toBeVisible({ timeout });
  } finally {
    await page.keyboard.up('KeyD');
  }
}

test('WB-004 solo traverses door, rope finale and finish gate', async ({ page }, testInfo) => {
  const errors = captureErrors(page);
  await loadRealApp(page, appUrl);
  await page.getByRole('button', { name: /Play Solo/i }).click();
  await alignCameraToRoute(page);

  await moveRightUntil(page, page.getByTestId('door-status').filter({ hasText: /Door open/i }));
  await moveRightUntil(page, page.getByTestId('finale-status').filter({ hasText: /Hold a grab hand/i }));
  await page.mouse.down({ button: 'left' });
  await expect(page.getByTestId('finale-status')).toContainText(/Rope held/i);
  await page.mouse.up({ button: 'left' });
  await expect(page.getByTestId('finale-status')).toContainText(/Launched/i);

  await moveRightUntil(page, page.getByRole('heading', { name: /Great wobble/i }), 30_000);
  await page.screenshot({ path: testInfo.outputPath('wb-004-completed.png') });
  expect(errors, 'blocking browser errors during full solo traversal').toEqual([]);
});
