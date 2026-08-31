# Instructional Design Table Workflow

**Goal:** Turn a task analysis into a complete, congruent instructional design
table validated row by row and ready to hand off to Development.

**CRITICAL:** If a step directs you to another snapshot file, read it fully and follow it. No exceptions.

Subagents, when the capability is available, are an important part of this workflow. Use them as directed by the workflow steps.
If you need an explicit user instruction to run them, ask once now for the whole workflow run.

## DESIGN TABLE ROW READY STANDARD
 
A design table row is "Ready for Development" when:
 
- **Congruent**: Objective, Assessment, and both strategies all address the exact same task, knowledge level and Bloom domain — no drift between columns.
- **Classified**: Every row carries an explicit domain (cognitive / affective / psychomotor) and knowledge level, used as the basis for the strategy choice.
- **Measurable**: The objective uses ABCD form, is valide and reliable.
- **Assessed**: The assessment item directly tests the stated objective — not a related-but-different skill or a lower/higher Bloom level.
- **Strategized**: Both an organizational-strategy placement (where the task sits in the course structure) and a delivery-strategy (a concrete technique) are assigned, each with a one-line justification.
- **Complete**: No placeholders, no "TBD", no empty cells.

## Conventions

- Every operational cross-file reference in this workflow is an absolute snapshot path. Open it directly; do not resolve it relative to a skill directory.
- `{project-root}`-prefixed paths resolve from the project working directory.
- Whenever this workflow captures or records a version-control revision, obtain the full canonical identifier directly from version control and preserve it verbatim.

## On Activation

### Step 1: Execute Prepend Steps

Execute each of these steps in order before proceeding (`_None._` means skip):

{workflow.activation_steps_prepend}

### Step 2: Load Persistent Facts

Treat every entry below as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` -- load the referenced contents as facts. All other entries are facts verbatim (`_None._` means none):

{workflow.persistent_facts}

### Step 3: Execute Append Steps

Execute each of these steps in order (`_None._` means skip):

{workflow.activation_steps_append}

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

- **Micro-file Design**: Each step is self-contained and followed exactly
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Persist progress via spec frontmatter and in-memory variables
- **Append-Only Building**: Build artifacts incrementally

### Step Processing Rules

1. **READ COMPLETELY**: Read the entire step file before acting
2. **FOLLOW SEQUENCE**: Execute sections in order
3. **VALIDATE BEFORE ADVANCING**: Check each newly filled column or line against the DESIGN TABLE READY STANDARD before moving to the next one
4. **WAIT FOR INPUT**: Halt at checkpoints and wait for human review when a validation fails or a business-rule conflict is detected
5. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** follow the exact instructions in the step file
- **ALWAYS** halt at checkpoints and wait for human input

## FIRST STEP

Read fully and follow: `[[design-snapshot:step-01-learning-objectives.md]]` to begin the workflow.