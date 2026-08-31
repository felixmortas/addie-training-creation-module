'use strict';

// Unit tests for filter_strategies_catalogue.js.
// Run with: node scripts/tests/test_filter_strategies_catalogue.js

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  filterCatalogue,
  knowledgeLevelMatches,
  bloomDomainMatches,
  isSeparatorRow,
} = require(path.join('..', 'filter_strategies_catalogue.js'));

const SCRIPT_PATH = path.join(__dirname, '..', 'filter_strategies_catalogue.js');

// Small fixture table exercising every matching rule the script relies on:
// an exact-level row, a "Low-High" range row, a "High" row, a row with a
// multi-value Bloom domain cell, and a "Cross-level" row.
const SAMPLE_TABLE = `# Delivery strategy catalogue

| Delivery Strategy | Bloom domain | Knowledge level | Organizational Strategy |
| --- | --- | --- | --- |
| Keller's ARCS Model | Affective | Low | Introduction |
| Lecture | Cognitive | Low\u2013High | Content Presentation and Learning |
| Problem-based learning | Cognitive | High | Content Presentation and Learning |
| Role-playing | Affective, Psychomotor | High | Content Presentation and Learning |
| Andragogy (Knowles) | Affective, Cognitive | Cross-level | Cross-cutting |
`;

test('knowledgeLevelMatches: exact level match only matches that level', () => {
  assert.equal(knowledgeLevelMatches('Low', 'low'), true);
  assert.equal(knowledgeLevelMatches('Low', 'high'), false);
  assert.equal(knowledgeLevelMatches('High', 'high'), true);
  assert.equal(knowledgeLevelMatches('High', 'low'), false);
});

test('knowledgeLevelMatches: range and cross-level cells match any task level', () => {
  assert.equal(knowledgeLevelMatches('Low\u2013High', 'low'), true);
  assert.equal(knowledgeLevelMatches('Low\u2013High', 'high'), true);
  assert.equal(knowledgeLevelMatches('Cross-level', 'low'), true);
  assert.equal(knowledgeLevelMatches('Cross-level', 'high'), true);
});

test('knowledgeLevelMatches: is case-insensitive', () => {
  assert.equal(knowledgeLevelMatches('LOW', 'Low'), true);
});

test('bloomDomainMatches: single-value and multi-value cells', () => {
  assert.equal(bloomDomainMatches('Cognitive', 'cognitive'), true);
  assert.equal(bloomDomainMatches('Cognitive', 'affective'), false);
  assert.equal(bloomDomainMatches('Affective, Psychomotor', 'psychomotor'), true);
  assert.equal(bloomDomainMatches('Affective, Psychomotor', 'cognitive'), false);
});

test('isSeparatorRow: recognizes markdown separator rows only', () => {
  assert.equal(isSeparatorRow(['---', '---', '---']), true);
  assert.equal(isSeparatorRow([':---:', '-----']), true);
  assert.equal(isSeparatorRow(['Lecture', 'Cognitive']), false);
});

test('filterCatalogue: filters by knowledge level and bloom domain together', () => {
  // "Andragogy (Knowles)" is Cross-level + Affective, so it is correctly
  // included alongside the exact Low/Affective match.
  const result = filterCatalogue(SAMPLE_TABLE, 'low', 'affective');
  assert.deepEqual(result, ["Keller's ARCS Model", 'Andragogy (Knowles)']);
});

test('filterCatalogue: matches Low-High and Cross-level rows regardless of task level', () => {
  const result = filterCatalogue(SAMPLE_TABLE, 'high', 'cognitive');
  assert.deepEqual(result, ['Lecture', 'Problem-based learning', 'Andragogy (Knowles)']);
});

test('filterCatalogue: matches rows with multi-value bloom domain cells', () => {
  const result = filterCatalogue(SAMPLE_TABLE, 'high', 'psychomotor');
  assert.deepEqual(result, ['Role-playing']);
});

test('filterCatalogue: returns an empty array when nothing matches', () => {
  const result = filterCatalogue(SAMPLE_TABLE, 'low', 'psychomotor');
  assert.deepEqual(result, []);
});

test('filterCatalogue: throws when no markdown table is present', () => {
  assert.throws(() => filterCatalogue('no table here', 'low', 'cognitive'), /No markdown table found/);
});

test('filterCatalogue: throws when an expected column is missing', () => {
  const badTable = '| Foo | Bar |\n| --- | --- |\n| a | b |\n';
  assert.throws(
    () => filterCatalogue(badTable, 'low', 'cognitive'),
    /missing one of the expected columns/
  );
});

test('CLI: prints a JSON array to stdout for a valid call', () => {
  const fixturePath = path.join(__dirname, 'fixture-catalogue.md');
  require('node:fs').writeFileSync(fixturePath, SAMPLE_TABLE);
  try {
    const stdout = execFileSync('node', [SCRIPT_PATH, fixturePath, 'low', 'affective'], {
      encoding: 'utf8',
    });
    assert.deepEqual(JSON.parse(stdout), ["Keller's ARCS Model", 'Andragogy (Knowles)']);
  } finally {
    require('node:fs').unlinkSync(fixturePath);
  }
});

test('CLI: exits non-zero when the catalogue file is missing', () => {
  assert.throws(() => {
    execFileSync('node', [SCRIPT_PATH, '/nonexistent/catalogue.md', 'low', 'cognitive'], {
      stdio: 'pipe',
    });
  });
});
