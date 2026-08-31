#!/usr/bin/env node
// Counts learning tasks listed under the "## Hierarchical task decomposition"
// section of a task-analysis.md file. A task is any level-3 heading ("### ")
// that appears after that section header and before the next level-2 heading
// ("## "). Level-4+ headings ("#### ") inside a task's body are ignored.
//
// Usage: node count_task.js <path-to-task-analysis.md>
// Output: a single integer (task count) printed to stdout, nothing else.
// Errors go to stderr so stdout stays a clean integer for the caller to parse.

const fs = require('fs');
const path = require('path');

function fail(message) {
  process.stderr.write(`count_task: ${message}\n`);
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  fail('missing required argument <path-to-task-analysis.md>');
}

const resolvedPath = path.resolve(inputPath);
if (!fs.existsSync(resolvedPath)) {
  fail(`file not found: ${resolvedPath}`);
}

const content = fs.readFileSync(resolvedPath, 'utf8');
const lines = content.split(/\r?\n/);

const SECTION_HEADING = '## Hierarchical task decomposition';
const TASK_HEADING_PREFIX = '### ';

let inSection = false;
let taskCount = 0;

for (const rawLine of lines) {
  const trimmed = rawLine.trimEnd();

  if (trimmed === SECTION_HEADING) {
    inSection = true;
    continue;
  }

  if (!inSection) continue;

  // Any other level-2 heading closes the section.
  if (trimmed.startsWith('## ') && trimmed !== SECTION_HEADING) {
    break;
  }

  // A level-3 heading directly under the section is a task entry.
  // Guard against level-4+ headings ("#### ") being miscounted, since
  // "#### ".startsWith("### ") is false anyway, but be explicit for clarity.
  if (trimmed.startsWith(TASK_HEADING_PREFIX) && !trimmed.startsWith('#### ')) {
    taskCount += 1;
  }
}

if (!inSection) {
  fail(`section "${SECTION_HEADING}" not found in ${resolvedPath}`);
}

// Emit only the integer — this is parsed directly by the calling step.
process.stdout.write(String(taskCount));
