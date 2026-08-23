---
---

# Step 5: Write task analysis

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{proposal_file}` is read-only. Do not modify.

## INSTRUCTIONS

This step goal is to break those project goals down into skills and
knowledge so that you can make sure that you know exactly
what the learners need to know.
In the most simple terms, you are making sure you know all of
the steps (or tasks) learners must know to accomplish their
goals.

1. Break the high-level goal into tasks - what are the main things the learner's going to be doing for this goal
2. Prioritize each task on a 1–10 scale across:
   - **Importance** — how critical to the goal
   - **Difficulty** — how hard to learn
   - **Length** — how long to teach
   - **Cost** — to develop
3. Recursively decompose each task into sub-tasks until **prior knowledge takes over** (i.e., further decomposition would teach things the learner already knows).
4. Format to **List** — hierarchical numbering (1.0 → 1.1 → 1.1.1)


The table might look like this:
| Goal: Fly a plane |
|---|
| Tasks | Importance | Difficulty | Length | Cost |
|---|---|---|---|---|
| Read instruments | 10 | 1 | 10 | 1 |
| Eject from plane | 1 | 5 | 1 | 10 |

### CHECKPOINT 2

Present summary. Display the task analysis file path as a CWD-relative path (no leading `/`) so it is clickable in the terminal. If token count exceeded 1600 and the user chose to keep the full task analysis, include the token count and explain why it may be a problem.

After presenting the summary, display this note:

---

Before approving, you can open the task analysis file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation` or `bmad-party-mode`, ideally in another session to avoid context bloat.

---

HALT and give the user a choice:

- **Approve and continue** — approve the task analysis and proceed to next steps.
- **Approve and stop** — approve the proposal, leave it `approved`, and stop so a fresh `bmad-addie-analyse` session can resume at next step.
- **Review task analysis** — review the task analysis, use a subagent if available, and discuss the findings and revisions with the user until the user is ready to approve, then either stop or continue.

Before acting on approval, re-read `{task_analysis_file}` from disk. If it is missing, HALT without recreating it, changing status, or proceeding. If it changed, acknowledge the external edits and continue with the updated version. Set status `approved`; everything inside `<frozen-after-approval>` is then locked and only the human can change it.

## NEXT

Read fully and follow `[[bmad-snapshot:step-06-review-proposal.md]]`