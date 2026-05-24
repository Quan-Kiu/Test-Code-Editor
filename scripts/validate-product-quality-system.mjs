#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const args = new Set(argv);

function valueAfter(flag) {
  const idx = argv.indexOf(flag);
  return idx >= 0 ? argv[idx + 1] : '';
}
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(errors) {
  console.error('Product quality system validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
function has(text, pattern) { return pattern.test(text); }

const planFile = valueAfter('--plan');
const reportFile = valueAfter('--report');
const allowTemplate = args.has('--allow-template-placeholders');
const selfCheck = args.has('--self-check') || (!planFile && !reportFile);
const errors = [];

if (selfCheck) {
  const requiredDocs = [
    'docs/product-quality-system.md',
    'docs/role-thinking-protocols.md',
    'docs/role-gate-quality-map.md',
    'docs/plan-quality.md',
    'docs/hard-gates.md',
    'docs/roles-and-raci.md',
    'docs/context-read-matrix.md',
    'docs/guided-build-workflow.md',
    'docs/definition-of-done.md',
  ];
  for (const file of requiredDocs) {
    if (!exists(file)) errors.push(`${file} is missing.`);
  }
  const docExpectations = [
    ['docs/product-quality-system.md', /Product Quality System/i, /Role simulation summary/i, /Plan-quality gate/i, /Composition gate/i, /Release gate/i],
    ['docs/role-thinking-protocols.md', /Role Thinking Protocols/i, /Plan Quality Owner/i, /Visual\/Composition Director/i, /Agent Context Steward/i],
    ['docs/role-gate-quality-map.md', /Role Gate Quality Map/i, /Canonical role set/i, /Gate-to-role map/i, /Role applicability rule/i],
    ['docs/plan-quality.md', /Plan Quality/i, /Target quality level/i, /Alternatives considered/i, /Fallback and rollback/i, /Plan scoring rubric/i],
    ['docs/hard-gates.md', /No L2\+ role-applicability scan and pre-code role simulation -> no coding/i, /No post-validation product-quality role review -> no L2\+ done/i, /No plan-quality review -> no non-trivial coding/i],
    ['docs/guided-build-workflow.md', /Plan-quality review/i, /Role simulation before coding/i],
    ['docs/definition-of-done.md', /Product-quality role simulation/i, /Role applicability/i, /plan-quality/i],
  ];
  for (const [file, ...patterns] of docExpectations) {
    if (!exists(file)) continue;
    const text = read(file);
    for (const pattern of patterns) {
      if (!pattern.test(text)) errors.push(`${file} is missing required signal ${pattern}.`);
    }
  }
}

function validateConcreteFile(file, mode) {
  if (!file) return;
  if (!exists(file)) {
    errors.push(`${mode} file not found: ${file}`);
    return;
  }
  const text = read(file);
  const commonSignals = [
    ['target quality level', /target\s+quality\s+level|\bL[0-4]\b/i],
    ['role applicability', /role\s+applicability|active\/consulted\/not_applicable/i],
    ['role simulation', /role\s+simulation|Product Owner[\s\S]{0,1200}Tech Lead|Plan Quality Owner/i],
    ['concrete status tokens', /\b(pass|fail|partial|blocked|not_applicable|accepted_unknown)\b/i],
  ];
  for (const [label, pattern] of commonSignals) {
    if (!has(text, pattern)) errors.push(`${file} is missing ${label}.`);
  }
  if (mode === 'plan') {
    const planSignals = [
      ['intent and non-goals', /Intent[\s\S]{0,500}(non[-\s]?goals|out\s+of\s+scope)/i],
      ['assumptions or unknowns', /Assumptions|unknowns/i],
      ['alternatives considered', /Alternatives considered|Option[\s\S]{0,200}Pros[\s\S]{0,200}Cons/i],
      ['implementation file plan', /Implementation File Plan|\|\s*File\s*\|\s*Action/i],
      ['validation plan', /Validation plan|browser interaction|lint|typecheck|test/i],
      ['fallback or rollback', /Fallback|rollback|de[-\s]?scope/i],
      ['non-empty role rows', /\|\s*(Product Owner|Tech Lead|QA Owner)\s*\|\s*(?!TBD\s*\|)(?!\s*\|)[^|]{6,}\|/i],
    ];
    for (const [label, pattern] of planSignals) {
      if (!has(text, pattern)) errors.push(`${file} is missing ${label}.`);
    }
  }
  if (mode === 'report') {
    const reportSignals = [
      ['evidence path', /evidence|screenshot|trace|video|command/i],
      ['quality dimension review', /product value|composition|accessibility|performance|security|release/i],
      ['human UX or comprehension review', /first[-\s]?time|human|comprehension|user\s+understand|player\s+understand/i],
      ['deferred risks owner', /owner|mitigation|review date|accepted_unknown/i],
      ['role applicability classification', /active|consulted|not_applicable/i],
    ];
    for (const [label, pattern] of reportSignals) {
      if (!has(text, pattern)) errors.push(`${file} is missing ${label}.`);
    }
  }
  if (!allowTemplate) {
    const placeholder = /\|\s*TBD\s*\||\|\s*(Product Owner|Plan Quality Owner|Tech Lead|UX\/Interaction Designer|QA Owner|Release Owner)\s*\|\s*\|\s*\||\b(TBD|TODO|FIXME|not_reviewed)\b/i;
    if (placeholder.test(text)) {
      errors.push(`${file} contains placeholders. Replace them with concrete observations before claiming quality pass.`);
    }
  }
}

validateConcreteFile(planFile, 'plan');
validateConcreteFile(reportFile, 'report');

if (errors.length) fail(errors);

if (selfCheck) console.log('Product quality system self-check: pass');
if (planFile) console.log(`Product quality plan check: pass (${planFile})`);
if (reportFile) console.log(`Product quality report check: pass (${reportFile})`);
