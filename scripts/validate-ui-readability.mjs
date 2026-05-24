#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportCandidates = [
  'docs/validation-reports/latest.md',
  'docs/validation-reports/ui-readability.md',
];
const existingReports = reportCandidates.filter((file) => fs.existsSync(path.join(root, file)));
const errors = [];

if (!existingReports.length) {
  errors.push('No concrete UI readability validation report found. Add docs/validation-reports/latest.md or docs/validation-reports/ui-readability.md with screenshot-backed review. Template guidance docs are not evidence.');
}

const combined = existingReports
  .map((file) => `\n# ${file}\n` + fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');

const requiredSignals = [
  { label: 'screenshot/frame/trace evidence path', pattern: /(screenshot|frame|trace|video)[^\n]*(\.png|\.jpg|\.jpeg|\.webp|\.zip|\.json|path:|evidence)/i },
  { label: 'viewport or responsive coverage', pattern: /viewport|mobile|desktop|responsive/i },
  { label: 'readability or contrast judgment', pattern: /contrast|readability|legible|readable/i },
  { label: 'console and network review', pattern: /console[\s\S]{0,200}network|network[\s\S]{0,200}console/i },
  { label: 'explicit status', pattern: /status\s*:\s*(pass|fail|partial|blocked|not_run|not_available)|\b(pass|fail|partial|blocked)\b/i },
];

if (combined) {
  for (const { label, pattern } of requiredSignals) {
    if (!pattern.test(combined)) errors.push(`Visual QA report is missing ${label}.`);
  }
}

const contradictoryPassPatterns = [
  /status\s*:\s*pass[\s\S]{0,500}(unreadable|low contrast|overlap|clipped|default scrollbar|broken image)/i,
  /ui\s*pass[\s\S]{0,500}(unreadable|low contrast|overlap|clipped|default scrollbar|broken image)/i,
  /visual\s*:\s*pass[\s\S]{0,500}(unreadable|low contrast|overlap|clipped|default scrollbar|broken image)/i,
];
for (const pattern of contradictoryPassPatterns) {
  if (pattern.test(combined)) {
    errors.push('Visual QA claims pass while describing a visible defect. Mark as fail/partial and retest after fixing.');
  }
}

if (errors.length) {
  console.error('UI readability validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('UI readability evidence check: pass');
for (const file of existingReports) console.log(`evidence: ${file}`);
