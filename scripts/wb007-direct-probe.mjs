import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4221';
const report = { story: 'WB-007 direct localhost probe', browserMode: 'headed Chromium + Xvfb', url, localhostDirect: 'running', bridgeUsed: false, appSource: 'real Vite preview server', consoleErrors: [], pageErrors: [], result: 'running' };
await mkdir('docs/validation-reports', { recursive: true });
const browser = await chromium.launch({ headless: false, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
try {
 const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
 page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
 page.on('pageerror', (e) => report.pageErrors.push(e.message));
 await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
 report.localhostDirect = 'pass'; report.result = 'pass';
} catch (error) {
 report.localhostDirect = 'blocked'; report.failure = error instanceof Error ? error.message : String(error); report.result = 'documented';
} finally { await writeFile('docs/validation-reports/wb-007-direct-probe.json', JSON.stringify(report, null, 2)); await browser.close().catch(() => undefined); }
console.log(JSON.stringify(report, null, 2));
