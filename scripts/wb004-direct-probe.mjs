import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const report = { browserMode: 'headed Chromium + Xvfb', executable: '/usr/bin/chromium', url: process.env.REAL_SERVER_URL || 'http://127.0.0.1:4176/', result: 'running', errors: [] };
const browser = await chromium.launch({ headless: false, executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader'] });
try {
 const page = await browser.newPage({ viewport: { width: 960, height: 600 }});
 page.on('pageerror', e => report.errors.push(e.message));
 try { await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 10000 }); report.result='pass'; }
 catch (e) { report.result='blocked'; report.failure = e.message; }
} finally { await browser.close(); await writeFile('docs/validation-reports/wb-004-correction-direct-probe.json', JSON.stringify(report, null, 2)); }
console.log(JSON.stringify(report, null, 2));
