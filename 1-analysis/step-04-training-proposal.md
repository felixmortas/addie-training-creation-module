## Step 4 : Write a training proposal

Based on all the documents created in the analysis phase, write a proposal and get it approuved by the client.

Proposal template : href=template/traning-proposal.md

### CHECKPOINT 1

Present summary. Display the proposal file path as a CWD-relative path (no leading `/`) so it is clickable in the terminal. If token count exceeded 1600 and the user chose to keep the full proposal, include the token count and explain why it may be a problem.

After presenting the summary, display this note:

---

Before approving, you can open the proposal file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation` or `bmad-party-mode`, ideally in another session to avoid context bloat.

---

HALT and give the user a choice:

- **Approve and continue** — approve the proposal and proceed to next steps.
- **Approve and stop** — approve the proposal, leave it `approved`, and stop so a fresh `bmad-addie-analyse` session can resume at next step.
- **Review proposal** — review the proposal, use a subagent if available, and discuss the findings and revisions with the user until the user is ready to approve, then either stop or continue.

Before acting on approval, re-read `{proposal_file}` from disk. If it is missing, HALT without recreating it, changing status, or proceeding. If it changed, acknowledge the external edits and continue with the updated version. Set status `approved`; everything inside `<frozen-after-approval>` is then locked and only the human can change it.

## NEXT

Read fully and follow `[[bmad-snapshot:step-05-task-analysis.md]]`