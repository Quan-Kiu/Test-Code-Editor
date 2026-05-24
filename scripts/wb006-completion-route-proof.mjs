import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4186';
process.env.REAL_SERVER_URL = source;
const outDir = 'docs/validation-reports/wb-006-screenshots';
const reportPath = 'docs/validation-reports/wb-006-completion-route-proof.json';
const report = { story: 'WB-006 completion regression', browserMode: 'headless Chromium + Xvfb fallback', localhostDirect: 'blocked; see wb-006-direct-probe.json', bridgeUsed: true, appSource: `real Vite preview bytes through dynamic-subresource fetch bridge (${source})`, consoleErrors: [], pageErrors: [], networkFailures: [], steps: [], result: 'running' };
const start = Date.now(); const at = () => `${((Date.now()-start)/1000).toFixed(2)}s`;
const waitForText = async (page, pattern, label, timeout=45000) => { const end=Date.now()+timeout; while(Date.now()<end){ const body=await page.locator('body').innerText().catch(()=> ''); if(pattern.test(body)){ report.steps.push({label, at:at()}); return; } await page.waitForTimeout(75); } throw new Error(`Timeout: ${label}`); };
const moveUntil = async (page, pattern, label, timeout) => { await page.keyboard.down('KeyD'); try { await waitForText(page, pattern, label, timeout); } finally { await page.keyboard.up('KeyD').catch(()=>undefined); } };
await mkdir(outDir,{recursive:true});
const browser=await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium', args:['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
let page;
let completionCaptured = false;
try {
 const context=await browser.newContext({viewport:{width:720,height:450}, reducedMotion:'reduce'}); page=await context.newPage();
 page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())}); page.on('pageerror',e=>report.pageErrors.push(e.message)); page.on('requestfailed',r=>report.networkFailures.push(`${r.method()} ${r.url()} ${r.failure()?.errorText||''}`)); page.on('crash',()=>report.steps.push({label:'page crashed',at:at()})); page.on('close',()=>{ if (!completionCaptured) report.steps.push({label:'page closed unexpectedly',at:at()}); });
 const bridge=await loadRealAppThroughRequestBridge(page,'/'); report.bridgedRequests=bridge.requests;
 const playButton = page.getByRole('button',{name:/Play Solo/i}); await playButton.hover();
 await page.waitForTimeout(900);
 await playButton.click(); await page.waitForFunction(()=>window.__GAME_READY__===true,undefined,{timeout:25000});
 report.webgl=await page.evaluate(()=>{const gl=document.querySelector('canvas')?.getContext('webgl2')||document.querySelector('canvas')?.getContext('webgl'); const d=gl?.getExtension('WEBGL_debug_renderer_info'); return {available:Boolean(gl), glError:gl?.getError()??null, renderer:gl&&d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL):'unknown'};});
 const b=await page.locator('canvas').boundingBox(); if(!b) throw new Error('Canvas missing'); const x=b.x+b.width*.5,y=b.y+b.height*.5; await page.mouse.move(x,y); await page.mouse.down({button:'middle'}); await page.mouse.move(x+92,y,{steps:8}); await page.mouse.up({button:'middle'}); await page.waitForTimeout(120);
 await moveUntil(page,/Door open — follow the glowing path\./i,'Door opened',50000); await moveUntil(page,/Hold a grab hand to swing\./i,'Rope reached',50000);
 await page.mouse.down({button:'left'}); await waitForText(page,/Rope held — release toward the gate!/i,'Rope held',10000); await page.mouse.up({button:'left'}); await waitForText(page,/Launched — reach the finish gate!/i,'Launched',10000); await moveUntil(page,/Great wobble!/i,'Completed',45000);
 report.screenshotPath=`${outDir}/wb-006-completion-polished.png`; await page.screenshot({path:report.screenshotPath}); completionCaptured = true; report.result=report.webgl.available&&report.webgl.glError===0&&!report.consoleErrors.length&&!report.pageErrors.length&&!report.networkFailures.length?'pass':'fail';
} catch(error) { report.failure=error instanceof Error?error.message:String(error); report.result='fail'; }
finally { report.elapsed=at(); await writeFile(reportPath,JSON.stringify(report,null,2)); await browser.close().catch(()=>undefined); }
console.log(JSON.stringify(report,null,2)); process.exit(report.result==='pass'?0:1);
