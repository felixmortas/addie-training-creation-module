---
title: 'Module Plan'
status: 'in-progress'
module_name: 'Addie Training Creation'
module_code: 'addie'
module_description: 'Guides instructional designers through ADDIE to create coherent, professional training-course artifacts in Claude Code.'
architecture: 'Five independent progressive-loading workflows, one per ADDIE phase'
standalone: true
expands_module: ''
skills_planned: []
config_variables: []
created: '2026-08-24T09:35:28Z'
updated: '2026-08-24T09:56:40Z'
---

# Module Plan

## Vision

Addie Training Creation gives instructional designers an ADDIE-native way to turn client conversations with SME notes, or an existing course into a complete, professional training course package. Its value is disciplined progression: every workflow embeds the relevant process and business rules, writes durable artifacts, and turns approved earlier artifacts into explicit evidence for the next phase.

## Architecture

Five independent, progressive-loading workflow skills—one for each ADDIE phase—with no orchestrator:

- `/addie-analysis`
- `/addie-design`
- `/addie-develop`
- `/addie-implement`
- `/addie-evaluate`

Each workflow uses the BMad v6 loading pattern: `SKILL.md` routes to `workflow.md`, which loads one ordered `step-XX-*.md` file at a time. Phase-specific templates and other reusable resources are loaded only when relevant.

This architecture preserves the user's desired explicit phase commands, allows every phase to be invoked independently, and keeps the module maintainable. An orchestrator is deliberately excluded: designers remain responsible for selecting the applicable phase and authoritative upstream files.

### Memory Architecture

No conversational or shared agent-memory layer is required. Generated, version-controlled course artifacts are the durable source of truth. This is intentional: work must be reproducible and later-phase decisions must be grounded in explicitly chosen evidence rather than hidden session state.

### Memory Contract

The project artifact set is the module's working-memory contract:

- Each workflow writes its phase documents as output files.
- A workflow may use documents it previously created within its own run.
- A later workflow accepts designer-selected upstream files and previously generated documents as direct inputs; it does not automatically discover or silently choose documents.
- In unattended mode, a missing required input stops the workflow and produces a concise question or report. The workflow must not make unlabelled assumptions.

### Cross-Agent Patterns

Not applicable: this module contains workflows, not collaborating agents. The designer is the explicit router between phase workflows by supplying the authoritative output files from earlier phases.

## Skills

### addie-analysis

**Type:** workflow

**Purpose:** Conduct a client-facing analysis that identifies the real performance or training need and produces the approved planning evidence needed for design.

**Capabilities:**

| Capability | Outcome | Inputs | Outputs |
| ---------- | ------- | ------ | ------- |
| Establish the project | A maintained training charter captures the client, business problem, causes, stakeholders, constraints, timeline, budget, and expected return. | Client conversation; SME notes; existing course; project brief. | Training charter file. |
| Diagnose the need | Learner, context, and performance-gap findings identify whether training is appropriate and what conditions affect success. | Selected source material and client/SME responses. | Learner analysis, context analysis, and gap-analysis files. |
| Define the solution | Project and instructional goals describe the intended intervention without confusing goals with measurable objectives. | Analysis findings. | Goals file. |
| Gain planning approval | A proposal integrates the findings, recommended intervention, scope, and ROI for client review and sign-off. | All earlier analysis artifacts. | Training proposal file with approval state. |
| Analyze required performance | A prioritized, hierarchical task analysis maps the knowledge and skills learners need. | Approved proposal and goals. | Task-analysis file. |
| Consolidate analysis | A final analysis document reuses—not re-derives—the approved phase evidence as the authoritative design handoff. | All analysis output files. | Final analysis document and concise completion summary. |

**Design notes:** Strictly follow the validated `1-analysis/` process and preserve its progressive loading. Interactive mode uses checkpointed client approval; unattended mode halts with a concise report when required information or selected files are absent.

**Relationships:** First workflow. Its designer-selected outputs are required inputs for `/addie-design`.

---

### addie-design

**Type:** workflow

**Purpose:** Transform approved analysis evidence into an aligned learning design that specifies what learners must do, how learning will be assessed, and how instruction will support it.

**Capabilities:**

| Capability | Outcome | Inputs | Outputs |
| ---------- | ------- | ------ | ------- |
| Specify objectives | Each selected task has a measurable objective with observable behavior and conditions, at an appropriate knowledge level. | Designer-selected final analysis, task analysis, goals, and relevant supporting artifacts. | Learning-objectives file. |
| Design valid assessment | Every objective has an aligned pre-, formative, and/or summative assessment, including rubrics where performance assessment requires them. | Learning objectives and upstream analysis evidence. | Assessment-design file. |
| Select instructional strategy | An evidence-based organizational, delivery, and development strategy matches the learners, tasks, constraints, knowledge level, and learning domain. | Objectives, assessments, task analysis, learner/context findings, and project constraints. | Instructional-strategy file. |
| Check alignment | The design demonstrates that objectives, content, and assessments remain aligned before development begins. | All design outputs. | Alignment check within the design package and concise completion summary. |

**Design notes:** Follow the draft `2-design/` progressive-loading process as it is matured. Interactive and unattended modes follow the module-wide input/stop contract.

**Relationships:** Consumes explicit analysis outputs and supplies its complete design package to `/addie-develop`.

---

### addie-develop

**Type:** workflow

**Purpose:** Turn the approved instructional design into a tested, production-ready training course package.

**Capabilities:**

| Capability | Outcome | Inputs | Outputs |
| ---------- | ------- | ------ | ------- |
| Plan the learning product | Approved storyboards specify screens or other learning experiences, assets, narration/text, navigation, interaction, and implementation notes. | Designer-selected objectives, assessments, instructional strategy, and relevant analysis evidence. | Storyboard file(s), including visual-layout specifications when applicable. |
| Establish production standards | A full-course style guide defines visual, interaction, formatting, accessibility/metadata, and reusable production conventions. | Storyboards, delivery constraints, and client standards. | Style-guide file. |
| Build course products | Training deliverables appropriate to the strategy and delivery mode are created from the approved storyboard and style guide. | Approved storyboards, style guide, and design package. | Course-product files and supporting assets. |
| Verify the products | Alpha testing checks compatibility and high-risk issues; beta testing with representative users finds usability, flow, and content defects. | Course products, test context, and target-platform requirements. | Test plan/results and release-ready course package. |

**Design notes:** Follow the draft `3-development/` progressive-loading process as it is matured. The non-negotiable is storyboard sign-off before building, with multimedia and usability principles applied throughout. Alpha testing targets the client environment; beta testing observes representative learners. Interactive and unattended modes follow the module-wide input/stop contract.

**Relationships:** Consumes the explicitly selected design package. Produces the course package and test evidence expected by future implementation and evaluation workflows.

---

### addie-implement

**Type:** workflow

**Purpose:** Hand over and roll out the completed training course so it is ready for real users, supported by the people, systems, communication, and evidence needed for successful launch and later evaluation.

**Capabilities:**

| Capability | Outcome | Inputs | Outputs |
| ---------- | ------- | ------ | ------- |
| Capture lessons learned | Project knowledge, special client notes, and delivery considerations are recorded for future work or return engagements. | Designer-selected analysis, design, development, and test artifacts; project-team observations. | Lessons-learned document. |
| Plan the handoff and rollout | The client receives a clear deployment plan tailored to the course products, delivery environment, responsibilities, timing, and support needs. | Release-ready course package, test results, client delivery constraints, and stakeholder information. | Implementation/handoff plan. |
| Prepare the delivery environment | Required deployment work—such as LMS installation, course-shell setup, links, access, or coordination with an LMS administrator—is planned, completed where the skill can do so safely, or assigned with precise instructions. | Course package, target-platform requirements, access/responsibility information. | Deployment checklist and environment-readiness record. |
| Enable trainers and stakeholders | Trainers, SMEs, delivery owners, and stakeholders receive an appropriate train-the-trainer plan, facilitator enablement, and launch communication. | Course package, implementation plan, audience/stakeholder information, and change impact. | Train-the-trainer/facilitator plan and stakeholder communication plan. |
| Prepare change and evaluation readiness | Material change impacts are identified, communications and change-management needs are surfaced, and the data required for the chosen later evaluation is scheduled for collection. | Implementation context; expected evaluation purpose and measures; project goals. | Change-readiness notes and evaluation-data-collection plan. |
| Confirm launch readiness | The designer and client can verify that the training is ready for a smooth, error-free handoff or launch. | All implementation artifacts and deployment evidence. | Launch-readiness checklist and concise completion summary. |

**Design notes:** Implementation can occur throughout ADDIE and may end with a client handoff when the instructional designer is not responsible for rollout. The workflow must make that scope explicit rather than assuming LMS administration, trainer delivery, or change-management ownership. The non-negotiable is a smooth, context-appropriate implementation and intentional collection of data needed by evaluation.

**Relationships:** Consumes the designer-selected release-ready development package and test evidence. Produces implementation evidence and data-collection plans for `/addie-evaluate`.

---

### addie-evaluate

**Type:** workflow

**Purpose:** Evaluate training quality and impact through formative quality checks and a purpose-driven summative evaluation that gives the client defensible findings and recommendations.

**Capabilities:**

| Capability | Outcome | Inputs | Outputs |
| ---------- | ------- | ------ | ------- |
| Plan formative evaluation | Quality checks, expert reviews, pilots, and other low-stakes formative evidence are consolidated or planned to improve confidence in the course package. | Selected design, development, test, and implementation artifacts; SME/reviewer feedback. | Formative-evaluation plan or findings record. |
| Frame summative evaluation | The client-aligned purpose, stakeholders, key questions, success measures, scope, and collection timing determine what the final evaluation must answer. | Project goals, ROI assumptions, implementation context, and client priorities. | Summative-evaluation plan with key questions. |
| Select an evaluation model | A model is chosen because it answers the key questions; Kirkpatrick is the default model where its four levels fit. | Summative-evaluation purpose and key questions. | Evaluation-model rationale and measurement map. |
| Collect and interpret evidence | Evidence is gathered and analyzed for the selected levels: learner satisfaction, learning, transfer to the job, and/or business impact/ROI. | Evaluation-data-collection plan, implementation data, pre/post assessments, surveys, observations, interviews, and performance data as applicable. | Findings and analysis record. |
| Report recommendations | The client receives a clear evaluation report that explains the context, questions, method, findings, and evidence-based recommendations. | All evaluation artifacts and findings. | Final evaluation report and concise completion summary. |

**Design notes:** Formative and summative evaluation are distinct: formative checks occur throughout the process, while summative evaluation is a final, potentially high-stakes inquiry. The workflow must not equate objective-level assessments with overall training evaluation. Kirkpatrick's levels are learner satisfaction, learning, transfer, and business impact/ROI; levels 3–4 require client-appropriate timeframes and data rather than a generic recommendation.

**Relationships:** Uses explicitly selected course, implementation, and evaluation-data artifacts. Its plan may be needed during `/addie-implement` so data collection starts at launch rather than after evidence is lost.

Not ready — complete in Phase 3+

---

## Configuration

The module collects one installation-time setting:

| Variable | Prompt | Default | Result Template | User Setting |
| -------- | ------ | ------- | --------------- | ------------ |
| `addie_output_folder` | Where should ADDIE course artifacts be stored by default? | `{project-root}/_bmad-output/addie` | `{addie_output_folder}` | Yes |

Each workflow uses this as its default output root while allowing the designer to choose a course-specific destination at runtime when needed.

## External Dependencies

The module depends on the BMad skill framework. It must be compatible with Claude Code, Codex, Gemini CLI, and GitHub Copilot. Workflows must therefore rely on portable Markdown instructions and local files rather than a host-specific tool, UI, or persistent runtime feature.

## UI and Visualization

No module-level UI or visualization is planned. The course documents and concise unattended-mode reports are the user-facing artifacts.

## Setup Extensions

The setup skill must collect `addie_output_folder` and ensure that the configured output root exists. It should register the five phase workflows and preserve their host-compatible invocation metadata.

## Integration

This is a standalone module. It provides value wherever the BMad skill framework runs, including Claude Code, Codex, Gemini CLI, and GitHub Copilot. Each phase is independently invocable; together they form an artifact-driven ADDIE course-production sequence.

## Creative Use Cases

- Start a new training initiative from a client conversation, retaining approved decisions as reusable evidence.
- Convert SME notes into a traceable training design rather than a one-shot course draft.
- Use an existing course as source material while revalidating the real performance need and current learner/context constraints.
- Run a phase unattended in a file-driven delivery pipeline, receiving a concise missing-information report instead of fabricated decisions.
- Hand a course to a client with a documented deployment, trainer-readiness, communication, and evaluation-data plan even when the instructional designer is not the rollout owner.
- Scale evaluation from formative quality checks to a client-specific Kirkpatrick inquiry, without promising that long-term transfer or ROI data already exists.

## Ideas Captured

- Goal: integrate the five ADDIE phases into Claude Code as end-user-triggerable skills that create professional training courses.
- Proposed phase commands: `/addie-analysis`, `/addie-design`, `/addie-develop`, `/addie-implement`, and `/addie-evaluate`.
- Each phase skill generates phase documents as output files. A skill can reuse its own earlier outputs and hand outputs to a later ADDIE phase as direct inputs.
- The project already contains early process drafts for analysis, design, and development; only analysis is validated and is the intended first implementation target.
- The validated analysis specification lives in `1-analysis/` and follows BMad v6 progressive loading: `SKILL.md` → `workflow.md` → ordered `step-XX-*.md` files, with templates/resources reachable through a `references/` folder.
- A `bmad-build` skill folder is available as a structural reference for BMad v6 progressive loading.
- Module identity: **Addie Training Creation** (`addie`). The user-facing module is designed to assist instructional designers.
- The differentiator is embedded ADDIE expertise: exact process and business rules, ordered work, and deliberate reuse of each artifact as evidence/input for later documents and phases—not generic prompts or disconnected templates.
- Likely source material includes existing courses and SME notes.
- Analysis is a collaborative client-facing conversation that produces the planning artifacts needed to proceed.
- “Professional” means the outputs meet the standards implied by the relevant ADDIE phase, rather than one superficial shared formatting standard.
- Every phase command must support both a guided collaborative conversation and an unattended mode driven by supplied files.
- Cross-phase handoff is designer-controlled: later phases use explicitly selected earlier output files from the fixed project context. The module should not silently discover or assume which artifacts are authoritative.
- In unattended mode, missing required information must halt the run with a concise question or report; it must not fabricate assumptions.
- Scope is creation of a complete course package, not an ongoing course-improvement or repair workflow.

## Build Roadmap

1. **`addie-analysis`** — build and validate first from the existing `1-analysis/` specification; it defines the initial artifact contract for every downstream phase.
2. **`addie-design`** — mature the current draft and build it once analysis outputs and handoff rules are fixed; it depends directly on analysis evidence.
3. **`addie-develop`** — mature the current draft and build it after design outputs are stable; it turns the design package into a tested course package.
4. **`addie-implement`** — build after development so the course package, test evidence, and handoff boundaries are concrete.
5. **`addie-evaluate`** — build after implementation so it can use launch and data-collection evidence; define its early data requirements in coordination with implementation.

All five workflow contracts are now defined. The module can be scaffolded as a production-ready five-command package once the corresponding workflow skills are built and validated.

**Next steps:**

1. Build each skill using **Build an Agent (BA)** or **Build a Workflow (BW)** — share this plan document as context
2. When all skills are built, return to **Create Module (CM)** to scaffold the module infrastructure
