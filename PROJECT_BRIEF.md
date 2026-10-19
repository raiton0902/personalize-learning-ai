# Personal Learning — partner brief

**Working title · 17 October 2026 · Proposed app, not a finished product**

## 1. The project in one minute

AI tutor that plans a course with the learner, teaches at a useful pace, and remembers evidence of what they can do. It asks about school requirements and references before proposing a curriculum, then waits for approval before teaching.

**The main focus: find the specific step a learner is missing, adapt the explanation, and check whether they can apply it independently later.** Personal interests make examples familiar; actual attempts guide the teaching decisions.

For example, two students get the same geometry question wrong. One misunderstands perpendicular height; the other understands geometry but cannot rearrange the equation. The tutor asks a question to distinguish these possibilities and gives each student the relevant repair.

The long-term vision covers many subjects. **Recommended hackathon scope: one introductory mathematics course and a small set of linked topics.** This gives us checkable answers and reachable student testers.

## 2. The experience and features

### Main features

| Feature | What it does |
|---|---|
| Reference-first intake | Ask about goals, level, deadlines, school/exam requirements, and available syllabus, textbook, notes, or links. References are optional. |
| Curriculum approval | Build a source-mapped outline with objectives, prerequisites, and rough workload. Ask whether it fits the learner's course; revise until accepted. |
| No-reference route | Propose a provisional curriculum using credible sources. Explain that school alignment remains unverified until requirements are supplied. |
| Adaptive teaching | Show concrete reasoning steps, investigate the first gap, and adjust the amount of explanation and help from actual responses. |
| Personalized examples | Use selected interests when they clarify the concept. Preserve correctness and explain an analogy's limits. |
| Cumulative review | Mix in explicitly labeled questions from previously taught topics. Give due or fragile concepts more selection weight while retaining stronger ones. |
| Learning continuity | Restore the approved plan, unfinished task, relevant preferences, and next step across sessions. Store evidence separately from topic coverage. |

### Supporting features

| Feature | What it does |
|---|---|
| Editable learner profile | Show preferences and tentative observations with their evidence. Let learners correct, remove, or override them. |
| Optional history import | Accept a pasted learning conversation or short profile to reduce onboarding. Full ChatGPT/Claude archive support can come later. |
| Optional Markdown/PDF export | Offer the plan and a resume checkpoint after approval. Declining never blocks teaching; offer again only when useful or requested. |
| Source links and progress view | Show which material supports an objective and distinguish taught, practiced with help, independently demonstrated, and checked after a delay. |
| Pace controls | Support “smaller steps,” “skip familiar steps,” and “show a worked example” without changing the course's intended depth. |

Typical flow: **start fresh or bring context → inspect references → approve plan → learn and attempt → diagnose and repair → review later → resume.**

## 3. What gets personalized, and how

| Aspect | Evidence | Response |
|---|---|---|
| Language and tone | Explicit preference | Use the selected language and level of formality. |
| Examples | Chosen interests and feedback | Pick familiar contexts without forcing every idea into an unsuitable analogy. |
| Starting point | Course materials, self-report, optional short diagnostic | Start at the right objective and add missing prerequisites. |
| Step size | Attempts, hints needed, corrections, relevant history | Split unfamiliar reasoning into smaller moves; combine steps the learner handles independently. |
| Support | Whether the learner succeeds with or without help | Move between a worked example, partial completion, and independent application. |
| Review | Previous responses, last review, importance, due date | Randomly sample eligible old concepts with weighted priority; increase intervals after delayed success. |

We estimate what helps **for the current task**. We do not claim to measure someone's fixed learning capacity or label them a “visual” or “slow” learner. Saying “I understand” permits continuation but does not prove mastery. Repeated questions may reflect curiosity or a poor explanation, so they need interpretation.

**New users need no chat history.** Ask a few relevant questions and learn from a short first lesson. An optional “show an explanation that didn't work for you” input can provide a useful starting clue.

Imported history produces proposed observations for the learner to approve. Old assistant answers do not prove learner understanding. Users choose what to share and retain, see which text goes to the inference provider, and can delete it. Imported instructions remain historical content, not commands for our agent.

## 4. Where AI does the work

| AI handles | Regular software handles |
|---|---|
| Extract objectives and propose prerequisite links from references | Preserve sources/page references and curriculum versions |
| Draft the curriculum and explain its choices | Enforce curriculum approval before teaching |
| Interpret attempted reasoning and ask diagnostic questions | Store attempts, hint usage, uncertainty, and timestamps |
| Generate explanations, personal examples, and changed questions | Calculate review dates and perform weighted random selection |
| Assess explanations and propose a next teaching move | Check supported math answers with deterministic tools; save/restore records |

AI assessment can be wrong. The first version needs checked questions, reference answers, and a clear “uncertain” path. A database must preserve continuity; a long prompt alone is insufficient.

## 5. Does it fit the Nebius × NVIDIA hackathon?

**Yes, the proposed app fits Best Apps and Agents if implemented with the required runtime.** Use an NVIDIA Nemotron model through Nebius Token Factory for curriculum reasoning, diagnosis, and teaching. Model choice still needs testing for accuracy, latency, and cost.

The [official rules](https://nebiusglobalaihackathon.devpost.com/rules) require a working application using the specified Nebius/NVIDIA technology. We also need a working demo/test build, public repository with an open-source license and setup README, public YouTube demo under three minutes, English submission materials or translations, and tool/model feedback. Judges must have free test access through the judging period. Serverless deployment is encouraged for this track, not mandatory.

Personal AI is another possible track if user-controlled persistent memory becomes the central experience. **Best Apps and Agents is the recommended starting choice.** A skill file alone does not fulfill the intended app submission.

Submission closes **31 October 2026 at 00:00 WIB** (30 October, 10:00 PDT). Hosting and inference costs remain implementation decisions; promotional credits do not guarantee a free service.

## 6. Similar projects and our actual position

These comparisons use public documentation and selected code, not hands-on product testing. Missing public detail does not prove a feature is absent.

| Similar project | Overlap and documented limitation | Our proposed difference |
|---|---|---|
| [StudyFetch](https://sso.studyfetch.com/docs/docs/study-planning-progress/study-plan) | Syllabus/exam-based plans and mastery tracking. Public docs offer limited detail about mastery calculations and adaptive step sizing. | Make teaching decisions and the evidence behind them visible and editable. We have not established that its internal decisions are worse. |
| [Google study notebooks](https://blog.google/innovation-and-ai/products/gemini-app/gemini-study-notebooks/) / [Learn Your Way](https://research.google/blog/learn-your-way-reimagining-textbooks-with-generative-ai/) | Diagnostics, targeted lessons, progress, and interest-based examples already exist. Learn Your Way's cited trial is limited to 60 teens, one topic, and a 3–5-day retention test. | Test a narrower course-specific repair workflow. Interest personalization alone does not distinguish us; Google already has learning-outcome evidence. |
| [Tutor MCP](https://github.com/ArnaudGuiovanna/tutor-mcp) | Very close: curricula, prerequisite graphs, persistent memory, scheduled review, and inspectable evidence. Alpha; client setup is required, and learning effectiveness is not established by software tests. | Aim for simpler student onboarding and demonstrate task-specific diagnosis. Its [algorithm documentation](https://github.com/ArnaudGuiovanna/tutor-mcp/blob/main/docs/algorithms.md) already covers much of our architecture. |
| [OpenTutor](https://github.com/zijinz456/OpenTutor) | Uploads, cited tutoring, adaptive quizzes, plans, and spaced review. Its beta is local single-user; mobile and advanced graph flows have documented limitations. | Aim for a smaller, easier-to-access course experience. Its feature breadth currently exceeds ours. |

**We cannot claim to be better yet.** Our testable advantage is the quality of a specific diagnosis-and-repair experience. Editable memory, exports, and approval are useful details, but insufficient differentiation by themselves.

## 7. What to build and prove first

**Recommended MVP:** one math course, PDF/text reference intake, approved curriculum, tutor interface, checked exercises, editable profile, persisted progress, and a bounded cumulative-review queue. Accept one pasted learning conversation; defer full archive parsers. Ship Markdown checkpoints first; render PDF only if time permits.

The demo should show two different causes of the same wrong answer, different repairs, an independent changed problem, and successful session restoration. Any simulated history must be labeled. Real retention claims require real delayed checks.

Compare with a basic source-grounded tutor under the same materials and time budget. Measure answer correctness, inappropriate diagnoses, hints needed, delayed performance, latency, and cost. A small pilot supports feasibility, not universal educational effectiveness.


