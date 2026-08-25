---
name: addie-design
description: 'Creates aligned ADDIE learning design. Use when the user says "/addie-design" or asks to create or continue an ADDIE design.'
---

# ADDIE design

Run the following command exactly once without changing the current working directory. Replace `{project-root}` with the absolute project root and `{skill-root}` with this skill's absolute directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` path printed to stdout.
- On failure, report the command output and stop. Do not read workflow source files directly.
