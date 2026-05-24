#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const argv = process.argv.slice(2);
const root = argv.includes('--root') ? argv[argv.indexOf('--root') + 1] : process.cwd();
const allowTemplate = argv.includes('--allow-template-placeholders');
const file = 'docs/traceability-matrix.md';
const path = join(root, file);
const errors = [];
function fail(msg) { errors.push(msg); }
function rowsWithHeaders(text, headers) {
  const lines = text.split(/\r?\n/); const rows = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\|.*\|\s*$/.test(lines[i])) continue;
    const h = lines[i].replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(s => s.trim());
    if (!headers.every(x => h.includes(x))) continue;
    for (let j = i + 1; j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j]); j++) {
      const cells = lines[j].replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(s => s.trim());
      if (cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
      if (cells.length === h.length) { const row = {}; h.forEach((name, k) => row[name] = cells[k]); rows.push({line:j+1,row}); }
    }
  }
  return rows;
}
function placeholder(v) { return /\b(TBD|TODO|FIXME)\b|<[^>]+>|YYYY-MM-DD/i.test(String(v || '')); }
if (!existsSync(path)) fail(`${file} is missing.`);
else {
  const text = readFileSync(path, 'utf8');
  for (const heading of ['## 1. Operating rule','## 2. Requirement to evidence matrix','## 3. Design conformance mapping','## 4. Validation mapping']) {
    if (!text.includes(heading)) fail(`${file} missing heading: ${heading}`);
  }
  const reqRows = rowsWithHeaders(text, ['Requirement ID','Requirement','Story ID','Acceptance criteria','Design asset ID','Implementation files','Test cases','Evidence ID/path','QA result','Release gate']);
  if (!reqRows.length) fail(`${file} must include at least one requirement traceability row.`);
  const valid = new Set(['not_run','pass','fail','partial','blocked','not_available','not_applicable']);
  for (const {line,row} of reqRows) {
    if (row['QA result'] && !valid.has(row['QA result'])) fail(`${file}:${line} has invalid QA result: ${row['QA result']}`);
    if (!allowTemplate && Object.values(row).some(placeholder)) fail(`${file}:${line} contains unresolved placeholder fields.`);
  }
}
if (errors.length) { console.error('validate-traceability failed:'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('validate-traceability passed.');
