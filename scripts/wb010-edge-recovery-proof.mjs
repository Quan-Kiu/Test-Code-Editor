import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4243';
process.env.REAL_SERVER_URL = source;
const out = 'docs/validation-reports/wb-010-screenshots';
const path = 'docs/validation-reports/wb-010-edge-recovery-proof.json';
const report = { story: 'WB-010 edge-fall recovery while pushing crate', browserMode: 'headless Chromium + Xvfb fallback', bridgeUsed: true, appSource: source, consoleErrors: [], pageErrors: [], networkFailures: [], samples: [], result: 'running' };
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 400 }, reducedMotion: 'reduce' });
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('pageerror', e => report.pageErrors.push(e.message));
  page.on('requestfailed', r => report.networkFailures.push(`${r.url()} ${r.failure()?.errorText || ''}`));
  const bridge = await loadRealAppThroughRequestBridge(page, '/'); report.bridgedRequests = bridge.requests;
  await page.getByRole('button', { name: /Play Solo/i }).hover(); await page.waitForTimeout(250); await page.getByRole('button', { name: /Play Solo/i }).click();
  await page.waitForFunction(() => window.__GAME_READY__ === true && document.documentElement.dataset.player1Grounded === 'true' && document.documentElement.dataset.tutorialCrateZ, undefined, { timeout: 25000 });
  const box = await page.locator('canvas').boundingBox(); if (!box) throw new Error('canvas missing');
  const cx = box.x + box.width * .5, cy = box.y + box.height * .5;
  await page.mouse.move(cx, cy); await page.mouse.down({ button: 'middle' }); await page.mouse.move(cx + 91, cy, { steps: 8 }); await page.mouse.up({ button: 'middle' }); await page.waitForTimeout(150);
  const pos = () => page.evaluate(() => ({ px: Number(document.documentElement.dataset.player1X), py: Number(document.documentElement.dataset.player1Y), pz: Number(document.documentElement.dataset.player1Z), grounded: document.documentElement.dataset.player1Grounded === 'true', recovered: document.documentElement.dataset.player1FallRecovered === 'true', cx: Number(document.documentElement.dataset.tutorialCrateX), cy: Number(document.documentElement.dataset.tutorialCrateY), cz: Number(document.documentElement.dataset.tutorialCrateZ), crateReset: document.documentElement.dataset.tutorialCrateRespawned === 'true' }));
  const tap = async (code, ms = 110) => { await page.keyboard.down(code); await page.waitForTimeout(ms); await page.keyboard.up(code); await page.waitForTimeout(150); };
  for (let i = 0; i < 36; i++) { const a = await pos(); if (Math.abs(a.px - a.cx) < .55) break; await tap(a.px < a.cx ? 'KeyD' : 'KeyA', 80); }
  for (let i = 0; i < 22; i++) { const a = await pos(); if (a.pz > .65 && a.pz < 1.2) break; await tap(a.pz < .65 ? 'KeyS' : 'KeyW'); }
  report.aligned = await pos();
  if (Math.abs(report.aligned.px - report.aligned.cx) > .62 || report.aligned.pz < .35 || report.aligned.pz > 1.35) throw new Error(`Could not align behind crate: ${JSON.stringify(report.aligned)}`);
  await page.keyboard.down('KeyS');
  const started = Date.now(); let correction = null; let maxCrateZ = -Infinity; let minPlayerY = Infinity; let fallObservedAt = null;
  while (Date.now() - started < 35000) {
    const sample = await pos(); maxCrateZ = Math.max(maxCrateZ, sample.cz); minPlayerY = Math.min(minPlayerY, sample.py);
    if (report.samples.length < 20 || sample.recovered) report.samples.push(sample);
    if (sample.py < -2.5 && fallObservedAt === null) fallObservedAt = Date.now();
    if (sample.crateReset && sample.recovered && sample.grounded && sample.px < -3) break;
    const dx = sample.cx - sample.px; const next = dx > .33 ? 'KeyD' : dx < -.33 ? 'KeyA' : null;
    if (next !== correction) { if (correction) await page.keyboard.up(correction).catch(() => undefined); if (next) await page.keyboard.down(next); correction = next; }
    await page.waitForTimeout(120);
  }
  if (correction) await page.keyboard.up(correction).catch(() => undefined); await page.keyboard.up('KeyS');
  report.final = await pos(); report.maxCrateZ = Number(maxCrateZ.toFixed(3)); report.minPlayerY = Number(minPlayerY.toFixed(3)); report.recoveryMs = fallObservedAt ? Date.now() - fallObservedAt : null;
  report.messageVisible = await page.getByText(/Crate returned to the tutorial start\./i).isVisible().catch(() => false);
  report.webgl = await page.evaluate(() => { const gl = document.querySelector('canvas')?.getContext('webgl2') || document.querySelector('canvas')?.getContext('webgl'); return { available: Boolean(gl), glError: gl?.getError() ?? null }; });
  report.screenshotPath = `${out}/wb-010-player-and-crate-recovered.png`; await page.screenshot({ path: report.screenshotPath });
  report.result = report.final.crateReset && report.final.recovered && report.final.grounded && report.final.px < -3 && report.messageVisible && report.maxCrateZ > 6 && report.minPlayerY < -2.5 && report.webgl.available && report.webgl.glError === 0 && !report.consoleErrors.length && !report.pageErrors.length && !report.networkFailures.length ? 'pass' : 'fail';
} catch (error) { report.failure = error instanceof Error ? error.message : String(error); report.result = 'fail'; }
finally { await writeFile(path, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2)); process.exit(report.result === 'pass' ? 0 : 1); }
