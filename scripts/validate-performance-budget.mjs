#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const argv = process.argv.slice(2);
const root = argv.includes('--root') ? argv[argv.indexOf('--root') + 1] : process.cwd();
const requireConcrete = argv.includes('--require-concrete');
const file = 'docs/performance-budget.md';
const path = join(root, file);
const errors = [];
function fail(msg) { errors.push(msg); }
if (!existsSync(path)) fail(`${file} is missing.`);
else {
  const text = readFileSync(path,'utf8');
  for (const heading of ['## 1. Web UI budgets','## 2. API/backend budgets','## 3. Game and Web3D budgets','## 4. Performance evidence log']) {
    if (!text.includes(heading)) fail(`${file} missing heading: ${heading}`);
  }
  for (const metric of ['LCP','INP','CLS','Stable FPS','Frame time p95','Canvas fallback rate']) {
    if (!text.includes(metric)) fail(`${file} must include metric: ${metric}`);
  }
  if (requireConcrete && /\bTBD\b|YYYY-MM-DD/i.test(text)) fail(`${file} still contains template placeholders.`);
}
if (errors.length) { console.error('validate-performance-budget failed:'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('validate-performance-budget passed.');
