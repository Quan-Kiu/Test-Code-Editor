import { loadRealApp } from './helpers/real-server-bridge.mjs';
import { test, expect } from '@playwright/test';

const appUrl = process.env.APP_URL || '/';
const projectType = process.env.PROJECT_TYPE || '';
const shouldRun = /web3d|3d|game/i.test(projectType) || process.env.WEB3D_REQUIRED === '1';

async function getCanvasDiagnostics(page) {
  return await page.evaluate(async () => {
    const canvases = [...document.querySelectorAll('canvas')];
    const canvas = canvases.find((candidate) => candidate.width > 0 && candidate.height > 0) || canvases[0] || null;
    let gl = null;
    let contextType = 'none';
    if (canvas) {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      contextType = gl ? (gl.constructor?.name || 'webgl') : 'none';
    }
    let vendor = 'unknown';
    let renderer = 'unknown';
    let glError = 'not_available';
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown';
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
      }
      glError = gl.getError();
    }
    const fallbackVisible = !![...document.querySelectorAll('[data-fallback], .fallback, #fallback')].find((el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
    });
    const ready = !!(
      document.documentElement.dataset.sceneReady === '1' ||
      window.__GAME_READY__ === true ||
      canvases.some((candidate) => candidate.dataset.ready === '1' || candidate.dataset.sceneReady === '1')
    );
    const renderMode = document.body?.dataset?.renderMode || document.documentElement?.dataset?.renderMode || window.__renderMode || 'unknown';
    return {
      hasCanvas: !!canvas,
      canvasCount: canvases.length,
      canvasSize: canvas ? {
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
      } : null,
      webgl: !!gl,
      webgpu: !!navigator.gpu,
      contextType,
      vendor,
      renderer,
      glError,
      fallbackVisible,
      renderMode,
      ready,
    };
  });
}

test('web3d canvas has render evidence and optional ready sentinel', async ({ page }, testInfo) => {
  test.skip(!shouldRun, 'Set PROJECT_TYPE=game,web3d or WEB3D_REQUIRED=1 to run 3D canvas readiness checks.');

  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));

  await loadRealApp(page, appUrl);
  await page.waitForTimeout(500);
  const diagnostics = await getCanvasDiagnostics(page);
  await page.screenshot({ path: testInfo.outputPath('web3d-canvas-ready.png'), fullPage: true });

  expect(diagnostics.hasCanvas, '3D route should expose at least one canvas').toBeTruthy();
  expect(diagnostics.canvasCount, '3D route should expose at least one canvas').toBeGreaterThan(0);
  expect(diagnostics.canvasSize?.width || 0, '3D canvas should have a non-zero drawing width').toBeGreaterThan(0);
  expect(diagnostics.canvasSize?.height || 0, '3D canvas should have a non-zero drawing height').toBeGreaterThan(0);
  expect(diagnostics.webgl || diagnostics.webgpu, '3D route should expose WebGL or WebGPU capability').toBeTruthy();
  expect(diagnostics.fallbackVisible, '3D fallback UI must not be visible when claiming Web3D pass').toBeFalsy();
  if (diagnostics.glError !== 'not_available') {
    expect(diagnostics.glError, 'WebGL getError should be NO_ERROR after readiness check').toBe(0);
  }
  expect(consoleErrors, 'blocking console/page errors').toEqual([]);
  expect(failedRequests, 'failed network requests').toEqual([]);

  testInfo.annotations.push({ type: 'web3d-diagnostics', description: JSON.stringify(diagnostics) });
});
