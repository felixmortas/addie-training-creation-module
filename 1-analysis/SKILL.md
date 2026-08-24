---
name: addie-analyse
description: 'Diagnoses training needs and creates design-ready analysis evidence. Use when the user says "/addie-analyse" or asks to start or continue ADDIE analysis.'
---

# ADDIE analysis

Run the following command exactly once without changing the current working directory. Replace `{project-root}` with the absolute project-root path and `{skill-root}` with the absolute path to this skill directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` path printed to stdout.
- On failure, report the command output and stop. Do not read workflow source files directly.
