import { defineConfig, devices } from '@playwright/test';

const appUrl = process.env.APP_URL || 'http://127.0.0.1:4173';
const serverCommand = process.env.PLAYWRIGHT_WEB_SERVER_COMMAND;
const headed = process.env.PW_HEADED === '1';
const chromiumExecutablePath = process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium';
const chromiumArgs = ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader', '--disable-gpu-sandbox'];

export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'docs/validation-reports/playwright-report', open: 'never' }]],
  outputDir: 'docs/validation-reports/browser-artifacts',
  use: {
    baseURL: appUrl,
    headless: !headed,
    launchOptions: {
      executablePath: chromiumExecutablePath,
      args: chromiumArgs,
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: serverCommand ? {
    command: serverCommand,
    url: appUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : undefined,
});
