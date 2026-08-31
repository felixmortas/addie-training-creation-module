# Task: Assign Assessment

## Purpose

Given one task's design-table row (task, domain, knowledge level, learning objective) and the pre-filtered list of assessment types permitted for that knowledge level, choose — or construct a named hybrid of — the single assessment approach that most directly and congruently tests the stated objective, and return it in the required structured format.

## Instructions

1. Read `{task_line}` and identify the task's action, its knowledge level, and the learning objective.
2. Select exactly one assessment approach from `{filtered_catalogue}`.
   - You may not select a type outside `{filtered_catalogue}`, even if you believe another type would fit better.
   - A hybrid is permitted only if named explicitly.
3. Draft the assessment item description: concrete enough that a developer could build it without guessing — what is shown to the learner, what the learner does, and what constitutes a correct response. Do not just restate the assessment type name.
4. Confirm congruence: the item must test the *exact same* task, knowledge level, and Bloom domain as the objective in `{task_line}` — not a related-but-different skill, and not a lower or higher cognitive level than the objective calls for.
5. If `{retry_context}` is present, make sure this new answer explicitly fixes every failed check it lists. Do not repeat the same defect.

## Output format

Return **only** a JSON object — no prose, no markdown code fences:

```json
{
  "task_id": <int, copied unchanged from {task_line}>,
  "assessment": ""
}
```
