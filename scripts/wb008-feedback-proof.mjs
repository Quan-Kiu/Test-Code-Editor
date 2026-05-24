import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadRealAppThroughRequestBridge } from '../tests/browser/helpers/real-server-bridge.mjs';
const source = process.env.REAL_SERVER_URL || 'http://127.0.0.1:4243'; process.env.REAL_SERVER_URL = source;
const outDir='docs/validation-reports/wb-008-screenshots'; const reportPath='docs/validation-reports/wb-008-feedback-proof.json';
const report={story:'WB-008 movement, lower jump and raised-hand feedback',browserMode:'headed Chromium + Xvfb bridge',localhostDirect:'blocked; see wb-008-direct-probe.json',bridgeUsed:true,appSource:source,consoleErrors:[],pageErrors:[],networkFailures:[],checks:{},result:'running'};
await mkdir(outDir,{recursive:true});
const browser=await chromium.launch({headless:false,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-webgl','--enable-webgl2','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
try { const page=await browser.newPage({viewport:{width:960,height:600},reducedMotion:'reduce'});
 page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())}); page.on('pageerror',e=>report.pageErrors.push(e.message)); page.on('requestfailed',r=>report.networkFailures.push(`${r.method()} ${r.url()} ${r.failure()?.errorText||''}`));
 const bridge=await loadRealAppThroughRequestBridge(page,'/'); report.bridgedRequests=bridge.requests;
 await page.getByRole('button',{name:/Play Solo/i}).hover(); await page.waitForTimeout(500); await page.getByRole('button',{name:/Play Solo/i}).click();
 await page.waitForFunction(()=>window.__GAME_READY__===true && document.documentElement.dataset.player1Grounded==='true',undefined,{timeout:25000});
 report.webgl=await page.evaluate(()=>{const gl=document.querySelector('canvas')?.getContext('webgl2')||document.querySelector('canvas')?.getContext('webgl'); return {available:Boolean(gl),glError:gl?.getError()??null};});
 const stance=await page.evaluate(()=>Number(document.documentElement.dataset.player1Y)); report.telemetry={stanceY:stance};
 await page.keyboard.down('Space'); await page.waitForFunction(y=>Number(document.documentElement.dataset.player1Y)>y+0.35,stance,{timeout:15000}); await page.keyboard.up('Space');
 const apex=await page.evaluate(()=>Number(document.documentElement.dataset.player1Y)); report.telemetry.jumpRise=Number((apex-stance).toFixed(3)); report.checks.lowerJumpFunctional=report.telemetry.jumpRise>0.35 && report.telemetry.jumpRise<1.3;
 await page.waitForFunction(y=>document.documentElement.dataset.player1Grounded==='true' && Math.abs(Number(document.documentElement.dataset.player1Y)-y)<0.2,stance,{timeout:12000});
 const box=await page.locator('canvas').boundingBox(); if(!box) throw new Error('canvas missing'); const cx=box.x+box.width*.55, cy=box.y+box.height*.5;
 await page.mouse.move(cx,cy); await page.mouse.down({button:'middle'}); await page.mouse.move(cx+90,cy,{steps:8}); await page.mouse.up({button:'middle'}); await page.waitForTimeout(100);
 await page.keyboard.down('KeyD'); await page.waitForFunction(()=>Number(document.documentElement.dataset.player1X)>-0.5,undefined,{timeout:15000}); await page.keyboard.up('KeyD');
 await page.keyboard.down('KeyS'); await page.getByText(/Target ready/i).waitFor({timeout:15000}); await page.keyboard.up('KeyS');
 await page.mouse.down({button:'left'}); await page.getByText(/LEFT HAND ↑ GRABBING/i).waitFor({timeout:5000});
 report.checks.raisedHandBadgeVisible=true; report.screenshotPath=`${outDir}/wb-008-raised-hand-crate-grab.png`; await page.screenshot({path:report.screenshotPath}); await page.mouse.up({button:'left'});
 report.result=Object.values(report.checks).every(Boolean)&&report.webgl.available&&report.webgl.glError===0&&!report.consoleErrors.length&&!report.pageErrors.length&&!report.networkFailures.length?'pass':'fail';
} catch(e){report.failure=e instanceof Error?e.message:String(e);report.result='fail';}
finally{await writeFile(reportPath,JSON.stringify(report,null,2)); await Promise.race([browser.close().catch(()=>undefined),new Promise(r=>setTimeout(r,1200))]);}
console.log(JSON.stringify(report,null,2)); process.exit(report.result==='pass'?0:1);
