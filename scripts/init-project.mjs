#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);

function valueAfter(flag) {
  const idx = argv.indexOf(flag);
  return idx >= 0 ? argv[idx + 1] : undefined;
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}
function uniq(values) {
  return [...new Set(values)];
}
function getModeOrder(matrix) {
  const modeNames = Object.keys(matrix.modes || {});
  const order = Array.isArray(matrix.modeOrder) ? matrix.modeOrder : [];
  if (!order.length) {
    throw new Error('docs/mode-requirements.json must define explicit modeOrder. Do not infer inheritance from JSON key order.');
  }
  const missingFromOrder = modeNames.filter((m) => !order.includes(m));
  const missingFromModes = order.filter((m) => !modeNames.includes(m));
  if (missingFromOrder.length || missingFromModes.length) {
    throw new Error(`Invalid modeOrder. Missing from order: ${missingFromOrder.join(', ') || 'none'}; unknown in order: ${missingFromModes.join(', ') || 'none'}`);
  }
  return order;
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

const matrix = readJson('docs/mode-requirements.json');
const validModes = new Set(Object.keys(matrix.modes || {}));
const validRuntimes = new Set(Object.keys(matrix.runtimeAdapters || {}));
const validProjectTypes = new Set(Object.keys(matrix.projectTypes || {}));

const mode = valueAfter('--mode') || 'mvp';
const runtime = valueAfter('--runtime') || 'generic';
const projectTypes = parseProjectTypes(valueAfter('--project-type'));
const route = valueAfter('--route') || (argv.includes('--adopt-existing') ? 'existing' : 'new');
const validRoutes = new Set(['new', 'existing']);

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`Usage:
  node scripts/init-project.mjs --mode <learning|mvp|real-project|production> --runtime <generic|claude|hermes> [--project-type <none|ui|api|backend|cli|mixed|game|web3d>] [--route <new|existing>]

This command is intentionally non-destructive. It prints the first files to fill, the runtime entry point, the validation command, and the next conversation prompt for the chosen mode/runtime/project type. Mode inheritance uses explicit modeOrder from docs/mode-requirements.json.

Use --route new for a new project and --route existing, or --adopt-existing, when applying the harness to a current repo. Use comma-separated project types such as ui,backend when a project has multiple surfaces. Use game for game/vertical-slice projects, and game,web3d for 3D browser games. Reserve mixed for UI plus API contract work without persistent backend state/data ownership/jobs/migrations.

Examples:
  node scripts/init-project.mjs --mode mvp --runtime generic --project-type ui --route new
  node scripts/init-project.mjs --mode real-project --runtime claude --project-type api --route existing
`);
  process.exit(0);
}

if (!validModes.has(mode)) {
  console.error(`Invalid --mode: ${mode}. Use one of: ${[...validModes].join(', ')}`);
  process.exit(1);
}
if (!validRuntimes.has(runtime)) {
  console.error(`Invalid --runtime: ${runtime}. Use one of: ${[...validRuntimes].join(', ')}`);
  process.exit(1);
}
if (!validRoutes.has(route)) {
  console.error(`Invalid --route: ${route}. Use one of: ${[...validRoutes].join(', ')}`);
  process.exit(1);
}
for (const type of projectTypes) {
  if (!validProjectTypes.has(type)) {
    console.error(`Invalid --project-type entry: ${type}. Use one of: ${[...validProjectTypes].join(', ')}`);
    process.exit(1);
  }
}

const runtimeEntry = matrix.runtimeAdapters[runtime].entrypoint;
const files = new Set([
  ...collectModeItems(matrix, mode, 'requires'),
  ...(matrix.runtimeAdapters[runtime]?.requires || [])
]);
for (const type of projectTypes) {
  for (const file of matrix.projectTypes[type]?.requires || []) files.add(file);
}

const validationCommand = `node scripts/validate-project.mjs --mode ${mode} --runtime ${runtime} --project-type ${projectTypes.join(',')}`;
const routeDoc = route === 'existing' ? 'docs/adoption-existing-project.md' : 'docs/guided-build-workflow.md';
const routeIntent = route === 'existing'
  ? 'adopt this existing repo without broad rewrites; first inventory current architecture, commands, risks, and evidence'
  : 'create a new project from a blank brief; first fill the smallest useful project brief, requirements, and first story';

console.log(`Playbook initialization plan\nMode: ${mode}\nRuntime: ${runtime}\nProject type: ${projectTypes.join(',')}\nRoute: ${route}\nRuntime entry: ${runtimeEntry}\n`);
console.log('Read/fill these files first:');
for (const file of files) console.log(`- ${file}`);
console.log('\nProgressive fill loop:');
console.log('1. Fill only the facts known now; leave unknowns as TBD in non-production phases.');
console.log('2. Run the validation command and use the first failures as the next fill list.');
console.log('3. Create or update one small story with an Implementation File Plan before coding.');
console.log('4. Attach validation evidence after each story, then raise mode only when the current mode passes.');
console.log('5. For production, remove --allow-template-placeholders and resolve or formally accept every unknown.');
console.log(`\nValidation command:\n${validationCommand}`);
console.log('\nNext prompt:');
console.log(`Read ${runtimeEntry}, docs/mode-requirements.json, docs/context-read-matrix.md, ${routeDoc}, docs/product-quality-system.md, docs/role-gate-quality-map.md, docs/role-thinking-protocols.md, docs/plan-quality.md, docs/hard-gates.md, and docs/agent-adapter-contract.md. Help me ${routeIntent} for ${mode} mode (${projectTypes.join(',')} project type). Fill the required docs gradually, then create the first story and Implementation File Plan before coding.`);
