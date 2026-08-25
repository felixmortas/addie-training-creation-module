# ADDIE design workflow

**Outcome:** Produce `organizational-and-delivery-strategies.md`, a design handoff that a developer can turn into learning products without this conversation. It must make every task, measurable objective, knowledge level, post-assessment, organizational approach, and delivery strategy traceable to selected analysis evidence.

## Operating contract

- Speak in `{communication_language}` and write the artifact in `{document_output_language}`.
- Ask the designer to explicitly select an approved `analysis-document.md` and its output folder. Accept explicitly selected task analysis, goals, learner/context findings, or constraints when needed; never discover or choose upstream files automatically.
- Default the course folder to `{project-root}/_bmad-output/addie/<course-slug>` and write the final artifact to `<course-folder>/design/organizational-and-delivery-strategies.md`. Keep the selected paths as run state.
- If an existing final artifact is supplied, inventory it and resume at its first incomplete or unapproved section. Never overwrite an approved artifact; surface conflicts for the designer to resolve.
- Treat stated facts as evidence only when supported by the selected files. Label inferences and unresolved gaps. In unattended runs, stop with a concise missing-input report instead of inventing evidence or decisions.
- Preserve alignment: one observable objective and an aligned post-assessment for every in-scope task. Do not design a separate pre-assessment: it is the same assessment with different values.
- Assessment question types and strategies must come from the loaded catalogues. A hybrid is allowed only when it is explicitly named and clearly combines catalogue entries.
- Ask for approval of the completed handoff. Once approved, preserve it unless the designer explicitly reopens it.

## Progressive loading

Read only the current stage. Complete it before loading the next stage.

| Stage | Purpose | Load when |
| --- | --- | --- |
| Define objectives | Convert selected tasks into measurable objectives and knowledge levels. | Selected analysis evidence identifies in-scope tasks. |
| Design assessment | Specify valid post-assessments aligned to every objective. | Every in-scope task has a draft objective and knowledge level. |
| Select strategies and finalize | Choose organizational and delivery strategies, produce the handoff, and obtain approval. | Every objective has an aligned assessment. |

## First stage

Read fully and follow `[[bmad-snapshot:step-01-learning-objectives.md]]`.
