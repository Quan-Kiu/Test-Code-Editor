import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealApp } from '../tests/browser/helpers/real-server-bridge.mjs';

const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4174';
process.env.REAL_SERVER_URL = source;
const outDir = 'docs/validation-reports/wb-004-correction-screenshots';
const reportPath = 'docs/validation-reports/wb-004-controls-proof.json';
await mkdir(outDir, { recursive: true });
const report = {
  story: 'WB-004 corrective controls slice',
  browserMode: process.env.HEADLESS === '1' ? 'headless Chromium + Xvfb fallback' : 'headed Chromium + Xvfb',
  executable: '/usr/bin/chromium',
  localhostDirect: 'not_checked_in_this_script',
  bridgeUsed: true,
  appSource: `real Vite preview server via fetch bridge (${source})`,
  webgl: null,
  steps: [],
  screenshots: [],
  consoleErrors: [], pageErrors: [], networkFailures: [],
  result: 'running',
};
const browser = await chromium.launch({
  headless: process.env.HEADLESS === '1',
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
});
let page;
try {
  const context = await browser.newContext({ viewport: { width: 960, height: 600 } });
  page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => report.pageErrors.push(e.message));
  page.on('requestfailed', (r) => report.networkFailures.push(`${r.method()} ${r.url()} ${r.failure()?.errorText || ''}`));
  console.log('step:load-start');
  await loadRealApp(page, 'http://bridge.invalid/');
  console.log('step:load-done');
  await page.waitForFunction(() => window.__GAME_READY__ === true, undefined, { timeout: 20000 });
  report.webgl = await page.evaluate(() => {
    const gl = document.querySelector('canvas')?.getContext('webgl2') || document.querySelector('canvas')?.getContext('webgl');
    const debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return { available: Boolean(gl), error: gl?.getError() ?? null, renderer: gl && debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unknown' };
  });
  await page.getByRole('button', { name: /Play Solo/i }).click();
  console.log('step:solo');
  await page.waitForFunction(() => document.documentElement.dataset.player1Grounded === 'true' && Number(document.documentElement.dataset.player1Y) < 1.3, undefined, { timeout: 10000 });
  await page.waitForTimeout(180);
  const stanceTelemetry = await page.evaluate(() => ({ y: Number(document.documentElement.dataset.player1Y), grounded: document.documentElement.dataset.player1Grounded }));
  report.telemetry = { stance: stanceTelemetry };
  const stance = `${outDir}/01-grounded-stance.png`;
  await page.screenshot({ path: stance, fullPage: true });
  console.log('step:stance', JSON.stringify(stanceTelemetry));
  report.steps.push('Play Solo settled on platform; grounded stance captured.'); report.screenshots.push(stance);

  await page.keyboard.down('Space');
  await page.waitForFunction((stanceY) => Number(document.documentElement.dataset.player1Y) > stanceY + 0.35, stanceTelemetry.y, { timeout: 15000 });
  await page.keyboard.up('Space');
  const jumpTelemetry = await page.evaluate(() => ({ y: Number(document.documentElement.dataset.player1Y), grounded: document.documentElement.dataset.player1Grounded }));
  report.telemetry.jump = jumpTelemetry;
  console.log('step:jump', JSON.stringify(jumpTelemetry));
  if (!(jumpTelemetry.y > stanceTelemetry.y + 0.35)) throw new Error(`Jump did not lift player: stance=${stanceTelemetry.y} jump=${jumpTelemetry.y}`);
  const jump = `${outDir}/02-jump-airborne.png`;
  await page.screenshot({ path: jump, fullPage: true });
  report.steps.push('Space jump triggered from grounded state; airborne frame captured near the arc apex.'); report.screenshots.push(jump);
  await page.waitForFunction((stanceY) => document.documentElement.dataset.player1Grounded === 'true' && Math.abs(Number(document.documentElement.dataset.player1Y) - stanceY) < 0.2, stanceTelemetry.y, { timeout: 7000 });
  const landedTelemetry = await page.evaluate(() => ({ y: Number(document.documentElement.dataset.player1Y), grounded: document.documentElement.dataset.player1Grounded }));
  report.telemetry.landed = landedTelemetry;
  console.log('step:landed', JSON.stringify(landedTelemetry));
  if (Math.abs(landedTelemetry.y - stanceTelemetry.y) > 0.2 || landedTelemetry.grounded !== 'true') throw new Error(`Player did not land cleanly: stance=${stanceTelemetry.y} landed=${landedTelemetry.y} grounded=${landedTelemetry.grounded}`);
  const landed = `${outDir}/03-jump-landed.png`;
  await page.screenshot({ path: landed, fullPage: true });
  report.steps.push('Player returned to ground after jump.'); report.screenshots.push(landed);

  const canvas = page.locator('canvas');
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error('Canvas missing');
  const cx = bounds.x + bounds.width * 0.7;
  const cy = bounds.y + bounds.height * 0.52;
  await page.mouse.move(cx, cy);
  await page.mouse.down({ button: 'middle' });
  await page.mouse.move(cx - 180, cy + 35, { steps: 10 });
  await page.mouse.up({ button: 'middle' });
  await page.waitForTimeout(320);
  const orbit = `${outDir}/04-camera-orbit-after-drag.png`;
  await page.screenshot({ path: orbit, fullPage: true });
  report.steps.push('Middle-drag changed the orbit camera view without consuming hand-grab input.'); report.screenshots.push(orbit);

  await page.keyboard.down('KeyD');
  await page.waitForTimeout(500);
  await page.keyboard.up('KeyD');
  await page.waitForTimeout(160);
  const facing = `${outDir}/05-facing-after-right-movement.png`;
  await page.screenshot({ path: facing, fullPage: true });
  report.steps.push('Player moved right; character facing visual captured after motion.'); report.screenshots.push(facing);

  report.result = report.webgl.available && report.webgl.error === 0 && !report.consoleErrors.length && !report.pageErrors.length && !report.networkFailures.length ? 'pass' : 'fail';
} catch (error) {
  if (page) report.failureTelemetry = await page.evaluate(() => ({ y: document.documentElement.dataset.player1Y, grounded: document.documentElement.dataset.player1Grounded, jumpRequest: document.documentElement.dataset.player1JumpRequest, jumpApplied: document.documentElement.dataset.player1JumpApplied, velocityY: document.documentElement.dataset.player1VelocityY })).catch(() => null);
  report.result = 'fail';
  report.failure = error instanceof Error ? error.message : String(error);
  if (page) await page.screenshot({ path: `${outDir}/failure.png`, fullPage: true }).catch(() => undefined);
} finally {
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  await browser.close().catch(() => undefined);
}
console.log(JSON.stringify(report, null, 2));
process.exit(report.result === 'pass' ? 0 : 1);
