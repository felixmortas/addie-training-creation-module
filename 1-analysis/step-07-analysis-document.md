---
# CUSTOMIZE TO GET ACTUAL SKILL NEEDS
xxx: '' # set at runtime for 
xxx: '' # set at runtime to 
---
# Step 7: Build the analysis document

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.

## INSTRUCTIONS

Use the data from the documents you created before instead of re doing all the job.

The first thing that I have is I have a summary of the case - the
training charter. Who’s the client/company? What's the
problem? What's the budget? What's my schedule? When am I
having this done by?

Then we have the results of our gap analysis. We discuss how we
collected data and what the results were. Describe who, what, where, when, why are we
doing this project.

Then we have a section for the learner analysis and context
analysis - the results. We discuss how we collected data and
what the results were.

Next, we write the project solution including our goals.

Then I would present my high-level task list table with this document

Then when the document is created, get approval/sign-off


### Common mistakes in analysis

| Mistake | Consequence |
|---|---|
| Trusting client's stated problem | Wrong solution to wrong problem |
| Skipping content walkthrough | Budget blow-up |
| Not pinning down LMS/tech upfront | Alpha test reveals incompatible stack |
| Recommending model before hearing problem | Wrong tool for the job |
| Confusing learning preferences with learning styles | Wasted design effort |
| Skipping task analysis sign-off | Scope creep, redevelopment |
| One-shot meeting → write proposal next day | Missing information surfaces mid-build |

### Copy patterns

> "You always need to go in knowing that you need to find the problem and cause then worry about the solution."

> "Good analysis helps ensure quality; bad analysis ensures poor quality."

> "70% of projects fail and poor analysis and management are usually the cause."

> "There is no learning style."

### Display Summary <!-- [CUSTOMIZE TO MATCH ACTUAL SKILL NEEDS] -->

Display summary of your work to the user, including:

- The commit hash, if one was created.
- Review findings breakdown: patches applied, items deferred, and the dismissed count — dismissal reasons are recorded in the spec's `## Review Triage Log`.

Any file paths shown in conversation/terminal output must use CWD-relative format (no leading `/`) with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability — the goal is to make paths clickable in terminal emulators.

Offer to push and/or create a pull request.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{workflow.on_complete}