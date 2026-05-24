#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validateProductionReadinessSemantics } from './lib/production-readiness-semantics.mjs';

const argv = process.argv.slice(2);
const args = new Set(argv);
const errors = [];
const warnings = [];

function valueAfter(flag) {
  const idx = argv.indexOf(flag);
  return idx >= 0 ? argv[idx + 1] : undefined;
}

const root = path.resolve(valueAfter('--root') || process.cwd());

function usage() {
  console.log(`Usage:
  node scripts/validate-project.mjs --mode <learning|mvp|real-project|production> [--runtime <generic|claude|hermes>] [--project-type <none|ui|api|backend|cli|mixed|game|web3d>] [--root <project-root>] [--summary] [--allow-template-placeholders] [--help]

Validates an initialized project that uses the playbook. Runtime and project-type requirements are loaded from docs/mode-requirements.json so docs, init planning, and validation share one source of truth.

Examples:
  node scripts/validate-project.mjs --mode mvp --runtime generic --project-type ui
  node scripts/validate-project.mjs --mode real-project --runtime claude --project-type api
  node scripts/validate-project.mjs --mode production --runtime hermes --project-type mixed --summary
  node scripts/validate-project.mjs --root ../my-app --mode production --runtime generic --project-type api --summary

The blank template may pass schema checks with --allow-template-placeholders, but production release approval must not use that flag.

Production mode additionally performs semantic checks for production gate statuses, accepted_unknown rows, evidence ledger rows, security exceptions, and final decision placeholders.

Use comma-separated project types such as ui,backend when a project has multiple surfaces. Use game for game/vertical-slice projects, and game,web3d for 3D browser games. Reserve mixed for UI plus API contract work without persistent backend state/data ownership/jobs/migrations.
`);
}

if (args.has('--help') || args.has('-h')) {
  usage();
  process.exit(0);
}

function exists(p) {
  return fs.existsSync(path.join(root, p));
}
function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8');
}
function lines(p) {
  return read(p).split(/\r?\n/);
}
function isPlaceholder(value) {
  return /(^|\b)(TBD|TODO|FIXME|<[^>]+>|YYYY-MM-DD)(\b|$)/i.test(String(value || '').trim());
}
function isMissingOrPlaceholder(value) {
  return !String(value || '').trim() || isPlaceholder(value);
}
function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim());
}
function norm(value) {
  return String(value || '').trim().replace(/^`|`$/g, '');
}
function normText(value) {
  return norm(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}
function extractEnvExampleNames(text) {
  const names = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*#?\s*([A-Z][A-Z0-9_]+)\s*=/);
    if (match) names.push(match[1]);
  }
  return [...new Set(names)];
}

function splitTableRow(line) {
  return line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
}
function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c.replace(/\s+/g, '')));
}
function parseTableRows(file, requiredHeaders) {
  if (!exists(file)) return [];
  const all = lines(file);
  const rows = [];
  for (let i = 0; i < all.length; i++) {
    const line = all[i];
    if (!/^\s*\|.*\|\s*$/.test(line)) continue;
    const headers = splitTableRow(line);
    const hasHeaders = requiredHeaders.every((h) => headers.includes(h));
    if (!hasHeaders) continue;
    let j = i + 1;
    while (j < all.length && /^\s*\|.*\|\s*$/.test(all[j])) {
      const cells = splitTableRow(all[j]);
      if (isSeparatorRow(cells)) { j++; continue; }
      if (cells.length === headers.length) {
        const row = { file, line: j + 1, cells: {}, raw: all[j], headers };
        headers.forEach((h, idx) => { row.cells[h] = cells[idx]; });
        rows.push(row);
      }
      j++;
    }
  }
  return rows;
}
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function hasExactEvidenceId(text, id) {
  if (!id) return false;
  const escaped = escapeRegExp(id);
  const pattern = new RegExp(`(^|[^A-Za-z0-9_-])${escaped}(?![A-Za-z0-9_-])`);
  return pattern.test(String(text || ''));
}
function acceptedUnknownMatchesGate(unknownRow, gateRow, evidenceIds = []) {
  const gate = normText(gateRow.cells.Gate);
  const linkRaw = norm(unknownRow.cells['Gate/Evidence ID']);
  const link = normText(linkRaw);
  if (!gate || !link) return false;
  if (link === gate) return true;
  return evidenceIds.some((id) => linkRaw === id && hasExactEvidenceId(gateRow.cells['Required evidence'], id));
}
function uniq(values) {
  return [...new Set(values)];
}
function loadRequirementMatrix() {
  const file = 'docs/mode-requirements.json';
  if (!exists(file)) {
    errors.push(`${file} is missing. Project validation cannot determine required files.`);
    return { modes: {}, runtimeAdapters: {}, projectTypes: {}, modeOrder: [] };
  }
  try {
    return JSON.parse(read(file));
  } catch (error) {
    errors.push(`${file} is not valid JSON: ${error.message}`);
    return { modes: {}, runtimeAdapters: {}, projectTypes: {}, modeOrder: [] };
  }
}
function getModeOrder(matrix) {
  const modeNames = Object.keys(matrix.modes || {});
  const order = Array.isArray(matrix.modeOrder) ? matrix.modeOrder : [];
  if (!order.length) {
    errors.push('docs/mode-requirements.json must define explicit modeOrder. Do not infer inheritance from JSON key order.');
    return modeNames;
  }
  const missingFromOrder = modeNames.filter((m) => !order.includes(m));
  const missingFromModes = order.filter((m) => !modeNames.includes(m));
  if (missingFromOrder.length) errors.push(`modeOrder omits modes: ${missingFromOrder.join(', ')}`);
  if (missingFromModes.length) errors.push(`modeOrder references unknown modes: ${missingFromModes.join(', ')}`);
  return order.filter((m) => modeNames.includes(m));
}
function collectModeItems(matrix, modeName, key) {
  const modeOrder = getModeOrder(matrix);
  const idx = modeOrder.indexOf(modeName);
  if (idx < 0) return [];
  return uniq(modeOrder.slice(0, idx + 1).flatMap((m) => matrix.modes[m]?.[key] || []));
}
function parseProjectTypes(value) {
  const raw = value || 'none';
  const types = raw.split(',').map((item) => item.trim()).filter(Boolean);
  return types.length ? types : ['none'];
}
function categoryFor(error) {
  if (/Required path missing/.test(error)) return 'missing required paths';
  if (/Unresolved placeholder|placeholder|TBD|TODO|FIXME/i.test(error)) return 'unresolved placeholders';
  if (/accepted_unknown/i.test(error)) return 'accepted_unknown issues';
  if (/evidence ledger|Evidence ledger/i.test(error)) return 'evidence ledger issues';
  if (/security exception/i.test(error)) return 'security exception issues';
  if (/production gate|production readiness|production-readiness|Risk tier|release risk tier|Applies when|Final decision|release-decision|derived status|blocking gate|Evidence ID|Decision date/i.test(error)) return 'production readiness issues';
  if (/modeOrder|mode-requirements/.test(error)) return 'requirements matrix issues';
  if (/validation status|status token|legacy validation/i.test(error)) return 'status vocabulary issues';
  return 'other issues';
}
function printSummary(errors) {
  const grouped = new Map();
  for (const error of errors) {
    const key = categoryFor(error);
    grouped.set(key, [...(grouped.get(key) || []), error]);
  }
  console.error('Summary:');
  for (const [category, entries] of grouped.entries()) {
    console.error(`- ${category}: ${entries.length}`);
    for (const entry of entries.slice(0, 3)) console.error(`  - ${entry}`);
    if (entries.length > 3) console.error(`  - ... ${entries.length - 3} more`);
  }
}
function countTemplatePlaceholders(files) {
  let count = 0;
  for (const file of files) {
    if (!exists(file)) continue;
    for (const line of lines(file)) {
      if (/\b(TBD|TODO|FIXME)\b|<[^>]+>|YYYY-MM-DD/i.test(line) && !placeholderAllowedLine(line)) {
        count += 1;
      }
    }
  }
  return count;
}

const matrix = loadRequirementMatrix();
const mode = valueAfter('--mode');
const runtime = valueAfter('--runtime') || 'generic';
const projectTypes = parseProjectTypes(valueAfter('--project-type'));
const allowTemplate = args.has('--allow-template-placeholders');
const summary = args.has('--summary');
const validModes = new Set(Object.keys(matrix.modes || {}));
const validRuntimes = new Set(Object.keys(matrix.runtimeAdapters || {}));
const validProjectTypes = new Set(Object.keys(matrix.projectTypes || {}));

if (!mode || !validModes.has(mode)) errors.push(`Missing or invalid --mode. Use one of: ${[...validModes].join(', ')}.`);
if (!validRuntimes.has(runtime)) errors.push(`Missing or invalid --runtime. Use one of: ${[...validRuntimes].join(', ')}.`);
for (const type of projectTypes) {
  if (!validProjectTypes.has(type)) errors.push(`Invalid --project-type entry: ${type}. Use one of: ${[...validProjectTypes].join(', ')}.`);
}

const allowedArgs = new Set(['--mode', '--runtime', '--project-type', '--root', '--summary', '--allow-template-placeholders']);
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (['--mode', '--runtime', '--project-type', '--root'].includes(arg)) { i++; continue; }
  if (!allowedArgs.has(arg)) errors.push(`Unknown project validation argument: ${arg}. Use --help.`);
}

let required = [];
let criticalDocs = [];
if (mode && validModes.has(mode)) {
  required.push(...collectModeItems(matrix, mode, 'requires'));
  criticalDocs.push(...collectModeItems(matrix, mode, 'criticalDocs'));
}
if (runtime && validRuntimes.has(runtime)) {
  const runtimeAdapter = matrix.runtimeAdapters[runtime] || {};
  if (runtimeAdapter.entrypoint) required.push(runtimeAdapter.entrypoint);
  required.push(...(runtimeAdapter.requires || []));
}
for (const type of projectTypes) {
  if (!validProjectTypes.has(type)) continue;
  required.push(...(matrix.projectTypes[type]?.requires || []));
  criticalDocs.push(...(matrix.projectTypes[type]?.criticalDocs || []));
}
required = uniq(required);
criticalDocs = uniq(criticalDocs);

for (const file of required) {
  if (!exists(file)) errors.push(`Required path missing for ${mode}/${runtime}/${projectTypes.join(',')}: ${file}`);
}

function placeholderAllowedLine(line) {
  // Do not exempt a whole row merely because a status cell contains accepted_unknown or not_applicable.
  // That previously let real TBD values in owner/evidence cells slip through validation.
  return /template placeholder/i.test(line) || /must not contain unresolved `?(TBD|TODO|FIXME)`?/i.test(line);
}

if (!allowTemplate) {
  for (const file of criticalDocs) {
    if (!exists(file)) continue;
    lines(file).forEach((line, index) => {
      if (/\b(TBD|TODO|FIXME)\b/.test(line) && !placeholderAllowedLine(line)) {
        errors.push(`Unresolved placeholder in ${file}:${index + 1}`);
      }
    });
  }
}

const requiredHeadings = {
  'docs/production-readiness.md': ['## 1. Readiness status', '## 1.1 Release decision tree', '## 2.1 Release risk classification', '## 3. Measurable production gates', '## 12. Final decision'],
  'docs/observability.md': ['## 3. SLI/SLO contract'],
  'docs/evidence-ledger.md': ['# Evidence Ledger'],
  'docs/security-exceptions.md': ['# Security Exceptions'],
  'docs/standards-map.md': ['## 1. External reference register', '## 2. Mapping table']
};

if (mode === 'production') {
  for (const [file, headings] of Object.entries(requiredHeadings)) {
    if (!exists(file)) continue;
    const text = read(file);
    for (const heading of headings) {
      if (!text.includes(heading)) errors.push(`${file} missing required heading: ${heading}`);
    }
  }
}

const validationStatuses = new Set(['not_run', 'pass', 'fail', 'blocked', 'not_available', 'not_applicable', 'partial']);
const productionStatuses = new Set(['not_started', 'in_progress', 'pass', 'fail', 'accepted_unknown', 'not_applicable']);
const readinessStatuses = new Set(['not_ready', 'ready_with_risks', 'ready']);
const evidenceStatuses = new Set(['retained', 'linked', 'expired', 'missing']);
const allowedRiskTiers = new Set(['low', 'medium', 'high', 'critical', 'all', 'n/a', 'TBD']);
const acceptedUnknownHeaders = ['Unknown', 'Gate/Evidence ID', 'Owner', 'Reason', 'Risk', 'Review date', 'Expiry', 'Mitigation'];
const legacyAcceptedUnknownHeaders = ['Unknown', 'Owner', 'Reason', 'Risk', 'Review date', 'Expiry', 'Mitigation'];

if (mode === 'production' && exists('docs/production-readiness.md')) {
  const text = read('docs/production-readiness.md');
  if (!text.includes('Owner') || !text.includes('Required evidence') || !text.includes('Enforced by')) {
    errors.push('docs/production-readiness.md must include owner/evidence/enforcement fields.');
  }
  if (!text.includes('Applies when') || !text.includes('Risk tier')) {
    errors.push('docs/production-readiness.md must include Applies when and Risk tier columns for conditional blocking gates.');
  }
  if (!text.includes('docs/release-risk-classification.md')) {
    errors.push('docs/production-readiness.md must reference docs/release-risk-classification.md for risk tier definitions.');
  }

  const gateHeaders = ['Gate', 'Owner', 'Applies when', 'Risk tier', 'Required evidence', 'Enforced by', 'Blocking?', 'Status'];
  let gateRows = parseTableRows('docs/production-readiness.md', gateHeaders);
  if (gateRows.length === 0) {
    gateRows = parseTableRows('docs/production-readiness.md', ['Gate', 'Owner', 'Required evidence', 'Enforced by', 'Blocking?', 'Status']);
    if (gateRows.length > 0) warnings.push('docs/production-readiness.md uses the legacy production gate table without Applies when/Risk tier columns.');
  }

  for (const row of gateRows) {
    const status = norm(row.cells.Status);
    const appliesWhen = row.cells['Applies when'];
    const riskTier = norm(row.cells['Risk tier']);
    const blocking = row.cells['Blocking?'] || '';
    if (status && !productionStatuses.has(status) && status !== 'TBD') {
      errors.push(`Unknown production gate status in docs/production-readiness.md:${row.line}: ${status}`);
    }
    if (riskTier && !allowedRiskTiers.has(riskTier)) {
      errors.push(`Unknown risk tier in docs/production-readiness.md:${row.line}: ${riskTier}`);
    }
    if (!allowTemplate) {
      for (const header of ['Gate', 'Owner', 'Applies when', 'Risk tier', 'Required evidence', 'Enforced by', 'Blocking?', 'Status']) {
        if (isMissingOrPlaceholder(row.cells[header])) errors.push(`Production gate ${header} is unresolved in docs/production-readiness.md:${row.line}`);
      }
    }
    if (!allowTemplate && /yes for|yes when/i.test(blocking) && (!appliesWhen || appliesWhen === 'TBD')) {
      errors.push(`Conditional blocking gate must document Applies when at docs/production-readiness.md:${row.line}`);
    }
    if (!allowTemplate && status === 'not_applicable') {
      const evidence = row.cells['Required evidence'] || '';
      if (!/(reason|because|does not apply|not applicable)/i.test(evidence)) {
        errors.push(`not_applicable gate must document a reason in Required evidence at docs/production-readiness.md:${row.line}`);
      }
    }
  }

  const finalText = text.split('## 12. Final decision')[1] || '';
  const finalStatusMatches = [...finalText.matchAll(/^\s*Production readiness status:\s*`?([a-z_]+|TBD)`?\s*$/gmi)];
  if (finalStatusMatches.length !== 1) {
    errors.push('docs/production-readiness.md final decision must declare exactly one line: Production readiness status: `<not_ready|ready_with_risks|ready>`.');
  } else {
    const finalStatus = finalStatusMatches[0][1];
    if (!allowTemplate && !readinessStatuses.has(finalStatus)) errors.push(`Invalid production readiness status: ${finalStatus}`);
    if (allowTemplate && finalStatus !== 'TBD' && !readinessStatuses.has(finalStatus)) errors.push(`Invalid production readiness status: ${finalStatus}`);
  }
  if (!allowTemplate && /\b(TBD|TODO|FIXME)\b/.test(finalText)) errors.push('docs/production-readiness.md final decision still contains unresolved placeholders.');
}

if (mode === 'production') {
  const gateHeaders = ['Gate', 'Owner', 'Applies when', 'Risk tier', 'Required evidence', 'Enforced by', 'Blocking?', 'Status'];
  const evidenceRowsForMapping = parseTableRows('docs/evidence-ledger.md', ['Evidence ID', 'Type', 'Scope', 'Link/path/summary', 'Owner', 'Date', 'Expires?', 'Status']);
  const evidenceIdsForMapping = evidenceRowsForMapping.map((row) => norm(row.cells['Evidence ID'])).filter(Boolean);
  const acceptedGateRows = parseTableRows('docs/production-readiness.md', gateHeaders).filter((row) => norm(row.cells.Status) === 'accepted_unknown');
  let acceptedRows = parseTableRows('docs/production-readiness.md', acceptedUnknownHeaders);
  const legacyRows = parseTableRows('docs/production-readiness.md', legacyAcceptedUnknownHeaders);
  if (legacyRows.length && !acceptedRows.length) {
    errors.push('docs/production-readiness.md accepted_unknown table must include Gate/Evidence ID, Risk, and Mitigation columns.');
    acceptedRows = legacyRows;
  }
  if (acceptedGateRows.length && !acceptedRows.length) {
    errors.push('accepted_unknown gates require a filled accepted_unknown table with Gate/Evidence ID, Risk, and Mitigation columns.');
  }
  for (const gateRow of acceptedGateRows) {
    if (!acceptedRows.some((unknownRow) => acceptedUnknownMatchesGate(unknownRow, gateRow, evidenceIdsForMapping))) {
      errors.push(`accepted_unknown gate is not mapped to an accepted_unknown row at docs/production-readiness.md:${gateRow.line}: ${gateRow.cells.Gate}`);
    }
  }
  for (const row of acceptedRows) {
    const requiredFields = row.headers.includes('Gate/Evidence ID') ? acceptedUnknownHeaders : legacyAcceptedUnknownHeaders;
    const values = requiredFields.map((h) => row.cells[h]);
    if (!allowTemplate && values.some(isMissingOrPlaceholder)) {
      errors.push(`accepted_unknown row has unresolved fields at docs/production-readiness.md:${row.line}`);
    }
    if (!allowTemplate && (!isDate(row.cells['Review date']) || !isDate(row.cells.Expiry))) {
      errors.push(`accepted_unknown row must include YYYY-MM-DD review date and expiry at docs/production-readiness.md:${row.line}`);
    }
    if (row.cells.Risk && !allowedRiskTiers.has(norm(row.cells.Risk))) {
      errors.push(`accepted_unknown row has invalid Risk at docs/production-readiness.md:${row.line}: ${row.cells.Risk}`);
    }
  }
}

if (mode === 'production' && exists('docs/evidence-ledger.md')) {
  const rows = parseTableRows('docs/evidence-ledger.md', ['Evidence ID', 'Type', 'Scope', 'Link/path/summary', 'Owner', 'Date', 'Expires?', 'Status']);
  if (!allowTemplate && rows.length === 0) errors.push('docs/evidence-ledger.md must include at least one evidence row.');
  for (const row of rows) {
    const status = norm(row.cells.Status);
    if (status && !evidenceStatuses.has(status) && status !== 'TBD') {
      errors.push(`Unknown evidence retention status in docs/evidence-ledger.md:${row.line}: ${status}`);
    }
    if (!allowTemplate) {
      for (const header of ['Evidence ID', 'Type', 'Scope', 'Link/path/summary', 'Owner', 'Date', 'Status']) {
        if (isMissingOrPlaceholder(row.cells[header])) errors.push(`Evidence ledger ${header} is unresolved at docs/evidence-ledger.md:${row.line}`);
      }
      if (!isDate(row.cells.Date)) errors.push(`Evidence ledger Date must be YYYY-MM-DD at docs/evidence-ledger.md:${row.line}`);
    }
  }

  const acceptedRows = parseTableRows('docs/evidence-ledger.md', acceptedUnknownHeaders);
  const legacyAcceptedRows = parseTableRows('docs/evidence-ledger.md', legacyAcceptedUnknownHeaders);
  if (legacyAcceptedRows.length && !acceptedRows.length) {
    errors.push('docs/evidence-ledger.md accepted_unknown table must include Gate/Evidence ID, Risk, and Mitigation columns.');
  }
  for (const row of acceptedRows) {
    if (!allowTemplate) {
      for (const header of acceptedUnknownHeaders) {
        if (isMissingOrPlaceholder(row.cells[header])) errors.push(`Evidence ledger accepted_unknown ${header} is unresolved at docs/evidence-ledger.md:${row.line}`);
      }
      if (!['low', 'medium', 'high', 'critical'].includes(norm(row.cells.Risk))) {
        errors.push(`Evidence ledger accepted_unknown Risk must be low, medium, high, or critical at docs/evidence-ledger.md:${row.line}: ${row.cells.Risk}`);
      }
      if (!isDate(row.cells['Review date']) || !isDate(row.cells.Expiry)) {
        errors.push(`Evidence ledger accepted_unknown dates must be YYYY-MM-DD at docs/evidence-ledger.md:${row.line}`);
      }
    }
  }
}

if (mode === 'production' && exists('.env.example') && exists('docs/environments.md')) {
  const envExampleNames = extractEnvExampleNames(read('.env.example'));
  const environmentsDoc = read('docs/environments.md');
  for (const name of envExampleNames) {
    if (!environmentsDoc.includes(`\`${name}\``)) {
      errors.push(`docs/environments.md must document env var from .env.example: ${name}`);
    }
  }
}

if (mode === 'production' && exists('docs/security-exceptions.md')) {
  const rows = parseTableRows('docs/security-exceptions.md', ['ID', 'Risk', 'Severity', 'Owner', 'Mitigation', 'Expiry date', 'Status']);
  const allowedSecurityStatuses = new Set(['open', 'closed', 'expired']);
  const allowedSeverities = new Set(['low', 'medium', 'high', 'critical']);
  for (const row of rows) {
    const status = norm(row.cells.Status);
    const severity = norm(row.cells.Severity);
    if (status && !allowedSecurityStatuses.has(status) && !(allowTemplate && status === 'TBD')) {
      errors.push(`Unknown security exception status in docs/security-exceptions.md:${row.line}: ${status}`);
    }
    if (severity && !allowedSeverities.has(severity) && !(allowTemplate && severity === 'TBD')) {
      errors.push(`Unknown security exception severity in docs/security-exceptions.md:${row.line}: ${severity}`);
    }
    if (!allowTemplate) {
      if (status.includes('/')) errors.push(`Security exception status must be a single value at docs/security-exceptions.md:${row.line}: ${status}`);
      if (severity.includes('/')) errors.push(`Security exception severity must be a single value at docs/security-exceptions.md:${row.line}: ${severity}`);
      for (const header of ['ID', 'Risk', 'Severity', 'Owner', 'Mitigation', 'Expiry date', 'Status']) {
        if (isMissingOrPlaceholder(row.cells[header])) errors.push(`Security exception ${header} is unresolved at docs/security-exceptions.md:${row.line}`);
      }
      if (status === 'open' && !isDate(row.cells['Expiry date'])) errors.push(`Open security exception expiry must be YYYY-MM-DD at docs/security-exceptions.md:${row.line}`);
    }
  }
}

if (mode === 'production') {
  const validationFiles = ['docs/validation.md', 'docs/validation-reports/template.md'];
  for (const file of validationFiles) {
    if (!exists(file)) continue;
    const text = read(file);
    const legacy = text.match(/pass\/fail\/not (run|available|applicable)|`not (run|available|applicable)`/i);
    if (legacy) errors.push(`${file} uses legacy validation status spelling near: ${legacy[0]}`);
    const statusTokens = [...text.matchAll(/\b(pass|fail|blocked|not_run|not_available|not_applicable|partial)\b/g)].map((m) => m[1]);
    for (const token of statusTokens) {
      if (!validationStatuses.has(token)) errors.push(`${file} contains invalid validation status token: ${token}`);
    }
  }
}


if (mode === 'production') {
  const semantic = validateProductionReadinessSemantics({ root, allowTemplate });
  errors.push(...semantic.errors);
  warnings.push(...semantic.warnings);
}

if (allowTemplate) {
  const placeholderCount = countTemplatePlaceholders(criticalDocs);
  warnings.push('Template placeholders are allowed for package/template hygiene only. This is not project readiness or production release evidence.');
  if (placeholderCount > 0) {
    warnings.push(`${placeholderCount} placeholder-bearing lines remain in mode-critical template docs and must be filled in a real project.`);
  }
}

if (warnings.length) {
  console.warn('Warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error(`Project validation failed (${mode || 'unknown mode'}):`);
  if (summary) printSummary(errors);
  if (!summary) {
    for (const error of errors) console.error(`- ${error}`);
  } else {
    console.error('\nRun without --summary for the complete error list.');
  }
  process.exit(1);
}

if (allowTemplate) {
  console.log(`Template hygiene validation passed (${mode}/${runtime}/${projectTypes.join(',')}): ${required.length} required paths checked at ${root}.`);
  console.log('Result is intentionally not valid as project readiness evidence until placeholders are filled and --allow-template-placeholders is removed.');
} else {
  console.log(`Project validation passed (${mode}/${runtime}/${projectTypes.join(',')}): ${required.length} required paths checked at ${root}.`);
}
