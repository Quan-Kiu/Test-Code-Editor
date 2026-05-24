#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const allowTemplate = argv.includes('--allow-template-placeholders');
const explicitReport = (() => {
  const idx = argv.indexOf('--report');
  return idx >= 0 ? argv[idx + 1] : '';
})();

const reportCandidates = explicitReport ? [explicitReport] : [
  'docs/validation-reports/latest.md',
  'docs/validation-reports/composition-qa.md',
  'docs/validation-reports/browser-evidence.md',
  'docs/validation-reports/ui-readability.md',
];
const existingReports = reportCandidates.filter((file) => fs.existsSync(path.join(root, file)));
const errors = [];

if (!existingReports.length) {
  errors.push('No concrete composition QA report found. Add docs/validation-reports/latest.md, composition-qa.md, browser-evidence.md, or ui-readability.md with screenshot-backed human composition review.');
}

const combined = existingReports
  .map((file) => `\n# ${file}\n` + fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');

const requiredSignals = [
  { label: 'screenshot/frame/trace evidence path', pattern: /(screenshot|frame|trace|video|evidence)[^\n]*(\.png|\.jpg|\.jpeg|\.webp|\.zip|\.json|path:|evidence)/i },
  { label: 'viewport or responsive coverage', pattern: /viewport|mobile|desktop|responsive|tablet|1440|390|375/i },
  { label: 'functional status separated from visual/composition status', pattern: /functional\s+(status|pass|partial|fail)|functional\s+pass\s*\/\s*composition\s+fail|composition\s+(status|review)/i },
  { label: 'intended dominant subject/action', pattern: /intended\s+(dominant|dominance|subject|action)|desired\s+(dominant|dominance|subject|action)|dominant\s+subject/i },
  { label: 'actual human first read or eye path', pattern: /(actual\s+)?first\s+read|eye\s+path|three[-\s]?second|3\s*seconds/i },
  { label: 'component rhythm judgment', pattern: /component\s+rhythm|rhythm[^\n]{0,120}(pass|partial|fail|cadence|density|grouping)/i },
  { label: 'spatial balance judgment', pattern: /spatial\s+balance|balance[^\n]{0,120}(left|right|top|bottom|negative\s+space|visual\s+weight|pass|partial|fail)/i },
  { label: 'center-content preservation judgment', pattern: /center[-\s]?content\s+preservation|safe\s+focal\s+zone|focal\s+zone|center[^\n]{0,120}(preserv|crop|overlay|camera|resize)/i },
  { label: 'visual dominance or scene dominance judgment', pattern: /(scene\s+)?visual\s+dominance|dominance[^\n]{0,120}(scene|hud|overlay|subject|cta|pass|partial|fail)/i },
  { label: 'visual noise judgment', pattern: /visual\s+noise|noise[^\n]{0,120}(border|glow|label|icon|motion|copy|debug|pass|partial|fail)/i },
  { label: 'user/player comprehension judgment', pattern: /(user|player)\s+comprehension|comprehension[^\n]{0,120}(pass|partial|fail|goal|next\s+action)|without\s+developer\s+notes/i },
  { label: 'fix direction for composition defects or explicit no defects', pattern: /fix\s+direction|suggested\s+fix|none\s+observed|no\s+composition\s+defects/i },
];

if (combined) {
  for (const { label, pattern } of requiredSignals) {
    if (!pattern.test(combined)) errors.push(`Composition QA report is missing ${label}.`);
  }

  if (!allowTemplate) {
    const placeholderPatterns = [
      /composition[^\n]{0,120}(TBD|not_reviewed|required)/i,
      /(component\s+rhythm|spatial\s+balance|center[-\s]?content|visual\s+dominance|visual\s+noise|comprehension)[\s\S]{0,180}\b(TBD|not_reviewed|required)\b/i,
      /\|\s*TBD\s*\|/i,
      /Status:\s*not_run/i,
      /\|\s*(TBD|not_captured)?\s*\|\s*(TBD)?\s*\|\s*(TBD)?\s*\|\s*(TBD)?\s*\|\s*(TBD)?\s*\|/i,
    ];
    for (const pattern of placeholderPatterns) {
      if (pattern.test(combined)) {
        errors.push('Composition QA report still contains placeholders, empty table cells, or unreviewed required composition fields. Replace them with screenshot-specific observations before claiming pass.');
        break;
      }
    }
  }

  const contradictoryPassPatterns = [
    /composition\s*(status\s*)?:\s*pass[\s\S]{0,700}(off[-\s]?balance|dominance\s+conflict|too\s+noisy|visual\s+noise|weak\s+hierarchy|cropped|covered|lost|debug|dev\s+overlay|unreadable|overlap|clipped)/i,
    /visual\s*(status\s*)?:\s*pass[\s\S]{0,700}(off[-\s]?balance|dominance\s+conflict|too\s+noisy|weak\s+hierarchy|cropped|covered|lost|debug|dev\s+overlay|unreadable|overlap|clipped)/i,
    /functional\s+pass[\s\S]{0,500}(composition\s+pass)[\s\S]{0,500}(weak|unclear|confusing|off[-\s]?balance|dominance\s+conflict|too\s+noisy|cropped|covered)/i,
  ];
  for (const pattern of contradictoryPassPatterns) {
    if (pattern.test(combined)) {
      errors.push('Report claims visual/composition pass while describing a composition defect. Mark composition as fail/partial and retest after fixing.');
      break;
    }
  }
}

if (errors.length) {
  console.error('Composition QA validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Composition QA evidence check: pass');
for (const file of existingReports) console.log(`evidence: ${file}`);
