import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4221';
process.env.REAL_SERVER_URL = source;
const headed = process.env.WB_HEADED === 'true';
const outDir = 'docs/validation-reports/wb-007-screenshots';
const reportPath = 'docs/validation-reports/wb-007-preplay-readiness-proof.json';
const report = { story: 'WB-007 pre-playtest readiness UI, focus and reduced-effects proof', browserMode: headed ? 'headed Chromium + Xvfb bridge' : 'headless Chromium + Xvfb fallback', localhostDirect: 'blocked; see wb-007-direct-probe.json', bridgeUsed: true, bridgeType: 'setContent shell plus subresource request bridge delivering exact Vite preview bytes, including dynamic chunks', appSource: source, inputEvidenceBoundary: 'Virtual Gamepad state proves controller-presence UI and browser input wiring only; physical controller remains human-session evidence.', consoleErrors: [], pageErrors: [], networkFailures: [], checks: {}, result: 'running' };
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: !headed, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
try {
 const page = await browser.newPage({ viewport: { width: 960, height: 600 }, reducedMotion: 'reduce' });
 page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
 page.on('pageerror', (e) => report.pageErrors.push(e.message));
 page.on('requestfailed', (r) => report.networkFailures.push(`${r.method()} ${r.url()} ${r.failure()?.errorText || ''}`));
 const bridge = await loadRealAppThroughRequestBridge(page, '/'); report.bridgedRequests = bridge.requests;
 await page.getByTestId('gamepad-status').waitFor({ timeout: 10000 });
 report.checks.keyboardFallbackVisible = await page.getByTestId('gamepad-status').getAttribute('data-connected') === 'false';
 await page.getByTestId('graphics-reduced').click();
 report.checks.reducedPresetSelected = await page.getByTestId('graphics-reduced').getAttribute('aria-pressed') === 'true';
 await page.evaluate(() => {
   const buttons = Array.from({ length: 16 }, () => ({ pressed: false, touched: false, value: 0 }));
   window.__WB_VIRTUAL_GAMEPAD__ = { connected: true, id: 'WB-007 Playtest Controller Probe', index: 0, mapping: 'standard', axes: [0, 0, 0, 0], buttons, timestamp: performance.now() };
   Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => [window.__WB_VIRTUAL_GAMEPAD__] });
   window.dispatchEvent(new Event('gamepadconnected'));
 });
 await page.getByTestId('gamepad-status').locator('strong').filter({ hasText: /controller ready/i }).waitFor({ timeout: 5000 });
 report.checks.controllerBadgeResponds = await page.getByTestId('gamepad-status').getAttribute('data-connected') === 'true';
 report.menuScreenshotPath = `${outDir}/wb-007-menu-controller-quality.png`; await page.screenshot({ path: report.menuScreenshotPath });
 const play = page.getByRole('button', { name: /Local Co-op Run/i }); await play.hover(); await page.waitForTimeout(500); await play.click();
 await page.waitForFunction(() => window.__GAME_READY__ === true, undefined, { timeout: 25000 }); await page.waitForTimeout(1500);
 report.webgl = await page.evaluate(() => { const canvas = document.querySelector('canvas'); const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl'); const debug = gl?.getExtension('WEBGL_debug_renderer_info'); return { available: Boolean(gl), glError: gl ? gl.getError() : null, renderer: gl && debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unknown', preset: document.documentElement.dataset.graphicsPreset }; });
 report.checks.reducedPresetAppliedToScene = report.webgl.preset === 'reduced';
 report.reducedEffectsFrameSample = await page.evaluate(async () => { let count = 0; const start = performance.now(); await new Promise((resolve) => { const tick = (time) => { count += 1; if (time - start > 1000) resolve(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }); const duration = performance.now() - start; return { count, durationMs: Number(duration.toFixed(1)), fpsApprox: Number((count * 1000 / duration).toFixed(1)) }; });
 report.gameplayScreenshotPath = `${outDir}/wb-007-reduced-effects-gameplay.png`; await page.screenshot({ path: report.gameplayScreenshotPath });
 await page.keyboard.press('Escape'); await page.getByRole('dialog', { name: /Paused/i }).waitFor({ timeout: 5000 });
 report.checks.pauseAutofocus = /Resume/i.test(await page.evaluate(() => document.activeElement?.textContent || ''));
 await page.keyboard.press('Shift+Tab'); report.checks.pauseFocusWrapBackward = /Back to Menu/i.test(await page.evaluate(() => document.activeElement?.textContent || ''));
 await page.keyboard.press('Tab'); report.checks.pauseFocusWrapForward = /Resume/i.test(await page.evaluate(() => document.activeElement?.textContent || ''));
 report.pauseScreenshotPath = `${outDir}/wb-007-pause-focus-controller.png`; await page.screenshot({ path: report.pauseScreenshotPath });
 const checksPass = Object.values(report.checks).every(Boolean);
 report.result = checksPass && report.webgl.available && report.webgl.glError === 0 && !report.consoleErrors.length && !report.pageErrors.length && !report.networkFailures.length ? 'pass' : 'fail';
} catch (error) { report.failure = error instanceof Error ? error.message : String(error); report.result = 'fail'; }
finally { await writeFile(reportPath, JSON.stringify(report, null, 2)); await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 1200))]); }
console.log(JSON.stringify(report, null, 2)); process.exit(report.result === 'pass' ? 0 : 1);
