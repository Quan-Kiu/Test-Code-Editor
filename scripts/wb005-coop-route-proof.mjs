import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';

const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4188';
process.env.REAL_SERVER_URL = source;
const outDir = 'docs/validation-reports/wb-005-screenshots';
const reducedEffects = process.env.WB_GRAPHICS_PRESET === 'reduced';
const reportPath = reducedEffects ? 'docs/validation-reports/wb-007-reduced-effects-coop-route-proof.json' : 'docs/validation-reports/wb-005-coop-route-proof.json';
const report = {
  story: reducedEffects ? 'WB-007 reduced-effects local co-op route regression' : 'WB-005 local co-op route and Gamepad API wiring',
  browserMode: 'headless Chromium + Xvfb fallback',
  localhostDirect: 'blocked; see wb-005-direct-probe.json',
  bridgeUsed: true,
  bridgeType: 'setContent shell plus subresource request bridge delivering exact Vite preview bytes, including dynamic chunks',
  appSource: source,
  graphicsPreset: reducedEffects ? 'reduced' : 'standard',
  inputEvidenceBoundary: 'Virtual browser Gamepad API state validates Player 2 input wiring only; it is not physical-controller or human co-op signoff.',
  consoleErrors: [],
  pageErrors: [],
  networkFailures: [],
  steps: [],
  result: 'running',
};
const start = Date.now();
const at = () => `${((Date.now() - start) / 1000).toFixed(2)}s`;
const waitForText = async (page, pattern, label, timeout = 45_000) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const body = await page.locator('body').innerText().catch(() => '');
    if (pattern.test(body)) {
      report.steps.push({ label, at: at() });
      return;
    }
    await page.waitForTimeout(75);
  }
  throw new Error(`Timeout: ${label}`);
};
const p2X = async (page) => Number(await page.evaluate(() => document.documentElement.dataset.player2X || 'NaN'));
const setGamepad = async (page, horizontal, forward = 0) => page.evaluate(({ horizontal, forward }) => {
  window.__WB_VIRTUAL_GAMEPAD__.axes[0] = horizontal;
  window.__WB_VIRTUAL_GAMEPAD__.axes[1] = forward;
}, { horizontal, forward });
const moveBothUntil = async (page, pattern, label, timeout) => {
  await page.keyboard.down('KeyD');
  await setGamepad(page, 1);
  try {
    await waitForText(page, pattern, label, timeout);
  } finally {
    await page.keyboard.up('KeyD').catch(() => undefined);
    await setGamepad(page, 0).catch(() => undefined);
  }
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--enable-webgl', '--enable-webgl2', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});
let completionCaptured = false;
try {
  const context = await browser.newContext({ viewport: { width: 640, height: 400 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => report.pageErrors.push(error.message));
  page.on('requestfailed', (request) => report.networkFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));
  page.on('crash', () => report.steps.push({ label: 'page crashed', at: at() }));
  page.on('close', () => { if (!completionCaptured) report.steps.push({ label: 'page closed unexpectedly', at: at() }); });

  const bridge = await loadRealAppThroughRequestBridge(page, '/');
  report.bridgedRequests = bridge.requests;
  await page.evaluate(() => {
    const buttons = Array.from({ length: 16 }, () => ({ pressed: false, touched: false, value: 0 }));
    window.__WB_VIRTUAL_GAMEPAD__ = {
      connected: true,
      id: 'WB-005 Virtual Browser Gamepad',
      index: 0,
      mapping: 'standard',
      axes: [0, 0, 0, 0],
      buttons,
      timestamp: performance.now(),
    };
    Object.defineProperty(navigator, 'getGamepads', {
      configurable: true,
      value: () => [window.__WB_VIRTUAL_GAMEPAD__],
    });
  });

  if (reducedEffects) await page.getByTestId('graphics-reduced').click();
  const coOpButton = page.getByRole('button', { name: /Local Co-op Run/i });
  await coOpButton.waitFor({ timeout: 10_000 });
  report.menuModeVisible = true;
  await coOpButton.hover();
  await page.waitForTimeout(900);
  await coOpButton.click();
  await page.waitForFunction(() => window.__GAME_READY__ === true, undefined, { timeout: 25_000 });
  await page.waitForFunction(() => document.documentElement.dataset.player2X, undefined, { timeout: 15_000 });

  report.webgl = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
    const debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return {
      available: Boolean(gl),
      glError: gl ? gl.getError() : null,
      renderer: gl && debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unknown',
      preset: document.documentElement.dataset.graphicsPreset,
    };
  });
  report.player2StartX = await p2X(page);

  const canvasBox = await page.locator('canvas').boundingBox();
  if (!canvasBox) throw new Error('Canvas missing');
  const x = canvasBox.x + canvasBox.width * 0.5;
  const y = canvasBox.y + canvasBox.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down({ button: 'middle' });
  await page.mouse.move(x + 92, y, { steps: 8 });
  await page.mouse.up({ button: 'middle' });
  await page.waitForTimeout(120);

  await moveBothUntil(page, /Door open — follow the glowing path\./i, 'Both-player traversal opened door', 55_000);
  report.player2AfterDoorX = await p2X(page);
  report.player2MovedByGamepad = Number.isFinite(report.player2StartX) && Number.isFinite(report.player2AfterDoorX) && report.player2AfterDoorX - report.player2StartX > 6;
  await moveBothUntil(page, /Hold a grab hand to swing\./i, 'Both-player traversal reached rope', 55_000);
  await page.mouse.down({ button: 'left' });
  await waitForText(page, /Rope held — release toward the gate!/i, 'Player 1 held rope while Player 2 remained routed', 12_000);
  await page.mouse.up({ button: 'left' });
  await waitForText(page, /Launched — reach the finish gate!/i, 'Finale launched', 12_000);
  await moveBothUntil(page, /Both buddies reached the finish!/i, 'Both buddies completed Local Co-op Run', 45_000);

  report.completionAutofocus = /Play Again/i.test(await page.evaluate(() => document.activeElement?.textContent || ''));
  report.screenshotPath = reducedEffects ? 'docs/validation-reports/wb-007-screenshots/wb-007-reduced-effects-completion.png' : `${outDir}/wb-005-local-coop-run-completed.png`;
  if (reducedEffects) await mkdir('docs/validation-reports/wb-007-screenshots', { recursive: true });
  await page.screenshot({ path: report.screenshotPath });
  completionCaptured = true;
  report.result = report.menuModeVisible && report.player2MovedByGamepad && report.completionAutofocus && report.webgl.available && (!reducedEffects || report.webgl.preset === 'reduced') && report.webgl.glError === 0 && !report.consoleErrors.length && !report.pageErrors.length && !report.networkFailures.length ? 'pass' : 'fail';
} catch (error) {
  report.failure = error instanceof Error ? error.message : String(error);
  report.result = 'fail';
} finally {
  report.elapsed = at();
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 1200))]);
}
console.log(JSON.stringify(report, null, 2));
process.exit(report.result === 'pass' ? 0 : 1);
