// Tests for scripts/filter_assessment_catalogue.js
// Plain Node.js, no external test framework required. Run with:
//   node tests/test_filter_assessment_catalogue.js

'use strict';

const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'filter_assessment_catalogue.js');

// Fixture that mirrors the new assessment-types-catalogue.md structure
// (single "Best for knowledge-level" column with Low, High, or Low-High values).
const FIXTURE_CATALOGUE = `# Assessment question catalogue

Select an assessment question type only from this list. A hybrid is permitted only when named and derived from two or more entries below.

| Type | Best for knowledge-level |
| --- | --- |
| True/False | Low |
| Multiple Choice (single answer) | Low-High |
| Multiple Response / Multiple Select | Low-High |
| Matching | Low |
| Long Answer / Essay | High |
| Case Study Analysis | High |
| Branching Scenario / Decision Tree | High |
`;

let tmpDir;
let fixturePath;
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`ok - ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL - ${name}`);
    console.error(`  ${err.message}`);
  }
}

// Runs the script and returns its result without throwing on non-zero exit,
// so failure-path assertions can inspect status/stderr directly.
function run(args) {
  try {
    const stdout = execFileSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
    return { status: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      status: err.status === null || err.status === undefined ? 1 : err.status,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : '',
    };
  }
}

function setup() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'filter-catalogue-test-'));
  fixturePath = path.join(tmpDir, 'assessment-types-catalogue.md');
  fs.writeFileSync(fixturePath, FIXTURE_CATALOGUE, 'utf8');
}

function teardown() {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

setup();

test('filters to low-level types only', () => {
  const { status, stdout } = run([fixturePath, 'low']);
  assert.strictEqual(status, 0);
  const parsed = JSON.parse(stdout);
  assert.strictEqual(parsed.level, 'low');
  assert.deepStrictEqual(
    parsed.types.slice().sort(),
    ['Matching', 'Multiple Choice (single answer)', 'Multiple Response / Multiple Select', 'True/False'].sort(),
  );
});

test('filters to high-level types only', () => {
  const { status, stdout } = run([fixturePath, 'high']);
  assert.strictEqual(status, 0);
  const parsed = JSON.parse(stdout);
  assert.strictEqual(parsed.level, 'high');
  assert.deepStrictEqual(
    parsed.types.slice().sort(),
    [
      'Multiple Choice (single answer)',
      'Multiple Response / Multiple Select',
      'Long Answer / Essay',
      'Case Study Analysis',
      'Branching Scenario / Decision Tree',
    ].sort(),
  );
});

test('accepts the level argument case-insensitively', () => {
  const { status, stdout } = run([fixturePath, 'LOW']);
  assert.strictEqual(status, 0);
  assert.strictEqual(JSON.parse(stdout).level, 'low');
});

test('rejects an invalid level', () => {
  const { status, stderr } = run([fixturePath, 'medium']);
  assert.notStrictEqual(status, 0);
  assert.ok(/invalid level/i.test(stderr), `expected "invalid level" in stderr, got: ${stderr}`);
});

test('rejects a missing catalogue file', () => {
  const { status, stderr } = run([path.join(tmpDir, 'does-not-exist.md'), 'low']);
  assert.notStrictEqual(status, 0);
  assert.ok(/could not read/i.test(stderr), `expected "could not read" in stderr, got: ${stderr}`);
});

test('rejects a catalogue with no recognizable table', () => {
  const brokenPath = path.join(tmpDir, 'broken.md');
  fs.writeFileSync(brokenPath, '# Not a table\nJust some prose, no pipes here.\n', 'utf8');
  const { status, stderr } = run([brokenPath, 'low']);
  assert.notStrictEqual(status, 0);
  assert.ok(/no markdown table found/i.test(stderr), `expected "no markdown table found" in stderr, got: ${stderr}`);
});

test('rejects a table missing the required columns', () => {
  const badPath = path.join(tmpDir, 'bad-columns.md');
  fs.writeFileSync(badPath, '| Type | Difficulty |\n| --- | --- |\n| True/False | Easy |\n', 'utf8');
  const { status, stderr } = run([badPath, 'low']);
  assert.notStrictEqual(status, 0);
  assert.ok(
    /missing one of the required columns/i.test(stderr),
    `expected "missing one of the required columns" in stderr, got: ${stderr}`,
  );
});

teardown();

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);