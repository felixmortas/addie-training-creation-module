# Step 2: Assessment

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- Every assessment must be selected exclusively from the subset of `assessment-types-catalogue.md` that matches that task's own knowledge level. Never choose a type outside that filtered pool, and never fabricate a catalogue entry that isn't there.
- The subagent that assigns an assessment has no file system access. All context it needs must be included directly in its prompt. Do not ask it to read files itself.
- Only the primary agent performs file I/O (running scripts, reading `references/*.md` once, writing `{state_file}`). Subagents never write to disk.
- Never skip a task, never merge two tasks' assessments together, or reorder tasks. Process the task ids already present in `{state_file}` strictly in ascending order, one subagent call per task.
- On any script failure (non-zero exit, invalid JSON on stdout), HALT and report the failure. Do not guess a filtered catalogue or invent an assessment type.
- If a task's assessment fails validation after `{max_retries}` attempts, HALT and present the task, the last attempted assessment, and the failed checks to the human. Ask: `[R]` retry once more with human-supplied guidance | `[E]` let the human edit the assessment directly | `[S]` skip this task and continue, flagging it as unresolved in `{state_file}`.

## INSTRUCTIONS

### 1. Resolve resume position

- Set `{current_task_index}` = the smallest `task_id` among `{state_file}.tasks` whose entry has no `assessment` field yet.
- Treat every entry that already has an `assessment` field as already validated — do not re-validate or reassign it.
- If a task's entry has no `objective` field (it was flagged `unresolved` during step 1), do not attempt to assess it: copy that entry through unchanged, set its `assessment` field to `"unresolved"`, and move on without spawning a subagent for it.
- If `{current_task_index}` has no task lacking an `assessment` field (i.e. every task already has one), every task already has an assessment — skip to step 3.

### 2. For each task `n` from `{current_task_index}` to `{task_count}`, in order:

a. **Read the task's line.** Take task `n`'s full current entry from `{state_file}` (task id, title, domain, knowledge level, and the validated learning objective) as `{task_line}`. Confirm `{task_line}.knowledge_level` is exactly `"low"` or `"high"`; if it is missing or any other value, HALT — the data from step 1 is inconsistent.

   If `{task_line}` has no `objective` field, apply the "unresolved" handling from step 2 above and continue to the next task without steps b–d.

b. **Filter the catalogue.** Run:

```bash
node "{skill-root}/scripts/filter_assessment_catalogue.js" "{skill-root}/references/assessment-catalogue.md" "{task_line.knowledge_level}"
```

Capture the JSON stdout as `{filtered_catalogue}`. On failure (non-zero exit or stdout that doesn't parse as JSON), HALT per RULES.

c. **Assign the assessment.** Follow `[[design-snapshot:assign-assessment.md]]`, in order of preference:
   - **Preferred — subagent:** spawn a subagent synchronously (wait for it to return in this turn) with `[[design-snapshot:assign-assessment.md]]` as its prompt. Pass it `{task_line}`, `{filtered_catalogue}`, and on retries only, the specific failed checks from step 1 verbatim, plus any human-supplied guidance if this retry follows an `[R]` HALT response.
   - **Fallback — inline** (for runtimes without subagent support): if your runtime cannot spawn subagents, or the spawn fails/times out, read `[[design-snapshot:assign-assessment.md]]` yourself and follow its instructions to produce the same output.

   Capture the returned object as `{candidate_assessment}`.

d. **Validate** Check `{candidate_assessment}` against every item:
   -  `task_id` matches the task under work and is unchanged from `{task_line}`.
   - `assessment` is either a single verbatim entry from `{filtered_catalogue}`, or a hybrid .
   - The output is valid JSON and nothing else (no leading or trailing prose, no code fence), and contains only the two keys `task_id` and `assessment` — it must not echo back `task`, `knowledge_level`, `learning_objective`, or any other field from `{task_line}`.

   - **All checks pass:** merge — take task `n`'s existing entry in `{state_file}` as-is (it already carries `task`, `knowledge_level`, `learning_objective`, etc. from step 1), set or overwrite only its `assessment` key with `{candidate_assessment}.assessment`, and leave every other key and every other task's entry untouched. Write the full `{state_file}` (the entire `tasks` array, not just this one entry) back to disk. Move to the next task.
   - **Any check fails, attempts remaining:** return to 2c with the retry reason — the section naming exactly which checks failed and why. Re-run 2d for the same task `n`.
   - **Any check fails, attempts exhausted (`{max_retries}` reached):** HALT per RULES.

### 3. Completion

Once every task from 1 to `{task_count}` has an `assessment` field (validated or flagged `unresolved`), tell the user how many assessments were written, how many (if any) were flagged unresolved, and where `{state_file}` lives.

## NEXT

Read fully and follow `[[design-snapshot:step-03-strategies.md]]`
