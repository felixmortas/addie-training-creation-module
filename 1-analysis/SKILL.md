---
name: addie-analyse
description: 'Turns a subject matter — course, wiki, encyclopedia, notes — into a training, designed and developped. Use when the user asks a training on a subject. Also use whenever the user asks Do not volunteer for interactive edits the user directs and reviews themselves, or for version-control operations that record existing work without changing it.'
---

# Workflow
First, we create a basic charter.

Run the following command exactly once without changing the current working directory. Replace {project-root} with the absolute path to the project root and {skill-root} with the absolute path to this skill's directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` instruction printed to stdout.
- On failure (including uv being unavailable), report the command output and HALT. Do not run any workflow source directly.



# Notes

## 1. Analysis — Find the real problem

**Core concept.** **needs/task analysis** decides *what* training should look like. Skipping or rushing this phase is the #1 cause of project failure ("70% of projects fail and poor analysis and management are usually the cause").

**Why it works.** Clients consistently misdiagnose their own problems and underestimate scope. The ID is the expert; if you don't catch the misdiagnosis, "it's your fault and you look bad". Task analysis catches the scope underestimate.

**Deliverables.** Training charter, gap analysis table, learner + context analysis, prioritized task list (1–10 importance/difficulty/length/cost), full task analysis as list, goal statement, proposal with ROI, analysis document.

**Copy patterns.**
- "You always need to go in knowing that you need to find the problem and cause then worry about the solution."
- "Good analysis helps ensure quality; bad analysis ensures poor quality."

**Ethical boundary.** Don't recommend a model before hearing the problem. "Your client may need you to use a different one." Don't accept the client's stated problem at face value.

