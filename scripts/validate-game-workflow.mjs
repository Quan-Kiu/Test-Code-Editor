#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const candidates = [
  cwd,
  path.resolve(here, '..'),
  path.resolve(here, '../..'),
  path.resolve(here, '../../..'),
];
const packageRoot = candidates.find((candidate) =>
  fs.existsSync(path.join(candidate, '.agent-harness')) &&
  fs.existsSync(path.join(candidate, 'project-playbook', 'docs', 'game-project-adoption.md'))
);
const installedRoot = candidates.find((candidate) =>
  fs.existsSync(path.join(candidate, 'docs', 'game-project-adoption.md'))
);
const root = packageRoot || installedRoot;
if (!root) {
  console.error('Could not find game workflow docs from current directory.');
  process.exit(1);
}
const base = packageRoot ? 'project-playbook' : '';
function file(rel) {
  return path.join(root, base, rel);
}
function harnessFile(rel) {
  const direct = path.join(root, rel);
  if (fs.existsSync(direct)) return direct;
  return path.join(root, base, rel);
}
function readRequired(rel, harness = false) {
  const target = harness ? harnessFile(rel) : file(rel);
  if (!fs.existsSync(target)) {
    errors.push(`missing required game workflow file: ${rel}`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
}
function requireText(rel, text, needles, harness = false) {
  for (const needle of needles) {
    if (!text.includes(needle)) errors.push(`${rel} missing game workflow contract text: ${needle}`);
  }
}

const errors = [];
const gameDoc = readRequired('docs/game-project-adoption.md');
const browserDoc = readRequired('docs/browser-testing.md');
const visualDoc = readRequired('docs/visual-qa.md');
const compositionDoc = readRequired('docs/composition-qa.md');
const storiesDoc = readRequired('docs/stories.md');
const modeReq = readRequired('docs/mode-requirements.json');
const sandboxWorkflow = readRequired('.agent-harness/workflows/game-sandbox-to-local.md', true);
const playerChecklist = readRequired('.agent-harness/checklists/game-player-facing-readiness.md', true);
const browserChecklist = readRequired('.agent-harness/checklists/browser-evidence.md', true);
const browserEvidenceScript = readRequired('scripts/browser-evidence.mjs');
const playwrightConfig = readRequired('playwright.config.mjs');
const gamePlayerSpec = readRequired('tests/browser/game-player-mode.spec.mjs');
const browserTemplate = readRequired('docs/validation-reports/browser-evidence-template.md');

requireText('docs/game-project-adoption.md', gameDoc, [
  'Required game workflow order',
  'Design intake / art direction',
  'Developer debug test',
  'Player-facing cleanup',
  'Design conformance test',
  'Agent self-play in player mode',
  'Human playtest request allowed',
  'Debug UI visible in normal mode -> no human playtest request',
]);
requireText('.agent-harness/workflows/game-sandbox-to-local.md', sandboxWorkflow, [
  'debug playable != player playable',
  'Player-facing readiness gate before human playtest',
  'Human playtest request allowed',
  'Developer debug test:',
  'Design conformance test:',
  'Player-facing readiness:',
]);
requireText('.agent-harness/checklists/game-player-facing-readiness.md', playerChecklist, [
  'Developer debug test',
  'Design conformance test',
  'Player-facing readiness gate',
  'TODO/NOTE/DEBUG',
  'Human playtest request allowed',
]);
requireText('.agent-harness/checklists/browser-evidence.md', browserChecklist, [
  'Browser Evidence Checklist',
  'Normal mode has no TODO/NOTE/DEBUG/dev-only text',
  'Report saved under `docs/validation-reports/`',
]);
requireText('scripts/browser-evidence.mjs', browserEvidenceScript, [
  '--self-check',
  'Human playtest request allowed',
  'forbiddenPlayerText',
]);
requireText('playwright.config.mjs', playwrightConfig, [
  'PLAYWRIGHT_WEB_SERVER_COMMAND',
  'docs/validation-reports/browser-artifacts',
]);
requireText('tests/browser/game-player-mode.spec.mjs', gamePlayerSpec, [
  'normal player mode is clean enough for player-facing review',
  'forbiddenPlayerText',
]);
requireText('docs/validation-reports/browser-evidence-template.md', browserTemplate, [
  'Browser Evidence Report',
  'Player-facing readiness',
]);
requireText('docs/browser-testing.md', browserDoc, [
  'Game evidence classes: debug, design, player mode, human playtest',
  'Hard fail player-facing readiness',
  'Human playtest request allowed: no',
]);
requireText('docs/visual-qa.md', visualDoc, [
  'Game player-facing visual gate',
  'developer debug frame',
  'normal player frame',
  'Human-level composition checks',
]);
requireText('docs/composition-qa.md', compositionDoc, [
  'Human-Level Composition QA',
  'Component rhythm',
  'Spatial balance',
  'Center-content preservation',
  'Scene visual dominance',
  'functional pass / composition fail',
]);
requireText('docs/stories.md', storiesDoc, [
  'Game Story Addendum',
  'Player-facing:',
  'Developer-facing:',
  'Human playtest request allowed',
]);
try {
  const matrix = JSON.parse(modeReq);
  if (!matrix.projectTypes?.game) errors.push('docs/mode-requirements.json missing projectTypes.game');
  const gameRequires = matrix.projectTypes?.game?.requires || [];
  for (const required of ['DESIGN.md', 'docs/design-brief.md', 'docs/game-project-adoption.md', 'docs/browser-testing.md', 'docs/visual-qa.md', 'docs/composition-qa.md', 'docs/component-contract.md', 'playwright.config.mjs', 'tests/browser/', 'docs/validation-reports/browser-evidence-template.md']) {
    if (!gameRequires.includes(required)) errors.push(`projectTypes.game missing required path: ${required}`);
  }
} catch (error) {
  errors.push(`docs/mode-requirements.json invalid JSON: ${error.message}`);
}

if (errors.length) {
  console.error('Game workflow validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Game workflow validation passed.');
