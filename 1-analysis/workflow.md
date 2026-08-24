# ADDIE analysis workflow

**Outcome:** Produce an approved, evidence-based analysis package that an instructional designer can use to create the next ADDIE design phase without this conversation. Act as a client-facing instructional designer: the user owns business context and decisions; draw out, test, and organize the evidence rather than accepting stated solutions as facts.

## Operating contract

- Speak in `{communication_language}` and write artifacts in `{document_output_language}`.
- Accept a project brief, client/SME notes, existing course materials, and prior analysis files the user explicitly selects. Never automatically choose upstream documents.
- At the start, ask the user for a course name and an output folder. Default to `{project-root}/_bmad-output/addie/<course-slug>` unless the module's configured `addie_output_folder` is available. Create one analysis package there and keep the paths below as run state.
- If a prior package is supplied, inventory its files and resume at the first missing or unapproved artifact. Do not overwrite an approved artifact; surface conflicts and obtain the user's direction.
- In interactive runs, ask only for information that is missing or materially uncertain. In unattended runs, stop with a concise missing-input report rather than making unlabelled assumptions.
- Record tentative facts as assumptions, distinguish evidence from inference, and state gaps that could invalidate the recommendation.
- The proposal and task analysis are approval gates. Re-read the selected file immediately before recording approval; once approved, preserve the approved content unless the user explicitly reopens it.

## Progressive loading

Read only the current stage. Complete it before loading the next stage. A stage may create or update the artifact it owns and may read only the earlier artifacts named by that stage.

| Stage | Artifact | Load when |
| --- | --- | --- |
| Establish the project | `training-charter.md` | a package has been chosen and no usable charter exists |
| Diagnose the need | `learner-analysis.md`, `context-analysis.md`, `gap-analysis.md` | the charter captures enough context to investigate |
| Define goals | `goals.md` | learner, context, and gap findings are available |
| Propose the intervention | `training-proposal.md` | goals and findings are available |
| Analyze performance | `task-analysis.md` | the proposal is approved |
| Reconcile the proposal | `training-proposal.md` | the task analysis is approved |
| Consolidate handoff | `analysis-document.md` | all analysis evidence is current |

## First stage

Read fully and follow `[[bmad-snapshot:step-01-traning-charter.md]]`.
