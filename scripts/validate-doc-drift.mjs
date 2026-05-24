#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const rootCandidates = [
  cwd,
  resolve(here, '..'),
  resolve(here, '../..'),
  resolve(here, '../../..')
];
const root = rootCandidates.find((candidate) => existsSync(join(candidate, '.agent-harness/scripts/validate_harness.py')));
if (!root) {
  console.error('validate_harness.py not found. Install the full Agent Engineering Harness first.');
  process.exit(1);
}
console.log('validate:drift wrapper: delegated to validate_harness.py semantic doc-drift checks with smoke tests skipped.');
const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const result = spawnSync(python, [join(root, '.agent-harness/scripts/validate_harness.py'), '--root', root, '--no-smoke'], {
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
