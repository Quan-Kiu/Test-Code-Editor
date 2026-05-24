#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const node = process.execPath;
const root = process.cwd();
const checks = [
  ['game workflow regression', ['scripts/validate-game-workflow.mjs']],
  ['browser evidence pack regression', ['scripts/browser-evidence.mjs', '--self-check']],
  ['mvp game template regression', ['scripts/validate-project.mjs', '--mode', 'mvp', '--runtime', 'generic', '--project-type', 'game', '--allow-template-placeholders']],
];

function runCheck(label, args, cwd = root) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(node, args, { cwd, stdio: 'inherit', timeout: 60000 });
  if (result.error) {
    console.error(`${label} failed to run: ${result.error.message}`);
    process.exit(1);
  }
  if ((result.status ?? 1) !== 0) {
    console.error(`${label} failed with exit ${result.status ?? 1}.`);
    process.exit(result.status ?? 1);
  }
}

for (const [label, args] of checks) runCheck(label, args);

const cases = [
  ['generic', 'AGENTS.md'],
  ['claude', 'CLAUDE.md'],
  ['hermes', '.hermes/context.md'],
];
for (const [runtime, entrypoint] of cases) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), `harness-regression-${runtime}-`));
  try {
    fs.cpSync(root, temp, { recursive: true });
    const target = path.join(temp, entrypoint);
    if (fs.existsSync(target)) fs.rmSync(target, { force: true });
    const result = spawnSync(node, ['scripts/validate-project.mjs', '--mode', 'mvp', '--runtime', runtime, '--project-type', 'none', '--allow-template-placeholders'], {
      cwd: temp,
      encoding: 'utf8',
      timeout: 60000,
    });
    if ((result.status ?? 0) === 0) {
      console.error(`missing runtime entrypoint regression failed to fail for ${runtime}: ${entrypoint}`);
      process.exit(1);
    }
    if (!`${result.stdout}\n${result.stderr}`.includes(entrypoint)) {
      console.error(`missing runtime entrypoint regression did not mention ${entrypoint}`);
      process.exit(1);
    }
    console.log(`missing runtime entrypoint regression passed for ${runtime}`);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

console.log('\nvalidate:regression passed.');
