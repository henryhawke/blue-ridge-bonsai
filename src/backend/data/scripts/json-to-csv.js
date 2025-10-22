#!/usr/bin/env node
/*
  Convert all JSON datasets in src/backend/data to CSVs for easy Wix CMS import.
  Output directory: src/backend/data/csv

  Notes:
  - Arrays are joined with semicolons (;) per common Wix import guidance for multi-value fields.
  - Objects are JSON-stringified.
  - Dates are left as ISO strings.
  - Field order is derived from union of keys across items.
*/

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(DATA_DIR, 'csv');

/** Serialize a single value to CSV-friendly string */
function serializeValue(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    // If array of primitives → join with semicolons; otherwise JSON
    const isPrimitiveArray = value.every(v => v === null || ['string', 'number', 'boolean'].includes(typeof v));
    return isPrimitiveArray ? value.join(';') : JSON.stringify(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/** Escape value for CSV cell */
function escapeCsvCell(value) {
  const needsQuotes = /[",\n\r]/.test(value) || value.includes(',');
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headerKeys = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach(k => set.add(k));
    return set;
  }, new Set()));

  const headerLine = headerKeys.map(k => escapeCsvCell(k)).join(',');
  const lines = rows.map(row => headerKeys.map(k => escapeCsvCell(serializeValue(row[k]))).join(','));
  return [headerLine, ...lines].join('\n');
}

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${filePath}: ${err.message}`);
  }
}

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function main() {
  ensureOutDir();
  const entries = fs.readdirSync(DATA_DIR).filter(name => name.endsWith('.json'));
  if (!entries.length) {
    console.log('No JSON files found.');
    return;
  }
  for (const name of entries) {
    const inPath = path.join(DATA_DIR, name);
    const base = path.basename(name, '.json');
    const outPath = path.join(OUT_DIR, `${base}.csv`);
    const data = readJson(inPath);
    const rows = Array.isArray(data) ? data : [data];
    const csv = toCsv(rows);
    fs.writeFileSync(outPath, csv, 'utf8');
    console.log(`Wrote ${outPath} (${rows.length} rows)`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}




