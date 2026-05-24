const sourceOrigin = process.env.REAL_SERVER_URL || '';
const appUrl = process.env.APP_URL || '/';

export const bridgeEnabled = Boolean(sourceOrigin);

async function fetchServerText(resourceUrl) {
  const response = await fetch(resourceUrl);
  if (!response.ok) {
    throw new Error(`Real server bridge failed: ${response.status} ${response.statusText} for ${resourceUrl}`);
  }
  return response.text();
}

function resolveAppPath(targetUrl) {
  if (!targetUrl || targetUrl === '/') return '/';
  try {
    const parsed = new URL(targetUrl);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
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

/**
 * Loads the exact Vite preview HTML/CSS/JS responses into real Chromium.
 * It is used only when navigation to localhost is administratively blocked.
 * No alternate app markup or mocked scene is created.
 */
export async function loadRealApp(page, targetUrl = appUrl) {
  if (!bridgeEnabled) {
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    return { bridgeUsed: false, source: targetUrl, assets: [] };
  }

  const routePath = resolveAppPath(targetUrl);
  const indexUrl = new URL(routePath, sourceOrigin).toString();
  const html = await fetchServerText(indexUrl);
  const { shell, scriptRefs, styleRefs } = extractBuildAssets(html);
  if (scriptRefs.length === 0) {
    throw new Error(`Real server bridge found no module script in ${indexUrl}`);
  }

  const styles = await Promise.all(styleRefs.map(async (ref) => ({
    ref,
    text: await fetchServerText(new URL(ref, sourceOrigin).toString()),
  })));
  const scripts = await Promise.all(scriptRefs.map(async (ref) => ({
    ref,
    text: await fetchServerText(new URL(ref, sourceOrigin).toString()),
  })));

  await page.setContent(shell, { waitUntil: 'domcontentloaded' });
  for (const style of styles) {
    await page.addStyleTag({ content: `${style.text}\n/* source: ${new URL(style.ref, sourceOrigin)} */` });
  }
  for (const script of scripts) {
    await page.evaluate(({ sourceText, sourceUrl }) => {
      const node = document.createElement('script');
      node.type = 'module';
      node.textContent = `${sourceText}\n//# sourceURL=${sourceUrl}`;
      document.head.appendChild(node);
    }, { sourceText: script.text, sourceUrl: new URL(script.ref, sourceOrigin).toString() });
  }
  await page.waitForFunction(() => document.querySelector('#root')?.childElementCount > 0, undefined, { timeout: 20000 });
  return {
    bridgeUsed: true,
    source: indexUrl,
    assets: [...styleRefs, ...scriptRefs].map((ref) => new URL(ref, sourceOrigin).toString()),
  };
}

/**
 * Boots the real Vite shell through setContent, then fulfills browser subresource
 * requests for entry and dynamic chunks from the actual preview server. Navigation
 * stays off localhost because this sandbox blocks browser localhost navigation.
 */
export async function loadRealAppThroughRequestBridge(page, targetPath = '/') {
  if (!bridgeEnabled) {
    await page.goto(targetPath, { waitUntil: 'networkidle' });
    return { bridgeUsed: false, source: targetPath, requests: [] };
  }

  const proxyOrigin = 'http://bridge.invalid';
  const routePath = resolveAppPath(targetPath);
  const indexUrl = new URL(routePath, sourceOrigin).toString();
  const html = await fetchServerText(indexUrl);
  const { shell, scriptRefs, styleRefs } = extractBuildAssets(html);
  const bridgedRequests = [];
  await page.route(`${proxyOrigin}/**`, async (route) => {
    const requestUrl = new URL(route.request().url());
    const sourceUrl = new URL(`${requestUrl.pathname}${requestUrl.search}`, sourceOrigin).toString();
    const response = await fetch(sourceUrl);
    const body = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || undefined;
    bridgedRequests.push({ proxyUrl: requestUrl.toString(), sourceUrl, status: response.status });
    await route.fulfill({ status: response.status, contentType, body });
  });

  await page.setContent(shell, { waitUntil: 'domcontentloaded' });
  for (const styleRef of styleRefs) {
    await page.addStyleTag({ url: new URL(styleRef, proxyOrigin).toString() });
  }
  for (const scriptRef of scriptRefs) {
    await page.addScriptTag({ type: 'module', url: new URL(scriptRef, proxyOrigin).toString() });
  }
  await page.waitForFunction(() => document.querySelector('#root')?.childElementCount > 0, undefined, { timeout: 20000 });
  return {
    bridgeUsed: true,
    source: indexUrl,
    requests: bridgedRequests,
  };
}
