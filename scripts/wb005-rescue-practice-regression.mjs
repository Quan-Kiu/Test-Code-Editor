import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4189';
process.env.REAL_SERVER_URL = source;
const outDir = 'docs/validation-reports/wb-005-screenshots';
const reportPath = 'docs/validation-reports/wb-005-rescue-practice-regression.json';
const report = { story: 'WB-005 regression: rescue practice preserved', browserMode: 'headless Chromium + Xvfb fallback', localhostDirect: 'blocked; see wb-005-direct-probe.json', bridgeUsed: true, appSource: source, consoleErrors: [], pageErrors: [], networkFailures: [], result: 'running' };
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
try {
 const page = await browser.newPage({ viewport: { width: 960, height: 600 }, reducedMotion: 'reduce' });
 page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
 page.on('pageerror', (e) => report.pageErrors.push(e.message));
 page.on('requestfailed', (r) => report.networkFailures.push(`${r.method()} ${r.url()} ${r.failure()?.errorText || ''}`));
 const bridge = await loadRealAppThroughRequestBridge(page, '/'); report.bridgedRequests = bridge.requests;
 report.menuScreenshotPath = `${outDir}/wb-005-menu-three-modes.png`; await page.screenshot({ path: report.menuScreenshotPath });
 const button = page.getByRole('button', { name: /Co-op Rescue/i }); await button.hover(); await page.waitForTimeout(500); await button.click();
 await page.waitForFunction(() => window.__GAME_READY__ === true, undefined, { timeout: 25000 });
 await page.getByTestId('rescue-status').filter({ hasText: /Buddy is hanging below/i }).waitFor({ timeout: 12000 });
 report.rescueStatus = await page.getByTestId('rescue-status').innerText();
 report.webgl = await page.evaluate(() => { const gl = document.querySelector('canvas')?.getContext('webgl2') || document.querySelector('canvas')?.getContext('webgl'); return { available: Boolean(gl), glError: gl?.getError() ?? null }; });
 report.screenshotPath = `${outDir}/wb-005-rescue-practice-preserved.png`; await page.screenshot({ path: report.screenshotPath });
 report.result = report.webgl.available && report.webgl.glError === 0 && /Buddy is hanging below/i.test(report.rescueStatus) && !report.consoleErrors.length && !report.pageErrors.length && !report.networkFailures.length ? 'pass' : 'fail';
} catch (error) { report.result = 'fail'; report.failure = error instanceof Error ? error.message : String(error); }
finally { await writeFile(reportPath, JSON.stringify(report, null, 2)); await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 1200))]); }
console.log(JSON.stringify(report, null, 2)); process.exit(report.result === 'pass' ? 0 : 1);
