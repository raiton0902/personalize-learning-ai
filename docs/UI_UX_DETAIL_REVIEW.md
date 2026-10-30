# Detailed UI/UX review: familiar controls, precise feedback and architecture impact

**Date:** 27 October 2026, Asia/Jakarta. **Deliverable:** research and an implementation-ready recommendation list; **no product redesign has been applied**. Read with [the current architecture and control inventory](../handoff/CURRENT_ARCHITECTURE.md). IDs such as UI-W04 and API-12 refer to that file, so every recommendation has a concrete home in the code.

## 1. Conclusion before the detail

Our application already resembles a familiar AI workspace: left history, bottom-left account, central composer, attachment plus, saved question branches, right settings, Library, Activity and Markdown/math. Replacing this structure again would add work without addressing the main friction.

The highest-value next pass is **state consistency**: put waiting feedback at the action that caused it, keep drafts visible, make errors actionable in that same place, standardize popovers/focus, and show which step of learning is active. Keep the right panel's current textareas/text inputs. Keep the owner's black/icy-blue/crimson identity and dark/light themes. Familiarity should come from predictable behavior, not copying another product's logo, proprietary font, or every feature.

This review distinguishes four implementation types:

- **V — visual:** CSS/layout/icon/copy changes; same action/data.
- **F — frontend interaction:** local behavior such as keyboard menus, editable goal starters, draft retention or copy buttons; no new inference requirement.
- **B — backend/protocol:** data shape, endpoint, pagination, job state, file processing or ownership change.
- **A — AI behavior/context:** instructions, generation modes, retrieval/citations, classification or extra model input. Requires an explicit scope/data decision before integration.

Priorities: **P0** prevents loss/confusion or inaccessible controls; **P1** improves daily use; **P2** optional later value. None of these labels is permission to modify the app.

## 2. Method and evidence limitations

### What was actually inspected

1. Read the current entry point, final script order, backend routes, store, request coordinator, learning/chat/practice/history renderers, theme/motion CSS, parsers and export logic.
2. Opened the current frontend with real API routes and temporary SQLite at 8782. Model transport was replaced by deterministic fixtures, live inference disabled. Artificial six-second waits exposed generation/question loading. A synthetic failure exposed service-error recovery. This is observation of UI states, not a benchmark of model latency or correctness.
3. Opened ChatGPT, Claude, Google AI Studio, NotebookLM and Stitch through the user's Chrome browser. Inspected new/blank composer, attachment menus, collapsed navigation, settings and a **public featured notebook**. Did not open private conversation bodies, upload user files, send model prompts, change billing, or generate designs.
4. Saved screenshots only after hiding personal chat histories, or from public/sample workspaces. Unsent synthetic text was cleared from ChatGPT/Claude after measuring the nonempty composer. No secret/API-key screen was captured.
5. Used official help/product pages to substantiate loading/error/source features that were not safely triggered in the signed-in services. Recommendations below are explicitly our design specifications, not claims about a competitor's unpublished internals.

**O = observed live UI/DOM**, **D = official documentation/product media**, **C = current local code/runtime**, **P = proposal**. Pixel values from O are measurements in one desktop browser view; P sizes/timings are choices for our app, not measurements of competitors. Account/region/rollout/language can change a platform's UI.

### Coverage by platform

| Platform | Direct observation | Limits / confidence |
|---|---|---|
| ChatGPT | O: home, collapsed icon navigation, file/tools menu, blank vs typed composer, accessible labels and button measurements. | No message sent; generation animation/error appearance not triggered. Those behaviors use official docs. |
| Claude | O: new session, collapsed navigation, file/connectors menu, typed composer, model/project/effort row. | No message sent; no paid or private chat examined. Thinking behavior documented separately. |
| Google AI Studio | O: Playground, disabled empty Run, multimodal insert menu, context chip, right Run settings, panel close. | Did not select/create API keys or run a prompt. Failure examples are D, not intentionally provoked. |
| NotebookLM | O: entry redirected to **Gemini Notebook** at notebook.google.com; public featured notebook Sources/Chat/Studio, source checkboxes, source count, disabled empty send, suggestions, collapsible panels. | This session's branding/URL differs from the older NotebookLM name. Did not copy notebook, alter source selection or send questions. Citation behavior additionally D. |
| Stitch | O: entry stayed a blank iframe before and after one reload. | Do not claim its loading/error/canvas was directly tested. Canvas, variations and in-progress design are D from official Google product media; precise animation timing remains unverified. |
| Q-AI / SynthesisOS | Earlier directly captured public-demo screens in this project; award evidence checked against organizer/sponsor sources. | Current public demos may differ from judged versions. SynthesisOS explicitly labeled deterministic demo. No conclusion that a certain button caused an award. |

Stitch's inaccessible entry is an evidence gap, not a reason to invent its error states. A future live session could supplement this report; it does not block the recommendations supported by the other four platforms and official Stitch media.

## 3. Evidence files and source register

Screenshots and control measurements: [`research/ui-detail-evidence-2026-10-27/`](research/ui-detail-evidence-2026-10-27/).

| Evidence | What it proves |
|---|---|
| [ChatGPT attachment menu](research/ui-detail-evidence-2026-10-27/chatgpt-attachment-menu.png) | O: plus attached to composer, icon/text menu with direct file/library choices. Personal history collapsed. |
| [Claude attachment menu](research/ui-detail-evidence-2026-10-27/claude-attachment-menu.png) | O: small anchored menu, file row/shortcut and secondary submenus; navigation collapsed. |
| [AI Studio attachment/settings](research/ui-detail-evidence-2026-10-27/ai-studio-attachment-settings.png) | O: central playground, insertion menu, removable context chip and independent right settings panel. |
| [Public notebook workspace](research/ui-detail-evidence-2026-10-27/notebook-public-workspace.png) | O: source selection left, question area center, stored outputs right; type icons/source count/disabled empty send. |
| [Stitch entry](research/ui-detail-evidence-2026-10-27/stitch-entry.png) | O: blank entry only; not a screenshot of a working canvas. |
| [Current new-learning wait](research/ui-detail-evidence-2026-10-27/current-generating-learning.png) | C: immediate course-heading window and small Thinking row under it. Synthetic delay. |
| [Current first-question wait](research/ui-detail-evidence-2026-10-27/current-question-thinking.png) | C: Thinking immediately above original question form, draft still visible; synthetic delay. |
| [Current chat service error](research/ui-detail-evidence-2026-10-27/current-service-error.png) | C: deterministic transport failure; inline error above reply composer, typed draft retained and saved chat unchanged. No real provider request failed. |
| `platform-control-metrics.json` | O: bounded DOM geometry/font measurements of composer and attachment/send controls; not hidden application state. |

Official sources, opened during this review:

- **S-GPT:** [OpenAI: troubleshooting ChatGPT error messages](https://help.openai.com/en/articles/7996703-troubleshooting-chatgpt-error-messages). Supports documented stuck-generation recovery and distinction between response, network and download errors; not an exact animation-duration source.
- **S-CLAUDE-THINK:** [Anthropic: using extended thinking](https://support.anthropic.com/en/articles/10574485-using-extended-thinking). Describes thinking status/timer and expandable summary. Model names and placements in that older article may differ from the current account; this report borrows the distinction between processing and optional explanation, not an internal reasoning dump.
- **S-CLAUDE-FILE:** [Claude: uploading files](https://support.claude.com/en/articles/8241126-upload-files-to-claude). Supports the plus/file/drop interaction concept; our allowed formats/limits must remain our own.
- **S-STUDIO:** [Google AI Studio quickstart](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart). Supports a separate Run settings surface and conversational prompt workflow.
- **S-STUDIO-ERROR:** [Troubleshoot AI Studio](https://ai.google.dev/gemini-api/docs/troubleshoot-ai-studio). Distinguishes access restriction from blocked/no-content responses; avoid converting every failure into “rephrase”.
- **S-NOTEBOOK:** [Google: use chat in Gemini Notebook](https://support.google.com/gemininotebook/answer/16179559?hl=en). Documents source selection, citation hover/context navigation, response style/length. These are not present in our app merely because it has View source.
- **S-NOTEBOOK-DISCOVER:** [Google: NotebookLM source discovery](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-discover-sources/). Supports source preview/import as a user decision rather than invisible background additions.
- **S-STITCH:** [Google: Stitch design canvas](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/). Documents canvas, design rules and interactive preview. Our adaptation is controlled alternatives and preview-before-apply, not an infinite canvas for lessons.
- **S-STITCH-LIVE:** [Google: real-time design updates](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/). Demonstrates progressive work visible on canvas; it does not establish how our non-streaming API could do this without protocol work.
- **S-NEBIUS:** [Nebius's event/winner record](https://github.com/nebius/token-factory-cookbook/blob/main/community/events.md), [Emergence/Nebius gallery](https://emergence2.devpost.com/project-gallery), [Delivery Tracker submission](https://devpost.com/software/delivery-tracker), [SynthesisOS submission](https://devpost.com/software/synthesisos-qk04dt).

## 4. What makes each familiar interface useful at detail level

### 4.1 ChatGPT — familiar composer grammar

**O:** the attachment plus is part of the composer, not a detached toolbar. A typed prompt changes the trailing action to Send. Blank composer presents voice-related actions. Current measured plus/send were **36×36px**, composer text **16px/26px** in this browser. These are observations, not a requirement to shrink our 44px main submit.

**Adapt:** keep our plus-left/up-arrow-right arrangement; use a stable trailing action position, disabled empty state, consistent attach menu, visible selected reference chip, and answer actions near the answer. Do not adopt voice controls that have no implementation. Preserve our learning workflow rather than replacing it with a generic chat box. [S-GPT](https://help.openai.com/en/articles/7996703-troubleshooting-chatgpt-error-messages)

### 4.2 Claude — compact controls with progressive disclosure

**O:** the attachment menu is compact, icon-led and anchored close to the composer; advanced choices sit in submenus. Model/project controls are separate from the message text area. Measured current file trigger was **28×28px**, composer text **15px/21px**; computed family included `anthropic-sans`. We should keep our licensed Inter, not try to redistribute a proprietary platform font.

**Adapt:** plain primary file/link rows, concise shortcut labels, hover/focus feedback on the whole row, collapse extra options rather than making every row loud. Thinking should be one honest processing state; our model's disabled reasoning output must not be relabeled as an expandable reasoning summary. [S-CLAUDE-THINK](https://support.anthropic.com/en/articles/10574485-using-extended-thinking), [S-CLAUDE-FILE](https://support.claude.com/en/articles/8241126-upload-files-to-claude)

### 4.3 AI Studio — visible context and separable settings

**O:** the right Run settings can close independently; attachments have modality-specific options; a selected tool appears as a chip with its own remove action. Empty Run is disabled. The developer-facing density is higher than appropriate for our learner.

**Adapt:** retain free-text learning preferences in a separable right panel. Use selected-reference chips and concise capability states. Do not expose temperature, raw token budgets, provider keys, schema switches or safety sliders to ordinary learners. Classify setup restrictions, temporary service failure and empty/blocked responses separately. [S-STUDIO](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart), [S-STUDIO-ERROR](https://ai.google.dev/gemini-api/docs/troubleshoot-ai-studio)

### 4.4 NotebookLM / observed Gemini Notebook — visible grounding

**O:** Sources and Studio have independent collapse controls. File/type icons precede source titles, checkboxes show selected sources, composer shows source count, empty Send is disabled, and question suggestions are actual buttons. Measured query text **16px/24px**, 28px inner textbox; circular Send **36×36px**. This was a public featured notebook, not a newly created private workspace.

**Adapt:** show which reference supports the current course; keep source preview distinct from a generic AI reply. A future citation chip must point to a retained excerpt/page, not just reopen an entire document. Multi-source selection would be a real data/context change; our current single `resource_id` cannot support it by CSS alone. [S-NOTEBOOK](https://support.google.com/gemininotebook/answer/16179559?hl=en)

### 4.5 Stitch — alternatives with clear apply boundaries

**D only for working canvas:** official material shows parallel visual directions, preview and progressive design output. Our browser entry did not load a usable canvas; no claims about exact live spinner, toast, keyboard or retry behavior are made.

**Adapt:** when revising a plan/explanation, preserve the current accepted version until the learner reviews/applies a replacement; make “preview” distinct from “saved”. An infinite canvas or multiple chat agents would add complexity to learning. Fine-grained streamed progress would require more than our current completed-JSON response. [S-STITCH](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/), [S-STITCH-LIVE](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/)

## 5. Nebius winners: exact architecture impact

These are earlier sponsored-event winners. The current Global AI Hackathon rules schedule its winners around January 2027; there is no current-edition winner UI to copy as of this audit. [Official rules](https://nebiusglobalaihackathon.devpost.com/rules)

| Pattern/evidence | Specific improvement | Existing architecture touched | Type / caution |
|---|---|---|---|
| Q-AI stage bar, [captured crop](research/nebius-winners/qai-workflow.png) | Show current Plan/Learn/Practice/Review status plus objective position. | UI-L03/08/10/20/23; `renderCourse` wrapper; `stage`, `objective_index`, `approved_version`. | V/F. Display first; do not make invalid stages clickable. Map diagnostic/repair explicitly rather than hiding them. |
| Q-AI readable upload target, [crop](research/nebius-winners/qai-upload.png) | Compact drop target, accepted formats and per-file validation beside existing plus menu. | UI-H02/03, UI-R01/02, API-09, `references.document`. | F; existing parser reused. Real transfer percentage needs upload transport/progress hooks; transcription phase needs B. |
| Q-AI selected output choice, [crop](research/nebius-winners/qai-output-choices.png) | Small selected states for lesson support modes; distinguish one active mode. | UI-L09/10, `web_tutor.teach`, possibly new explicit course action. | V/F/A. Do not add fake toggles that do not affect generation. |
| SynthesisOS example prompts, [crop](research/nebius-winners/synthesis-examples.png) | Three editable goal starters beneath composer; click fills, never sends. | UI-H01/07; `.compose-wrap`; final `.send` handler unchanged. | F; no AI needed. Sample must not promise source use before reference selected. |
| SynthesisOS transparent output/history product description | Show user-facing operation phases and saved lesson/test access, rather than burying progress in technical audit logs. | FE-FEEDBACK, UI-L23/26, API-11. | V for existing history; B for true phase events. Do not expose private model reasoning or internal learning_signals. |
| Delivery Tracker evidence-backed refusal (submission description, no live UI measurement) | Explicitly distinguish verified sample checks from model assessment and “could not determine”. | UI-L16, AI schema status/checked result; source line; API-ERROR. | V/F for labels, A/B for richer evidence. Product claim, not a measured button design. |

The key lesson is not that winning projects use a certain rounded button. They make the current task and outcome legible. Our biggest opportunity is completing that same legibility in waiting/failure/attachment states.

## 6. Detailed recommendation register

Each entry states **current → proposed → acceptance test**, with precise architecture targets. All sizes below are **proposed CSS pixels**, not copied competitor measurements. Start with P0/P1; avoid a wholesale shell rewrite.

### R01 — One operation-state contract (P0, F/B)

**Targets:** FE-FEEDBACK, `live.js:perform/api`, UI-H11, UI-Q08, UI-W05, UI-P10.

Current: operation state lives partly in a Set, partly in the DOM, partly in feedback flags. Whole body inert blocks every control; many operations have no visible wait.

Proposed: operation record `{id, kind, courseId, threadId, viewEpoch, status, startedAt, draftSnapshot, errorCode}`. Local statuses idle/pending/success/error/cancel-requested. Disable only actions that would conflict with that operation. Read-only navigation can remain available **only after** stale-result guards prevent a late response opening the wrong course. Keep accountEpoch and add view/course/thread checks rather than removing the lock alone.

Acceptance: delayed request, navigate to a different course, return, fail request, double-click submit. No duplicate write, lost draft or late view replacement. Do not enable navigation during writes before this protection exists.

### R02 — Exact Thinking placement and size (P0, V/F)

**Targets:** UI-H11, UI-Q08, UI-L08/10/14/18, `thinkingRequest`, `learning-ui.css`, `threads-ui.css`.

Current: generation label under goal; question label before composer; other AI operations only global lock. Generation row has 24px margins; ordinary question row 12px; 13px label/9px dot/28px height/1.3s pulse.

Proposed shared component: **28px row, 13px label, 8px gap, 8px dot, 12px space above/below**, same left edge as answer text. Keep generation variant 24px below goal heading. Inline form spinner can be **14×14px** in a reserved **16px icon slot**; do not run two full-size spinners for one operation. Plain dot opacity pulse **1.2–1.4s**, no travel/bounce. Reduced motion: static dot + label.

| Operation | Precise placement | Label | What stays visible |
|---|---|---|---|
| New plan | Under submitted goal H1; 24px gap | Preparing your plan… | Goal and selected reference; not empty lesson skeleton with fake text. |
| First question | At anticipated assistant-answer start, after the submitted question; if retaining original form, immediately above it | Thinking… | Typed question and lesson context. |
| Existing chat | Inside new assistant placeholder, **8px below assistant role label**, before composer | Thinking… | User turn already shown; reserved row prevents composer jumping. |
| Teach lesson | Below objective/outcome, where explanation will appear; 16–24px gap | Preparing this lesson… | Objective title and source. |
| Practice generation | Under Your practice heading, before new problem | Preparing a practice problem… | Prior feedback if revisiting. |
| Assessment | Below submitted answer card or at Feedback start | Checking your reasoning… | Answer, reasoning and attachments; do not clear them first. |
| Diagnostic repair | At repair explanation start | Working through this step… | Diagnostic response. |

Show state immediately after valid submission; do not invent a 1.2s delay before work begins. If showing elapsed time after **10 seconds**, use actual elapsed seconds and at most once-per-second text updates. It is not percent complete. After **30 seconds**, add one quiet “Still working…” status, not repeated notifications. Transport's real timeout controls failure, not an animation clock. Use `role=status`, polite announcement once; do not announce every dot pulse.

Acceptance: delayed screenshots at start/10s/timeout, short request, reduced motion, narrow screen. Indicator visible on every AI operation and never mistaken for provider reasoning output.

### R03 — Preserve the user turn and draft through failure (P0, F/B)

**Targets:** UI-Q02/06/07/13, UI-L11/12/14, `showQuestionChat`, `courseAction`, `accountEpoch`.

Current: no optimistic user bubble before response; submitted form text remains in existing DOM. A later re-render can remove local-only drafts.

Proposed: capture draft by course/thread/form before request. Show pending user bubble immediately with small pending state, but do not claim server persistence. On failure retain text and offer Retry/Edit. A retry for the **same chat message** must reuse original request ID; editing creates a new ID. Practice attachments remain selected until confirmed saved assessment or explicit removal. Optional sessionStorage drafts require a deliberate retention/account-isolation decision; do not silently store private reasoning in general localStorage.

Acceptance: response lost after server save, offline error before save, switching account, leaving/returning course. One logical message, no cross-account draft exposure.

### R04 — Errors beside the operation, not behind a modal (P0, V/F/B)

**Targets:** API-ERROR, UI-R02/04, UI-W04, UI-P12, `#live-status`.

Current: 12px fixed-bottom generic status; pointer-events none; can be hidden by shared modal top layer. Chat has a separate inline service_error path; generation has another.

The controlled chat failure retained `UX failure example` in the composer and the existing two-message conversation. Its error suggested “try again or rephrase”; rephrasing does not remedy a transport outage. Separate service failure from unclear-question feedback rather than asking the learner to change a valid question.

Proposed error block within the active form/dialog/answer placeholder: **14px text, line-height 1.5, icon 16px, gap 8px, padding 12px, radius 10px**, width of content. Red used for icon/border only or muted red surface with sufficient contrast. Keep exact failure near its file/field; do not recolor entire reading area. `role=alert` for new blocking error; no focus theft while typing. One error per failed operation, removed/replaced on retry or explicit dismiss.

Body: one plain sentence; action: one or two small buttons. Developer diagnostics/request ID behind Details, not `.env` instruction text in the main learner message. Introduce stable backend `code`, safe `message`, `retryable`, optional `retry_after` while retaining existing HTTP distinction.

| Failure | Learner copy proposal | Action | Guard |
|---|---|---|---|
| File too large | This document exceeds 2 MB. | Choose a smaller file | Reference/document vs video limit must be correct. |
| Unreadable/scanned PDF | No readable text was found in this PDF. | Paste text / Upload a page image where supported | Do not imply main reference upload already OCRs images. |
| Link unavailable/login | This page could not be read. | Paste its text / Upload a document | Do not retry a private URL indefinitely. |
| Video setup unavailable | Video transcription is unavailable here. | Upload a transcript | Setup details for owner, not ordinary learner. |
| Provider timeout | The reply took too long. Your draft is still here. | Retry / Edit | Manual retry only; original request ID where supported. |
| Rate restriction | Too many requests right now. | Try again after actual retry time | Display timer only if supplied; no invented countdown. |
| Session expired | Sign in again to continue. | Sign in | Preserve draft only within safe account boundary. |
| Stale revision | This learning changed in another tab. | Reload latest | Warn before replacing unsaved local work. |
| Unclear question | Which part of this lesson do you mean? | Keep draft editable | Semantic uncertainty is not network failure. |
| Google unavailable | Google sign-in is unavailable. | Use email | Do not show environment-variable names to every user. |

Acceptance: errors in open upload/discard/submit dialogs remain visible and keyboard reachable; screen-reader announcement; theme contrast; no raw exception/secret.

### R05 — Common menu behavior (P0/P1, F)

**Targets:** UI-H02, UI-A11, UI-P06, UI-W01, UI-X01; existing disparate menu listeners.

Proposed geometry: **220–280px width**, **6px outer padding**, **36–40px rows**, **18–20px icon**, **10px icon/text gap**, **8px anchor gap**, **10–14px outer radius**, menu limited to viewport minus 16px each edge. Anchor near trigger; flip above/below according to available space; never hide the composer or push focused item offscreen. Whole row hover fill with no text movement. Use dividers only between real action groups.

Behavior: open on click/Enter/Space, focus first menu action, arrow keys within actual menus, Escape closes and returns focus, outside pointer closes, only one menu open, correct aria-expanded/aria-controls. Language's free-text editor is a disclosure/form, **not** a menu that steals arrow keys from the input. File picker cancellation returns focus to plus, without failure toast. Checkpoint already has much of this contract—reuse rather than regress it.

Acceptance: keyboard-only, at bottom of viewport, zoom 200%, touch, menu inside modal, reopening after view replacement. Do not invoke browser file chooser twice from bubbling handlers.

### R06 — Text input focus without the unwanted blue rectangle (P0, V/F)

**Targets:** UI-H01, UI-P02–P07, UI-L11/12/17, auth fields; global input outline removal.

Keep user-requested clean interiors. Put focus feedback on the **outer field container** with `:focus-within`: **1px neutral high-contrast border/inset ring**, no second rectangle around textarea text. Keyboard focus must be discernible in both themes. Error state uses its own adjacent message/aria-describedby, not only red color. Retain textarea caret and selection. Do not replace textareas with dropdowns.

Acceptance: Tab through every field at 200% zoom, keyboard-only dark/light, invalid email/password/answer. User can identify the active field without a blue inner box.

### R07 — Empty submit states and predictable trailing control (P1, V/F)

**Targets:** UI-H07, UI-Q02/07, UI-L13, auth submit.

Main send stays **44×44px, centered 22px arrow**; chat send **36×36px** with **20px arrow**, but mobile hit area at least **44×44px** without making the icon huge. Disabled for whitespace-only input, pending conflicting operation, or pending topic decision; not merely an enabled button that silently does nothing. Keep width/position constant on pending/error. Do not add voice mode solely to mimic ChatGPT.

Acceptance: spaces, newline-only, IME, double-click, Shift+Enter, disabled contrast, identical arrow centering in both themes.

### R08 — Shorten the 1,200ms similar-question reveal (P1, V/F)

**Targets:** UI-Q09/20, `questionFeedback`.

Current buttons remain inert during 1,200ms animation. Proposed reveal **120–180ms**, vertical movement ≤4px, buttons available immediately once response arrives. Keep current cancellation on any text edit. Reduced motion: no transition. The recommendation is about wait cost, not a claim that competitors use this exact timing.

Acceptance: type while suggestion appears, click Open immediately, request changes during reveal; no stale title or hidden intercepted click.

### R09 — Stable message/reading layout (P1, V)

**Targets:** UI-Q05, UI-L01/09; `.chat-log`, `.rendered-copy`, `.course-reading`.

Reading measure **640–720px** on wide screens, body **16px/1.7–1.8**; sidebar/panel **14px/1.5**. User bubble offset at most **12–18%** desktop, **0–6%** mobile. Assistant text aligned to lesson reading edge. Messages separated **24px**; role label **11–12px** and **8px** below it before content. Reserve 28px pending response row to reduce composer jump. Avoid opaque cards around every paragraph.

For scroll: auto-follow only when reader is within **80px of bottom**; otherwise show a **36px circular jump-to-latest button** near composer, 12px offset, label “Jump to latest”. Existing app currently resets to top in several renderers; a new universal scroll-to-bottom would also be wrong.

Acceptance: long equation/table/code block, scroll up during answer arrival, return from saved question, 390px viewport, panel toggled. No page horizontal overflow or forced loss of reading position.

### R10 — Reply action bar and accessible copy feedback (P1, F)

**Targets:** UI-Q05, `showQuestionChat` assistant article; UI-L09 optional worked-example copy.

Add Copy as one **28–32px visible icon button** with **36px desktop/44px mobile hit area**, **16px icon**, **6px gap** between actions, positioned **8px below assistant answer** at text start. Visible on hover/focus desktop; always accessible/visible touch. Tooltip after ~**500ms** hover, immediate on focus; no tooltip-only label. After copy replace icon/text with Copied for **1.5s**, then restore; announce once politely. Clipboard failure shows inline “Could not copy” with manual selection option. No success toast.

Retry/regenerate/edit are **not** purely cosmetic companions: model cost, branching and idempotency need explicit design. Do not add them as dead icons.

### R11 — Reference chip with removal and scope (P1, F)

**Targets:** UI-H10, `selectedSource`, `fieldsProfile`, UI-R09.

Replace plain source title with one compact chip **30–34px high**, **16px file-type icon**, ellipsized title max **240px**, remove button **24px visual/32px hit area**. Full name via tooltip/accessible name; preview opens on title; X only removes selection for next request, not Library item. Below/inside source preview make it clear whether full source or opening excerpt is retained. Keep one-reference model unless a real multi-source design is approved.

Acceptance: 160-character filename, URL, remove after saved source, no source, draft goal retained, no accidental deletion.

### R12 — Separate upload transfer from extraction (P0/P1, F/B)

**Targets:** UI-R01/02 and UI-W04/05; API-09/API-12; `references`/`reasoning_files`.

Per-file row: **40–48px minimum height**, file icon **20px**, filename **14px**, status **12px**, controls right. States: Selected → Uploading → Reading text → Ready / Failed. Use a **3px progress line** only for bytes actually transferred; extraction uses indeterminate 14px spinner or text, not a frozen fake 100%. Document upload threshold is 2MB, while configured video is 25MB/5min; show correct current type limit before request.

Existing fetch has no upload progress listener; XHR or other observable transfer support is **F/B**, not CSS. Existing API returns after extraction, so detailed server phase percentages require a job/event protocol; do not claim “OCR 73%” from an animation. Cancellation requires row-specific request handling and cleanup rules, not just hiding the row.

Acceptance: cancel picker, zero-byte/corrupt/oversize file, unsupported suffix, 3→4 reasoning files, slow upload, parse failure after transfer, successful retry, same filename twice.

### R13 — Make OCR review unavoidable enough to be useful (P1, V/F)

**Targets:** UI-W06, API-12, `ocr_image.ps1`.

Current filename already opens extracted text. Keep it, add concise “Review extracted text” action at **12px** alongside image filename, not a warning banner over every answer. Preview header shows file type and character count, body **14px/1.6**, max **50vh**, selectable text. If adding edit-and-confirm OCR text, that is **B**: server must validate/store edited text tied to owned attachment rather than trusting arbitrary client text IDs. Do not imply handwritten equation OCR is infallible.

Acceptance: x/×, minus signs, fractions, mixed language, blank extraction. User can remove and type corrected reasoning; original draft remains.

### R14 — File-type identity and upload destinations (P1, V/F)

**Targets:** UI-R01, UI-W02/03, UI-X02/03/04, UI-B06.

Use recognizable file-type marks plus extension text; color is secondary. Keep PDF red, Word blue, Markdown neutral, image distinct; icons **18–20px**, fixed column **24px**, text baseline aligned. Reference upload label and reasoning upload label must name their different purpose. Do not use the same folder icon for every PDF/document/image. Do not copy unsupported competitor file limits/formats.

Acceptance: grayscale, dark/light, filename with misleading extension, unsupported file. Backend remains final validator.

### R15 — Panel width and focus stability (P1, V/F)

**Targets:** UI-P01–P10; `setPanel`, `fillProfile`, `applyLanguage`, right-panel CSS.

Keep **310–324px** desktop right panel, **24px padding**, fields full width, **20–24px between groups**, labels **14px**, textareas **90–110px** initial height. X remains **40×40px / 20px icon**, centered, **14–16px** from edges. On screens unable to fit rail + sidebar + **≥560px reading area** + panel, use an overlay with clear close and focus return, or close sidebar automatically with user-visible control; do not obscure reading silently.

Do not focus the language button every time `fillProfile` updates state. Focus panel heading/first requested field only when user explicitly opens it; normal lesson re-render should put focus on new H1 or retained composer, not a hidden language control. Retain free-text style/struggle and text interest/context. Tiny optional scope labels can distinguish universal vs this course without adding repetitive descriptive paragraphs.

Acceptance: open/close after dirty edit, load another course, view new learning, 1024px overlay, mobile keyboard, no focus jump to hidden field.

### R16 — Save/discard contract on every exit path (P0, F/B)

**Targets:** UI-P10–P13; Home/New learning/Library/Activity/account navigation.

Current X checks dirty; other paths can replace preferences/reset form. Inventory every exit: X, rail Home, New learning, course switch, Library, Activity, auth/account switch, Escape/browser reload. Apply one decision policy where draft replacement would lose edits. Do not prompt when merely hiding a panel while retaining the same draft.

Keep requested Save?/Saved text and green→grey state. Modal: centered title **23–24px**, content **14px/1.5**, button height **46–48px**, vertical gap **12px**, width min(450px, viewport−32px). Keep editing first; Discard changes second (red tint); Save third (green tint). Escape = Keep editing, not discard. Failed save leaves dialog and editable draft with local error. No success toast.

Acceptance: each exit above, failed save, Escape, re-open, no double save, global-vs-course isolation. Browser beforeunload prompt only if actual draft loss warrants it; do not prompt for every navigation.

### R17 — Exact sidebar behavior (P1, V/F)

**Targets:** UI-N04–N10, `renderHistory`.

Course row **36–40px high**, title **14px**, icon **18–20px**, **10–12px** horizontal padding. Branch indent **18–24px**, question row **32–36px**, chevron graphic **14–16px** but hit area **32px desktop/44px touch**. Both label and icon hover trigger same feedback; chevron toggles branch, title opens course—no ambiguous double action from one click. Selected/current, hovered and keyboard-focused states must be distinct.

Use ellipsis for long titles plus tooltip/focus access to full title; don't crop glyphs at right border. Search expands only relevant child matches, highlights matched text without changing case/data, and gives a real empty result. Clear search restores prior branches. Active item `aria-current`/appropriate selected semantics; rail item tooltip after **400–600ms**, accessible label always. Preserve scroll position when list refreshes.

Acceptance: new question appended, selected child on reload, 100+ items, search while branch open, keyboard collapse, hover title triggers icon animation, no stale Library selected on Home.

### R18 — Stage strip without invalid navigation (P1, V/F)

**Targets:** UI-L03/08/10/18/20/23 and ACT matrix.

Proposed mapping: plan→Plan; ready/lesson→Learn; attempt/diagnostic/repair→Practice (sub-label Answer / Check one step / Repair); feedback→Practice completed, next action explicit; complete→Review/Completed. Saved-history Review is a **view**, not a new server stage. Do not misrepresent an uncertain diagnostic as completed practice.

Strip **40px high**, labels **13px**, gap **20–24px**, active **2px underline**, objective counter **12px** at right. Non-available future stages are plain disabled text with explanation, not clickable tabs. Existing approved history may be browsed; it must not reset state. On mobile counter can wrap below, never squeeze labels into unreadable icons.

Acceptance: first plan unapproved, revised plan, correct/incorrect practice, final objective, transferred-question course, history view. No approval bypass; counter from real state, no fake retention percentages.

### R19 — Example goals that fill instead of submit (P1, F)

**Targets:** UI-H01, `learning-ui.js` final submit.

Three small chips, **32–36px high**, **12–13px text**, **8px gap**, placed **16px below composer**, wrap to two rows on mobile. Examples: Understand algebra, Prepare for an exam, Learn from my notes. Clicking fills an editable goal and focuses composer/caret; never starts model call. If goal already nonempty, avoid silently replacing it—either only show starters when empty or ask a lightweight replacement decision. “Learn from my notes” should open/point to attachment choice if no notes selected, not imply inaccessible notes were read.

Acceptance: keyboard/touch, existing typed goal, no network request from starter click, overflow, screen reader name.

### R20 — Lesson support actions with honest scope (P1/P2, F/A)

**Targets:** UI-L09/10, `web_tutor.teach`, `Lesson` schema.

Compact Explain simply / Show an example / Give me practice; **34–38px high**, **12–13px label**, **16px icon**, **8px gaps**. No giant selectable cards that occupy more height than the explanation. Give me practice maps to existing action. New simpler/example generation needs explicit request semantics, no silent whole-course regeneration. Attach result to the lesson, preserve original explanation, mark active selection and allow return to original. Never simplify an exercise by revealing its answer before the independent attempt.

Acceptance: same objective/reference, requested language, preserved original, no duplicate request on hover, failure retains existing lesson, pending exercise hint constraint.

### R21 — Source context and future citations (P1/P2, V then A/B)

**Targets:** UI-L02, UI-R07/08, source schema, `source_ids`, `references.pdf_source`.

Now: one small source/type chip beside View source, **12px text**, **16px icon**, **6px gap**; distinguish Uploaded reference / General explanation / Checked sample with factual labels. Do not add a vague confidence badge.

Future citations: numbered **20–24px chips** adjacent to source-backed sentence; hover/focus excerpt card max **320px**, click opens source preview at page/retained excerpt with highlight. This requires preserving stable chunk/page IDs and model-supported citation fields plus validation. Existing `source_ids` only identify the supplied reference; they do **not** establish sentence-level grounding. No fabricated footnotes or AI-assigned reliability percentages. [S-NOTEBOOK](https://support.google.com/gemininotebook/answer/16179559?hl=en)

Acceptance: source removed/unavailable, excerpt only, citation not in source, original source title vs user-upload filename, math page references.

### R22 — Library row anatomy and meaningful empty states (P1, V/F; scale B)

**Targets:** UI-B01–B07, API-09, auto-note storage.

Search **44px high**, icon **18px**, input **14px**; filter chips **32px**. Row **64–76px minimum**, type icon **20px** in **28px column**, title **14px/500–550**, secondary **12px**, **16px gap**. Full row hover/click, no redundant trailing arrow. Search clear-X appears only when nonempty; keyboard Escape can clear query if menu not open. Show distinct “No saved references yet” vs “No matches for …”, with Clear search action for latter.

Small matched excerpt could be local search functionality, not AI. Opening a note should show originating course and return path. Existing API fetches all resource text; if library becomes large, add paginated/search summary endpoint rather than rendering everything and claiming scalable search.

Acceptance: long title, title-only match, extracted-text match, category/search combined, zero notes, no results, returning from source preview preserves query/scroll.

### R23 — Activity date semantics and back-navigation (P1, V/F; scale B)

**Targets:** UI-T01–T04, API-14.

Native calendar remains; label **13px**, field **40–44px high**, All dates **36–40px**, **8–10px gap**. Display active date as human-readable local date; group results by Today/Yesterday/actual date with timestamp **12px**. Opening event should allow return with same filter/scroll. Empty copy must distinguish no matching fetched events from history not loaded.

Server capped at 500: future exact historical date search requires date-range/pagination API; a local calendar cannot recover records not fetched. Backend owns timezone/range contract if added; do not infer Jakarta for every learner just because development runs there.

Acceptance: UTC/local midnight, DST elsewhere, empty date, older than 500th event, deleted/stale course link.

### R24 — Shared dialog sizing, errors and focus (P0/P1, V/F)

**Targets:** shared `<dialog>`, UI-R10, UI-P11, UI-L14, API-ERROR.

Standard modal min(viewport−32px, **480px**) unless source preview needs **640–720px**. Padding **24px desktop/20px mobile**, heading **20–24px**, close **40px target**, body scroll max **70dvh**. Sticky close/header only if long body. Opening stores invoker; closing returns there if still visible. Meaningful initial focus: heading for source text, input for entry, Keep editing for destructive decision. Escape cancels; no implicit discard or assessment.

Use explicit action roles, not “first enabled dialog button” for Enter. Error block goes inside modal top layer. Restore Save/Cancel labels/classes on every close path; dialog reuse must not leak Submit/Discard button style.

Acceptance: open upload → error → close → discard → close → source; header labels/focus correct at every step; mobile virtual keyboard does not hide primary action.

### R25 — Submit confirmation should name what is submitted (P1, V/F)

**Targets:** UI-L13/14/15, UI-W06.

Keep current orange Submit confirmation if owner wants it. Add compact summary: answer entered, reasoning present, number of attached extracts; no repeated full essay. Primary Submit **46px high**, Cancel same target, **12px gap**. Confirmed request uses captured snapshot, not mutable form values after dialog opened. Escape/Cancel preserves everything. Double-submit remains guarded.

Acceptance: edit/cancel/reopen, three files, failed assessment, pressing Enter in reasoning inserts submission flow only on unmodified Enter, no unintended assessment from modal Close.

### R26 — Export action feedback (P1, F/B)

**Targets:** UI-X01–X05, API-13, checkpoints.py.

Keep one trigger, menu above/below based on available space. On format click show small **14px spinner** in format row and “Preparing PDF…” **12px**, disable repeat format action; use fetch/blob or explicit job if needed to observe failure. On success browser downloads, menu closes and focus returns. If fetch/blob used, preserve filename/MIME/auth and revoke object URLs. Failure stays in menu/adjacent block with Retry, not a blank JSON page.

Do not promise mathematically identical DOCX/PDF/Markdown: current converter linearizes equations and may depend on fonts. Add export regression samples with fractions, powers, CJK/Indonesian, code and page breaks before claiming parity. No inference needed for export.

### R27 — Hover, press and reduced motion as one system (P1, V)

**Targets:** FE-FEEDBACK motion, `bindIconMotion`, Hairline runtime, close/main submit exceptions.

Retain owner-requested icon feedback across the whole hit region. Proposed default hover icon motion **120–180ms**, translate **1–2px**, optional rotation **≤6°**; clock can use a tiny hand turn without rotating the whole button. Press feedback **70–100ms**, scale **.98** max; circle centers fixed. Keep no icon animation on upload/submit exceptions. No hover-triggered inference, panel opening or jumping text.

Reduced motion: remove geometric movement, keep clear fill/border state; static processing label. Guest notebook remains the one larger motion element, destroyed/paused when signed-in/hidden as current behavior supports. No continuous decorative motion while learning.

Acceptance: hover on label/padding/icon, keyboard focus equivalent, rapid enter/leave, icon exceptions, light theme, no lost centered X.

### R28 — Font and icon familiarity without proprietary copying (P1, V)

**Targets:** FE-LAYOUT; local Inter; whole UI.

Current measured platforms use different families: ChatGPT's inspected view had a system/Segoe-style stack; Claude `anthropic-sans`; Notebook Google Sans family. There is no single universal “AI sidebar font”. Keep licensed Inter consistently at **14px sidebar/panel, 16px reading**, weight **500–550 nav / 600 headings**, line-height **1.45–1.6 nav / 1.7 reading**. Pure white title text in dark remains owner choice; muted text for metadata only. Use 1.5–1.75px line icons on a common 24px grid, not mixed emoji/glyph arrows plus unrelated strokes.

Acceptance: compare main/left/right, font fallback offline, 125–200% zoom, English/Indonesian/CJK, one text color change doesn't leave other components grey by accident.

### R29 — Skeletons only for predictable structure (P2, V/F)

**Targets:** API boot/load, FE-BOOT, course lists.

For a fetch lasting >**200ms**, optionally show **3–4 static skeleton rows**, each matching actual **36–40px history row** or **64px Library row**, with no fake titles or generated content. Use low-contrast neutral blocks, no sweep shimmer under reduced motion. Generation still uses submitted goal + honest status, not skeleton paragraphs implying known content.

Acceptance: fast loads do not flash skeleton; stale account list never displayed; empty list resolves to true empty state; failure resolves to actionable error rather than endless bars.

### R30 — No unsupported capability affordances (P0/P1, V/F/B)

**Targets:** API-02 capabilities, UI-A05, UI-R01, main menu.

A control must say whether it can work before the user commits. Video should be an explicit supported/unavailable path with transcript alternative. Do not add camera/microphone/voice just because AI Studio has them. Google capability true means configured, not guaranteed consent. Missing OCR language has a user-facing file/text alternative. Admin setup links belong in owner guidance, not ordinary learner prompts.

Acceptance: capabilities false, provider configured-but-failing, offline, non-Windows OCR, expired auth, no dead buttons.

### R31 — Saved-history context is not backward progression (P1, V/F)

**Targets:** UI-L23–L26, `showLearningReview`, `learning_history.public_history`.

Keep Review lessons and tests but replace vague selected option with a clear read-only context strip: “Reviewing Step 1 · Current step unchanged”. Return to current step appears at top, **32–36px** control. Previous-version label visible. Tests indicate question + submitted answer + feedback, with worked solution only when authorized by backend. Do not show a Submit button in history or reset current objective when browsing.

Acceptance: prior version after revised plan, recovered-note entry, incomplete attempt without answer-key leak, empty history, return restores active course action.

### R32 — Improve completion without inventing mastery (P1, V/F)

**Targets:** UI-L20/22, complete renderer.

Completion screen names actual finished objectives, offers View saved lessons / Download checkpoint / New learning, and a small current-stage completion label. It must not say “Mastered algebra” because one model-assessed attempt passed. Legacy spaced review is not integrated simply because a Python scheduler exists; adding due-review cards is B/A work, not a decorative achievement badge.

Acceptance: objective count, general vs checked sample, no fake streak/retention score; save/export available without another inference.

### R33 — Request identity and safe manual retries (P0, B/F)

**Targets:** API-10/API-11, `api`, `createLearning`, chat requestId, optimistic revisions.

Chat has request-ID deduplication for stored user messages. Course creation/revision/assessment don't all have the same explicit client idempotency contract. Before adding broad Retry buttons or enabling parallel navigation, define operation IDs, response-lost handling and which actions can be repeated safely. “Model returned error” may still have incurred provider usage; no automatic paid retry. Server error payload should be safe and machine-readable.

Acceptance: post-response connection loss, timeout before/after save, same request repeated, older revision, model succeeds/store fails. UI must not claim payment cancellation or saved state without evidence.

### R34 — Honest cancellation (P2, B/F)

**Targets:** FE-FEEDBACK, `request_model`, server synchronous threadpool calls.

Current API is non-streaming and whole-body inert. Adding a square Stop icon alone would be misleading. Minimum safe frontend option is “Stop waiting” that aborts local fetch and says work may still complete; it needs request identity and later state reconciliation. True cancellation needs server job ID/state and provider cancellation support where available. Never claim it refunds usage. Keep active write state coherent before offering it.

Acceptance: cancel before dispatch, during provider call, after server save, navigate/reopen. No phantom unsaved course or duplicate next-objective step.

### R35 — Design alternatives before Apply, from Stitch (P2, F/B/A)

**Targets:** UI-L04–L07, plan versioning, saved history.

For future major plan revisions, present current vs proposed outline with a clearly marked **Apply revised plan** action. Preserve accepted plan until new generation/validation succeeds. This requires storing draft plan separate from accepted version if parallel comparison is real; it is not achieved by two CSS columns over the same mutated object. For a single visual preview no backend change is needed. Keep focused lesson-reading surface rather than importing Stitch's infinite canvas.

Acceptance: generation fails, user closes comparison, applies once, returns to prior lesson; version/approval/history correct.

## 7. State-by-state acceptance checklist

These are target verification cases, not claims all were tested during research.

| Area | Must inspect before implementation is considered complete |
|---|---|
| Goal | Empty/whitespace, typed, attached source, long goal, Enter/Shift+Enter/IME, pending generation, error, similar goal, successful plan. |
| Chat | Empty, typing, very long, waiting, answer, service error, clarification, similar match, off-topic pending, Yes/No, same-thread reload, duplicate request. |
| Right panel | New-learning global fields, existing local fields, explicit/automatic language, clean, dirty, save pending, failure, X/discard/save/keep/edit; other navigation exit paths. |
| Upload reference | No selection, chooser cancelled, supported doc, transcript, unsupported video capability, corrupt/oversize/long source, link login/private address, excerpt preview, Use/remove selection. |
| Reasoning | File/image options, OCR waiting, unreadable image, wrong math extraction, filename preview, three files, remove, cancel confirm, successful/failed assessment. |
| Lesson/practice | Unapproved plan, ready, lesson preparing, readable Markdown/math, generated practice, answer+work, diagnostic, repair, correct feedback, changed problem, next objective, completion. |
| History | Closed branch, expanded, matching search, no results, old plan, old test with hidden solution, current step unchanged, stale/deleted course. |
| Library | Empty account vs no matches, all/reference/notes, title/text matches, full-row hover, source preview, query preserved on return. |
| Activity | All dates, specific date, empty, UTC/local boundary, older data not fetched, return from event preserves filter. |
| Export | Three formats, menu keyboard, long math/non-Latin, pending, server error, file signature, disabled duplicate click. |
| Global | Dark/light themes and OS contrast preference, reduced motion, keyboard only, screen reader live status, 200% zoom, 360/390/768/1024/1440 widths, touch targets, stale async response, no private data in console. No System theme selector is proposed. |

## 8. Recommended implementation order and exact deliverable boundary

### Pass 1 — feedback correctness before new features

**R01–R08, R16, R24, R30, R33.** Establish operation state, draft preservation, visible waiting on all costly actions, local errors, menu/focus consistency, dirty-exit protection, capability truth and safe retries. Keep current page structure. This addresses the details users notice first when something takes time or fails.

### Pass 2 — familiar everyday controls

**R09–R15, R17–R19, R22–R23, R25–R28, R31–R32.** Reading/scroll, copy, reference/file rows, panel, sidebar, stage indicator, goal starters, history/calendar/export polish. Most can reuse existing endpoints; distinguish visual-only work from API-scale changes in each ticket.

### Pass 3 — selectively richer AI

**R20–R21, R34–R35**, and real upload phase jobs if needed. Extra examples/simplification, validated citations/multiple sources, true cancellation and revision comparison require explicit behavior/context decisions. Do not add all of them just to match platform feature counts.

## 9. What should remain recognizable and unchanged

- Left icon rail + learning/question history; account bottom-left.
- Main plus and upward submit; Enter/Shift+Enter with IME support.
- Right pattern as **free-text inputs**, with existing typed language override; automatic by default.
- Global style/interests vs per-course struggle/context/language.
- Light/dark toggle, dark default, Inter everywhere, no signed-in background distraction.
- Plan approval gate, tentative interpretation of struggle, existing ownership and request/data limits.
- Quiet Save?/Saved feedback; no repeated success notifications or generic helper paragraphs brought back everywhere.

The next improvement should make a learner think “I know how this works” because the same action has the same location, state and recovery path—not because the whole page is repeatedly redesigned.

## 10. UI/UX Pro Max cross-check, 27 October 2026

The observations in this section are the **before** state. Section 11 records the subsequently requested implementation in the separate example.

This is a read-only review of the current **separate interface preview**, after its icy-blue learning-area and sidebar-motion revisions. No UI, backend, provider context or production source was changed during this cross-check. Findings below are verified against the preview, not a claim that the main app was retested in this pass.

### Skill workflow followed

1. **Requirements and stack:** learner-focused web application; familiar content-first workspace; owner-approved icy blue in the central learning area, unchanged sidebar design, free-text pattern inputs, dark/light themes and eased panels. Verified plain HTML/CSS/JavaScript in the preview/current frontend; Starlette remains the backend. The tool dependency manifest is not evidence that this is React or Tailwind.
2. **Design-system step:** no replacement design system was generated or persisted because this is an audit of an existing approved interface, not a new page or visual direction. A generated palette/font suggestion would not supersede the owner's choices.
3. **Targeted searches:** ran the skill's actual local `scripts/search.py` with explicit `ux` queries for touch size, mobile text, route focus, error association, navigation history and transform performance. Checked result category/platform before using it. The first mobile-input query returned keyboards rather than text sizing; the permitted narrower retry returned Readable Font Size. Route-focus search plus retry did not produce an applicable database match; the route-focus recommendation comes from the skill's explicit `quick-reference.md` §9 rule instead.
4. **Stack fit:** the installed skill has no exact plain-JavaScript stack profile. Two `web` domain queries returned native/React Native material, which was rejected as an implementation match. No native units, native APIs or framework migration were substituted into the project. Web recommendations use the stack-independent quick reference and verified DOM/CSS behavior.
5. **Priority/checklist pass:** read `SKILL.md`, `references/quick-reference.md` and `references/pro-rules.md`. The latter explicitly targets native/mobile apps, so its 44pt/48dp units and native Dynamic Type rules are not treated as identical requirements for this browser app. No chart work is warranted by this interface.

### Verified improvements, in recommended order

| ID / priority | Evidence from current preview | Recommended improvement | Skill basis / relationship to earlier review |
|---|---|---|---|
| UPM-01 / first | Navigating from the phone drawer to Library shows its H1, but active focus lands on `BODY`. `go()` replaces the view without focusing the new reading region. | On deliberate navigation, focus the destination H1/main region and expose the new location to screen readers. Preserve composer focus for ordinary answer updates; do not focus every re-render. | Quick reference §1/§9 keyboard navigation and `focus-on-route-change`; explicit reference fallback after no applicable database match. Refines R01/R15/R24. |
| UPM-02 / first | At 390px, sidebar opener/theme/Personalize/X are 40×40px; lesson actions are 40px high; reference chip and language control are 36px high. | Use comfortable **44px CSS hit areas** for frequently tapped phone controls, with enough room between neighbors. Keep the visible icons small and current appearance; avoid overlapping expanded targets. | Verified UX matches Touch Target Size and Touch Spacing. This is a comfort recommendation for our web product, **not** a claim every 40px control fails WCAG: the skill separately distinguishes web target-size rules and exceptions from native guidance. Refines R07/R15/R17/R20. |
| UPM-03 / next | Phone lesson body computes to **15px**; struggle/style/interests/context inputs compute to **13px**. | Use **16px for phone reading and editable input text** while keeping Inter and compact desktop labels. Recheck wrapping and panel scroll. Verify Safari keyboard/zoom behavior on a real phone rather than asserting it from headless Chrome. | Verified UX match Readable Font Size; quick reference §5/§6. Refines R09/R15/R28 without changing the owner's font family. |
| UPM-04 / next | Invalid reference URL produces a visible inline error and `aria-invalid=true`, but the input has no `aria-describedby`; focus remains on the submit action. | Give the error a stable ID, link it to the input, and focus the invalid field after failed submission. A multi-field form may use a focusable linked summary; the single URL field does not need a large new summary. | Verified UX matches Error Placement and Focusable Error Summary; quick reference §8 focus-management. Refines R04/R24. |
| UPM-05 / next | Home and Library use the same URL; source has no `pushState`, `popstate` or per-view history integration. `go()` resets scroll to the top. Existing local search/date state preservation is useful but incomplete. | Add intentional URL/history state for key views and saved course/question IDs. Browser Back should restore the previous view/filter/reading position. Route changes must honor the unsaved-pattern policy. Do not put private message text or credentials in URLs. | Verified UX match Back Button; quick reference §9 deep-linking, state-preservation and back-stack-integrity. Extends R09/R16/R22/R23. No extra model context required. |
| UPM-06 / profile before changing | Panel slides themselves use `transform`; `motion.css` also animates the reading area's `margin-left`/`margin-right`. That part changes layout during the transition. | Profile narrow/long-content cases on a phone. If frame work is high, use a measured single layout update plus transform-based visual continuity, or keep the reading measure stable during the slide. Preserve the owner's ease-in-out feel, reversibility and reduced-motion bypass. | Verified UX match Transform Performance and quick reference §3 reduce-reflows/§7 layout-shift-avoid. This is a code-level performance risk, **not measured evidence of jank, poor FPS or a CLS failure**. Refines R27. |

### What already fits and should stay

- Recognizable SVG actions; no decorative emoji navigation or unsupported voice control.
- Dark/light semantic colors, icy-blue central learning treatment and unchanged sidebar identity.
- Free-text learning-pattern inputs; green Save?/grey Saved and explicit save/discard decisions.
- Empty-disabled send, contextual waiting, recoverable errors, retained drafts, keyboard menus, and fixed sample-data disclosure.
- Interruptible sidebar slides and a real reduced-motion bypass. Do not change their requested easing merely because a generic preset recommends faster exits.
- The removed Enter/Shift+Enter helper stays removed. The skill's generic helper-copy advice is relevant for genuinely complex/invalid fields, not a requirement to restore unwanted explanatory text or success toasts.

### Evidence and remaining limits

Fresh isolated browser probe: 390×844 phone view, computed hit areas/font sizes, navigation focus, invalid-link association; an 844×390 landscape check found no horizontal overflow in the inspected view. Sample data only, no API/model calls. Detailed probe output is local ignored `app/local_results/pro-max-audit.json`; implementation references are [script.js](../design_review/detail-study/script.js), [style.css](../design_review/detail-study/style.css), [learning.css](../design_review/detail-study/learning.css) and [motion.css](../design_review/detail-study/motion.css).

The earlier 10-view axe result remains evidence of those automated checks, not proof that route focus, native Back behavior, enlarged text, safe-area behavior or real-device performance are complete. Before integration, additionally check browser/text zoom, landscape with the keyboard open, Safari/Android browser behavior, and actual screen-reader navigation. Native app checklist items should be translated deliberately if a native app is ever built.

Recommendation: implement UPM-01/02 first, then UPM-03/04/05. Profile UPM-06 before selecting a more complex animation technique. These improvements refine the approved interface rather than introduce another broad visual direction.

## 11. UI/UX Pro Max implementation in the separate example

Implemented at the owner's request in `design_review/detail-study/`; the production app is unchanged.

| Item | Implemented behavior | Verification |
|---|---|---|
| UPM-01 | Deliberate navigation focuses the new H1; restoring a scrolled entry focuses main without scrolling it away. Ordinary answer/support updates do not repeatedly invoke route focus. | Focus checked after navigation and browser Back. Route announcements avoid duplicating normal focused-heading announcements. |
| UPM-02 | At least 44px hit areas on the phone/coarse-pointer UI, retaining compact icon artwork and adjusted spacing. | No smaller visible target found in the checked phone lesson/pattern states. Desktop presentation remains compact. |
| UPM-03 | 16px mobile reading and editable input text, including touch-device landscape. Inter retained. | Computed font sizes checked for lesson and all four visible pattern fields; narrow overflow checks passed. |
| UPM-04 | Invalid reference URLs focus the input, set aria-invalid and link to inline error via aria-describedby; editing clears the stale error. | Failed/corrected input paths checked. Existing quiet save feedback remains unchanged. |
| UPM-05 | Hash routes for Home/Library/Activity and sample lesson/practice/review/question views. Back/Forward restores filters/date/scroll; dirty Back first restores the current URL and offers Keep editing/Discard/Save. | All three dirty decisions, direct question/practice links, browser forward/back, modal closing and reading-position restoration checked. |
| UPM-06 | One workspace layout update followed by transform-based movement; removed per-frame margin transitions. Kept 280ms ease-in-out, reversal and reduced motion. | A 1280px headless sample held the reading-container width at 656px during the measured interval; animated keyframes contained no layout properties. This does not establish real-device FPS/CLS performance. |

`navigation.js` contains the explicit preview history helper; `refinements.css` contains responsive touch/text rules. `refinements-check.cjs` and `refinements-verification.json` record the focused acceptance checks, alongside the original 10-view axe/interaction run. All 65 fingerprinted production application source files remain unchanged; no provider calls, persistent learner storage or backend endpoints were added. Newly created preview chats remain memory-only and do not become durable shared conversations from having a URL. Real Safari/Android keyboard, zoom and screen-reader checks remain device-level verification work.
