#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const argv = process.argv.slice(2);
const root = argv.includes('--root') ? argv[argv.indexOf('--root') + 1] : process.cwd();
const allowTemplate = argv.includes('--allow-template-placeholders');
const file = 'docs/accessibility.md';
const path = join(root, file);
const errors = [];
const statuses = new Set(['not_run','pass','fail','partial','blocked','not_available','not_applicable']);
function fail(msg) { errors.push(msg); }
function tableRows(text, headers) {
  const lines = text.split(/\r?\n/), rows=[];
  for (let i=0;i<lines.length;i++) {
    if (!/^\s*\|.*\|\s*$/.test(lines[i])) continue;
    const h=lines[i].replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|').map(s=>s.trim());
    if (!headers.every(x=>h.includes(x))) continue;
    for (let j=i+1;j<lines.length && /^\s*\|.*\|\s*$/.test(lines[j]);j++) {
      const c=lines[j].replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|').map(s=>s.trim());
      if (c.every(x=>/^:?-{3,}:?$/.test(x))) continue;
      if (c.length===h.length) { const r={}; h.forEach((x,k)=>r[x]=c[k]); rows.push({line:j+1,row:r}); }
    }
  }
  return rows;
}
if (!existsSync(path)) fail(`${file} is missing.`);
else {
  const text = readFileSync(path,'utf8');
  for (const phrase of ['Keyboard navigation','Focus visibility','Accessible names','Reduced motion','Mobile/touch']) {
    if (!text.includes(phrase)) fail(`${file} must cover ${phrase}.`);
  }
  const rows = tableRows(text, ['Check','Status','Evidence ID/path','Owner','Notes']);
  if (!rows.length) fail(`${file} must include an accessibility report table.`);
  for (const {line,row} of rows) {
    if (!statuses.has(row.Status)) fail(`${file}:${line} invalid status: ${row.Status}`);
    if (!allowTemplate && /\b(TBD|TODO|FIXME)\b|YYYY-MM-DD/i.test(Object.values(row).join(' '))) fail(`${file}:${line} contains unresolved placeholder fields.`);
  }
}
if (errors.length) { console.error('validate-accessibility-report failed:'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('validate-accessibility-report passed.');
