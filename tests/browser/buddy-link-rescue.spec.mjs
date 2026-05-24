import { loadRealApp } from './helpers/real-server-bridge.mjs';
import { test, expect } from '@playwright/test';

const appUrl = process.env.APP_URL || '/';

test.use({ viewport: { width: 960, height: 600 } });

function captureErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function moveRightUntil(page, locator, timeout = 30000) {
  await page.keyboard.down('KeyD');
  try {
    await expect(locator).toBeVisible({ timeout });
  } finally {
    await page.keyboard.up('KeyD');
  }
}

test('solo crate supports grab feedback and immediate release', async ({ page }, testInfo) => {
  const errors = captureErrors(page);
  await loadRealApp(page, appUrl);
  await page.getByRole('button', { name: /Play Solo/ }).click();

  await moveRightUntil(page, page.getByText(/Target ready: hold left or right grab/i));

  await page.mouse.down({ button: 'left' });
  await expect(page.getByTestId('interaction-feedback')).toContainText(/Left hand grabbed crate/i);
  await page.waitForTimeout(450);
  await page.screenshot({ path: testInfo.outputPath('wb-002-crate-grabbed.png'), fullPage: true });

  await page.mouse.up({ button: 'left' });
  await expect(page.getByTestId('interaction-feedback')).toContainText(/Left hand released crate/i);
  await page.screenshot({ path: testInfo.outputPath('wb-002-crate-released.png'), fullPage: true });
  expect(errors, 'blocking console/page errors during object grab path').toEqual([]);
});

test('local co-op stages Buddy Link rescue, pulls and releases predictably', async ({ page }, testInfo) => {
  const errors = captureErrors(page);
  await loadRealApp(page, appUrl);
  await page.getByRole('button', { name: /Local Co-op/ }).click();

  await expect(page.getByText(/BUDDY RESCUE GAP/i).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('rescue-status')).toContainText(/Buddy is hanging below/i);
  await page.screenshot({ path: testInfo.outputPath('wb-003-rescue-staged.png'), fullPage: true });

  await page.mouse.down({ button: 'left' });
  await expect(page.getByTestId('rescue-status')).toContainText(/Buddy Link active/i);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: testInfo.outputPath('wb-003-buddy-linked.png'), fullPage: true });

  await page.mouse.up({ button: 'left' });
  await expect(page.getByTestId('interaction-feedback')).toContainText(/released buddy/i);
  await page.screenshot({ path: testInfo.outputPath('wb-003-buddy-released.png'), fullPage: true });
  expect(errors, 'blocking console/page errors during buddy rescue path').toEqual([]);
});
