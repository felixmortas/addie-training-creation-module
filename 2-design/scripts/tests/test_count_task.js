// Test suite for count_task.js.
//
// Uses Node's built-in test runner (node:test, available since Node 18),
// so no external dependency is required.
//
// Run with:  node tests/test_count_task.js

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const SCRIPT_PATH = path.join(__dirname, '..', 'count_task.js');

// Writes `content` to a fresh temp file and returns its path. A fresh temp
// dir per call avoids clashes between parallel test runs.
function writeFixtureFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'count-task-'));
  const filePath = path.join(dir, 'task-analysis.md');
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

// Runs the script and returns { status, stdout, stderr } without throwing
// on a non-zero exit code, so failure-path tests can assert on it directly.
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

test('counts level-3 headings under the decomposition section', () => {
  const content = [
    '# Task analysis',
    '',
    '## Hierarchical task decomposition',
    '',
    '### 1. First task',
    '1.1 Some detail.',
    '',
    '### 2. Second task',
    '2.1 Some detail.',
    '',
    '### 3. Third task',
    '',
    '## Prerequisites and dependencies',
    '',
    'Trailing content that must not be counted.',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stdout, stderr } = runScript([filePath]);

  assert.equal(status, 0);
  assert.equal(stderr, '');
  assert.equal(stdout, '3');
});

test('ignores level-4+ headings inside a task body', () => {
  const content = [
    '## Hierarchical task decomposition',
    '',
    '### 1. First task',
    '#### 1.1 Not a task',
    '##### 1.1.1 Also not a task',
    '',
    '### 2. Second task',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stdout } = runScript([filePath]);

  assert.equal(status, 0);
  assert.equal(stdout, '2');
});

test('stops counting at the next level-2 heading', () => {
  const content = [
    '## Hierarchical task decomposition',
    '',
    '### 1. First task',
    '',
    '## Some other section',
    '',
    '### Not a task, wrong section',
    '### Still not a task',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stdout } = runScript([filePath]);

  assert.equal(status, 0);
  assert.equal(stdout, '1');
});

test('section with zero tasks returns 0', () => {
  const content = [
    '## Hierarchical task decomposition',
    '',
    'No tasks listed yet.',
    '',
    '## Prerequisites and dependencies',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stdout } = runScript([filePath]);

  assert.equal(status, 0);
  assert.equal(stdout, '0');
});

test('section extending to end of file (no trailing "## " heading)', () => {
  const content = [
    '## Hierarchical task decomposition',
    '',
    '### 1. First task',
    '### 2. Second task',
    '### 3. Third task',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stdout } = runScript([filePath]);

  assert.equal(status, 0);
  assert.equal(stdout, '3');
});

test('missing decomposition section: fails with a clear error', () => {
  const content = [
    '# Task analysis',
    '',
    '## Some other section',
    '',
    '### Not the right section',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { status, stderr } = runScript([filePath]);

  assert.notEqual(status, 0);
  assert.match(stderr, /Hierarchical task decomposition/);
});

test('missing file: fails with a clear error', () => {
  const { status, stderr } = runScript(['/nonexistent/path/task-analysis.md']);

  assert.notEqual(status, 0);
  assert.match(stderr, /file not found/);
});

test('no argument: fails with a clear error', () => {
  const { status, stderr } = runScript([]);

  assert.notEqual(status, 0);
  assert.match(stderr, /missing required argument/);
});

test('stdout contains only the integer, with no trailing newline', () => {
  const content = [
    '## Hierarchical task decomposition',
    '',
    '### 1. First task',
    '',
  ].join('\n');
  const filePath = writeFixtureFile(content);
  const { stdout } = runScript([filePath]);

  // No trailing "\n" and no extra whitespace: callers may parse this
  // directly with e.g. parseInt(stdout, 10).
  assert.equal(stdout, '1');
  assert.equal(/^\d+$/.test(stdout), true);
});
