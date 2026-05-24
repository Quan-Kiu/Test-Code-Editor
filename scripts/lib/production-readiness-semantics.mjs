import fs from 'node:fs';
import path from 'node:path';

const productionStatuses = new Set(['not_started', 'in_progress', 'pass', 'fail', 'accepted_unknown', 'not_applicable']);
const readinessStatuses = new Set(['not_ready', 'ready_with_risks', 'ready']);
const evidenceStatuses = new Set(['retained', 'linked', 'expired', 'missing']);
const allowedRiskTiers = new Set(['low', 'medium', 'high', 'critical', 'all', 'n/a']);
const releaseRiskTiers = new Set(['low', 'medium', 'high', 'critical']);
const releaseRiskRank = new Map([['low', 0], ['medium', 1], ['high', 2], ['critical', 3]]);

const gateHeaders = ['Gate', 'Owner', 'Applies when', 'Risk tier', 'Required evidence', 'Enforced by', 'Blocking?', 'Status'];
const acceptedUnknownHeaders = ['Unknown', 'Gate/Evidence ID', 'Owner', 'Reason', 'Risk', 'Review date', 'Expiry', 'Mitigation'];
const evidenceHeaders = ['Evidence ID', 'Type', 'Scope', 'Link/path/summary', 'Owner', 'Date', 'Expires?', 'Status'];

function exists(root, file) {
  return fs.existsSync(path.join(root, file));
}

function read(root, file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function lines(root, file) {
  return read(root, file).split(/\r?\n/);
}

function norm(value) {
  return String(value || '').trim().replace(/^`|`$/g, '');
}

function normText(value) {
  return norm(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim());
}

function dateToMs(value) {
  if (!isDate(value)) return Number.NaN;
  return Date.parse(`${value}T00:00:00.000Z`);
}

function isPlaceholder(value) {
  return /(^|\b)(TBD|TODO|FIXME|<[^>]+>|YYYY-MM-DD)(\b|$)/i.test(String(value || '').trim());
}

function isMissingOrPlaceholder(value) {
  return !String(value || '').trim() || isPlaceholder(value);
}

function splitTableRow(line) {
  return line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c.replace(/\s+/g, '')));
}

function parseTableRows(root, file, requiredHeaders) {
  if (!exists(root, file)) return [];
  const all = lines(root, file);
  const rows = [];
  for (let i = 0; i < all.length; i++) {
    const line = all[i];
    if (!/^\s*\|.*\|\s*$/.test(line)) continue;
    const headers = splitTableRow(line);
    if (!requiredHeaders.every((h) => headers.includes(h))) continue;
    let j = i + 1;
    while (j < all.length && /^\s*\|.*\|\s*$/.test(all[j])) {
      const cells = splitTableRow(all[j]);
      if (isSeparatorRow(cells)) { j++; continue; }
      if (cells.length === headers.length) {
        const row = { file, line: j + 1, cells: {}, headers, raw: all[j] };
        headers.forEach((h, idx) => { row.cells[h] = cells[idx]; });
        rows.push(row);
      }
      j++;
    }
  }
  return rows;
}

function acceptedUnknownMatchesGate(unknownRow, gateRow, evidenceIds = []) {
  const gate = normText(gateRow.cells.Gate);
  const linkRaw = norm(unknownRow.cells['Gate/Evidence ID']);
  const link = normText(linkRaw);
  if (!gate || !link) return false;
  if (link === gate) return true;
  return evidenceIds.some((id) => linkRaw === id && hasExactEvidenceId(gateRow.cells['Required evidence'], id));
}

function releaseStatusMatches(text) {
  return [...text.matchAll(/^\s*(?:Production readiness status|Status|Release decision):\s*`?([a-z_]+|TBD)`?\s*$/gmi)];
}

function parseProductionReadinessStatus(root, file, errors, allowTemplate) {
  if (!exists(root, file)) return undefined;
  const text = read(root, file);
  const finalText = text.split(/##\s+12\.\s+Final decision/i)[1] || text.split(/##\s+Final decision/i)[1] || text;
  const matches = [...finalText.matchAll(/^\s*Production readiness status:\s*`?([a-z_]+|TBD)`?\s*$/gmi)];
  if (matches.length !== 1) {
    errors.push(`${file} final decision must declare exactly one canonical line: Production readiness status: \`<not_ready|ready_with_risks|ready>\`.`);
    return undefined;
  }
  const status = matches[0][1];
  if (status === 'TBD') {
    if (!allowTemplate) errors.push(`${file} final production readiness status is unresolved.`);
    return status;
  }
  if (!readinessStatuses.has(status)) errors.push(`${file} final production readiness status is invalid: ${status}`);
  return status;
}

function parseReleaseRiskTiers(root, files, errors, allowTemplate) {
  const found = [];
  for (const file of files) {
    if (!exists(root, file)) continue;
    const all = lines(root, file);
    for (let index = 0; index < all.length; index += 1) {
      const match = all[index].match(/^\s*Release risk tier:\s*`?([a-z_]+|TBD)`?\s*$/i);
      if (!match) continue;
      const tier = match[1];
      if (tier !== 'TBD' && !releaseRiskTiers.has(tier)) {
        errors.push(`${file}:${index + 1} release risk tier is invalid: ${tier}. Use low, medium, high, or critical.`);
      }
      if (!allowTemplate && tier === 'TBD') errors.push(`${file}:${index + 1} release risk tier is unresolved.`);
      found.push({ file, line: index + 1, tier });
    }
  }
  const concrete = [...new Set(found.map((entry) => entry.tier).filter((tier) => tier && tier !== 'TBD'))];
  if (concrete.length > 1) errors.push(`Release risk tier declarations disagree: ${concrete.join(', ')}.`);
  return concrete[0];
}

function parseReleaseDecision(root, file, errors, allowTemplate) {
  if (!exists(root, file)) return { status: undefined, decisionDate: undefined };
  const text = read(root, file);
  const matches = releaseStatusMatches(text);
  let status;
  if (matches.length > 1) {
    errors.push(`${file} must contain at most one release status line.`);
  } else if (matches.length === 1) {
    status = matches[0][1];
    if (status !== 'TBD' && !readinessStatuses.has(status)) errors.push(`${file} release status is invalid: ${status}`);
    if (!allowTemplate && status === 'TBD') errors.push(`${file} release status is unresolved.`);
  }

  const dateMatch = text.match(/^\s*Decision date:\s*`?([0-9]{4}-[0-9]{2}-[0-9]{2}|TBD)`?\s*$/mi)
    || text.match(/^\s*Decision date:\s*\n\s*-\s*`?([0-9]{4}-[0-9]{2}-[0-9]{2}|TBD)`?\s*$/mi);
  const decisionDate = dateMatch?.[1];
  if (decisionDate && decisionDate !== 'TBD' && !isDate(decisionDate)) errors.push(`${file} decision date must be YYYY-MM-DD.`);
  if (!allowTemplate && (!decisionDate || decisionDate === 'TBD')) errors.push(`${file} must declare Decision date: YYYY-MM-DD for expiry checks.`);
  return { status, decisionDate };
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

function extractEvidenceIdsFromText(text, evidenceIds) {
  return evidenceIds.filter((id) => hasExactEvidenceId(text, id));
}

function isBlocking(row) {
  const blocking = normText(row.cells['Blocking?']);
  return blocking === 'yes' || blocking.startsWith('yes ');
}

function gateLabel(row) {
  return `${row.file}:${row.line} (${row.cells.Gate})`;
}

function gateAppliesToReleaseRisk(row, releaseRiskTier) {
  const gateTier = norm(row.cells['Risk tier']).toLowerCase();
  const releaseTier = norm(releaseRiskTier).toLowerCase();
  if (gateTier === 'all') return true;
  if (gateTier === 'n/a') return false;
  if (!releaseRiskRank.has(gateTier)) return true;
  // When the release tier is unresolved or invalid, do not silently skip gates;
  // other validation will report the bad/missing release risk tier.
  if (!releaseRiskRank.has(releaseTier)) return true;
  return releaseRiskRank.get(releaseTier) >= releaseRiskRank.get(gateTier);
}

function acceptedUnknownAppliesToCurrentRelease(row, applicableGates, evidenceIds, applicableEvidenceIds) {
  const link = norm(row.cells['Gate/Evidence ID']);
  if (!link) return false;
  if (applicableGates.some((gate) => acceptedUnknownMatchesGate(row, gate, evidenceIds))) return true;
  return applicableEvidenceIds.has(link);
}

function deriveReadiness({ gates, acceptedUnknownRows, badBlockingGate, badRequiredEvidence, badAcceptedUnknown }) {
  if (badBlockingGate || badRequiredEvidence || badAcceptedUnknown) return 'not_ready';
  const acceptedGateExists = gates.some((row) => norm(row.cells.Status) === 'accepted_unknown');
  if (acceptedGateExists || acceptedUnknownRows.length > 0) return 'ready_with_risks';
  return 'ready';
}

export function validateProductionReadinessSemantics(options) {
  const {
    root,
    allowTemplate = false,
    productionFile = 'docs/production-readiness.md',
    evidenceFile = 'docs/evidence-ledger.md',
    releaseDecisionFile = 'docs/release-decision.md',
    requireEvidenceIds = true
  } = options;

  const errors = [];
  const warnings = [];

  if (!exists(root, productionFile)) {
    return { errors: [`${productionFile} is missing.`], warnings };
  }

  const gates = parseTableRows(root, productionFile, gateHeaders);
  const gateByName = new Map();
  for (const row of gates) {
    const gateName = norm(row.cells.Gate);
    if (!gateName) continue;
    const existing = gateByName.get(gateName);
    if (existing) {
      errors.push(`${productionFile}:${row.line} duplicate production gate name ${gateName}; first seen at ${productionFile}:${existing.line}.`);
      continue;
    }
    gateByName.set(gateName, row);
  }
  const acceptedUnknownRows = parseTableRows(root, productionFile, acceptedUnknownHeaders);
  const evidenceRows = parseTableRows(root, evidenceFile, evidenceHeaders);
  const evidenceById = new Map();
  for (const row of evidenceRows) {
    const evidenceId = norm(row.cells['Evidence ID']);
    if (!evidenceId) continue;
    const existing = evidenceById.get(evidenceId);
    if (existing) {
      errors.push(`${evidenceFile}:${row.line} duplicate Evidence ID ${evidenceId}; first seen at ${evidenceFile}:${existing.line}.`);
      continue;
    }
    evidenceById.set(evidenceId, row);
  }
  const evidenceIds = [...evidenceById.keys()].filter(Boolean);
  const finalStatus = parseProductionReadinessStatus(root, productionFile, errors, allowTemplate);
  const releaseDecision = parseReleaseDecision(root, releaseDecisionFile, errors, allowTemplate);
  const productionDecision = parseReleaseDecision(root, productionFile, [], allowTemplate);
  const decisionDate = releaseDecision.decisionDate || productionDecision.decisionDate;
  const releaseRiskTier = parseReleaseRiskTiers(root, [releaseDecisionFile, productionFile, 'docs/release.md'], errors, allowTemplate);

  if (releaseDecision.status && finalStatus && releaseDecision.status !== 'TBD' && finalStatus !== 'TBD' && releaseDecision.status !== finalStatus) {
    errors.push(`${releaseDecisionFile} status must match ${productionFile} final production readiness status (${releaseDecision.status} != ${finalStatus}).`);
  }
  if (!allowTemplate && ['ready', 'ready_with_risks'].includes(finalStatus) && !releaseRiskTier) {
    errors.push(`${productionFile} cannot be ${finalStatus} until a Release risk tier is recorded as low, medium, high, or critical.`);
  }

  if (!gates.length) errors.push(`${productionFile} must include a measurable production gate table.`);
  if (!allowTemplate && !decisionDate) errors.push(`${productionFile} needs a decision date source; add ${releaseDecisionFile} or a Decision date line.`);

  const applicableGates = gates.filter((row) => gateAppliesToReleaseRisk(row, releaseRiskTier));
  const applicableEvidenceIds = new Set();
  for (const gate of applicableGates) {
    for (const id of extractEvidenceIdsFromText(gate.cells['Required evidence'] || '', evidenceIds)) applicableEvidenceIds.add(id);
  }

  let badBlockingGate = false;
  let badRequiredEvidence = false;
  let badAcceptedUnknown = false;

  for (const row of gates) {
    const status = norm(row.cells.Status);
    const riskTier = norm(row.cells['Risk tier']);
    const appliesToReleaseRisk = gateAppliesToReleaseRisk(row, releaseRiskTier);
    if (status && !productionStatuses.has(status) && !(allowTemplate && status === 'TBD')) {
      errors.push(`${gateLabel(row)} has invalid production gate status: ${status}.`);
    }
    if (riskTier && !allowedRiskTiers.has(riskTier) && !(allowTemplate && riskTier === 'TBD')) {
      errors.push(`${gateLabel(row)} has invalid risk tier: ${riskTier}.`);
    }
    if (allowTemplate) continue;

    for (const header of gateHeaders) {
      if (isMissingOrPlaceholder(row.cells[header])) errors.push(`${gateLabel(row)} has unresolved ${header}.`);
    }

    if (status === 'not_applicable') {
      const evidence = row.cells['Required evidence'] || '';
      if (!/(reason|because|does not apply|not applicable)/i.test(evidence)) {
        errors.push(`${gateLabel(row)} is not_applicable but Required evidence does not explain why.`);
      }
      continue;
    }

    if (appliesToReleaseRisk && isBlocking(row) && ['fail', 'not_started', 'in_progress'].includes(status)) {
      badBlockingGate = true;
      errors.push(`${gateLabel(row)} is an applicable blocking gate with status ${status}; final readiness must be not_ready.`);
    }

    if (appliesToReleaseRisk && isBlocking(row) && status === 'pass') {
      const refs = extractEvidenceIdsFromText(row.cells['Required evidence'] || '', evidenceIds);
      if (requireEvidenceIds && refs.length === 0) {
        badRequiredEvidence = true;
        errors.push(`${gateLabel(row)} is a passed blocking gate but Required evidence does not reference an Evidence ID from ${evidenceFile}.`);
      }
      for (const id of refs) {
        const evidenceRow = evidenceById.get(id);
        const evidenceStatus = norm(evidenceRow?.cells.Status);
        if (['missing', 'expired'].includes(evidenceStatus)) {
          badRequiredEvidence = true;
          errors.push(`${gateLabel(row)} references required evidence ${id}, but ${evidenceFile}:${evidenceRow.line} is ${evidenceStatus}.`);
        }
      }
    }
  }

  for (const row of acceptedUnknownRows) {
    if (allowTemplate) continue;
    for (const header of acceptedUnknownHeaders) {
      if (isMissingOrPlaceholder(row.cells[header])) {
        badAcceptedUnknown = true;
        errors.push(`${row.file}:${row.line} accepted_unknown ${header} is unresolved.`);
      }
    }
    const risk = norm(row.cells.Risk);
    if (!['low', 'medium', 'high', 'critical'].includes(risk)) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} accepted_unknown Risk must be low, medium, high, or critical: ${row.cells.Risk}.`);
    }
    if (!isDate(row.cells['Review date']) || !isDate(row.cells.Expiry)) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} accepted_unknown Review date and Expiry must be YYYY-MM-DD.`);
    } else if (decisionDate && isDate(decisionDate) && dateToMs(row.cells.Expiry) < dateToMs(decisionDate)) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} accepted_unknown expired on ${row.cells.Expiry}; decision date is ${decisionDate}.`);
    }

    const link = norm(row.cells['Gate/Evidence ID']);
    const linkedEvidence = evidenceById.get(link);
    const mappedToGate = gates.some((gate) => acceptedUnknownMatchesGate(row, gate, evidenceIds));
    if (!mappedToGate && !linkedEvidence) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} accepted_unknown is not mapped to a production gate or evidence ID: ${link}.`);
    }
    if (linkedEvidence && ['missing', 'expired'].includes(norm(linkedEvidence.cells.Status))) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} accepted_unknown maps to evidence ${link}, but that evidence is ${norm(linkedEvidence.cells.Status)}.`);
    }
  }

  const evidenceAcceptedUnknownRows = parseTableRows(root, evidenceFile, acceptedUnknownHeaders);
  for (const row of evidenceAcceptedUnknownRows) {
    if (allowTemplate) continue;
    for (const header of acceptedUnknownHeaders) {
      if (isMissingOrPlaceholder(row.cells[header])) {
        badAcceptedUnknown = true;
        errors.push(`${row.file}:${row.line} evidence ledger accepted_unknown ${header} is unresolved.`);
      }
    }
    const risk = norm(row.cells.Risk);
    if (!['low', 'medium', 'high', 'critical'].includes(risk)) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} evidence ledger accepted_unknown Risk must be low, medium, high, or critical: ${row.cells.Risk}.`);
    }
    if (!isDate(row.cells['Review date']) || !isDate(row.cells.Expiry)) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} evidence ledger accepted_unknown Review date and Expiry must be YYYY-MM-DD.`);
    } else if (decisionDate && isDate(decisionDate) && dateToMs(row.cells.Expiry) < dateToMs(decisionDate)) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} evidence ledger accepted_unknown expired on ${row.cells.Expiry}; decision date is ${decisionDate}.`);
    }

    const link = norm(row.cells['Gate/Evidence ID']);
    const linkedEvidence = evidenceById.get(link);
    const mappedToGate = gates.some((gate) => acceptedUnknownMatchesGate(row, gate, evidenceIds));
    if (!mappedToGate && !linkedEvidence) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} evidence ledger accepted_unknown is not mapped to a production gate or evidence ID: ${link}.`);
    }
    if (linkedEvidence && ['missing', 'expired'].includes(norm(linkedEvidence.cells.Status))) {
      badAcceptedUnknown = true;
      errors.push(`${row.file}:${row.line} evidence ledger accepted_unknown maps to evidence ${link}, but that evidence is ${norm(linkedEvidence.cells.Status)}.`);
    }
  }

  for (const gateRow of applicableGates.filter((row) => norm(row.cells.Status) === 'accepted_unknown')) {
    if (!acceptedUnknownRows.some((unknownRow) => acceptedUnknownMatchesGate(unknownRow, gateRow, evidenceIds))) {
      badAcceptedUnknown = true;
      errors.push(`${gateLabel(gateRow)} accepted_unknown gate is not mapped to an accepted_unknown row.`);
    }
  }

  for (const row of evidenceRows) {
    const status = norm(row.cells.Status);
    if (status && !evidenceStatuses.has(status) && !(allowTemplate && status === 'TBD')) {
      errors.push(`${row.file}:${row.line} evidence status is invalid: ${status}.`);
    }
  }

  for (const row of evidenceRows) {
    const id = norm(row.cells['Evidence ID']);
    const status = norm(row.cells.Status);
    if (applicableEvidenceIds.has(id) && ['missing', 'expired'].includes(status)) {
      badRequiredEvidence = true;
      errors.push(`${evidenceFile}:${row.line} required evidence ${id} is ${status}; final readiness must be not_ready.`);
    }
  }

  const derived = deriveReadiness({
    gates: applicableGates,
    acceptedUnknownRows: [...acceptedUnknownRows, ...evidenceAcceptedUnknownRows].filter((row) => acceptedUnknownAppliesToCurrentRelease(row, applicableGates, evidenceIds, applicableEvidenceIds)),
    badBlockingGate,
    badRequiredEvidence,
    badAcceptedUnknown
  });
  if (!allowTemplate && finalStatus && finalStatus !== 'TBD' && finalStatus !== derived) {
    errors.push(`${productionFile} final production readiness status ${finalStatus} conflicts with derived status ${derived}.`);
  }

  return { errors, warnings, derivedStatus: derived, finalStatus, decisionDate, releaseRiskTier };
}
