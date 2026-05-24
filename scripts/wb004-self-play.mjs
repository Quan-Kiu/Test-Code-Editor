import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealApp } from '../tests/browser/helpers/real-server-bridge.mjs';

const outDir = 'docs/validation-reports/wb-004-self-play-screenshots';
const reportPath = 'docs/validation-reports/wb-004-self-play.json';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4173';
const useHeadlessFallback = process.env.WB_BROWSER_MODE === 'headless-fallback';
const report = {
  story: 'WB-004',
  browserMode: useHeadlessFallback ? 'headless Chromium + Xvfb fallback' : 'headed Chromium + Xvfb',
  localhostDirect: 'blocked; see wb-004-correction-direct-probe.json for current-build evidence',
  bridgeUsed: true,
  appSource: `real Vite preview server bytes via fetch bridge (${source})`,
  viewport: '720x450',
  screenshotPolicy: 'capture completion only during the long SwiftShader traversal; intermediate state assertions are logged as timed DOM evidence to avoid the documented screenshot renderer failure',
  steps: [],
  consoleErrors: [],
  pageErrors: [],
  pageEvents: [],
  networkFailures: [],
  result: 'running',
};
const start = Date.now();
const elapsed = () => `${((Date.now() - start) / 1000).toFixed(2)}s`;

async function waitForText(page, pattern, label, timeout = 45_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const body = await page.locator('body').innerText().catch(() => '');
    if (pattern.test(body)) {
      report.steps.push({ label, at: elapsed(), matched: pattern.source });
      return;
    }
    await page.waitForTimeout(100);
  }
  throw new Error(`Timed out waiting for ${label}: ${pattern}`);
}

async function moveRouteUntil(page, pattern, label, timeout = 45_000) {
  await page.keyboard.down('KeyD');
  try {
    await waitForText(page, pattern, label, timeout);
  } finally {
    await page.keyboard.up('KeyD').catch(() => undefined);
  }
}

async function alignCameraToRoute(page) {
  const canvas = page.locator('canvas');
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error('Canvas missing before traversal input');
  const x = bounds.x + bounds.width * 0.5;
  const y = bounds.y + bounds.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down({ button: 'middle' });
  await page.mouse.move(x + 92, y, { steps: 8 });
  await page.mouse.up({ button: 'middle' });
  await page.waitForTimeout(200);
  report.steps.push({ label: 'Orbit camera aligned to the +X route before camera-relative traversal', at: elapsed() });
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  headless: useHeadlessFallback,
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
});
let page;
try {
  const context = await browser.newContext({ viewport: { width: 720, height: 450 }, reducedMotion: 'reduce' });
  page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => report.pageErrors.push(error.message));
  page.on('crash', () => report.pageEvents.push({ event: 'crash', at: elapsed() }));
  page.on('close', () => report.pageEvents.push({ event: 'close', at: elapsed() }));
  page.on('requestfailed', (request) => report.networkFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));
  const bridge = await loadRealApp(page, '/');
  report.loadedAssets = bridge.assets;
  await page.waitForFunction(() => window.__GAME_READY__ === true, undefined, { timeout: 20_000 });
  report.webgl = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
    const debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return {
      available: Boolean(gl),
      glError: gl ? gl.getError() : null,
      renderer: gl && debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unknown',
      sceneReady: window.__GAME_READY__ === true,
    };
  });

  await page.getByRole('button', { name: /Play Solo/i }).click();
  report.steps.push({ label: 'Play Solo started', at: elapsed() });
  await alignCameraToRoute(page);

  await moveRouteUntil(page, /Door open — follow the glowing path\./i, 'Heavy-door switch opened the route', 40_000);
  await moveRouteUntil(page, /Hold a grab hand to swing\./i, 'Rope finale marker reached', 40_000);

  await page.mouse.down({ button: 'left' });
  await waitForText(page, /Rope held — release toward the gate!/i, 'Left hand acquired the rope', 8_000);
  await page.mouse.up({ button: 'left' });
  await waitForText(page, /Launched — reach the finish gate!/i, 'Rope release applied bounded launch assistance', 8_000);

  await moveRouteUntil(page, /Great wobble!/i, 'Finish gate reached and completion overlay displayed', 35_000);
  const completionShot = `${outDir}/wb-004-completed.png`;
  await page.screenshot({ path: completionShot });
  report.screenshotPath = completionShot;
  report.result = report.consoleErrors.length || report.pageErrors.length || report.networkFailures.length || !report.webgl.available || report.webgl.glError !== 0 ? 'fail' : 'pass';
} catch (error) {
  report.result = 'fail';
  report.failure = error instanceof Error ? error.message : String(error);
  if (page && !page.isClosed()) await page.screenshot({ path: `${outDir}/wb-004-failure.png` }).catch(() => undefined);
} finally {
  report.elapsed = elapsed();
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  await browser.close().catch(() => undefined);
}
console.log(JSON.stringify(report, null, 2));
process.exit(report.result === 'pass' ? 0 : 1);
