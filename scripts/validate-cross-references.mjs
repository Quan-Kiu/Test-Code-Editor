#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const argv = process.argv.slice(2);
const root = argv.includes('--root') ? argv[argv.indexOf('--root') + 1] : process.cwd();
const errors = [];
function fail(msg) { errors.push(msg); }
function existsRel(rel) { return existsSync(join(root, rel)); }
function readJson(rel) { return JSON.parse(readFileSync(join(root, rel), 'utf8')); }
function uniq(items) { return [...new Set(items.filter(Boolean))]; }
function projectTypes(value) { return String(value || 'none').split(',').map((x) => x.trim()).filter(Boolean); }
function collectMode(matrix, mode, key) {
  const order = matrix.modeOrder || Object.keys(matrix.modes || {});
  const idx = order.indexOf(mode);
  if (idx < 0) return [];
  return uniq(order.slice(0, idx + 1).flatMap((m) => matrix.modes?.[m]?.[key] || []));
}
function expectedPaths(matrix, cfg) {
  if (!cfg) {
    const out = [];
    for (const section of ['modes','runtimeAdapters','projectTypes']) {
      for (const entry of Object.values(matrix[section] || {})) {
        for (const key of ['requires','criticalDocs']) out.push(...(entry[key] || []));
        if (entry.entrypoint) out.push(entry.entrypoint);
      }
    }
    return uniq(out);
  }
  const mode = cfg.selected_mode || 'mvp';
  const runtime = cfg.selected_runtime || 'generic';
  const types = projectTypes(cfg.selected_project_type || 'none');
  const runtimeCfg = matrix.runtimeAdapters?.[runtime] || {};
  const out = [...collectMode(matrix, mode, 'requires'), runtimeCfg.entrypoint, ...(runtimeCfg.requires || [])];
  for (const type of types) out.push(...(matrix.projectTypes?.[type]?.requires || []));
  return uniq(out);
}
if (!existsRel('docs/mode-requirements.json')) fail('docs/mode-requirements.json is missing.');
else {
  const matrix = readJson('docs/mode-requirements.json');
  const cfg = existsRel('harness.config.json') ? readJson('harness.config.json') : null;
  for (const rel of expectedPaths(matrix, cfg)) {
    if (rel.endsWith('/')) { if (!existsRel(rel.slice(0,-1))) fail(`mode-requirements references missing selected directory: ${rel}`); }
    else if (!existsRel(rel)) fail(`mode-requirements references missing selected path: ${rel}`);
  }
  if (!matrix.projectTypes?.web3d) fail('mode-requirements must define projectTypes.web3d.');
}
if (existsRel('package.json')) {
  const pkg = readJson('package.json');
  const scripts = Object.values(pkg.scripts || {}).join('\n');
  for (const script of ['validate-design-assets.mjs','validate-traceability.mjs','validate-accessibility-report.mjs','validate-performance-budget.mjs','validate-cross-references.mjs']) {
    if (!scripts.includes(script)) fail(`package.json scripts do not reference ${script}`);
    if (!existsRel(`scripts/${script}`)) fail(`missing validator script: scripts/${script}`);
  }
}
if (existsRel('design-assets/manifest.json')) {
  const manifest = readJson('design-assets/manifest.json');
  if (!Array.isArray(manifest.assets)) fail('design-assets/manifest.json assets must be an array.');
}
const coreQuality = ['docs/roles-and-raci.md','docs/signoff-ledger.md','docs/traceability-matrix.md','docs/qa-test-cases.md'];
for (const rel of coreQuality) if (!existsRel(rel)) fail(`quality-system core file missing: ${rel}`);
for (const rel of ['docs/design-assets.md','docs/accessibility.md','docs/performance-budget.md','docs/license-compliance.md','docs/privacy.md','docs/security-asvs-map.md','docs/playtest-protocol.md']) {
  if (existsRel(rel)) continue;
  // Optional in selective installs; required only when mode-requirements selected it, which was checked above.
}
if (errors.length) { console.error('validate-cross-references failed:'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('validate-cross-references passed.');
