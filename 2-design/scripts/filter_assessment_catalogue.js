#!/usr/bin/env node
// Filter assessment-types-catalogue.md down to the assessment types permitted
// for a single knowledge level ("low" or "high"), and print the result as
// JSON on stdout. Used by step-02-assessment.md to build the choice pool
// that gets handed to the assign-assessment subagent for each task.
//
// Usage:
//   node filter_assessment_catalogue.js <catalogue.md> <low|high>
//
// stdout (on success): {"level":"low","source":"assessment-types-catalogue.md","types":[...]}
// exit code: 0 on success, 1 on any failure (message goes to stderr).

'use strict';

const fs = require('fs');
const path = require('path');

function fail(message) {
  // All errors go to stderr so stdout stays pure JSON on success; non-zero
  // exit lets the calling workflow step HALT per its RULES.
  process.stderr.write(`filter_assessment_catalogue: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const [, , cataloguePathArg, levelArg] = argv;
  if (!cataloguePathArg || !levelArg) {
    fail('usage: filter_assessment_catalogue.js <catalogue.md> <low|high>');
  }
  const level = levelArg.trim().toLowerCase();
  if (level !== 'low' && level !== 'high') {
    fail(`invalid level "${levelArg}" - must be "low" or "high"`);
  }
  return { cataloguePath: cataloguePathArg, level };
}

function readCatalogue(cataloguePath) {
  try {
    return fs.readFileSync(cataloguePath, 'utf8');
  } catch (err) {
    fail(`could not read catalogue file "${cataloguePath}": ${err.message}`);
    return ''; // unreachable, fail() exits, but keeps linters happy
  }
}

// Split a markdown table row on pipes and trim each cell. Tolerates
// optional leading/trailing pipe characters.
function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

// A markdown table separator row looks like: | --- | :---: | ---: |
function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell));
}

function parseTable(raw) {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().startsWith('|'));
  if (lines.length < 2) {
    fail('no markdown table found in catalogue file');
  }

  const header = splitRow(lines[0]);
  const typeCol = header.findIndex((cell) => /^type$/i.test(cell));
  const knowledgeCol = header.findIndex((cell) => /knowledge-level/i.test(cell));

  if (typeCol === -1 || knowledgeCol === -1) {
    fail(
      'catalogue table is missing one of the required columns: "Type", "Best for knowledge-level"',
    );
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = splitRow(lines[i]);
    if (isSeparatorRow(cells)) continue;
    if (cells.length <= Math.max(typeCol, knowledgeCol)) continue; // malformed row, skip defensively
    const knowledgeVal = cells[knowledgeCol];
    rows.push({
      type: cells[typeCol],
      low: /low/i.test(knowledgeVal),
      high: /high/i.test(knowledgeVal),
    });
  }

  if (rows.length === 0) {
    fail('catalogue table has a header but no data rows');
  }

  return rows;
}

function main() {
  const { cataloguePath, level } = parseArgs(process.argv);
  const raw = readCatalogue(cataloguePath);
  const rows = parseTable(raw);

  const types = rows.filter((row) => (level === 'low' ? row.low : row.high)).map((row) => row.type);

  if (types.length === 0) {
    fail(`no assessment types found for level "${level}" - check the catalogue table`);
  }

  const output = {
    level,
    source: path.basename(cataloguePath),
    types,
  };

  process.stdout.write(JSON.stringify(output));
}

main();