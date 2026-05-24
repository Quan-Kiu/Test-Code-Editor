#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const args = new Set(argv);

function valueAfter(flag, fallback) {
  const idx = argv.indexOf(flag);
  return idx >= 0 && argv[idx + 1] ? argv[idx + 1] : fallback;
}
function boolFlag(flag) {
  return args.has(flag);
}
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function write(file, text) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text, 'utf8');
}
function parseViewports(value) {
  const raw = value || 'mobile:390x844,tablet:768x1024,desktop:1440x900';
  return raw.split(',').map((item) => {
    const [namePart, sizePart] = item.split(':');
    const [width, height] = (sizePart || '').split('x').map((n) => Number.parseInt(n, 10));
    return { name: namePart || `viewport-${width}x${height}`, width, height };
  }).filter((vp) => vp.name && Number.isFinite(vp.width) && Number.isFinite(vp.height));
}
function nowDate() {
  return new Date().toISOString();
}
function slug(value) {
  return String(value || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'item';
}
function usage() {
  console.log(`Usage:
  node scripts/browser-evidence.mjs --url http://localhost:3000 [--project-type ui|game|web3d|game,web3d] [--debug-url http://localhost:3000?debug=1]
  node scripts/browser-evidence.mjs --self-check

Purpose:
  Capture local browser evidence for UI/game projects. This command requires Playwright to be installed in the target project.

Common flags:
  --url <url>                Normal player/user route. Default: http://localhost:3000
  --debug-url <url>          Optional debug route for developer-only tooling evidence.
  --out <file>               Evidence report path. Default: docs/validation-reports/browser-evidence.md
  --screenshot-dir <dir>     Screenshot output dir. Default: docs/validation-reports/browser-screenshots
  --project-type <type>      ui, game, web3d, or comma-separated such as game,web3d. Default: ui
  --headed                   Launch headed Chromium. Use with xvfb-run in Linux sandboxes when needed.
  --viewports <list>         Comma list like mobile:390x844,desktop:1440x900
  --max-components <n>       Max visible components/regions to screenshot per route/viewport. Default: 12
  --no-component-shots       Skip component screenshot capture.
  --no-keyboard-probe        Skip non-destructive Tab focus probe.
  --self-check               Validate that this browser evidence pack is installed.
`);
}

const requiredPackFiles = [
  'playwright.config.mjs',
  'scripts/browser-evidence.mjs',
  'tests/browser/ui-visual-smoke.spec.mjs',
  'tests/browser/game-player-mode.spec.mjs',
  'tests/browser/game-debug-mode.spec.mjs',
  'tests/browser/web3d-canvas-ready.spec.mjs',
  'docs/browser-interaction-qa.md',
  'docs/composition-qa.md',
  'docs/role-gate-quality-map.md',
  'docs/validation-reports/browser-evidence-template.md',
  'scripts/validate-composition-qa.mjs',
];

if (boolFlag('--help') || boolFlag('-h')) {
  usage();
  process.exit(0);
}

if (boolFlag('--self-check')) {
  const missing = requiredPackFiles.filter((file) => !fs.existsSync(path.resolve(file)));
  if (missing.length) {
    console.error('Browser evidence pack validation failed:');
    for (const file of missing) console.error(`- missing ${file}`);
    process.exit(1);
  }
  console.log('Browser evidence pack validation passed.');
  process.exit(0);
}

const root = process.cwd();
const url = valueAfter('--url', process.env.APP_URL || 'http://localhost:3000');
const debugUrl = valueAfter('--debug-url', process.env.DEBUG_URL || '');
const bridgeSourceUrl = valueAfter('--bridge-source-url', process.env.BRIDGE_SOURCE_URL || '');
const bridgeUsed = Boolean(bridgeSourceUrl);
const projectType = valueAfter('--project-type', process.env.PROJECT_TYPE || 'ui');
const projectTypes = projectType.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
const isGameProject = projectTypes.includes('game');
const isWeb3DProject = projectTypes.includes('web3d') || projectTypes.includes('3d') || projectTypes.includes('game3d');
const outFile = path.resolve(valueAfter('--out', 'docs/validation-reports/browser-evidence.md'));
const screenshotDir = path.resolve(valueAfter('--screenshot-dir', 'docs/validation-reports/browser-screenshots'));
const componentScreenshotDir = path.join(screenshotDir, 'components');
const viewports = parseViewports(valueAfter('--viewports', process.env.BROWSER_VIEWPORTS));
const maxComponents = Math.max(0, Number.parseInt(valueAfter('--max-components', process.env.BROWSER_MAX_COMPONENTS || '12'), 10) || 12);
const captureComponentShots = !boolFlag('--no-component-shots');
const runKeyboardProbe = !boolFlag('--no-keyboard-probe');
const browserMode = boolFlag('--headed') ? 'headed' : 'headless';
const chromiumLaunchOptions = {
  headless: browserMode !== 'headed',
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
  args: isWeb3DProject ? [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
    '--enable-webgl2',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ] : ['--no-sandbox', '--disable-dev-shm-usage'],
};
const forbiddenPlayerText = /\b(TODO|NOTE|DEBUG|DEV\s*ONLY|INTERNAL|TEST\s*BUTTON|COLLISION|SPAWN\s*INSPECTOR|COORDINATE\s*GRID|SEED\s*PANEL|REPLAY\s*PANEL|CHEAT|QA\s*CONTROL)\b/i;
const forbiddenVisibleSelector = '[data-debug], [data-dev], [data-testid*="debug" i], [data-testid*="dev" i], [class*="debug" i], [class*="dev-panel" i], [id*="debug" i], [id*="dev-panel" i]';

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch (first) {
    try {
      return await import('@playwright/test');
    } catch (second) {
      const blockedReport = `# Browser Evidence Report\n\nStatus: blocked\nGenerated: ${nowDate()}\nURL: ${url}\nProject type: ${projectType}\n\n## Blocker\n\nPlaywright is not installed in this project. Install it in the project scope, then rerun this command.\n\nSuggested setup after approval:\n\n\`\`\`bash\nnpm install -D @playwright/test\nnpx playwright install chromium\n\`\`\`\n\nNo browser pass is claimed.\n`;
      write(outFile, blockedReport);
      console.error(`Browser evidence blocked: Playwright is not installed. Wrote ${path.relative(root, outFile)}.`);
      process.exit(2);
    }
  }
}

async function get3DDiagnostics(page) {
  return await page.evaluate(() => {
    const canvases = [...document.querySelectorAll('canvas')];
    const canvas = canvases.find((candidate) => candidate.width > 0 && candidate.height > 0) || canvases[0] || null;
    let gl = null;
    let contextType = 'none';
    if (canvas) {
      try {
        gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        contextType = gl ? (gl.constructor?.name || 'webgl') : 'none';
      } catch (_) {
        gl = null;
      }
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
    const sceneReady = !!(
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
      sceneReady,
    };
  }).catch(() => ({
    hasCanvas: false,
    canvasCount: 0,
    canvasSize: null,
    webgl: false,
    webgpu: false,
    contextType: 'none',
    vendor: 'unknown',
    renderer: 'unknown',
    glError: 'not_available',
    fallbackVisible: false,
    renderMode: 'unknown',
    sceneReady: false,
  }));
}

async function visibleDevSelectorCount(page) {
  return await page.locator(forbiddenVisibleSelector).evaluateAll((nodes) => nodes.filter((node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style && style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  }).length).catch(() => 0);
}

async function collectComponentTargets(page) {
  const groups = [
    ['shell-main', 'main, [role="main"]', 2],
    ['navigation', 'header, nav, [role="navigation"]', 3],
    ['form', 'form', 4],
    ['dialog', 'dialog, [role="dialog"], [aria-modal="true"]', 4],
    ['button', 'button, [role="button"], input[type="button"], input[type="submit"]', 6],
    ['link', 'a[href], [role="link"]', 6],
    ['input', 'input:not([type="hidden"]), textarea, select, [contenteditable="true"]', 6],
    ['state-region', '[role="alert"], [role="status"], [aria-live], [data-state], [data-testid*="empty" i], [data-testid*="error" i], [data-testid*="loading" i]', 6],
    ['canvas', 'canvas', 4],
    ['region', 'section, article, aside, [role="region"], [data-testid]', 8],
  ];
  const targets = [];
  const seen = new Set();
  for (const [kind, selector, limit] of groups) {
    const locator = page.locator(selector);
    const count = Math.min(await locator.count().catch(() => 0), limit);
    for (let index = 0; index < count; index += 1) {
      const item = locator.nth(index);
      const visible = await item.isVisible().catch(() => false);
      if (!visible) continue;
      const box = await item.boundingBox().catch(() => null);
      if (!box || box.width < 8 || box.height < 8) continue;
      const key = `${Math.round(box.x)}:${Math.round(box.y)}:${Math.round(box.width)}:${Math.round(box.height)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const label = await item.evaluate((node) => {
        const attr = node.getAttribute('aria-label') || node.getAttribute('data-testid') || node.getAttribute('name') || node.getAttribute('id') || '';
        const text = (node.innerText || node.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
        return attr || text || node.tagName.toLowerCase();
      }).catch(() => kind);
      targets.push({ kind, selector, index, label, box });
      if (targets.length >= maxComponents) return targets;
    }
  }
  return targets;
}

async function captureComponentEvidence(page, label, viewport) {
  if (!captureComponentShots || maxComponents <= 0) return [];
  ensureDir(componentScreenshotDir);
  const targets = await collectComponentTargets(page);
  const evidence = [];
  for (let order = 0; order < targets.length; order += 1) {
    const target = targets[order];
    const locator = page.locator(target.selector).nth(target.index);
    const baseName = `${label}-${viewport.name}-${String(order + 1).padStart(2, '0')}-${target.kind}-${slug(target.label)}`;
    const basePath = path.join(componentScreenshotDir, `${baseName}-base.png`);
    const states = [];
    try {
      await locator.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await locator.screenshot({ path: basePath, timeout: 5000 });
      states.push({ state: 'base', path: basePath, status: 'pass' });
    } catch (error) {
      states.push({ state: 'base', path: basePath, status: 'fail', error: error.message });
    }
    if (['button', 'link', 'input', 'canvas'].includes(target.kind)) {
      const hoverPath = path.join(componentScreenshotDir, `${baseName}-hover.png`);
      try {
        await locator.hover({ timeout: 3000 });
        await page.waitForTimeout(100);
        await locator.screenshot({ path: hoverPath, timeout: 5000 });
        states.push({ state: 'hover', path: hoverPath, status: 'pass' });
      } catch (error) {
        states.push({ state: 'hover', path: hoverPath, status: 'partial', error: error.message });
      }
      const focusPath = path.join(componentScreenshotDir, `${baseName}-focus.png`);
      try {
        await locator.focus({ timeout: 3000 });
        await page.waitForTimeout(100);
        await locator.screenshot({ path: focusPath, timeout: 5000 });
        states.push({ state: 'focus', path: focusPath, status: 'pass' });
      } catch (error) {
        states.push({ state: 'focus', path: focusPath, status: 'partial', error: error.message });
      }
    }
    evidence.push({ ...target, states });
  }
  return evidence;
}

async function keyboardFocusProbe(page, label, viewport) {
  if (!runKeyboardProbe) return { status: 'not_run', screenshot: '', sequence: [] };
  const sequence = [];
  let screenshot = '';
  try {
    await page.keyboard.press('Home').catch(() => {});
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(80);
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return { tag: 'none', text: '', label: '', role: '' };
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
          label: el.getAttribute('aria-label') || el.getAttribute('name') || el.getAttribute('id') || '',
          role: el.getAttribute('role') || '',
        };
      });
      sequence.push(focused);
    }
    screenshot = path.join(screenshotDir, `${label}-${viewport.name}-keyboard-focus-probe.png`);
    await page.screenshot({ path: screenshot, fullPage: false });
    const focusable = sequence.filter((item) => item.tag !== 'body' && item.tag !== 'html' && item.tag !== 'none').length;
    return { status: focusable ? 'pass' : 'partial', screenshot, sequence };
  } catch (error) {
    return { status: 'fail', screenshot, sequence, error: error.message };
  }
}

async function fetchRealServerText(resourceUrl) {
  const response = await fetch(resourceUrl);
  if (!response.ok) throw new Error(`Real server bridge failed: ${response.status} ${response.statusText} for ${resourceUrl}`);
  return response.text();
}

function appPathFromTarget(targetUrl) {
  try {
    const parsed = new URL(targetUrl);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return targetUrl || '/';
  }
}

function extractBuildAssets(html) {
  const scriptRefs = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)].map((match) => match[1]);
  const styleRefs = [...html.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi),
    ...html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']stylesheet["'][^>]*>/gi)].map((match) => match[1]);
  const shell = html
    .replace(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*><\/script>/gi, '')
    .replace(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi, '')
    .replace(/<link\b[^>]*\bhref=["'][^"']+["'][^>]*\brel=["']stylesheet["'][^>]*>/gi, '');
  return { scriptRefs, styleRefs: [...new Set(styleRefs)], shell };
}

async function loadRealServerApp(page, targetUrl) {
  if (!bridgeUsed) {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    return;
  }
  const indexUrl = new URL(appPathFromTarget(targetUrl), bridgeSourceUrl).toString();
  const html = await fetchRealServerText(indexUrl);
  const { shell, scriptRefs, styleRefs } = extractBuildAssets(html);
  if (!scriptRefs.length) throw new Error(`Real server bridge found no module script in ${indexUrl}`);
  const styles = await Promise.all(styleRefs.map(async (ref) => ({ ref, text: await fetchRealServerText(new URL(ref, bridgeSourceUrl).toString()) })));
  const scripts = await Promise.all(scriptRefs.map(async (ref) => ({ ref, text: await fetchRealServerText(new URL(ref, bridgeSourceUrl).toString()) })));
  await page.setContent(shell, { waitUntil: 'domcontentloaded' });
  for (const style of styles) await page.addStyleTag({ content: `${style.text}\n/* source: ${new URL(style.ref, bridgeSourceUrl)} */` });
  for (const script of scripts) {
    await page.evaluate(({ sourceText, sourceUrl }) => {
      const node = document.createElement('script');
      node.type = 'module';
      node.textContent = `${sourceText}\n//# sourceURL=${sourceUrl}`;
      document.head.appendChild(node);
    }, { sourceText: script.text, sourceUrl: new URL(script.ref, bridgeSourceUrl).toString() });
  }
  await page.waitForFunction(() => document.querySelector('#root')?.childElementCount > 0, undefined, { timeout: 20000 });
}
async function inspectRoute({ chromium, targetUrl, label, expectPlayerClean }) {
  const browser = await chromium.launch(chromiumLaunchOptions);
  const results = [];
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const consoleErrors = [];
      const networkFailures = [];
      page.on('console', (msg) => {
        if (['error'].includes(msg.type())) consoleErrors.push(msg.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));
      page.on('requestfailed', (request) => networkFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));
      let status = 'pass';
      let bodyText = '';
      let devSelectorCount = 0;
      let screenshot = '';
      let errorMessage = '';
      let diagnostics = null;
      let componentEvidence = [];
      let keyboardProbe = { status: 'not_run', screenshot: '', sequence: [] };
      try {
        await loadRealServerApp(page, targetUrl);
        await page.waitForTimeout(500);
        bodyText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');
        devSelectorCount = await visibleDevSelectorCount(page);
        diagnostics = isWeb3DProject ? await get3DDiagnostics(page) : null;
        ensureDir(screenshotDir);
        screenshot = path.join(screenshotDir, `${label}-${viewport.name}-${viewport.width}x${viewport.height}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        componentEvidence = await captureComponentEvidence(page, label, viewport);
        keyboardProbe = await keyboardFocusProbe(page, label, viewport);
        if (consoleErrors.length || networkFailures.length) status = 'partial';
        if (componentEvidence.some((item) => item.states.some((state) => state.status === 'fail')) && status === 'pass') status = 'partial';
        if (keyboardProbe.status === 'fail') status = 'partial';
        if (isWeb3DProject && (!diagnostics || !diagnostics.hasCanvas || diagnostics.canvasCount === 0 || (!diagnostics.webgl && !diagnostics.webgpu))) status = 'fail';
        if (isWeb3DProject && diagnostics && diagnostics.fallbackVisible) status = 'fail';
        if (isWeb3DProject && diagnostics && diagnostics.glError !== 'not_available' && diagnostics.glError !== 0) status = 'fail';
        if (isWeb3DProject && diagnostics && !diagnostics.sceneReady && status === 'pass') status = 'partial';
        if (expectPlayerClean && (forbiddenPlayerText.test(bodyText) || devSelectorCount > 0)) status = 'fail';
      } catch (error) {
        status = 'fail';
        errorMessage = error.message;
      }
      results.push({ label, url: targetUrl, viewport, status, screenshot, componentEvidence, keyboardProbe, consoleErrors, networkFailures, devSelectorCount, playerTextForbidden: forbiddenPlayerText.test(bodyText), diagnostics, errorMessage });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return results;
}

const playwright = await loadPlaywright();
const chromium = playwright.chromium;
if (!chromium) {
  write(outFile, `# Browser Evidence Report\n\nStatus: blocked\nGenerated: ${nowDate()}\nURL: ${url}\n\nPlaywright loaded, but Chromium launcher is unavailable. No browser pass is claimed.\n`);
  console.error('Browser evidence blocked: Chromium launcher unavailable.');
  process.exit(2);
}

const normalResults = await inspectRoute({ chromium, targetUrl: url, label: 'player', expectPlayerClean: isGameProject || isWeb3DProject });
const debugResults = debugUrl ? await inspectRoute({ chromium, targetUrl: debugUrl, label: 'debug', expectPlayerClean: false }) : [];
const allResults = [...normalResults, ...debugResults];
const hasFail = allResults.some((item) => item.status === 'fail');
const hasPartial = allResults.some((item) => item.status === 'partial');
const finalStatus = hasFail ? 'fail' : hasPartial ? 'partial' : 'pass';
const humanPlaytestAllowed = isGameProject ? (normalResults.every((item) => item.status === 'pass') ? 'yes' : 'no') : 'not_applicable';

let report = `# Browser Evidence Report\n\nStatus: ${finalStatus}\nGenerated: ${nowDate()}\nProject type: ${projectType}\nNormal URL: ${url}\nDebug URL: ${debugUrl || 'not_run'}\nBrowser mode: ${browserMode}\nLocalhost direct: ${bridgeUsed ? 'blocked_in_chromium; upstream confirmed by server probe' : 'attempted directly; see route result'}\nBridge used: ${bridgeUsed ? 'yes' : 'no'}\nApp source: ${bridgeUsed ? `real Vite preview server via CDP/fetch content bridge (${bridgeSourceUrl}); exact HTML/CSS/JS response bytes injected because navigation is blocked` : 'real server direct'}\nHuman playtest request allowed: ${humanPlaytestAllowed}\n\n`;
report += `## Summary\n\n| Route | Viewport | Status | Screenshot | Component shots | Keyboard probe | Console errors | Network failures | Visible dev selectors | Forbidden player text | 3D diagnostics |\n|---|---|---|---|---:|---|---:|---:|---:|---|---|\n`;
for (const item of allResults) {
  const vp = `${item.viewport.name} ${item.viewport.width}x${item.viewport.height}`;
  const shot = item.screenshot ? path.relative(root, item.screenshot) : 'not_captured';
  const componentCount = item.componentEvidence.reduce((sum, component) => sum + component.states.filter((state) => state.path).length, 0);
  const keyboard = item.keyboardProbe?.screenshot ? `${item.keyboardProbe.status}; ${path.relative(root, item.keyboardProbe.screenshot)}` : item.keyboardProbe?.status || 'not_run';
  const diag = item.diagnostics ? `canvas=${item.diagnostics.canvasCount}; size=${item.diagnostics.canvasSize ? `${item.diagnostics.canvasSize.width}x${item.diagnostics.canvasSize.height}` : 'none'}; webgl=${item.diagnostics.webgl}; webgpu=${item.diagnostics.webgpu}; context=${item.diagnostics.contextType}; glError=${item.diagnostics.glError}; fallback=${item.diagnostics.fallbackVisible}; renderMode=${item.diagnostics.renderMode}; ready=${item.diagnostics.sceneReady}` : 'not_applicable';
  report += `| ${item.label} | ${vp} | ${item.status} | ${shot} | ${componentCount} | ${keyboard} | ${item.consoleErrors.length} | ${item.networkFailures.length} | ${item.devSelectorCount} | ${item.playerTextForbidden ? 'yes' : 'no'} | ${diag} |\n`;
}
report += `\n## Details\n\n`;
for (const item of allResults) {
  const vp = `${item.viewport.name} ${item.viewport.width}x${item.viewport.height}`;
  report += `### ${item.label} - ${vp}\n\n`;
  report += `- URL: ${item.url}\n- Status: ${item.status}\n- Screenshot evidence path: ${item.screenshot ? path.relative(root, item.screenshot) : 'not_captured'}\n- Viewport coverage: ${item.viewport.width}x${item.viewport.height}\n- Screenshot review: required. Open the full-route and component screenshots and record observations in the screenshot review log from docs/browser-interaction-qa.md.\n- Human-level composition review: required. Complete docs/composition-qa.md checks for first read, component rhythm, spatial balance, center-content preservation, visual dominance, visual noise, and user/player comprehension.\n- Functional pass / composition fail: not_reviewed until the composition table is filled from screenshot inspection.\n- Design comparison: required when DESIGN.md, docs/design-brief.md, mocks, or story design references exist.\n- Console and network review: ${item.consoleErrors.length ? 'console errors found' : 'console clean'}; ${item.networkFailures.length ? 'network failures found' : 'network clean'}.\n`;
  if (item.keyboardProbe) {
    report += `- Keyboard focus probe: ${item.keyboardProbe.status}; screenshot=${item.keyboardProbe.screenshot ? path.relative(root, item.keyboardProbe.screenshot) : 'not_captured'}\n`;
    if (item.keyboardProbe.sequence?.length) {
      report += `- Focus sequence:\n${item.keyboardProbe.sequence.map((entry, index) => `  ${index + 1}. ${entry.tag}${entry.role ? `[role=${entry.role}]` : ''}${entry.label ? ` ${entry.label}` : ''}${entry.text ? ` - ${entry.text}` : ''}`).join('\n')}\n`;
    }
  }
  if (item.componentEvidence.length) {
    report += `\n#### Component/state screenshots\n\n| Kind | Label | State | Evidence | Status | Notes |\n|---|---|---|---|---|---|\n`;
    for (const component of item.componentEvidence) {
      for (const state of component.states) {
        report += `| ${component.kind} | ${String(component.label).replace(/\|/g, '/')} | ${state.state} | ${state.path ? path.relative(root, state.path) : 'not_captured'} | ${state.status} | ${state.error ? state.error.replace(/\|/g, '/') : ''} |\n`;
      }
    }
    report += '\n';
  }
  if (item.diagnostics) report += `- 3D diagnostics: canvas=${item.diagnostics.canvasCount}; size=${item.diagnostics.canvasSize ? `${item.diagnostics.canvasSize.width}x${item.diagnostics.canvasSize.height} client=${item.diagnostics.canvasSize.clientWidth}x${item.diagnostics.canvasSize.clientHeight}` : 'none'}; webgl=${item.diagnostics.webgl}; webgpu=${item.diagnostics.webgpu}; context=${item.diagnostics.contextType}; vendor=${item.diagnostics.vendor}; renderer=${item.diagnostics.renderer}; glError=${item.diagnostics.glError}; fallbackVisible=${item.diagnostics.fallbackVisible}; renderMode=${item.diagnostics.renderMode}; sceneReady=${item.diagnostics.sceneReady}.\n`;
  if (item.errorMessage) report += `- Error: ${item.errorMessage}\n`;
  if (item.consoleErrors.length) report += `- Console errors:\n${item.consoleErrors.map((e) => `  - ${e}`).join('\n')}\n`;
  if (item.networkFailures.length) report += `- Network failures:\n${item.networkFailures.map((e) => `  - ${e}`).join('\n')}\n`;
  report += '\n';
}
report += `## Composition review log\n\n`;
report += `Fill this table after opening the captured screenshots. Do not mark UI/browser pass while these fields are TBD/not_reviewed.\n\n`;
report += `| Evidence | Route/state | Viewport | Intended dominance | Actual first read | Component rhythm | Spatial balance | Center-content preservation | Scene visual dominance | Visual noise | Comprehension | Status | Fix direction | Retest |\n`;
report += `|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
for (const item of allResults) {
  const vp = `${item.viewport.name} ${item.viewport.width}x${item.viewport.height}`;
  const shot = item.screenshot ? path.relative(root, item.screenshot) : 'not_captured';
  report += `| ${shot} | ${item.label} | ${vp} | TBD | TBD | not_reviewed | not_reviewed | not_reviewed | not_reviewed | not_reviewed | not_reviewed | partial | Fill human-level composition review from docs/composition-qa.md | not_run |\n`;
}
const baseQualityRoles = [
  'Product Owner',
  'User Researcher',
  'Plan Quality Owner',
  'Tech Lead',
  'UX/Interaction Designer',
  'Visual Design Owner',
  'Visual/Composition Director',
  'Frontend/UI Owner',
  'Content/Copy Reviewer',
  'Accessibility Owner',
  'QA Owner',
  'Exploratory Tester',
  'Performance Owner',
  'Security Owner',
  'Privacy Owner',
  'Platform/SRE Owner',
  'Release Owner',
  'Agent Context Steward',
];
const conditionalQualityRoles = [
  ...(isGameProject ? ['Game Design Owner', 'Human Playtest Owner', 'Support/Ops Reviewer', 'Analytics/Learning Owner'] : []),
  ...(isWeb3DProject ? ['3D/Rendering Owner', 'License/Compliance Owner'] : []),
];
const browserQualityRoles = [...new Set([...baseQualityRoles, ...conditionalQualityRoles])];
report += `\n## Product-quality role applicability\n\n`;
report += `Classify every role before claiming L2+ UI/game/product-quality pass. Use docs/role-gate-quality-map.md.\n\n`;
report += `| Role | Applicability | Reason | Required evidence or not_applicable reason |\n`;
report += `|---|---|---|---|\n`;
for (const role of browserQualityRoles) {
  report += `| ${role} | TBD | TBD | Link screenshot/command/finding or explain not_applicable |\n`;
}
report += `\n## Product-quality role simulation\n\n`;
report += `Fill this table before claiming L2+ UI/game/product-quality pass. Each active or consulted row needs a concrete concern and evidence, not generic approval.\n\n`;
report += `| Role | Concrete concern | Evidence found | Status | Owner/fix |\n`;
report += `|---|---|---|---|---|\n`;
for (const role of browserQualityRoles) {
  report += `| ${role} | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |\n`;
}
report += `\n## Mandatory manual review handoff\n\n`;
report += `This command captures real-browser evidence and non-destructive interaction probes. It does not replace story-specific functional tests, screenshot review, or human-level composition review. Before claiming UI/browser pass, complete the screenshot review log in docs/browser-interaction-qa.md, complete the composition review in docs/composition-qa.md, compare against design references when available, and retest matching screenshots after fixes.\n\n`;
if (isGameProject) {
  report += `## Game player-facing readiness\n\n`;
  report += `Player-facing readiness: ${humanPlaytestAllowed === 'yes' ? 'pass' : 'fail'}\n`;
  report += `Agent self-play in player mode: not_run unless this command is paired with an interaction script or manual step log.\n`;
  report += `Human playtest request allowed: ${humanPlaytestAllowed}\n\n`;
  report += `This command checks for visible debug markers in DOM text/selectors and captures screenshots. It cannot inspect visual text rendered inside a canvas; reviewers must still inspect screenshots/frame sequences against DESIGN.md. For web3d projects, missing canvas/WebGL/WebGPU, visible fallback UI, or non-zero WebGL error is failing evidence; scene-ready absence is partial evidence unless another stable-render signal is documented.\n`;
}
write(outFile, report);
console.log(`Browser evidence ${finalStatus}. Report: ${path.relative(root, outFile)}`);
process.exit(finalStatus === 'pass' ? 0 : 1);
