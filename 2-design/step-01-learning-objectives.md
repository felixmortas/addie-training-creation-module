---
state_file: '' # set at runtime to {{.implementation_artifacts}}/design/learning-objectives.json
task_count: '' # set at runtime from scripts/count_task.js output
current_task_index: '' # set at runtime; 1-based index of the next task to write, resumed from state_file if it already exists
max_retries: 3 # fixed retry budget per task before halting and asking the human
---

# Step 1: Learning Objectives

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- Every learning objective must be grounded only in `{{.implementation_artifacts}}/analysis/task-analysis.md` content. Never fabricate task content that isn't there.
- The subagent that writes objectives has no file system access. All context it needs must be included directly in its prompt. Do not ask it to read files itself.
- Only the primary agent performs file I/O (running scripts, reading `references/*.md` and `assets/templates/*.json` once, writing `{state_file}`). Subagents never write to disk.
- Never skip a task, merge two tasks into one objective, or reorder tasks. Process task ids strictly in ascending order, one subagent call per task.
- On any script failure (non-zero exit, non-numeric `task_count`, missing section), HALT and report the failure. Do not guess a task count or invent section content.
- If a task's objective fails validation after `{max_retries}` attempts, HALT and present the task, the last attempted objective, and the failed checks to the human. Ask: `[R]` retry once more with human-supplied guidance | `[E]` let the human edit the objective directly | `[S]` skip this task and continue, flagging it as unresolved in `{state_file}`.

## INSTRUCTIONS

### 1. Count the tasks

Run:

```bash
node "{skill-root}/scripts/count_task.js" "{{.implementation_artifacts}}/analysis/task-analysis.md"
```

Capture stdout as `{task_count}`. If the command fails, or stdout is not a positive integer, HALT per RULES.

### 2. Resolve resume position

- Set `{state_file}` = `{{.implementation_artifacts}}/design/learning-objectives.json`.
- If `{state_file}` exists and parses as valid JSON with a non-empty `tasks` array: set `{current_task_index}` = (highest `task_id` present) + 1. Treat every existing entry as already validated — do not re-validate or regenerate it.
- Otherwise: initialize `{state_file}` with the full contents of `{skill-root}/assets/templates/learning-objectives-state.json`, and set `{current_task_index}` = 1.

If `{current_task_index}` > `{task_count}`, every task already has a validated objective — skip to step 4.

### 3. For each task `n` from `{current_task_index}` to `{task_count}`, in order:

a. **Extract task context.** Run:

```bash
node "{skill-root}/scripts/decompose_task.js" "{{.implementation_artifacts}}/analysis/task-analysis.md" "{n}"
```

Capture the JSON stdout as `{task_context}` (contains `scope_and_assumptions`, `task_priorities`, and `task` — id, title, body). On failure, HALT per RULES.

b. **Write learning objectives.** Append it to `{state_file}` by following `[[design-snapshot:write-learning-objective.md]]`, in order of preference:
        - **Preferred — subagent:** spawn a subagent synchronously (wait for it to return in this turn) with `[[design-snapshot:write-learning-objective.md]]` as its prompt. Pass it the full `{task_context}`, the full contents of `{skill-root}/references/learning-objectives-rules.md`, the full current contents of `{state_file}` and on retries only, the specific failed checks from step 3c, verbatim, plus any human-supplied guidance if this retry follows a `[R]` HALT response.
        - **Fallback — inline** (for runtimes without subagent support): if your runtime cannot spawn subagents, or the spawn fails/times out, read `[[design-snapshot:write-learning-objective.md]]` yourself and follow its instructions to append the same output to `{state_file}`.

c. **Validate.** Check `{candidate_state}`'s newly appended entry for task `n` against every item in the formulation rules' `## 5. Validation checklist`, and additionally confirm:
   - every prior task's entry in `{candidate_state}` is byte-for-byte identical to what was in `{state_file}` before this call.
   - `task_count` and `source_task_analysis` are set correctly.

   - **All checks pass:** overwrite `{state_file}` with `{candidate_state}`. Move to the next task.
   - **Any check fails, attempts remaining:** return to 3b with the retry reason from step 3c section naming exactly which checks failed and why. Re-run 3c for the same task `n`.
   - **Any check fails, attempts exhausted (`{max_retries}` reached):** HALT per RULES.

### 4. Completion

Once every task from 1 to `{task_count}` has a validated entry in `{state_file}`, tell the user how many objectives were written and where `{state_file}` lives.

## NEXT

Read fully and follow `[[design-snapshot:step-02-assessment.md]]`
