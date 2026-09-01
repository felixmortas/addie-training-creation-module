# Step 3: Strategies

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- Every organizational strategy must be exactly one of the four phases defined in `organizational-strategies-definition.md` (Introduction, Content Presentation and Learning, Assessment, Utilization). Never invent a phase that isn't defined there.
- Every delivery strategy must be selected exclusively from the subset of `delivery-strategies-catalogue.md` that matches that task's own knowledge level and Bloom domain. Never choose a strategy outside that filtered pool, and never fabricate a catalogue entry that isn't there.
- Subagents have no file system access. All context they need must be included directly in their prompt. Do not ask them to read files themselves.
- Only the primary agent performs file I/O (running scripts, reading `references/*.md` once, writing `{state_file}`). Subagents never write to disk.
- Never skip a task, never merge two tasks' strategies together, or reorder tasks. Process the task ids already present in `{state_file}` strictly in ascending order wherever this file directs per-task processing.
- On any script failure (non-zero exit, invalid JSON on stdout), HALT and report the failure. Do not guess a filtered catalogue or invent a strategy.
- If organizational-strategy assignment fails validation after `{max_retries}` attempts, HALT and present the last attempted candidate state and the failed checks to the human. Ask: `[R]` retry once more with human-supplied guidance | `[E]` let the human edit `{state_file}` directly | `[S]` flag every task still missing an `organizational_strategy` as `"unresolved"`, write `{state_file}`, and continue to delivery-strategy assignment.
- If a task's delivery strategy fails validation after `{max_retries}` attempts, HALT and present the task, the last attempted delivery strategy, and the failed checks to the human. Ask: `[R]` retry once more with human-supplied guidance | `[E]` let the human edit the delivery strategy directly | `[S]` skip this task and continue, flagging it as unresolved in `{state_file}`.

## INSTRUCTIONS

### 1. Assign organizational strategies (single batch call)

a. **Resolve resume position.** If every task entry in `{state_file}.tasks` already has an `organizational_strategy` field, treat this phase as already validated — skip directly to step 2.

b. **Extract task context.** Run:

```bash
node "{skill-root}/scripts/decompose_task.js" "{{.implementation_artifacts}}/analysis/task-analysis.md"
```

Capture the JSON stdout as `{tasks_context}` (contains `scope_and_assumptions`, `task_priorities`). On failure, HALT per RULES.

c. **Assign.** Follow `[[design-snapshot:set-organizational-strategy.md]]`, in order of preference:
   - **Preferred — subagent:** spawn a subagent synchronously (wait for it to return in this turn) with `[[design-snapshot:set-organizational-strategy.md]]` as its prompt. Pass it the full current contents of `{state_file}`, the full contents of `{skill-root}/references/organizational-strategies-definition.md`, the full `{tasks_context}` and on retries only, the specific failed checks from step 1d verbatim, plus any human-supplied guidance if this retry follows an `[R]` HALT response.
   - **Fallback — inline** (for runtimes without subagent support): if your runtime cannot spawn subagents, or the spawn fails/times out, read `[[design-snapshot:set-organizational-strategy.md]]` and `{tasks_context}` yourself and follow its instructions to produce the same output.

   Capture the returned object as `{candidate_state}`.

d. **Validate.** Check `{candidate_state}` against every item:
   - Every `task_id` from `{state_file}` is present in `{candidate_state}`, unchanged, in the same order — no task added, removed, merged, or reordered.
   - Every field that already existed on each task (`task_title`, `knowledge_level`, `bloom_domain`, `objective`, `assessment`, etc.) is byte-for-byte identical to what was in `{state_file}` before this call.
   - For every task whose `objective` field is absent or whose `assessment` field is `"unresolved"`, `organizational_strategy` is set to `"unresolved"` — not fabricated.
   - For every other task, `organizational_strategy` is exactly one of the four phase names defined in `organizational-strategies-definition.md` (verbatim), and `organizational_strategy_justification` is a concise, one-line justification grounded in that task's own content — not copied verbatim between tasks.
   - `task_count` and `source_task_analysis` are unchanged.

   - **All checks pass:** overwrite `{state_file}` with `{candidate_state}`. Move to step 2.
   - **Any check fails, attempts remaining:** return to 1c with the retry reason naming exactly which checks failed and why. Re-run 1d.
   - **Any check fails, attempts exhausted (`{max_retries}` reached):** HALT per RULES.

### 2. Assign delivery strategies (per task)

a. **Resolve resume position.** Set `{current_task_index}` = the smallest `task_id` among `{state_file}.tasks` whose entry has no `delivery_strategy` field yet. If every task already has a `delivery_strategy` field, skip to step 3.

b. For each task `n` from `{current_task_index}` to `{task_count}`, in order:

   i. **Read the task's line.** Take task `n`'s full current entry from `{state_file}` as `{task_line}`.

      If `{task_line}.organizational_strategy` is `"unresolved"` (or `{task_line}` has no `objective` field), do not attempt to assign a delivery strategy: copy the entry through unchanged, set its `delivery_strategy` field to `"unresolved"`, write `{state_file}`, and continue to the next task without steps ii–v.

   ii. **Filter the catalogue.** Run:

   ```bash
   node "{skill-root}/scripts/filter_strategies_catalogue.js" "{skill-root}/references/delivery-strategies-catalogue.md" "{task_line.knowledge_level}" "{task_line.bloom_domain}"
   ```

   Capture the JSON stdout as `{filtered_catalogue}`. On failure (non-zero exit or stdout that doesn't parse as JSON), HALT per RULES. If `{filtered_catalogue}` is an empty array, HALT per RULES and report that no catalogue entry matches this task's knowledge level and Bloom domain combination — do not fabricate one.

   iii. **Assign the delivery strategy.** Follow `[[design-snapshot:assign-delivery-strategy.md]]`, in order of preference:
   - **Preferred — subagent:** spawn a subagent synchronously (wait for it to return in this turn) with `[[design-snapshot:assign-delivery-strategy.md]]` as its prompt. Pass it `{task_line}`, `{filtered_catalogue}`, and on retries only, the specific failed checks from step 2b.iv verbatim, plus any human-supplied guidance if this retry follows an `[R]` HALT response.
   - **Fallback — inline** (for runtimes without subagent support): if your runtime cannot spawn subagents, or the spawn fails/times out, read `[[design-snapshot:assign-delivery-strategy.md]]` yourself and follow its instructions to produce the same output.

   Capture the returned object as `{candidate_delivery}`.

   iv. **Validate.** Check `{candidate_delivery}` against every item:
   - `task_id` matches the task under work and is unchanged from `{task_line}`.
   - `delivery_strategy` is a single verbatim entry from `{filtered_catalogue}` — no hybrids, no entries outside the filtered pool.
   - The output is valid JSON and nothing else (no leading or trailing prose, no code fence), and contains only the two keys `task_id`, and `delivery_strategy` — it must not echo back `task_title`, `knowledge_level`, `bloom_domain`, `objective`, `assessment`, `organizational_strategy`, or any other field from `{task_line}`.

   - **All checks pass:** merge — take task `n`'s existing entry in `{state_file}` as-is, set or overwrite only its `delivery_strategy` key with the values from `{candidate_delivery}`, and leave every other key and every other task's entry untouched. Write the full `{state_file}` (the entire `tasks` array, not just this one entry) back to disk. Move to the next task.
   - **Any check fails, attempts remaining:** return to 2b.iii with the retry reason — the section naming exactly which checks failed and why. Re-run 2b.iv for the same task `n`.
   - **Any check fails, attempts exhausted (`{max_retries}` reached):** HALT per RULES.

### 3. Completion

Once every task from 1 to `{task_count}` has both an `organizational_strategy` and a `delivery_strategy` field (validated or flagged `unresolved`), tell the user:

- how many tasks are fully strategized (both fields set to a real value, not `"unresolved"`),
- how many, if any, were flagged `unresolved` at any step of the workflow,
- where `{state_file}` lives.

This is the final step of the workflow. The design table in `{state_file}` is ready for handoff to Development for every task that is not flagged `unresolved`; unresolved tasks require human resolution before handoff.

## On Complete
 
If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.
 
{workflow.on_complete}
