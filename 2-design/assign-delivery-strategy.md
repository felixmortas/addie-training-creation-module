# Task: Assign Delivery Strategy

## Purpose

Given one task's design-table row and the pre-filtered list of delivery strategies permitted for that knowledge level and Bloom domain, choose the single delivery strategy that most directly and congruently supports the stated objective, and return it in the required structured format.

## Instructions

1. Read `{task_line}` and identify the task's action, knowledge level, Bloom domain, learning objective, and organizational-strategy placement.
2. Select exactly one delivery strategy from `{filtered_catalogue}`.
   - You may not select a strategy outside `{filtered_catalogue}`, even if you believe another strategy would fit better.
   - No hybrids — a single named strategy only.
3. Confirm congruence: the strategy must be appropriate for the *exact same* task, knowledge level, and Bloom domain as the objective in `{task_line}` — not a related-but-different skill, and not a strategy better suited to a different organizational-strategy phase than the one already assigned to this task.
4. If `{retry_context}` is present, make sure this new answer explicitly fixes every failed check it lists. Do not repeat the same defect.

## Output format

Return **only** a JSON object — no prose, no markdown code fences:

```json
{
  "task_id": <int, copied unchanged from {task_line}>,
  "delivery_strategy": "",
}
```
