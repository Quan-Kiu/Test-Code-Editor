#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const node = process.execPath;
const root = process.cwd();
const packageMode = existsSync('MANIFEST.json') && existsSync('docs/mode-requirements.json') && !existsSync('harness.config.json');

function readConfig() {
  if (!existsSync('harness.config.json')) return null;
  try { return JSON.parse(readFileSync('harness.config.json', 'utf8')); }
  catch { return null; }
}
function projectTypes(value) {
  return String(value || 'none').split(',').map((item) => item.trim()).filter(Boolean);
}
function scriptExists(rel) { return existsSync(rel); }
function addIf(phases, label, args, predicate = true) { if (predicate) phases.push([label, args]); }

const cfg = readConfig();
const selectedMode = cfg?.selected_mode || process.env.HARNESS_MODE || 'mvp';
const selectedRuntime = cfg?.selected_runtime || process.env.HARNESS_RUNTIME || 'generic';
const selectedProjectType = cfg?.selected_project_type || process.env.PROJECT_TYPE || 'none';
const types = projectTypes(selectedProjectType);
const hasType = (name) => types.includes(name);

const phases = [];
addIf(phases, 'playbook contract and drift', ['scripts/validate-playbook.mjs', '--no-smoke'], scriptExists('scripts/validate-playbook.mjs'));
addIf(phases, 'browser evidence pack', ['scripts/browser-evidence.mjs', '--self-check'], scriptExists('scripts/browser-evidence.mjs'));
addIf(phases, 'design assets registry', ['scripts/validate-design-assets.mjs'], scriptExists('scripts/validate-design-assets.mjs'));
addIf(phases, 'traceability matrix', ['scripts/validate-traceability.mjs', '--allow-template-placeholders'], scriptExists('scripts/validate-traceability.mjs'));
addIf(phases, 'accessibility gates', ['scripts/validate-accessibility-report.mjs', '--allow-template-placeholders'], scriptExists('scripts/validate-accessibility-report.mjs'));
addIf(phases, 'performance budget', ['scripts/validate-performance-budget.mjs'], scriptExists('scripts/validate-performance-budget.mjs'));
addIf(phases, 'cross references', ['scripts/validate-cross-references.mjs'], scriptExists('scripts/validate-cross-references.mjs'));
addIf(phases, 'product quality system', ['scripts/validate-product-quality-system.mjs', '--self-check'], scriptExists('scripts/validate-product-quality-system.mjs'));
addIf(phases, 'game workflow', ['scripts/validate-game-workflow.mjs'], scriptExists('scripts/validate-game-workflow.mjs') && (packageMode || hasType('game')));

if (packageMode) {
  addIf(phases, 'template: learning', ['scripts/validate-project.mjs', '--mode', 'learning', '--runtime', 'generic', '--project-type', 'none', '--allow-template-placeholders']);
  addIf(phases, 'template: mvp', ['scripts/validate-project.mjs', '--mode', 'mvp', '--runtime', 'generic', '--project-type', 'none', '--allow-template-placeholders']);
  addIf(phases, 'template: mvp ui', ['scripts/validate-project.mjs', '--mode', 'mvp', '--runtime', 'generic', '--project-type', 'ui', '--allow-template-placeholders']);
  addIf(phases, 'template: mvp game', ['scripts/validate-project.mjs', '--mode', 'mvp', '--runtime', 'generic', '--project-type', 'game', '--allow-template-placeholders']);
  addIf(phases, 'template: mvp game web3d', ['scripts/validate-project.mjs', '--mode', 'mvp', '--runtime', 'generic', '--project-type', 'game,web3d', '--allow-template-placeholders']);
  addIf(phases, 'template: real project', ['scripts/validate-project.mjs', '--mode', 'real-project', '--runtime', 'generic', '--project-type', 'none', '--allow-template-placeholders']);
  addIf(phases, 'template: production', ['scripts/validate-project.mjs', '--mode', 'production', '--runtime', 'generic', '--project-type', 'mixed', '--allow-template-placeholders']);
  addIf(phases, 'filled examples availability', ['scripts/validate-example.mjs'], scriptExists('scripts/validate-example.mjs'));
  addIf(phases, 'regression fixtures', ['scripts/validate-regression-fixtures.mjs'], scriptExists('scripts/validate-regression-fixtures.mjs'));
} else {
  // Installed projects must validate real readiness. Do not pass
  // --allow-template-placeholders here; that flag is reserved for the
  // distributed blank template/package matrix above.
  addIf(phases, `selected project: ${selectedMode}/${selectedRuntime}/${selectedProjectType}`, [
    'scripts/validate-project.mjs', '--mode', selectedMode, '--runtime', selectedRuntime, '--project-type', selectedProjectType
  ], scriptExists('scripts/validate-project.mjs'));
}

for (const [label, args] of phases) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(node, args, { stdio: 'inherit' });
  if (result.error) {
    console.error(`validate:all failed during ${label}: ${result.error.message}`);
    process.exit(1);
  }
  if ((result.status ?? 1) !== 0) {
    console.error(`validate:all failed during ${label} with exit ${result.status ?? 1}.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nvalidate:all passed (${packageMode ? 'package template matrix' : `installed project readiness ${selectedMode}/${selectedRuntime}/${selectedProjectType}`}).`);
