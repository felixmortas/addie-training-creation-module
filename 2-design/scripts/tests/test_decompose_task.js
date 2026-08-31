// Test suite for decompose_task.js.
//
// Uses Node's built-in test runner (node:test, available since Node 18),
// so no external dependency is required.
//
// Run with:  node tests/test_decompose_task.js

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const SCRIPT_PATH = path.join(__dirname, '..', 'decompose_task.js');

// A minimal but structurally valid task-analysis.md fixture, built fresh
// for each test that needs one (avoids shared mutable state between tests).
function buildFixture({ includeDecomposition = true } = {}) {
  const parts = [
    '# Task analysis',
    '',
    '## Scope and assumptions',
    '',
    'This is the scope paragraph.',
    'Second line of scope.',
    '',
    '## Task priorities',
    '',
    '| Goal | Importance |',
    '| --- | ---: |',
    '| 1. First goal | 8 |',
    '',
  ];

  if (includeDecomposition) {
    parts.push(
      '## Hierarchical task decomposition',
      '',
      '### 1. First task',
      '',
      '1.1 First subpoint.',
      '',
      '- 1.1.1 Detail one.',
      '- 1.1.2 Detail two.',
      '',
      '### 2. Second task',
      '',
      '2.1 Another subpoint.',
      '',
      '## Prerequisites and dependencies',
      '',
      'Some trailing section that must not leak into task 2.',
      '',
    );
  }

  return parts.join('\n');
}

// Writes `content` to a fresh temp file and returns its path. Using a
// per-call temp dir keeps parallel test runs from clashing.
function writeFixtureFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'decompose-task-'));
  const filePath = path.join(dir, 'task-analysis.md');
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

// Runs the script and returns { stdout, status } without throwing on a
// non-zero exit code, so failure-path tests can assert on it directly.
function runScript(args) {
  try {
    const stdout = execFileSync('node', [SCRIPT_PATH, ...args], {
      encoding: 'utf8',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      status: err.status,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : '',
    };
  }
}

test('no task number: returns only scope_and_assumptions and task_priorities', () => {
  const filePath = writeFixtureFile(buildFixture());
  const { status, stdout } = runScript([filePath]);

  assert.equal(status, 0);
  const parsed = JSON.parse(stdout);

  assert.equal(parsed.scope_and_assumptions, 'This is the scope paragraph.\nSecond line of scope.');
  assert.match(parsed.task_priorities, /1\. First goal/);
  // The "task" key must be entirely absent, not just empty.
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, 'task'), false);
});

test('no task number: works even without a decomposition section', () => {
  const filePath = writeFixtureFile(buildFixture({ includeDecomposition: false }));
  const { status, stdout } = runScript([filePath]);

  assert.equal(status, 0);
  const parsed = JSON.parse(stdout);
  assert.ok(parsed.scope_and_assumptions.length > 0);
  assert.ok(parsed.task_priorities.length > 0);
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, 'task'), false);
});

test('with task number: returns the shared sections plus the requested task', () => {
  const filePath = writeFixtureFile(buildFixture());
  const { status, stdout } = runScript([filePath, '1']);

  assert.equal(status, 0);
  const parsed = JSON.parse(stdout);

  assert.equal(parsed.task.id, 1);
  assert.equal(parsed.task.title, 'First task');
  assert.match(parsed.task.body, /1\.1 First subpoint\./);
  assert.match(parsed.task.body, /1\.1\.1 Detail one\./);
  // Must stop before the next "### 2." heading.
  assert.doesNotMatch(parsed.task.body, /Second task/);
});

test('with task number: task body stops at the next level-2 heading', () => {
  const filePath = writeFixtureFile(buildFixture());
  const { status, stdout } = runScript([filePath, '2']);

  assert.equal(status, 0);
  const parsed = JSON.parse(stdout);

  assert.equal(parsed.task.title, 'Second task');
  assert.doesNotMatch(parsed.task.body, /Prerequisites/);
  assert.doesNotMatch(parsed.task.body, /trailing section/);
});

test('unknown task number: fails with a clear error', () => {
  const filePath = writeFixtureFile(buildFixture());
  const { status, stderr } = runScript([filePath, '99']);

  assert.notEqual(status, 0);
  assert.match(stderr, /task 99 not found/);
});

test('invalid task number: fails validation before touching the file content', () => {
  const filePath = writeFixtureFile(buildFixture());
  const { status, stderr } = runScript([filePath, 'abc']);

  assert.notEqual(status, 0);
  assert.match(stderr, /must be a positive integer/);
});

test('non-positive task number: rejected', () => {
  const filePath = writeFixtureFile(buildFixture());
  const { status, stderr } = runScript([filePath, '0']);

  assert.notEqual(status, 0);
  assert.match(stderr, /must be a positive integer/);
});

test('missing file: fails with a clear error', () => {
  const { status, stderr } = runScript(['/nonexistent/path/task-analysis.md']);

  assert.notEqual(status, 0);
  assert.match(stderr, /file not found/);
});

test('missing "Scope and assumptions" section: fails', () => {
  const content = [
    '# Task analysis',
    '',
    '## Task priorities',
    '',
    'Some priorities.',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stderr } = runScript([filePath]);

  assert.notEqual(status, 0);
  assert.match(stderr, /Scope and assumptions/);
});

test('no arguments at all: fails with usage message', () => {
  const { status, stderr } = runScript([]);

  assert.notEqual(status, 0);
  assert.match(stderr, /usage:/);
});
