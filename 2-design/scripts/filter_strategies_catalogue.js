#!/usr/bin/env node
'use strict';

// Parses the markdown table in delivery-strategies-catalogue.md and returns the
// strategy names whose "Knowledge level" and "Bloom domain" columns are
// compatible with a given task's knowledge level and Bloom domain.
//
// Usage:
//   node filter_strategies_catalogue.js <catalogue-path> <knowledge-level> <bloom-domain>
//
// Prints a JSON array of matching strategy name strings to stdout.
// On failure, prints a message to stderr and exits with a non-zero status.

const fs = require('fs');

// A catalogue "Knowledge level" cell matches a task's level if:
//   - the cell is an exact match for the task's level ("Low" / "High"), or
//   - the cell spans both levels ("Low-High"), or
//   - the cell is level-agnostic ("Cross-level").
// En dashes / em dashes in the catalogue ("Low\u2013High") are normalized to a
// plain hyphen before comparing.
function knowledgeLevelMatches(cellValue, taskLevel) {
  const normalizedCell = cellValue.toLowerCase().replace(/[\u2013\u2014]/g, '-');
  const normalizedTaskLevel = taskLevel.toLowerCase();

  if (normalizedCell.includes('low-high') || normalizedCell.includes('cross-level')) {
    return true;
  }
  return normalizedCell.includes(normalizedTaskLevel);
}

// A catalogue "Bloom domain" cell is a comma-separated list (e.g.
// "Cognitive, Affective"). It matches a task's domain if that domain appears
// anywhere in the list.
function bloomDomainMatches(cellValue, taskDomain) {
  const domains = cellValue
    .toLowerCase()
    .split(',')
    .map((domain) => domain.trim());
  return domains.includes(taskDomain.toLowerCase());
}

// Splits one markdown table row ("| a | b | c |") into trimmed cell values,
// dropping the empty strings produced by the leading/trailing pipes.
function parseRow(line) {
  const cells = line.split('|').map((cell) => cell.trim());
  if (cells.length && cells[0] === '') cells.shift();
  if (cells.length && cells[cells.length - 1] === '') cells.pop();
  return cells;
}

// True for the markdown header/body separator row, e.g. "| --- | :--: |".
function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
}

// Parses `markdown` and returns the list of delivery-strategy names whose
// row is compatible with `knowledgeLevel` and `bloomDomain`. Throws if no
// table, or a table missing an expected column, is found.
function filterCatalogue(markdown, knowledgeLevel, bloomDomain) {
  const tableLines = markdown.split(/\r?\n/).filter((line) => line.trim().startsWith('|'));

  if (tableLines.length < 2) {
    throw new Error('No markdown table found in catalogue');
  }

  const header = parseRow(tableLines[0]).map((cell) => cell.toLowerCase());
  const strategyCol = header.findIndex((cell) => cell.includes('delivery strategy'));
  const bloomCol = header.findIndex((cell) => cell.includes('bloom domain'));
  const levelCol = header.findIndex((cell) => cell.includes('knowledge level'));

  if (strategyCol === -1 || bloomCol === -1 || levelCol === -1) {
    throw new Error('Catalogue table is missing one of the expected columns');
  }

  const matches = [];
  // tableLines[1] is the header/body separator row; data starts at index 2.
  for (const line of tableLines.slice(2)) {
    const cells = parseRow(line);
    if (isSeparatorRow(cells)) continue;
    if (cells.length <= Math.max(strategyCol, bloomCol, levelCol)) continue;

    const strategyName = cells[strategyCol];
    const bloomCell = cells[bloomCol];
    const levelCell = cells[levelCol];

    if (knowledgeLevelMatches(levelCell, knowledgeLevel) && bloomDomainMatches(bloomCell, bloomDomain)) {
      matches.push(strategyName);
    }
  }

  return matches;
}

function main() {
  const [, , cataloguePath, knowledgeLevel, bloomDomain] = process.argv;

  if (!cataloguePath || !knowledgeLevel || !bloomDomain) {
    process.stderr.write(
      'Usage: node filter_strategies_catalogue.js <catalogue-path> <knowledge-level> <bloom-domain>\n'
    );
    process.exit(1);
  }

  let markdown;
  try {
    markdown = fs.readFileSync(cataloguePath, 'utf8');
  } catch (err) {
    process.stderr.write(`Failed to read catalogue file: ${err.message}\n`);
    process.exit(1);
  }

  try {
    const matches = filterCatalogue(markdown, knowledgeLevel, bloomDomain);
    process.stdout.write(JSON.stringify(matches));
  } catch (err) {
    process.stderr.write(`Failed to filter catalogue: ${err.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  filterCatalogue,
  knowledgeLevelMatches,
  bloomDomainMatches,
  parseRow,
  isSeparatorRow,
};
