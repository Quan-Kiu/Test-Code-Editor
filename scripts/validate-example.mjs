#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const args = new Set(argv);
const strict = args.has('--strict') || process.env.STRICT_EXAMPLES === '1';
const allowUnavailable = args.has('--allow-unavailable') || process.env.ALLOW_UNAVAILABLE_EXAMPLES === '1';

const root = process.cwd();
const candidateDirs = ['examples', '.agent-harness/examples'];
const exampleDirs = candidateDirs
  .map((dir) => path.join(root, dir))
  .filter((dir) => fs.existsSync(dir) && fs.statSync(dir).isDirectory());

function usage() {
  console.log(`Usage:
  node scripts/validate-example.mjs [--strict] [--allow-unavailable] [--help]

Filled examples are optional in the lean harness export. By default, this command reports
not_available with exit 0 when no filled examples are bundled, so npm validation is not
made noisy by an intentionally omitted artifact.

Use --strict in CI only when filled examples are expected and their absence should fail.
--allow-unavailable is kept as a compatibility alias for lean-package hygiene checks.
`);
}

if (args.has('--help') || args.has('-h')) {
  usage();
  process.exit(0);
}

const message = 'not_available: filled examples are not included in this lean harness export. This is an informational status, not project evidence. Use node scripts/validate-project.mjs for the current project. Use --strict only when a release package is expected to ship filled examples.';

if (!exampleDirs.length) {
  const stream = strict && !allowUnavailable ? console.error : console.log;
  stream(message);
  process.exit(strict && !allowUnavailable ? 2 : 0);
}

console.log(`Filled example directory detected: ${exampleDirs.map((dir) => path.relative(root, dir)).join(', ')}`);
console.log('No bundled filled-example validator is defined for this lean export. Run project validation inside each example project.');
process.exit(0);
