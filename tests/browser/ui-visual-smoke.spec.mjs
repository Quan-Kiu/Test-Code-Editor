import { loadRealApp } from './helpers/real-server-bridge.mjs';
import { test, expect } from '@playwright/test';

const appUrl = process.env.APP_URL || '/';

test('real UI route renders without blocking browser errors', async ({ page }, testInfo) => {
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));

  await loadRealApp(page, appUrl);
  await expect(page.locator('body')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('ui-route.png'), fullPage: true });

  expect(consoleErrors, 'blocking console/page errors').toEqual([]);
  expect(failedRequests, 'failed network requests').toEqual([]);
});
