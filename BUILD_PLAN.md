# Build plan: Personal Learning

**For our three-person team · Written 17 October 2026**

Read [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for the product idea. Use this file as the working checklist. Checked items record verified progress; unchecked items remain planned work.

**Status, 19 October 2026:** Milestone 2A is verified locally. The browser's Start learning button displays the seed equation. Packages, a pinned dependency snapshot, ignored local `.env`, and the Nebius helper/CLI are prepared; 14 offline connection tests pass. No live inference request has been made. Milestone 2B is waiting for the user's account setup, key, exact available Nemotron model ID, and agreed usage budget. See [README](README.md) for the handoff. The helper is not yet wired into a browser request button.

**Our first target:** a learner approves a small math curriculum, tries a problem, receives help for the actual missing step, and can resume later with their progress preserved.

Work through one milestone at a time. Check its “done” condition before adding the next feature. If a task feels too large, split it until its result can be shown on screen or checked with one example.

## Start here: the first three tasks

1. [x] Choose the first learner group and three connected math topics: classmates who know arithmetic but struggle with equations; linear equations → substitution → points on a line. Selected 18 October 2026.
2. [x] Prepare one short reference and six checked questions, including two possible causes of a wrong answer: see [reference](app/sample_materials/course_reference.md) and [questions and solutions](app/sample_materials/questions_and_solutions.md).
3. [ ] Run a blank Streamlit app and make one real Nemotron call through Nebius Token Factory.

You do not need a finished design, archive importer, or large question bank to complete these tasks.

## The version we are building

### Required for our first complete product

- [ ] Start fresh with a goal, level, language, interest, and optional course reference.
- [ ] Accept pasted text and a short, text-based PDF; preview extracted text.
- [ ] Propose a curriculum, allow edits, and require acceptance before teaching.
- [ ] Support no-reference users with a small bundled, sourced course; mark school alignment unverified.
- [ ] Teach one objective, accept an attempt, investigate a gap, and give a suitable repair.
- [ ] Save actual attempts, hints, current objective, and next step.
- [ ] Adapt examples, tone, and reasoning-step size; let users edit the profile.
- [ ] Include bounded review of previously taught concepts.
- [ ] Resume after closing/restarting the app and export a Markdown checkpoint.
- [ ] Give judges a working demo or test build using live Nemotron inference.

### Add only after the complete flow works

One pasted previous learning conversation, PDF export, extra subjects, prettier charts, and richer source handling. Full ChatGPT/Claude archive import, voice, video generation, mobile apps, fine-tuning, and multiple autonomous agents are outside this first build.

The core should still work when users decline history import, exports, or a review question.

## Tools: choose one simple path

| Tool | Why we need it |
|---|---|
| Python | One language for the interface, tutoring workflow, and data handling. |
| Streamlit | Forms, chat, buttons, and progress screens without a separate frontend project. |
| SQLite | Save progress in a local database file during development. |
| Nebius Token Factory + an available NVIDIA Nemotron model | Real AI reasoning and teaching; required technology for our chosen track. |
| Pydantic | Check that AI-generated curriculum and assessment data have the expected fields. |
| pypdf | Extract text from ordinary PDFs; scanned documents need a later OCR feature. |
| Git/GitHub | Share code, keep recoverable checkpoints, and supply the public submission repository. |

Use one model initially. Select its exact ID from the current Token Factory catalog and confirm access, pricing, and structured-output support. Do not copy a guessed model name or the non-NVIDIA example model from a generic quickstart.

**Deployment decision:** SQLite is suitable for the local prototype. For a hosted version, choose durable storage: a persistent disk for a small single-instance build, or a hosted database for multiple users. Browser session state and an ephemeral server filesystem are not reliable learning memory.

## Milestone 1 — Agree on a tiny course

**Goal:** know exactly what our first tutor must teach.

- [x] Chosen audience: classmates who know arithmetic but struggle with equations. Tester recruitment and syllabus fit still need checking.
- [x] Chosen course: linear equations → substitution → points on a line.
- [x] Prepare an original [short course reference](app/sample_materials/course_reference.md), with linked OpenStax sections for mathematical checking and reuse notes.
- [x] Choose one objective per topic, with stable IDs as recorded below.
- [x] Prepare [six questions with checked solutions](app/sample_materials/questions_and_solutions.md): two per topic, with practice/changed-example roles and guidance for delayed reuse.
- [x] Document two causes of a wrong geometry answer and a distinguishing diagnostic sequence in GEO-01.
- [ ] Ask two or three potential testers whether this is a real difficulty and whether they will try the prototype.

**Done:** all three teammates can explain the same demo in under a minute, and every seed question has a checked answer. Freeze this scope before expanding.

### Selected first course — 18 October 2026

| Topic | Objective ID | Learning objective | Example task |
|---|---|---|---|
| Linear equations | `algebra.linear_equations` | Isolate x using the same operation on both sides. | Solve 3x + 5 = 17. |
| Substitution | `algebra.substitution` | Substitute a value into a formula and calculate the result. | Find y when y = 2x + 3 and x = 4. |
| Points on a line | `geometry.point_on_line` | Check whether a point satisfies a line's equation. | Does (3, 8) lie on y = 2x + 2? |

**Demo description:** help a classmate work through a short algebra-to-coordinate-geometry course, investigate a wrong attempt, provide help for the supported difficulty, and save progress for later.

For the point-on-line task, possible causes include confusing x and y, substituting incorrectly, or making an arithmetic error. A diagnostic prompt can ask: “For the point (3, 8), what are x and y? Then substitute x into 2x + 2 and show your calculation.” These are candidate explanations to investigate, not conclusions to assume from a wrong answer.

**Next build task:** run the blank Streamlit app and make one real Nemotron call (Milestone 2). The reference and six-question starter set are prepared. Confirm the scope with teammates and recruit two or three testers; Milestone 1 still requires team agreement and tester outreach.

## Milestone 2 — Run the app and connect the model

**Goal:** remove setup uncertainty early.

### 2A. Prepare the project

- [x] Check that Python and Git are available: Python 3.14.7 and Git 2.55.0 verified locally.
- [x] Create an `app/` subfolder in this repository. Keep the brief and plan at the root.
- [x] In a PowerShell terminal opened inside `app/`, create an isolated Python environment and install the packages:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install streamlit openai python-dotenv pydantic pypdf pytest
```

The environment keeps project packages separate. `openai` is the compatible client library; requests will go to Nebius. Using the environment's Python directly avoids PowerShell activation issues.

- [x] Create `app.py` containing a title and a “Start learning” button. Browser click and Streamlit AppTest verified on 19 October 2026. Run it:

```powershell
.\.venv\Scripts\python.exe -m streamlit run app.py
```

**Check:** a browser page opens. `Ctrl+C` stops the server.

### 2B. Make one live AI request

- [ ] Verify Token Factory account access, balance, billing behavior, and available Nemotron models. Agree on an out-of-pocket budget before enabling paid usage.
- [ ] Fill `.env` with `NEBIUS_API_KEY` and the available `NEBIUS_MODEL`. Blank `.env` and `.env.example` are prepared; live calls default to disabled.
- [x] Add `.env`, `.venv/`, database files, private uploads, and caches to `.gitignore`; verified with `git check-ignore`.
- [x] Prepare `llm.py` with `https://api.tokenfactory.nebius.com/v1/`, environment-loaded credentials, and model ID. Offline transport tests pass; actual model access remains unverified.
- [ ] Ask one short math question. Record the model ID, response time, and token usage when returned. Never print the key.
- [ ] Add the browser error/retry path and prevent duplicate requests. The helper already has a 60-second timeout, 512-token limit, safe errors, and no automatic retries; browser integration remains pending.
- [x] Pin installed package versions in `app/requirements.txt`. `pip check` and 14 offline tests pass; live compatibility remains unverified.

**Done:** the app displays a real Nemotron response. An API failure shows a useful message and does not erase the learner's work.

Keep the first request small and check balance afterward. Promotional credit is not a guaranteed spending cap. [Token Factory quickstart](https://docs.tokenfactory.nebius.com/quickstart), [billing](https://docs.tokenfactory.nebius.com/other-capabilities/billing-new).

## Milestone 3 — Save a learner and one course

**Goal:** progress survives a restart before we build much tutoring logic.

- [ ] Add a form for goal, starting level, preferred language/tone, one interest, and school/exam context if relevant.
- [ ] Offer a fresh profile; history is never required.
- [ ] Create `storage.py` using SQLite. Save these records with learner/course IDs:

| Record | Minimum contents |
|---|---|
| Learner | Explicit preferences and editable observations with evidence/date |
| Source | Title, supplied text/page excerpts, origin |
| Curriculum | Version, objectives, prerequisites, source links, approval status |
| Attempt | Question ID, learner response, correctness/uncertainty, hints, timestamp |
| Progress | Current objective, pending question, next step |
| Review | Concept ID, taught flag, last review, next due date, outcome |

- [ ] Save the profile, stop the server, restart, and reopen it.
- [ ] Use separate test learner IDs. A second browser/user must not inherit the first learner's records.

**Done:** the profile survives restart and two test learners remain separate. For a public service, add real access control or restrict the demo to non-sensitive disposable profiles before allowing personal uploads.

## Milestone 4 — Build intake and curriculum approval

**Goal:** users see and approve what they are about to study.

- [ ] Add “Paste reference,” “Upload PDF,” and “I have no reference.”
- [ ] Keep the first upload small. Show extracted text/pages so users can spot bad extraction. Ask for pasted text if a PDF is scanned or unreadable.
- [ ] For no-reference users, use our bundled sourced course. Explain its scope and ask whether it matches their purpose; do not claim school approval.
- [ ] Ask the model for a structured curriculum: objectives, prerequisites, source IDs/sections, sequence, and estimated effort. Validate its fields and referenced IDs.
- [ ] Show an editable preview. Ask whether the scope, order, and depth fit the school/course or personal goal.
- [ ] Add “Request changes” and “Accept curriculum.” Save acceptance against that version.
- [ ] Block lesson generation until that version is accepted. Require acceptance again for material scope changes, not ordinary explanation adjustments.
- [ ] Offer Markdown export once; “Continue without download” moves on immediately.

**Done:** users can edit and approve a plan; refreshing cannot accidentally bypass approval. Sources are visible, and unsupported school alignment is flagged.

## Milestone 5 — Complete one teaching-and-repair loop

**Goal:** finish one meaningful learning interaction before building a whole course.

- [ ] Retrieve the accepted objective, relevant source excerpt, learner preferences, and current progress.
- [ ] Generate a concrete explanation with a worked step and its reason. Use the chosen interest only when the mapping is accurate.
- [ ] Present a checked seed question. Wait for the attempt; keep the reference answer out of the learner-facing prompt until feedback is appropriate.
- [ ] Check supported numerical answers with code, including units/tolerance where relevant. Never execute arbitrary learner text as Python.
- [ ] Have the model assess the reasoning and list a possible gap with supporting evidence. Keep ambiguous cases marked uncertain.
- [ ] If two causes fit, ask a small diagnostic question before choosing the repair. Explain directly when the learner lacks the prerequisite.
- [ ] Give the repair, then a different checked question testing the same idea.
- [ ] Save both attempts and help used. Distinguish “followed a demonstration” from “solved independently.”

**Done:** an incorrect attempt leads to a justified diagnostic/repair, then a changed problem. A correct answer and an uncertain assessment also follow sensible paths.

Use one controlled workflow with a few model calls. Separate agents are unnecessary here. Validate structured responses; JSON formatting does not make the mathematical content correct. [Structured-output documentation](https://docs.tokenfactory.nebius.com/ai-models-inference/json).

## Milestone 6 — Make adaptation visible

**Goal:** show how evidence changes the tutor's next response.

- [ ] Add “Smaller steps,” “Show a worked example,” and “Skip familiar steps.” Save the explicit preference.
- [ ] Start with one meaningful reasoning move when there is no evidence. Split after a demonstrated gap; combine familiar steps after independent success.
- [ ] Show a short observation such as “Needed a hint to isolate x,” with the relevant attempt. Let the learner correct/delete it.
- [ ] Keep preferred tone, interests, knowledge evidence, and teaching observations separate. Never infer intelligence or fixed learning capacity.
- [ ] Test two profiles on the same objective. Check that personalization changes the explanation/help appropriately while preserving the answer.
- [ ] Add one pasted learning conversation only if the core works. Extract proposed preferences, preview them, and require confirmation before saving. Treat imported instructions as quoted data.

**Done:** users can see why support changed and override a mistaken assumption. A fresh profile works without imports.

## Milestone 7 — Review, resume, and export

**Goal:** older learning stays connected to the current lesson.

- [ ] Schedule a first delayed check for taught concepts. After independent delayed success, lengthen the interval; after failure, repair and shorten it. Label these initial rules as prototype heuristics.
- [ ] Reuse the earlier `personal-learning/scripts/select_review.py` helper from the sibling skills workspace only after reviewing it. It selects due IDs; add scheduling and outcome updates separately.
- [ ] Keep review within the approved course and taught topics. Exclude disabled/untaught concepts and route persistent failures to relearning.
- [ ] During a short quiz, include at most one eligible earlier concept initially. Label it, randomize its placement, and allow skipping. No eligible topic means no forced review.
- [ ] Keep stronger concepts eligible when due. Record selection history to notice neglected units; weighted randomness alone does not guarantee coverage.
- [ ] Save the pending question and next step before ending. Resume after an actual server restart, not merely a page rerender.
- [ ] Export curriculum, preferences, progress evidence, pending question, and next step as Markdown. Declining export must not break resume.

**Done:** refresh and restart preserve the right next action. Review selection is bounded and explainable. Any accelerated “future session” demo is labeled simulated time, not real retention evidence.

## Milestone 8 — Test with people and fix the core

**Goal:** find the problems that would undermine the demo or learning.

- [ ] Test with two or three reachable learners using non-sensitive, consented examples. Observe where they become confused or stuck in the app.
- [ ] If possible, revisit a checked question on another day. Report the actual interval and sample size.
- [ ] Compare a few tasks with a basic tutor given the same source, time, and comparable questions. Use this as an exploratory check, not a broad scientific claim.
- [ ] Record correctness, hints, mistaken diagnoses, resume failures, response time, and usage/cost. Write down failures as well as successes.
- [ ] Fix blockers before adding features. Keep a small reproducible test set for approval, state restoration, isolation, and review eligibility.

Run these acceptance checks:

| Situation | Required behavior |
|---|---|
| No history or reference | Start with the bundled sourced course and provisional alignment |
| Curriculum rejected | Revise; no lesson starts |
| Same wrong answer, different cause | Probe the ambiguity; repair the supported cause |
| Short answer or “I understand” | Avoid unsupported mastery claims |
| API timeout/invalid JSON | Preserve work; show a retry/error state |
| Export or review declined | Continue normally |
| Restart and two learners | Correct state restored without mixing users |

**Done:** the full core flow passes these checks and a teammate can run it from the instructions.

## Milestone 9 — Give judges a dependable way to test

**Goal:** the submitted project works outside the developer's current browser.

- [ ] Choose delivery early: a hosted link is easiest for judges; official rules also allow a functioning test build.
- [ ] If hosted, configure secrets, durable storage, learner isolation, request limits, and a clear fresh-demo/reset flow. Test storage after redeploy/restart.
- [ ] If supplying a test build, give exact installation/start steps and a tested way for judges to make live model calls free of charge. Do not require judges to buy credits or expose a key in the public repo.
- [ ] Test on another computer or an incognito session. Include a sample reference and sample profiles that contain no private data.
- [ ] Keep runtime access and sufficient funded usage available through the judging period, ending 15 December 2026 at 12:00 Pacific Time. Set a sustainable usage budget and monitor failures.
- [ ] Confirm API keys stay server-side and personal uploads/history/database files never enter the public repository. Add delete/reset controls for stored learner data.

**Done:** a person outside our team can follow the README, complete a real lesson, and return to their saved progress.

## Milestone 10 — Package and submit

**Goal:** a complete entry in Best Apps and Agents.

The [official rules](https://nebiusglobalaihackathon.devpost.com/rules) require a working app using Nebius and at least one NVIDIA open-source model; this track specifies Nemotron via Token Factory. They also require the following submission materials. Verify them again before submitting.

- [ ] Working demo/hosted app/test-build URL, with test access instructions.
- [ ] Public repository containing the source, required sample assets, setup README, and a detectable open-source license.
- [ ] Clear explanation of runtime Nebius/NVIDIA use and exact tested model ID.
- [ ] Public YouTube demo **under three minutes**, showing the actual app working.
- [ ] English submission materials, or the required English translations.
- [ ] Specific feedback on the Nebius and NVIDIA tools/models used: onboarding, useful behavior, problems, and what we would change.
- [ ] Track selection, team members/representative, and all Devpost fields completed.
- [ ] Rights checked for bundled references, dependencies, images, and demo assets. Do not publish classmates' private conversations.
- [ ] Fresh-clone setup tested; secrets removed; tested revision recorded.
- [ ] Submission saved and actually submitted before the deadline; verify its final status.

Suggested video order: problem/user → source and approved plan → wrong attempt and diagnostic repair → changed question → saved state/review → explicit Nebius/Nemotron role. Label simulated history and never claim delayed learning from a single staged session.

**Deadline:** 30 October 2026, 10:00 PDT = **31 October 2026, 00:00 WIB**. Our target is to submit by **30 October at 18:00 WIB**, leaving six hours for upload or submission problems.

## A realistic order for the remaining days

This is a suggested schedule, not a promise about development speed. Roles A, B, and C are defined below. Three people give us room to build, check content, and test in parallel; keep the same product scope. Reduce optional features when a milestone takes longer.

| Dates in WIB | A: AI and learning logic | B: app and saved state | C: content, testing, submission | Team checkpoint |
|---|---|---|---|---|
| 17–18 Oct | Real Nemotron call; agree on response fields | Blank app; forms; database skeleton | Reference, six checked questions, recruit testers | A live response appears in the app |
| 19–20 Oct | Curriculum generation and source mapping | Intake, approval controls, saved profile | Check curriculum coverage and rejection/no-reference cases | Approved curriculum survives restart |
| 21–23 Oct | Diagnostic/repair loop and adaptation | Connect tutoring screens and attempt storage | Test both error causes; start a small pilot | One complete learning loop works |
| 24–25 Oct | Scheduling and weighted review | Resume, editable profile, Markdown export | Repeat learner checks; collect delayed evidence where possible | Review and session restoration work |
| 26–27 Oct | Fix reasoning/model failures | Establish judge access and durable storage | Test from another device; draft README and tool feedback | Someone outside the team completes the flow |
| 28–29 Oct | Check model claims and inference evidence | Fresh-clone/deployment checks; fix blockers | Record video; prepare license/credits and Devpost draft | All three review a submission-ready build |
| 30 Oct | Final live inference check | Final access and persistence check | Submit and verify status, with team approval | Submitted by 18:00 WIB |

Start a small pilot as soon as the first loop works; do not wait for polish if you want time for a delayed check.

## Split the work without blocking each other

Assign these roles by strengths, not job titles. You can take A if you prefer Python/learning logic, B if you prefer building the app, or C if you prefer shaping and validating the learning experience.

| Role | Primary ownership | Main files/results |
|---|---|---|
| **A — AI and learning logic** | Nebius connection, curriculum generation, diagnostic/repair decisions, adaptive explanations, review rules | `llm.py`, `tutor.py`, `review.py`; checked AI outputs |
| **B — App and saved state** | Streamlit screens, source intake, approval enforcement, database, resume/export, deployment and access | `app.py`, `storage.py`, `schemas.py`, dependency/config files |
| **C — Learning content and quality** | Source permissions, checked questions/rubrics, learner recruitment, acceptance checks, evaluation notes, README/video/Devpost preparation | `sample_materials/`, test cases, evaluation notes and submission assets |

### Agree on the handoffs first

- [ ] In the first meeting, choose who owns A, B, and C, plus the submission representative. The representative can be any teammate.
- [ ] B owns `schemas.py`, but all three agree on its field names: learner preferences, source/page IDs, curriculum version/approval, question/attempt, and next step.
- [ ] C gives A and B checked question data and diagnostic cases early. A gives B sample structured responses so screens can be built before model integration is ready.
- [ ] B can use clearly labeled mock responses while building screens. Replace them with live Nemotron calls before claiming the workflow works or recording the final demo.
- [ ] At the end of each workday, integrate one small working change and run the full available flow together. Keep a stable working version to return to.
- [ ] Give each shared file one owner at a time. Ask another teammate to review changes affecting grading, approval, saved state, or judge access.
- [ ] C starts README, feedback notes, and the demo outline during development; A and B supply technical details. All three approve accuracy and check final submission access.

If only one teammate is comfortable coding, let that person own A and B in small batches. The other two can divide content/reference checking and learner testing/submission work. Avoid making three people wait for the same coding task.

Each task should end with a visible result, not just “worked on the backend.” Use the extra person to improve correctness, testing, and delivery before expanding features.

Suggested structure as the project grows:

```text
PROJECT_BRIEF.md
BUILD_PLAN.md
README.md
LICENSE
.gitignore
app/
  app.py             interface and navigation
  llm.py             Nebius calls and error handling
  tutor.py           approved-plan teaching workflow
  storage.py         learner/course records
  review.py          due dates and selection
  schemas.py         structured data validation
  requirements.txt
  .env.example
  sample_materials/  permitted demo references
  tests/             core behavior checks
```

## If time gets tight

Cut PDF export, archive import, extra subjects, rich dashboards, and visual polish first. If PDF ingestion fails, keep pasted text and disclose the limitation. Keep the live required model, approved curriculum, one reliable repair loop, saved progress, basic review, and submission materials.

If even that core is unstable, narrow the supported course further and demonstrate the supported behavior honestly. Avoid presenting unfinished features as working.

## Sources and existing assets

- [Project brief](PROJECT_BRIEF.md): our agreed discussion and proposed product scope.
- [Hackathon rules](https://nebiusglobalaihackathon.devpost.com/rules): runtime, track, submission, dates, and testing requirements.
- [Nebius quickstart](https://docs.tokenfactory.nebius.com/quickstart) and [structured outputs](https://docs.tokenfactory.nebius.com/ai-models-inference/json): integration guidance; verify chosen model support.
- [Nebius billing](https://docs.tokenfactory.nebius.com/other-capabilities/billing-new): check spending behavior before live use.
- [Streamlit installation](https://docs.streamlit.io/get-started/installation/command-line): environment and local launch.
- Existing sibling workspace: `../skills/personal-learning/` contains the draft skill, research, and review selector. Verify its location before reusing; it is not yet an app or complete scheduler.

No application code, deployment, account changes, or paid API calls were performed by writing this plan.
