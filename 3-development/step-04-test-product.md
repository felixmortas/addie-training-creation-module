For each product, implement the tests needed.

## 8. Pilot Testing

| Phase | When | What you're catching | Who tests |
|---|---|---|---|
| **Alpha** | Start before signing the contract | Big problems, hardware/LMS compatibility | You + dev team on **client's actual stack** |
| **Beta** | Near completion | Small glitches, broken links, spelling, flow | Real users in small groups; observe them |

### Alpha test priority

Stress-test on the **client's** hardware and LMS, not yours. Pastore's hard rule: do this before signing.

### Beta test priority

Observe users — don't just collect survey data. Watch what they do, where they pause, what they click first.

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