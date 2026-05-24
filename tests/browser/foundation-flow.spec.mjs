import { loadRealApp } from './helpers/real-server-bridge.mjs';
import { test, expect } from '@playwright/test';

const appUrl = process.env.APP_URL || '/';

test('foundation flow exposes menu, solo pause and local co-op entry in one real render session', async ({ page }, testInfo) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await loadRealApp(page, appUrl);
  await expect(page.getByRole('button', { name: /Play Solo/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('menu-render.png'), fullPage: true });

  await page.getByRole('button', { name: /Play Solo/ }).click();
  await expect(page.getByLabel('Gameplay status')).toBeVisible();
  await expect(page.getByText(/Tutorial Yard/i).first()).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('tutorial-yard.png'), fullPage: true });

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /Paused game|Paused/i })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('pause-state.png'), fullPage: true });
  await page.getByRole('button', { name: /Resume/ }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Back to Menu/ }).click();
  await expect(page.getByRole('button', { name: /Local Co-op/ })).toBeVisible();
  await page.getByRole('button', { name: /Local Co-op/ }).click();
  await expect(page.getByText('Buddies Together')).toBeVisible();
  await expect(page.getByText(/Tutorial Yard/i).first()).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('local-coop-start.png'), fullPage: true });

  expect(errors, 'blocking console/page errors during menu, solo pause and local co-op entry').toEqual([]);
});
