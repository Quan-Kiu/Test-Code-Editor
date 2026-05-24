#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const argv = process.argv.slice(2);
const root = normalize(argv.includes('--root') ? argv[argv.indexOf('--root') + 1] : process.cwd());
const manifestPath = join(root, 'design-assets', 'manifest.json');
const requireAssets = argv.includes('--require-assets');
const requireApproved = argv.includes('--require-approved');
const releaseMode = argv.includes('--release');
const allowedTypes = new Set(['screen', 'component', 'state', 'flow', 'brand', 'reference']);
const allowedStatuses = new Set(['draft', 'approved', 'superseded', 'reference-only', 'placeholder']);
const allowedExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const errors = [];
const warnings = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { fail(`Cannot parse ${path}: ${error.message}`); return null; }
}
function isDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim()); }
function missing(value) { return !String(value || '').trim() || /^(TBD|TODO|FIXME)$/i.test(String(value).trim()); }

if (!existsSync(manifestPath)) {
  if (existsSync(join(root, 'DESIGN.md')) || existsSync(join(root, 'docs', 'visual-qa.md'))) {
    fail('Missing design-assets/manifest.json for a UI/design-aware project.');
  } else {
    console.log('validate-design-assets: not_applicable (no design assets manifest).');
    process.exit(0);
  }
} else {
  const manifest = readJson(manifestPath);
  if (manifest) {
    if (!['1.1.0', '1.0.0'].includes(manifest.schemaVersion)) {
      warn(`Unexpected design asset manifest schemaVersion: ${manifest.schemaVersion ?? 'missing'}`);
    }
    if (!Array.isArray(manifest.assets)) {
      fail('design-assets/manifest.json must contain an assets array.');
    } else {
      const seen = new Set();
      const ids = new Set(manifest.assets.map((asset) => asset?.id).filter(Boolean));
      const approved = manifest.assets.filter((asset) => asset?.status === 'approved');
      manifest.assets.forEach((asset, index) => {
        const prefix = `assets[${index}]`;
        if (!asset || typeof asset !== 'object') { fail(`${prefix} must be an object.`); return; }
        for (const field of ['id', 'path', 'type', 'status', 'source', 'owner']) {
          if (!asset[field] || typeof asset[field] !== 'string') fail(`${prefix}.${field} is required and must be a string.`);
        }
        if (asset.id) {
          if (seen.has(asset.id)) fail(`Duplicate design asset id: ${asset.id}`);
          seen.add(asset.id);
        }
        if (asset.type && !allowedTypes.has(asset.type)) fail(`${prefix}.type must be one of: ${[...allowedTypes].join(', ')}`);
        if (asset.status && !allowedStatuses.has(asset.status)) fail(`${prefix}.status must be one of: ${[...allowedStatuses].join(', ')}`);
        if (asset.path) {
          if (!asset.path.startsWith('design-assets/')) fail(`${prefix}.path must be repo-relative under design-assets/: ${asset.path}`);
          const ext = extname(asset.path).toLowerCase();
          if (!allowedExts.has(ext)) fail(`${prefix}.path must point to a PNG/JPG/WebP/SVG image: ${asset.path}`);
          const fullPath = join(root, asset.path);
          if (asset.status !== 'placeholder' && !existsSync(fullPath)) fail(`${prefix}.path does not exist: ${asset.path}`);
        }
        if (asset.status === 'superseded' && !asset.supersededBy) fail(`${prefix}.supersededBy is required when status is superseded.`);
        if (asset.supersededBy && !ids.has(asset.supersededBy)) fail(`${prefix}.supersededBy points to unknown asset id: ${asset.supersededBy}`);
        if ((asset.status === 'reference-only' || asset.source === 'external') && !asset.license) warn(`${prefix} should include license/source-rights notes: ${asset.id ?? '(missing id)'}`);
        if (releaseMode && asset.status === 'approved') {
          for (const field of ['approvedBy', 'approvedAt', 'checksum']) if (missing(asset[field])) fail(`${prefix}.${field} is required for release-approved assets.`);
          if (asset.approvedAt && !isDate(asset.approvedAt)) fail(`${prefix}.approvedAt must be YYYY-MM-DD.`);
        }
      });
      if (requireAssets && manifest.assets.length === 0) fail('At least one design asset is required with --require-assets.');
      if (requireApproved && approved.length === 0) fail('At least one approved design asset is required with --require-approved.');
    }
  }
}

if (warnings.length) { console.warn('validate-design-assets warnings:'); for (const warning of warnings) console.warn(`- ${warning}`); }
if (errors.length) { console.error('validate-design-assets failed:'); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('validate-design-assets passed.');
