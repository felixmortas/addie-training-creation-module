---
name: addie-develop
description: 'development phase'
---

# Workflow
First, we create storyboards.

Run the following command exactly once without changing the current working directory. Replace {project-root} with the absolute path to the project root and {skill-root} with the absolute path to this skill's directory:

```bash
uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"
```

- On success, read and follow the one absolute `workflow.md` instruction printed to stdout.
- On failure (including uv being unavailable), report the command output and HALT. Do not run any workflow source directly.

# Development — Build the Deliverables

## Steps
For each deliverable :
storyboard
Get **client sign-off** on storyboards before building anything. This is where you catch design problems while changes are still cheap.
style-guide, 
multimedia-principles before you author, 
build basic deliverable
alpha test on hardware etc
build final deliverable
beta test on real public

## 1. Common Deliverables

| Deliverable | What it is | Notes |
|---|---|---|
| **Instructor Guide** | "Cookbook for delivery" — slides + notes + ice breaker + step-by-step | The trainer follows this |
| **Learner Guide** | Slimmed-down instructor guide without the notes | What the learner takes home |
| **Presentations** | Slides — but learn beyond PowerPoint | Keynote, Google Slides, etc. |
| **Computer-Based Training** | Executable + dev files, narration, images, video | Deliver via cloud or LMS |
| **Video** | Recorded lectures, demos, scenarios | Hire pro for narration |
| **Narration** | Voice-over | Text-to-speech still robotic — hire a person |
| **Job Aids** | Quick-reference performance support | Used post-training on the job |
| **Images** | Photos, diagrams, icons | Subscribe to a stock library |
| **Other material** | Something else | Be creative and adapt to learning outcomes, client, students, environment, etc ... |

Match deliverables to whether the training is face-to-face, blended, or fully online.

## 9. Common mistakes

| Mistake | Consequence |
|---|---|---|
| Skipping storyboard sign-off | Scope creep, full redevelopment |
| Skipping style guide because solo | Can't reverse-engineer your own work in 6 months |
| Text-to-speech for full narration | Sounds robotic; learners disengage |
| Not stress-testing on client hardware | Course breaks on production LMS |
| Treating "development" as the whole ID job | Skipping analysis and design |
| Over-using interactivity for its own sake | Cognitive overload; learners frustrated |
| Decorative content / busy backgrounds | Violates coherence + signaling principles |
| Reading on-screen text aloud verbatim | Violates redundancy principle |

## FIRST STEP

Read fully and follow: `[[bmad-snapshot:workflow.md]]` to begin the workflow.
