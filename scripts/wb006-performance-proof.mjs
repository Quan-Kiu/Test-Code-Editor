import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4186';
process.env.REAL_SERVER_URL = source;
const outDir = 'docs/validation-reports/wb-006-screenshots';
const reportPath = 'docs/validation-reports/wb-006-performance-proof.json';
const report = {
  story: 'WB-006 initial-load and WebGL boundary',
  browserMode: 'headless Chromium + Xvfb fallback',
  localhostDirect: 'blocked; see wb-006-direct-probe.json',
  bridgeUsed: true,
  bridgeType: 'setContent shell plus subresource request bridge delivering exact Vite preview bytes, including dynamic chunks',
  appSource: source,
  consoleErrors: [], pageErrors: [], networkFailures: [], result: 'running',
};
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 720, height: 450 }, reducedMotion: 'reduce' });
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => report.pageErrors.push(error.message));
  page.on('requestfailed', (request) => report.networkFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));
  const bridge = await loadRealAppThroughRequestBridge(page, '/');
  const playButton = page.getByRole('button', { name: /Play Solo/i });
  await playButton.waitFor({ timeout: 10000 });
  report.requestsAtIdleMenu = bridge.requests.map((item) => item.sourceUrl);
  report.menuCanvasAbsent = await page.locator('canvas').count() === 0;
  report.menuScreenshotPath = `${outDir}/wb-006-menu-lightweight.png`;
  await page.screenshot({ path: report.menuScreenshotPath });
  await playButton.hover();
  await page.waitForTimeout(900);
  report.requestsAfterPlayIntent = bridge.requests.map((item) => item.sourceUrl);
  report.intentPrefetchedAssets = report.requestsAfterPlayIntent.filter((url) => !report.requestsAtIdleMenu.includes(url));
  await playButton.click();
  await page.waitForFunction(() => window.__GAME_READY__ === true, undefined, { timeout: 25000 });
  report.webgl = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
    const debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return { available: Boolean(gl), glError: gl ? gl.getError() : null, renderer: gl && debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unknown' };
  });
  report.softwareRendererFrameSample = await page.evaluate(async () => {
    let count = 0; const start = performance.now();
    await new Promise((resolve) => { const tick = (time) => { count += 1; if (time - start > 1000) resolve(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    const duration = performance.now() - start;
    return { count, durationMs: Number(duration.toFixed(1)), fpsApprox: Number((count * 1000 / duration).toFixed(1)) };
  });
  report.result = report.menuCanvasAbsent && report.intentPrefetchedAssets.some((url) => /GameScene/i.test(url)) && report.webgl.available && report.webgl.glError === 0 && !report.consoleErrors.length && !report.pageErrors.length && !report.networkFailures.length ? 'pass' : 'fail';
} catch (error) { report.result = 'fail'; report.failure = error instanceof Error ? error.message : String(error); }
finally { await writeFile(reportPath, JSON.stringify(report, null, 2)); await browser.close().catch(() => undefined); }
console.log(JSON.stringify(report, null, 2)); process.exit(report.result === 'pass' ? 0 : 1);
