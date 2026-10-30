# UI feature provenance and adoption decisions

## Current handoff — 2026-10-30.15 (30 October 2026)

Reviewed for revision 2026-10-30.15 (OWNER request for free zero-rewrite Python deployment via Hugging Face Spaces Docker + Private HF Dataset SQLite sync). Added `Dockerfile`, `.dockerignore`, `app/hf_persistence.py`, `app/tests/test_hf_persistence.py` and `docs/INTEGRATION.md` guidance without altering any UI design, visual assets or P01–P35 provenance decisions; no substantive update needed. Verification in CHANGELOG.

## Current handoff — 2026-10-30.14 (30 October 2026)

OWNER Plan/P32/V08: following the supplied bug brief, replace orphan full-size plan outcomes with compact 13px bullet targets after scope; use matching bullets inside module lesson cards. Retain rich Markdown/math rendering and apply identically to ordinary and Cramming plans. No new visual direction or dependency. The owner's language correction explicitly permits one structure-preserving, budget-controlled repair for a drifted non-bundled proposal; country/culture subject matter must not change instruction language. Other provenance reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.13 (30 October 2026)

OWNER P32: selected explicit existing lesson module as the deterministic authority when generated module lists disagree, while retaining rejection of ambiguous cases. This corrects plan handling only; design/source provenance otherwise reviewed unchanged. Verification in CHANGELOG.

## Current handoff — 2026-10-30.12 (30 October 2026)

OWNER/P28: translucent blurred workspace header replaces the opaque strip that hid the notebook background. The existing book and sidebar-cover behavior are unchanged. Other provenance reviewed; verification in CHANGELOG.

## Current handoff — 2026-10-30.11 (30 October 2026)

OWNER/P28: following the approved concept, the favicon uses an icy-blue outlined transparent book with crimson mathematical italic x/y. The existing Hairline notebook is enlarged behind the signed-in workspace, with stronger blur and lower opacity in learning views; sidebars cover it. The final SVG is simplified from the generated preview for tab-size readability. This explicitly supersedes the earlier guest-only animation decision; other provenance reviewed unchanged. Verification in CHANGELOG.

## Current handoff — 2026-10-30.10 (30 October 2026)

OWNER V03/P22: requested hover feedback across the app's buttons. Shared subtle brightness/boundary feedback fills missing states without displacing upload/submit icons or the centered X; language retains its prior arrow-only exception. Other provenance reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.9 (30 October 2026)

OWNER UI-H/U05: added restrained hover feedback to the three standard suggestion buttons, with static reduced-motion feedback. Other provenance reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.8 (30 October 2026)

OWNER UI-H17/P33: the second Cramming suggestion now refers to a presentation this morning. Other design provenance reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.7 (30 October 2026)

OWNER UI-H08/UI-H16–17/P24/P33: outlined ground-colored second composer layer, icy-blue person-icon Personalize pill and five suggestions in three-plus-two rows follow the supplied images. “Icy crimson” was interpreted as icy blue for Personalize. Other inspiration and existing behavior reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.6 (30 October 2026)

OWNER/P24/U07: icy blue replaces green on Save and positive feedback; crimson replaces orange on practice submission. The account avatar also uses blue. This supersedes earlier owner color choices; other source provenance and behaviors reviewed unchanged. Verification in CHANGELOG.

## Current handoff — 2026-10-30.5 (30 October 2026)

OWNER/P33/UI-H16: Cramming toggle sizing now follows Personalize's desktop height and approximates its width; phone controls retain 44px height. Existing crimson/animation provenance and all other design decisions reviewed unchanged. Verification is recorded in CHANGELOG.

## Current handoff — 2026-10-30.4 (30 October 2026)

**OWNER/P32–P35/UI-H/UI-N/UI-P/U05/U19/U20–U23:** the latest four-part brief replaces track selection/manual extension controls with one complete progressive curriculum, adds exam-focused Cramming, draggable/keyboard panels and subject-plus-specificity matching. Full standard paths are3–5 modules/6–18 objectives; old saved courses remain unchanged. Prior .12 track-card adoption is historical, not the current UI.

P33 adapts the existing owner-selected Hairline notebook crimson exactly (#ed3e65/#b41f43), rather than a new competitor palette. Cramming toggle/starter, short activation ring and2.2s perimeter feedback distinguish urgency; reduced motion removes it. Tint over the theme ground preserves text contrast. P34 adds familiar native separator/arrow/reset behavior and local width preferences without changing the underlying sidebar content, font or disclosure contract. P35 uses deterministic framing/core/specificity parsing and conservative typo matching; it is not a claim of AI semantic understanding. P32 retains Coursera-inspired progression only, with no copied branding/content or mastery guarantee.

Awwwards/Apple/antislop building direction remains the existing calm workspace, with extra motion confined to the explicitly requested Cramming state. No new visual engine, dependency, external research or paid service. Verified offline with203 pytest passes (115.80s), including12 guest/auth cases,4 new Cramming/resizer/theme/viewport cases, existing axe/regression checks and visual review of synthetic captures. Other source attribution/rejected patterns and PREVIEW/LEGACY boundaries reviewed unchanged. Real model quality/OAuth consent/transcription remain unverified.

## Current handoff — 2026-10-30.3 (30 October 2026)

OWNER/P32/UI-A/H: repeated feature brief was rechecked against the existing implementation. Guest-auth cancellation now removes a cleared goal from both pending stores; browser regression reproduced the defect before correction. Existing three-track adaptation, editable intake and extension were reverified without redesign or new source/inspiration claims. Awwwards/Apple restraint and Karpathy surgical-change guidance retain the current UI. Other provenance, rejected patterns and preview/legacy boundaries reviewed unchanged.24 offline tests passed, including12 browser scenarios plus four cancellation cases; no external research, paid inference or real OAuth consent test.

## Current handoff — 2026-10-30.2 (30 October 2026)

The three continuation documents now live together in root `handoff/`. Links and AGENTS.md were updated. Design/source provenance reviewed; no semantic change.

## Current handoff — 2026-10-30.1 (30 October 2026)

OWNER reported selected-track rejection. A reproduced normalization bug collapsed valid module-level membership into the last module. Backend grouping is corrected without loosening track bounds; conflicting mappings still fail. No design/inspiration/source changes; remaining provenance and preview decisions reviewed unchanged. Reproduction uses synthetic responses, not the owner's actual provider output. Verification in CHANGELOG.

## Current handoff — 2026-10-29.12 (29 October 2026)

**OWNER / P32 / UI-A/H / U04/U19/U20:** supplied brief requests guest-to-auth submission continuity, editable prompt-derived intake and three depth choices with later extension. The three-card progression is Coursera-inspired as specified by the owner; no Coursera site measurement, copied branding, curriculum content, quality guarantee or external research is claimed. Full path is bounded at24 lessons by the existing schema. Beginner coverage and extension preview remain distinct from mastery.

S-KARPATHY adaptation: deterministic clause prefill avoids an additional paid extraction call; strict track validation reuses schemas; extension reuses candidate approval and deduplication instead of a separate persistence service. Old objectives/progress remain explicit and testable. UI retains V01–V03/V09 theme/type/focus/target rules, original math and guest-only motion; all other source/rejection/PREVIEW/LEGACY decisions reviewed unchanged.

LIVE implementation with offline synthetic evidence only: [feature verification](../docs/qa/2026-10-29-learning-tracks.md), CHANGELOG. OAuth-return simulation is not real Google consent; no live Nebius result, provider rate or advanced-learning outcome is claimed. Other provenance unchanged.

**Latest synchronization 2026-10-29.11, plan dialog:** OWNER correction aligns revision button with Close; other provenance unchanged.

**Latest synchronization 2026-10-29.10, plan numbering:** OWNER correction removes duplicate numbers from plan/revision display; other provenance unchanged.

**Latest synchronization 2026-10-29.9, learning/source and review:** OWNER removed the course/source breadcrumb and reported NO_SOLUTION. Existing saved placeholder displays unavailable and practice prompt discourages it; cause unverified. Other design provenance reviewed unchanged.

**Latest synchronization 2026-10-29.8, learning header:** OWNER removed the duplicate top-bar course title; other visual/source provenance reviewed unchanged.

**Latest synchronization 2026-10-29.7, practice/help:** OWNER requested removal of redundant I need a hint control; existing Need help? retained. Other overlapping shortcuts documented in CHANGELOG; visual/source provenance reviewed unchanged.

**Latest synchronization 2026-10-29.6, budget:** OWNER explicitly requested$1 app allowance; local default changed and launch pinned to1. No visual/source attribution changes; remaining provenance reviewed unchanged.

**Latest synchronization 2026-10-29.5, API-ERROR:** owner length-error report prompted higher4096-token ceilings for assessment/diagnostic/repair/practice. No visual/source-provenance changes; all other adaptation decisions reviewed unchanged.

**Latest synchronization 2026-10-29.4, Activity/API-ERROR:** OWNER equal-height date/action alignment implemented. Explicit local routing override uses main model for this server run; no inference claim. Other source/design provenance reviewed unchanged.

**Latest synchronization: 2026-10-29.3, UI-Library/Activity/V01/P31.** OWNER supplied ChatGPT Library screenshot adopted for toolbar placement, rounded file cards and grid/list views. Existing app categories retained; unsupported competitor features omitted. Theme canvas and duplicate header corrected. Source attribution and other backend/provenance records reviewed unchanged; provider 404 is not claimed resolved.

**Latest synchronization: 2026-10-29.2 (29 October 2026), UI-04/V03/P31.** OWNER screenshot correction removes blue field outlines across the integrated UI; neutral field boundaries and grey keyboard-control focus replace the earlier blue treatment. Inspiration and backend provenance reviewed unchanged.

**Handoff revision:** 2026-10-29.1. **Research observations:** 26–27 October 2026; original integration of `P01`–`P09`, `P11`–`P24`, and `P26`–`P32` completed on 28 October, with owner-requested QA/UI corrections on 29 October. **Role:** explain where each design/feature came from, how it was adapted, what was rejected and where implementation lives.

## Current owner correction provenance — 2026-10-29.1

**OWNER:** the QA-01–QA-06 / UI-01–UI-08 implementation brief directs these changes; no new competitor research or attribution is claimed. P23/P31 and V01/V03/V04/V09 retain the familiar shell, true-black/Inter palette, one material and attached composer/divider. Both-theme contrast/borders, keyboard focus, notebook image semantics, touch typography/targets and the `View lesson` repair disclosure are accessibility and viewport corrections to that design, not a new visual direction. Hairline figure, Times New Roman lining math/shared baseline, crimson mark, orange Submit, green Save and text cues are preserved.

P32 / UI-H/UI-R/Library/Activity/API-ERROR adaptations now keep intake fields editable, show truthful draft/activity states, refresh Library after preview close, expose errors inside dialogs, and synchronize history/menu interactions. Concise direct-answer instructions/schema and incomplete-output rejection implement the requested brevity/safe-failure behavior. Route syntax validation preserves the existing no-retry/no-fallback decision; it does not establish strong-model entitlement.

**LIVE code / FIXTURE evidence:** [fix report](../.ui_review/2026-10-29-fixes/report.md), final test and contrast/axe artifacts; no live provider, OAuth or transcription claim. Reviewed all other P/U/V source evidence and rejected patterns: no substantive changes. Existing PREVIEW examples remain separate; U10 PENDING, U17–U18 DEFERRED and LEGACY Streamlit remain unchanged. Three-file synchronization revision/date: 2026-10-29.1 / 29 October 2026.

Read with [CURRENT_ARCHITECTURE.md](CURRENT_ARCHITECTURE.md) and [UNREALIZED_CHANGES.md](UNREALIZED_CHANGES.md). Those two files define actual implementation and the exact desired reproduction/backend contract. Source inspiration never overrides the owner's later corrections.

## 0. Evidence language and maintenance

- **OWNER:** direct owner request or annotated correction in this project. Takes precedence over competitor conventions.
- **O:** interface observed during dated browser inspection. Says nothing about an untested model/backend.
- **D:** official documentation/product/submission description. A claim about a feature, not independently measured quality.
- **C:** current local code. Does not imply fresh live-provider testing.
- **P:** our own proposal/adaptation. Pixel sizes and timings are our specifications unless explicitly identified as measured.

“Inspired by” means interaction structure or task organization, not copied branding, assets, proprietary fonts or backend code. Similarity does not prove originality or learning effectiveness. This register is historical evidence; recheck external sites before making new current-availability/pricing claims.

Every future code-change task must read these three handoff files first, inspect the real source, then update all three synchronization records. Change substantive content only where facts/requirements/provenance changed; otherwise explicitly record “reviewed; no semantic change” with reason. Add a chronological CHANGELOG entry. The owner's new instruction is also stored in root `AGENTS.md` so future agents see it before coding.

## 1. Source register

| Source ID | Platform/source | Evidence and boundary |
|---|---|---|
| S-OWNER | Owner's requests and annotated screenshots in this project | Exact shell familiarity, black/icy-blue/crimson, free-text panel, Enter behavior, motion exclusions, quiet saving, export popover and math alignment. These are requirements, not competitor discoveries. |
| S-CODEX | Owner-provided Codex sidebar screenshot | Folder/course hierarchy, child questions, left rail and bottom account familiarity. No proprietary font/icon package was copied. |
| S-GPT | [ChatGPT](https://chatgpt.com/); [OpenAI error guidance](https://help.openai.com/en/articles/7996703-troubleshooting-chatgpt-error-messages) | O: blank/typed composer, attachment menu, collapsed navigation. D: response/network/download error distinctions. No prompt sent during research; exact generated wait/error animation untested. |
| S-CLAUDE | [Claude](https://claude.ai/); [file upload help](https://support.claude.com/en/articles/8241126-upload-files-to-claude); [extended-thinking help](https://support.anthropic.com/en/articles/10574485-using-extended-thinking) | O: compact attachment/options menus and composer controls. D: processing versus optional thinking presentation. Do not copy proprietary `anthropic-sans` or claim our provider exposes Claude-style summaries. |
| S-STUDIO | [AI Studio](https://aistudio.google.com/); [quickstart](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart); [troubleshooting](https://ai.google.dev/gemini-api/docs/troubleshoot-ai-studio) | O: separable right settings, modality choices, selected context chip, disabled empty Run. No key access or prompt run. |
| S-NOTEBOOK | [Notebook entry](https://notebook.google.com/); [source-based chat help](https://support.google.com/gemininotebook/answer/16179559?hl=en); [source discovery](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-discover-sources/) | O: public featured notebook Sources/Chat/Studio; this session redirected to Gemini Notebook branding. D: citations/source navigation. No private notebook content copied, no source selection changed or question submitted. |
| S-STITCH | [Stitch](https://stitch.withgoogle.com/); [design canvas media](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/); [updates](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/) | Live entry remained blank. Working-canvas/alternatives conclusions are D only. Do not attribute a measured spinner or error pattern to the blank page. |
| S-QAI | [Q-AI submission](https://lablab.ai/ai-hackathons/internet-of-agents/q-ai/q-ai-ai-platform-for-generating-data-sets); [public demo](https://qaigenerate.vercel.app/); [Nebius event record](https://github.com/nebius/token-factory-cookbook/blob/main/community/events.md) | O: workflow, upload and output-choice screens. Earlier Nebius-sponsored prize, not a winner of the then-current Global AI Hackathon. No Start AI Analysis or private upload. Demo may differ from judged version. |
| S-SYNTH | [SynthesisOS submission](https://devpost.com/software/synthesisos-qk04dt); [public demo](https://synthesisos.vercel.app/) | O: example prompts and deterministic demo. D: product history/audit description. Not evidence of live model quality or populated audit data. |
| S-DELIVERY | [Delivery Tracker submission](https://devpost.com/software/delivery-tracker) | D: evidence-backed refusal/uncertainty principle. Direct browser security gate prevented visual inspection; no screenshot/button design is attributed to it. |
| S-THETA | [Thetawave dashboard](https://thetawave.ai/id/app/dashboard), [Study](https://thetawave.ai/id/app/feed), [Sources](https://thetawave.ai/id/app/sources), [Notes](https://thetawave.ai/id/app/notes) | O: capture, scope, library/source controls, first two Study setup steps and account-specific subscription interruption. No new generation/upload/recording/trial. Existing note opened; private contents excluded. |
| S-THETA-D | [Study assistant](https://thetawave.ai/feature/ai-study-assistant), [exam generator](https://thetawave.ai/feature/exam-generator), [quiz maker](https://thetawave.ai/feature/quiz-maker), [flashcards](https://thetawave.ai/feature/flashcard-maker) | D: advertised study outputs, adaptive/exam progress. Full tool quality, retention and source fidelity untested. Do not call these missing from the competitor. |
| S-UPM | Local `C:/Users/raito/.codex/skills/ui-ux-pro-max/SKILL.md` | Design guidance for focus, contrast, hit targets, error placement, navigation and motion. It is not user research or proof of conversion/learning gains. |
| S-APPLE | Local `C:/Users/raito/.codex/skills/apple-design/SKILL.md` | Interruptibility, spatial continuity, immediate press feedback, restrained motion. Owner's requested280ms ease remains; not a claim that we implemented full Apple spring physics. |
| S-AWWWARDS | Local `C:/Users/raito/.codex/skills/awwwards/SKILL.md` | Specific concept, typographic craft, responsive visual review and meaningful signature. No award score or production performance certification. |
| S-KARPATHY | Local `C:/Users/raito/.codex/skills/karpathy-guidelines/SKILL.md` | Minimal scope, surgical changes, explicit assumptions, verifiable acceptance. No automatic new feature requirement. |
| S-HAIRLINE | Owner-invoked local `hairline-adopt` / `hairline-create` skills; checked-in `app/web/hairline-kernel.js`, `notebook.js`, `folder.js` | Pointer-responsive line-figure technique used for guest notebook and folder figures. The code, licenses and actual runtime define the implementation; this is not a claim that the separate step-repair example contains the full guest scene. |
| S-PROPOSAL | Owner-provided [ui_improvement_proposal.md](../ui_improvement_proposal.md),28 October2026 | Prioritizes visible course-action waiting/error, source reuse/removal and state-specific emptiness. Its backend retry/deduplication choice and help/diagnosis proposals are deferred by the owner's latest frontend-only instruction. No new competitor observations. |
| S-PLEARN | Local `C:/Users/raito/.codex/skills/personal-learning/SKILL.md` (`references/continuity.md`, `references/review-policy.md`, `references/research.md`) | Defines compact intake, source-aware planning with grounding transparency, flexible `Course → Modules → Lessons → Concepts` hierarchy, explicit approval and candidate revision gating, adaptive step-size/support-level teaching, schema v2 continuity, bounded spaced review, and one-time checkpoint export offer. |

## 2. Adopted interface-pattern register

IDs P01–P31 are provenance IDs. U/V IDs link to exact pending/visual specifications in UNREALIZED_CHANGES; UI IDs refer to current architecture. LIVE versus PREVIEW must be checked there before implementing.

| ID | Feature/design | Origin and actual observation | Our adaptation / location | What is not copied; integration boundary |
|---|---|---|---|---|
| P01 | Familiar icon rail, history and account dock | S-OWNER/S-CODEX; general collapsed navigation also O in ChatGPT/Claude. | Home/Library/Activity rail, bottom account/theme, project/course rows and nested questions. Current UI-N; preview `index.html`, `renderHistory`. V02/U01/U08. | No Search rail duplicate, no extra Library/Activity rows below New learning, no proprietary font redistribution. |
| P02 | Composer plus-left/send-right | S-GPT O, S-CLAUDE O, owner up-arrow request. | Existing goal/question composers;44px primary submit with22px arrow in current app, comfortable touch targets in preview. V03/U01. | No unsupported voice button or competitor's smaller measured desktop target. |
| P03 | Small anchored icon/text attachment menu | S-GPT/S-CLAUDE O. | Plus opens file/link/existing-reference rows; one menu, full-row action, Escape/arrow keys/outside close. `openMenu`, `referenceMenu`. U05/V03. | No model/provider/connector options with no implementation. |
| P04 | Explicit selected-reference chip | S-STUDIO O selected context and remove affordance; S-NOTEBOOK O visible sources. | Filename/type chip with preview/remove; metadata preserved across goal edit. `paintReference`; UI-H10/UI-R. U05. | Removing chip does not delete stored resource; no invisible source addition. |
| P05 | Editable goal suggestions | S-SYNTH O example prompts; S-THETA O editable intent presets. | Three buttons fill and focus editable goal; no generation on selection. `renderHome`, `data-intent`. U05/V06. | No silent submit; no claim notes were read before selecting them. |
| P06 | Reusable source picker | S-THETA O choose existing notes/courses/folders with search/counts. | Smaller single-reference picker over account resources; selected fill/border/check; immediate apply with explicit explanatory copy. `chooseExisting`. U05. | Not a multi-source course/folder selection or new retrieval engine. Sample picker is not persistent integration. |
| P07 | Separate right settings panel | S-STUDIO O Run settings; S-NOTEBOOK O independent panel collapse; S-OWNER text-input requirement. | Existing learning-pattern panel, free-text fields, close/reopen, course/global scopes, starts closed in latest preview. U02/U07/V03. | Do not turn style/struggle into fixed dropdowns. No token/temperature/API-key controls in learner UI. |
| P08 | Scope visible beside learning/questions | S-NOTEBOOK O source context; S-THETA O all-notes versus note-side tutor. | Course/source context line and “Questions stay with this lesson”; saved thread scope label. `lessonContext`, `renderChat`. U08/V06. | No all-account-history scope; labels must equal actual backend input. View source is not a citation. |
| P09 | Docked Plan/Learn/Practice/Review strip | S-QAI O workflow crop, adapted to our existing tutor state machine. | Attached below course header, selected underline and lesson count. `stages`, `bindStages`, `learning.css`. U01/V02. | Earlier floating spacing was our prototype choice and was rejected by owner. Never enable invalid stage skips. |
| P10 | Compact lesson support actions | S-QAI O selected output choices; our tutor supplies learning semantics. | Earlier example Explain simply / Another example / Give me practice; current step-repair emphasizes one next action instead. U10/V05. | Not six fake output tools; real modes require generation contract. |
| P11 | Visible wrong-step repair | Our tutor's existing diagnostic/repair architecture + S-OWNER request for useful differentiation; S-THETA comparison motivated clarity, not a copied diagnosis view. | Highlight a specific operator, brief explanation, next-line form, changed practice. `renderLesson` in `concept.js`. U11/U12/U15. | Not a verified exclusive invention or demonstrated competitor absence. Never invent learner work in live app. |
| P12 | Honest independent/helped outcome | Our own P informed by S-DELIVERY D uncertainty/evidence principle and current tutor limits; S-THETA already overlaps in weak-topic practice. | Evidence rows, help-use label, explicit no-mastery caveat. `evidenceMarkup`. U13. | No arbitrary readiness/mastery score; prototype boolean is not durable evidence. |
| P13 | Correct a tentative observation | Our own P, grounded in tentative learning signals and learner agency; no competitor screenshot asserted. | That's not where I'm stuck opens focus choices; sample correction shown. `correctSignal`. U14. | Not a global profile diagnosis. Production needs sanitized observation/correction contract. |
| P14 | Search/category counts and precise empty states | S-THETA O source tabs/counts/library filters; S-UPM guidance; our correction of observed generic emptiness. | All/References/Notes counts, keyword no-match with Clear search. `renderLibrary`, `paintLibraryRows`. U06. | No embeddings, no full-library emptiness claim for an empty filter. |
| P15 | Activity date selection | S-OWNER explicitly requested calendar; not attributed to Thetawave. | Native date filter, All dates, course-linked event rows. Existing UI-T and preview `renderActivity`. U06. | Full historical search not implemented merely because a calendar exists. |
| P16 | Waiting at assistant answer position | S-GPT/S-CLAUDE D processing/recovery principles; local delayed fixture exposed our gaps; exact sizing is ours. |28px status row,8px dot/gap,13px label, local placement, static reduced-motion variant. `thinking`, `operationHTML`. U03/V07. | No claim exact competitor spinner/timing was observed; no private reasoning dump. |
| P17 | Recoverable pending/error turns | S-GPT D errors, S-STUDIO D error classification; our existing draft-failure fixture. | Keep pending user bubble, Retry/Edit beside failure, late result updates owner only. U03/U04. | Do not remove current lock before stale-response/deduplication safety. No blind POST retry. |
| P18 | Readable drop target/format errors | S-QAI O upload target; S-CLAUDE D upload grammar. | Smaller target inside existing intake, accepted formats and inline recovery. `showUpload`. U18/U20. | Competitor upload formats do not expand our parser/transcription capabilities. No simulated percentage sold as live progress. |
| P19 | Checkpoint download popover and type identity | S-OWNER explicitly requested upload-style menu and familiar PDF/Word/Markdown icons/colors. | One Download checkpoint as… trigger, above/anchored format options. `bindExport`; current UI-X. U09. | No native select always beside trigger; no replacing real exports with preview samples. |
| P20 | Quiet Save?/Saved + guarded close | S-OWNER direct iterative request. S-UPM supports predictable recovery; not claimed copied from another app. | Green dirty Save?, grey Saved, stacked Keep editing/Discard/Save. `guard`, `savePattern`, UI-P. U07. | No success-toast spam; no critic-suggested replacement of owner's Saved button. |
| P21 | Sidebar entry/exit continuity | S-OWNER requested ease in/out; S-APPLE principles for reversal/current presentation. |280ms ease-in-out transform, same edge, immediate inert, focus return, one layout update plus transform. `revealSurface`, `moveWorkspace`. U02. | Not animating width/margins each frame, not full spring/velocity physics claim. |
| P22 | Whole-row icon hover, centered X | S-OWNER explicit text-hover and X-center fixes; S-UPM/S-APPLE feedback guidance. | Hover text/icon triggers same action/animation; X excludes displacement; upload/submit excluded as requested. V03/U01. | No hover-only access; no animation on disabled controls. |
| P23 | Inter and comfortable mobile inputs | S-OWNER familiar UI type requirement; research observed platform families but did not license them. S-UPM touch/text guidance. | Local Inter everywhere except math,16px mobile input/reading, comfortable44px targets. `refinements.css`. U01/U02. | Native44pt/48dp rules are not blindly asserted as web requirements. No proprietary font imitation files. |
| P24 | Black/ice/crimson, restrained signed-in page | S-OWNER supplied reference and ongoing explicit palette/dark/light requests. | Neutral sidebars, icy central action/status, crimson operator, both themes. `learning.css`, `concept.css`. V01. | Not Thetawave purple branding; no idle notebook motion during serious signed-in reading. |
| P25 | Preview-before-apply revisions | S-STITCH D official alternatives/canvas, live entry unusable. | Proposed accepted-versus-candidate plan boundary. U19 DEFERRED. | No infinite canvas; no claim already implemented or measured live. |
| P26 | Concise answers and optional explanation | S-OWNER complained about lengthy replies/markers; current tutor already has brevity instructions. | Short repair plus optional follow-up, sanitized Markdown/math. U10/U11. | Fixed preview text is not evidence real models always obey length. |
| P27 | Equation simplicity and numeral alignment | S-OWNER latest two annotated corrections, not a competitor. | Remove numbers/side labels/dividers/full red row. Times New Roman lining/tabular digits, one baseline, only+ marked; UI elsewhere remains Inter. `concept.css`, V04/U01. | Rejected Georgia varying-height numerals; no absolute sign offsets; no raw math delimiters in visible output. |
| P28 | Guest notebook and pointer-responsive folder figures | S-OWNER/S-HAIRLINE, direct requests for larger formula-filled notebook and whole-row icon response. | Current UI-A04, notebook/kernel/experience formulas and folder/discovery hover lifecycle; icy-blue/crimson identity and guest-only motion. Preserve current real scene on an interface port even though latest sample begins signed in. | No signed-in idle background motion; no additional animation engine or paid image generation implied. Respect reduced motion and destroy figures when view/account changes. |
| P29 | Recognizable Google sign-in identity | S-OWNER explicitly requested Google icon left of text; familiar provider identity, not a competitor feature discovery. | Current `live.js` inline multicolor SVG followed by Continue with Google, capability-controlled OAuth action. UI-A05/U20. | Do not replace real auth with preview account logic or claim configured OAuth has completed consent. SVG presence does not authorize copying other branding/assets. |
| P30 | Four action-specific waits/errors and accurate empty-state sample | S-PROPOSAL suggestions1–3, refining existing P04/P06/P14/P16/P17. | `design_review/proposal-feedback/`,8769; V08/PF-01–PF-10. Status stays beside Teach/Practice/Submit/Help, inputs/files preserved, busy trigger and quiet failed trigger, pre-send local retry versus unknown reconciliation, source reuse and distinct list emptiness. | No production POST/deduplication/navigation-unlocking or durable help/diagnosis work. Fixed1800ms/held operations are explicitly simulations. Neutral shell/math constraints preserved. |
| P31 | Centered Home, first-viewport divider, quiet header and white help button | S-OWNER's four annotated screenshot requests,28 October. No competitor measurement or new inspiration claim. | `proposal-feedback` V09/PF-11/PF-12: centered title without subtitle, removed header New learning/Plan tick, exact white/black Need help?, viewport-sized hero with continuation below divider. | Retain sidebar New learning action, source picker and scrollable continuation. Standard-content geometry verified at four sizes; do not claim arbitrary zoom/content always fits. |
| P32 | Personal-learning workflow: compact intake, flexible hierarchy, candidate revisions, adaptive teaching, and bounded review | S-OWNER/S-PLEARN (`personal-learning` skill and references). | Live `app/web/step-repair-live.js`, `app/web/step-repair-live.css`, `app/web_server.py`, `app/web_tutor.py`, `app/learning_history.py`, `app/review.py`, `app/review_selector.py`, `app/checkpoints.py`, `app/schemas.py`. Implements `intake` stage, up to 24 objectives across ordered modules/concepts, candidate revision banner (`U19`), one-time export offer card, optional `skip_check` (`unassessed`), and bounded 1-item spaced review (`U16`). | Preserves established Inter/dark-light/icy-blue/crimson UI and bundled algebra 3-topic constraints; no vector database, multi-source retrieval, or paid search added. |
| P33 | Cramming controls, motion and editable exam scope | S-OWNER four-part brief; exact existing notebook crimson from experience.css. | U21: toggle/starter, ground-backed tint, activation ring/perimeter pulse, urgent-goal recognition and deterministic multi-clause prefill. | No extra extraction inference, guaranteed readiness or motion under reduced-motion. |
| P34 | Adjustable sidebars | S-OWNER explicit drag/keyboard/reset/persistence specification. | U22: native separators,16px arrow increments, bounded CSS variables and localStorage preferences. | Desktop only; keep overlays/drawers and central reading space. |
| P35 | Subject plus specificity matching | S-OWNER broad-machine-learning/unsupervised examples and typo requirement. | U23: framing removal, domain anchors,>=.86 long-token matching and equal residual scope; un-prefix distinction. | Conservative local heuristic; no embeddings, paid inference or automatic cross-account merge. |

## 3. Screenshot evidence index

These are checked-in project-relative captures, not generated representations of competitor screenshots. References can be opened for historical evidence; implementation must not depend on a competitor website remaining available.

| Evidence | File/link | What it supports |
|---|---|---|
| ChatGPT file menu | [capture](../docs/research/ui-detail-evidence-2026-10-27/chatgpt-attachment-menu.png) | P02/P03 composer and menu grammar. |
| Claude compact file menu | [capture](../docs/research/ui-detail-evidence-2026-10-27/claude-attachment-menu.png) | P03 compact contextual choices. |
| AI Studio context/settings | [capture](../docs/research/ui-detail-evidence-2026-10-27/ai-studio-attachment-settings.png) | P04/P07 independent context/settings. |
| Public notebook workspace | [capture](../docs/research/ui-detail-evidence-2026-10-27/notebook-public-workspace.png) | P04/P07/P08 visible grounding and panel structure. |
| Q-AI workflow | [capture](../docs/research/nebius-winners/qai-workflow.png) | P09 current-stage status, not our exact placement/timing. |
| Q-AI intake | [capture](../docs/research/nebius-winners/qai-upload.png) | P18 drop target/accepted formats. |
| Q-AI output choices | [capture](../docs/research/nebius-winners/qai-output-choices.png) | P10 visible selection. |
| SynthesisOS examples | [capture](../docs/research/nebius-winners/synthesis-examples.png) | P05 editable starter placement. |
| Thetawave dashboard | [capture](../docs/research/thetawave-2026-10-27/dashboard-actions.png) | Capture paths and existing-notes context, P05/P08. |
| Thetawave intake | [capture](../docs/research/thetawave-2026-10-27/source-intake.png) | Unified capture/course/language layout. Goal presets inspected in same flow are not all visible in crop. |
| Thetawave Study intro | [capture](../docs/research/thetawave-2026-10-27/learning-levels-entry.png) | Explicit daily-level/mistake/weak-practice overlap. Not generated-tutor quality evidence. |
| Latest adopted equation | [capture](../design_review/step-repair/screenshots/equation-output.png) | P27 exact newest owner correction. Overrides older full-page equation screenshots. |

Additional screen evidence and sample implementation are in `design_review/step-repair/`. Historical raw browser metrics do not define our target dimensions: V01–V07 in UNREALIZED_CHANGES do.

## 4. What we deliberately did not adopt

| Candidate | Decision and reason |
|---|---|
| Thetawave's broad generators: podcast/infographic/mind map/etc. | Deferred. No six tool tabs without six useful real tools. One demonstrated repair loop comes first. |
| Thetawave mandatory material step in inspected Study wizard | Do not force on goal-first start. Sources optional; observed wizard constraint is not proof all Thetawave flows need uploads. |
| Thetawave English intake default in Indonesian UI | Preserve our owner-requested automatic reply language. Explicit override separate from UI/source language. |
| Thetawave generic empty-filter wording | Borrow category counts, improve state-specific copy instead of copying confusing wording. |
| Subscription gate after Explore all features | Show actual capability/limit before costly setup where possible; no trial/billing implementation inferred. |
| Generic “personalized/adaptive learning” as unique differentiator | Rejected as unsupported: competitor visibly/officially overlaps. Step-specific evidence and independent transfer remain hypotheses to evaluate. |
| Permanent right-panel dropdowns | Rejected by owner; keep editable textareas/inputs. Right panel may close, input system remains. |
| Floating stage strip | Owner rejected detached appearance. Dock it below course header. |
| Enter helper text, account-save footer, repeated helper descriptions | Owner requested removal of clutter. Short critical errors/uncertainty/capability explanations remain useful. |
| Full-row red wrong equation, row numbers and side labels | Owner called output messy. Compact math stack and operator-only annotation supersede them. |
| Georgia equation numerals | Owner annotated uneven digit heights. Use V04 lining baseline contract. |
| Proprietary fonts, copied brand graphics | Not licensed/adopted. Use local Inter and semantic icons; competitor research is structural inspiration. |
| Voice, full video understanding, live staged percentages/Stop | No unsupported capability affordances. Provider/job/cancel contracts would be real separate work. |
| Public private-model reasoning or raw internal learning signals | Never justified by a Thinking label or evidence UI. Expose only safe factual summaries. |

## 5. Why these adoptions fit our project

The familiar shell reduces relearning: composer/menu grammar, recognizable history, visible scope, independent settings and predictable navigation. It supports the existing course/assessment workflow rather than turning it into a general chat clone.

The distinctive episode is a project-specific proposal: show the actual supported wrong step, repair it briefly, then check a changed problem with help usage made explicit. The prototype demonstrates the interaction only. The current backend already has assessment/diagnostic/repair, but precise span validation, durable assistance and corrected observations still need U11–U15.

Neither a winning project's button nor this interface proves a learning advantage. Compare on explanation accuracy, time to repair, unassisted changed-task performance, hint dependence, retention and reading burden. Thetawave's adaptive/exam features mean generic personalization is not a defensible exclusive claim.

## 6. Synchronization record

| Revision | Code/reference checked | Result |
|---|---|---|
| 2026-10-28.1 | Current integrated routes/tutor/store; `step-repair` source including final lining-numeral correction; earlier research registers | First consolidated provenance handoff. LIVE vs PREVIEW vs PENDING separated; no application or prototype code changed in this documentation task. |
| 2026-10-28.2 | New proposal-feedback sample, S-PROPOSAL/P30; P04/P06/P14/P16/P17 adaptations reviewed | Frontend-only sample of suggestions1–3. Other provenance remains semantically unchanged. No new external-site verification or backend feature claim; two screenshot reviews and isolated checks inform refinement. |
| 2026-10-28.3 | Owner layout correction S-OWNER/P31, V09/PF-11/PF-12 | Recorded latest user-origin requirements and superseded inherited subtitle/left alignment. Earlier sources reviewed; no new external research or backend adoption. |

For the next code task: list changed files and affected P/U/UI IDs. If no inspiration changes, still append a concise reviewed/no-provenance-change record. If the implementation diverges from a source, record the reason and latest owner decision; do not claim the old source now proves the new behavior.

### Latest synchronization

| Revision | Scope | Status |
|---|---|---|
| 2026-10-28.4 | V09/P31/PF-12: capitalized Need help?; explicit Plan-icon suppression and versioned preview assets | PREVIEW-only correction verified on active Plan and lesson; backend and other source provenance reviewed with no semantic changes. |
| 2026-10-28.5 | Realized `P01`–`P09`, `P11`–`P24`, and `P26`–`P31` (`V01`–`V09`, `U01`–`U09`, `U11`–`U15`, `U20`, `B01`–`B06`) into the live integrated app (`app/web/step-repair-live.css`, `app/web/step-repair-live.js`, `app/episode_helpers.py`, `app/web_server.py`, `app/learning_history.py`, `app/schemas.py`). | LIVE integration complete alongside existing previews; `P10`/`U10` and `P25`/`U19` remain PENDING/DEFERRED. Source provenance reviewed with no new external browsing claims. |
| 2026-10-28.6 | Integrated `S-PLEARN` / `P32` (`personal-learning` workflow) and realized `U16` and `U19` into live `app/web/` and backend (`app/web_server.py`, `app/web_tutor.py`, `app/learning_history.py`, `app/review.py`, `app/review_selector.py`, `app/checkpoints.py`, `app/schemas.py`). | LIVE in integrated app. Verified with 92 passed pytest tests including headless Chromium Playwright verification; `P10`/`U10` remains PENDING and `U17`–`U18` remain DEFERRED. |


## Revision 2026-10-28.7 provenance review

Reviewed **P23/P31, UI-H08, V09** against owner tasks A5/A6: retain local Inter and centered Home geometry; the owner requested a visible 10px gap under the composer, so the Personalize strip now has its own rounded outline shape. Heading levels changed without changing typography. Metadata/favicon and themed 404 are owner-requested application polish, with no new external design-source claim. P01–P32 source attribution, rejected patterns, PREVIEW inventory and all other adaptations are semantically unchanged. No competitor research or live-provider verification performed. Font subsetting is PENDING offline tooling; existing WOFF2/license unchanged.

| Revision | Scope | Verification / limits |
|---|---|---|
| 2026-10-28.7 | A1–A6; UI-H08/V09/P23/P31 and AI transport/API-ERROR | Reviewed, no semantic change to inspiration/source evidence; documented owner-requested gap/metadata adaptation only. Offline verification: 150 pytest tests passed (50.61s), recorded in CHANGELOG; strong route, thinking and prices NOT live-verified. |


## Owner correction - 28 October 2026, revision 2026-10-28.8

LIVE frontend: UI-H08 / V09 / P31 restores the attached two-layer Home composer (Personalize strip overlaps by 12px, top padding 12px, bottom rounded corners) and centers prompt suggestions. This supersedes revision .7's 10px detached gap. P32 intake removes the pace badge and repeated small header goal, retains the main H1, and puts file-icon Attach files at the left with Propose curriculum and red/white Skip grouped at the right. Save draft and Answer as a one-off question instead remain below; the latter answers directly without proposing a curriculum. Mobile actions wrap. Existing handlers and backend semantics are unchanged. Other V/U/P contracts, PREVIEW inventory, pending/deferred work and LEGACY entry point reviewed with no semantic changes. No provider calls or configuration changes. Verification: targeted personal-learning pytest suite; result recorded in CHANGELOG.


## Attachment/error correction - 28 October 2026, revision 2026-10-28.9

LIVE UI-R / P32 intake Attach files now opens the actual upload form, not the existing-reference library picker. The shared upload/source preview accepts a selection callback: selecting an uploaded reference keeps the intake form and draft values, updates its source label, and includes selected resource_id in the next existing intake action. Other upload entry points keep their previous behavior. API-ERROR provider 404 now identifies the requested model and relevant default/strong model setting; no automatic fallback, retry or paid verification. Root cause of provider availability remains unconfirmed without checking owner configuration/catalog/project access. Reviewed other V/U/P, previews and deferred work: no semantic changes. Verification recorded in CHANGELOG.


## Browser audit synchronization - 28 October 2026, revision 2026-10-28.10

Reviewed UI-H/UI-R/Library/Activity/API-ERROR/P32 and V09 against live Browser observations: see [feature audit](../docs/qa/2026-10-28-browser-feature-audit.md) for exact passes, QA-01 through QA-06 and blocked work. No application, preview, model configuration or source provenance semantics changed in this task; screenshots/report are audit evidence only. Configured strong route fails live, default direct answer works but is overly long/incomplete; downstream live course stages remain unverified. Separate mocked suite: 150 passed (52.26s). Two owner-authorized real requests submitted. Existing PENDING/DEFERRED/LEGACY status retained; discovered issues are not claimed fixed.
