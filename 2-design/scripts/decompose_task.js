#!/usr/bin/env node
// Extracts reusable context sections from task-analysis.md.
//
//   - "## Scope and assumptions"   (full section, verbatim)
//   - "## Task priorities"         (full section, verbatim)
//   - optionally, the requested task's own subsection under
//     "## Hierarchical task decomposition"
//
// Usage:
//   node decompose_task.js <path-to-task-analysis.md> [task-number]
//
// Output (task-number provided): a single JSON object on stdout:
//   {
//     "scope_and_assumptions": "...",
//     "task_priorities": "...",
//     "task": { "id": 1, "title": "...", "body": "..." }
//   }
//
// Output (task-number omitted): only the shared context, no "task" key:
//   {
//     "scope_and_assumptions": "...",
//     "task_priorities": "..."
//   }

const fs = require('fs');
const path = require('path');

function fail(message) {
  process.stderr.write(`decompose_task: ${message}\n`);
  process.exit(1);
}

const inputPath = process.argv[2];
// task-number is now optional: undefined when not passed on the command line.
const taskNumberArg = process.argv[3];

if (!inputPath) {
  fail('usage: decompose_task.js <path-to-task-analysis.md> [task-number]');
}

// Only validate/parse the task number when the caller actually supplied one.
let taskNumber = null;
if (taskNumberArg !== undefined) {
  taskNumber = Number(taskNumberArg);
  if (!Number.isInteger(taskNumber) || taskNumber < 1) {
    fail(`<task-number> must be a positive integer, got "${taskNumberArg}"`);
  }
}

const resolvedPath = path.resolve(inputPath);
if (!fs.existsSync(resolvedPath)) {
  fail(`file not found: ${resolvedPath}`);
}

const content = fs.readFileSync(resolvedPath, 'utf8');
const lines = content.split(/\r?\n/);

// Generic extractor for a level-2 section: returns every line between a
// heading that matches `heading` exactly and the next level-2 heading (or
// EOF), with leading/trailing blank lines trimmed but internal formatting
// preserved.
function extractSection(heading) {
  const startIdx = lines.findIndex((l) => l.trimEnd() === heading);
  if (startIdx === -1) return null;

  const body = [];
  for (let i = startIdx + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trimEnd();
    if (trimmed.startsWith('## ')) break;
    body.push(lines[i]);
  }
  return body.join('\n').trim();
}

const scopeAndAssumptions = extractSection('## Scope and assumptions');
const taskPriorities = extractSection('## Task priorities');

if (scopeAndAssumptions === null) {
  fail('section "## Scope and assumptions" not found');
}
if (taskPriorities === null) {
  fail('section "## Task priorities" not found');
}

const output = {
  scope_and_assumptions: scopeAndAssumptions,
  task_priorities: taskPriorities,
};

// Only look up a specific task when a task number was provided.
if (taskNumber !== null) {
  // Locate "## Hierarchical task decomposition", then find the specific
  // "### {taskNumber}. {title}" heading inside it.
  const DECOMP_HEADING = '## Hierarchical task decomposition';
  const decompStart = lines.findIndex((l) => l.trimEnd() === DECOMP_HEADING);
  if (decompStart === -1) {
    fail(`section "${DECOMP_HEADING}" not found`);
  }

  const taskHeadingPattern = new RegExp(`^### ${taskNumber}\\.\\s+(.+)$`);
  let taskTitle = null;
  let taskStart = -1;

  for (let i = decompStart + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trimEnd();
    if (trimmed.startsWith('## ') && trimmed !== DECOMP_HEADING) break; // left the section
    const match = trimmed.match(taskHeadingPattern);
    if (match) {
      taskTitle = match[1].trim();
      taskStart = i;
      break;
    }
  }

  if (taskStart === -1) {
    fail(`task ${taskNumber} not found under "${DECOMP_HEADING}"`);
  }

  const taskBody = [];
  for (let i = taskStart + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trimEnd();
    // Stop at the next task heading, or at the next level-2 heading.
    if (trimmed.startsWith('### ') || (trimmed.startsWith('## ') && trimmed !== DECOMP_HEADING)) {
      break;
    }
    taskBody.push(lines[i]);
  }

  output.task = {
    id: taskNumber,
    title: taskTitle,
    body: taskBody.join('\n').trim(),
  };
}

process.stdout.write(JSON.stringify(output, null, 2));
