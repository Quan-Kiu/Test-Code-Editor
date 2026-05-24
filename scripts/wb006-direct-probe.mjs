import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const reportPath = 'docs/validation-reports/wb-006-direct-probe.json';
const report = {
  story: 'WB-006',
  browserMode: 'headed Chromium + Xvfb',
  executable: '/usr/bin/chromium',
  url: process.env.REAL_SERVER_URL || 'http://127.0.0.1:4186/',
  bridgeUsed: false,
  appSource: 'real Vite preview direct navigation attempt',
  result: 'running',
  errors: [],
};
const browser = await chromium.launch({ headless: false, executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 960, height: 600 }});
  page.on('pageerror', (error) => report.errors.push(error.message));
  try {
    await page.goto(report.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    report.result = 'pass';
  } catch (error) {
    report.result = 'blocked';
    report.failure = error instanceof Error ? error.message : String(error);
  }
} finally {
  await browser.close();
  await writeFile(reportPath, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify(report, null, 2));
