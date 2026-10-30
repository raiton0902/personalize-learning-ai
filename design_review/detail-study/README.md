# Personal Learning: detailed interface example

Separate interactive example based on [UI_UX_DETAIL_REVIEW.md](../../docs/UI_UX_DETAIL_REVIEW.md). The app entry point, backend and learner data are not connected to this preview. Plain HTML, CSS and JavaScript; local Inter font. No framework migration, external library requests or AI calls.

Latest owner revision: the central learning area follows the supplied icy-blue reference; sidebars remain unchanged. Stage navigation is attached to the course header, the question composer is compact without keyboard-helper copy, and the download trigger matches the current app's filled/bordered button. Enter/Shift+Enter still work. The original stage concept came from the [Q-AI workflow capture](../../docs/research/nebius-winners/qai-workflow.png) and review R18; the detached spacing was this prototype's implementation choice.

Both sidebars now open and close with a **280ms ease-in-out slide** and matching desktop workspace movement. Scrims fade; closed panels become inert immediately and are hidden after the exit finishes. Rapid reversal starts from the current position; reduced-motion users receive immediate changes. Sidebar appearance and learning-pattern input types are unchanged.

UI/UX Pro Max refinements are implemented in this example: deliberate navigation focuses the page heading; phone/coarse-pointer controls have at least 44px hit areas; phone reading and editable input text use 16px Inter; invalid reference links focus the field and expose its linked error. Browser Back/Forward restores the view, filters and reading position, with the existing unsaved-pattern decision respected. URLs contain route/sample IDs rather than question text. Sidebar workspace movement now uses one layout update and transform-based visual continuity, replacing per-frame margin animation.

Open **http://127.0.0.1:8767/** while the preview server is running. To restart from the repository root:

```powershell
.\app\.venv\Scripts\python.exe -m http.server 8767 --bind 127.0.0.1 --directory design_review/detail-study
```

The server exposes this example folder only. Port 8780 continues to belong to the application. No deployment or push is included.

## Try it

- Starts on the sample lesson with the text-based right panel open on wide screens. Compare both themes with the bottom-left sun/moon icon; on phones the theme control is in the header. Phone navigation moves into the drawer so the lesson uses the full width.
- Ask a question: the question becomes a user bubble, a 28px Thinking row appears on the assistant side, and a short prewritten response arrives. Drafts are kept internally while waiting and restored when an operation fails. This is a local simulation, not real tutoring.
- **Preview states** at the top opens loading, failed reply, reference processing, upload error, unsaved changes and completion examples. Loading-only examples remain visible until Finish simulated reply/extraction.
- Failed replies offer Retry and Edit beside the question. Editing restores the question to the composer; Retry reuses the simulated request identity. Switching to Library while a reply is pending does not pull you back when it finishes.
- Change Teaching style, then click Library, Home, New learning or the panel X. Keep editing/Discard changes/Save protects the local draft. Escape keeps editing. Save? turns green, then grey Saved without a success toast.
- Right panel retains struggle/style textareas, interests/context text inputs and the existing typed language override. New learning shows universal fields only. Desktop panel docks; smaller screens use an overlay with focus protection and a centered X.
- New learning has an empty-disabled send, editable goal starters, plus menu and removable reference chip. File/link actions are local sample selection only. File content is not read, extracted, transmitted or persisted. Upload dialogs check metadata and demonstrate correct local errors; simulated text is explicitly labeled.
- Expand the sidebar chevron to open saved sample questions. A sample question containing “coding”, “Python”, “JavaScript” or “programming” demonstrates the off-topic Yes/No decision using a local keyword rule. It is not an AI classifier. No removes only the pending exchange; Yes demonstrates an unapproved new plan.
- Give me practice opens a sample problem and reasoning-file controls. Submit first shows the answer/reasoning summary; Cancel keeps the draft. Only this fixed numeric answer is checked. It does not measure mastery.
- Library search/category filters and Activity's calendar work over the labeled sample items/events. Neither side panel is accessible in these views. Filters survive opening another view and returning.
- Checkpoint format menu downloads actual static **sample** MD/DOCX/PDF files. They contain no account data, user questions or selected file content. These are build-time sample exports, not requests to the app.
- Attachment/account/export menus support ArrowUp/Down, Home/End, Escape/focus return, click-away, viewport-aware positioning and one open menu at a time. Enter submits text forms; Shift+Enter makes a newline; composition events are excluded.

Sample messages, preferences, selected-file labels and drafts are held in memory and reset on reload. The URL preserves the selected sample view and built-in question IDs: for example `#/library`, `#/learn/algebra/practice`, and `#/learn/algebra/questions/why`. Newly created question IDs are valid only while that preview session remains in memory; an unavailable ID falls back to the lesson. No credentials, real accounts, uploads or provider configuration are loaded. Beforeunload only warns for an unsaved learning-pattern draft. A separate preview label remains visible so sample content is not mistaken for the live app.

## Changes if integrated

| Kind | Specific effect |
|---|---|
| Visual/interface only | Reading width, stage/source placement, file-type icons, button sizes, typography, hover/press/focus, dark/light and reduced-motion styling. |
| Frontend behavior | Shared keyboard menus, selected-reference chips, pending user bubble, per-thread draft/error state, copy feedback, guarded dirty navigation, local search/date continuity and goal starters. Wire to existing endpoints where available. |
| Backend/protocol work | Safe idempotent retries for writes beyond existing chat handling, stable error codes, true upload/extraction job phases, safe cancellation and durable draft/history policy. The simulated timers do not implement these. |
| AI/context decisions | Generated Explain simply/Another example, validated excerpt citations, multiple reference context and revision alternatives need a deliberate scope decision. Prewritten examples do not add any model input. |

## Review coverage

| Recommendations | Demonstrated here | Boundary |
|---|---|---|
| R01–R04 | Per-thread pending/error state, retained drafts, inline errors and stale-view protection. | Simulated operations; no network error taxonomy added to backend. |
| R05–R08 | Keyboard menus, neutral outer field focus, empty-disabled submit, concise previous-question decision. | No 1.2-second interaction lock. |
| R09–R11 | 680px reading, restrained bubbles, assistant copy action, removable source chip. | One reference only. |
| R12–R14 | Reading/file failure states, extracted-text preview, colored PDF/Word/Markdown/image marks. | Metadata/sample extraction only; no fake percentages or real OCR. |
| R15–R19 | Free-text panel, dirty-exit policy, course/question tree, guarded stages and editable starters. | Review is a read-only view; new plan requires approval. |
| R20–R21 | Short support samples and visible reference. | No invented inline citations or multi-source retrieval. |
| R22–R26 | Search/empty state, calendar, shared modal behavior, submission summary, real sample exports. | Backend scaling and production download error handling remain integration tasks. |
| R27–R32 | Whole-button icon feedback, Inter, honest capability states, saved review, completion. | No decorative signed-in motion or fake mastery score; no skeleton needed for static in-memory lists. |
| R33–R35 | Simulated chat identity reuse and transparent design-only boundary. | Durable idempotency, provider cancellation and generated revision comparison are not implemented. |

## Verification

Run `node design_review/detail-study/check.cjs` from the repository root. It uses existing `frontend_tools` Playwright/axe dependencies and a separate headless Chrome, with no access to the user's signed-in browser. Results are recorded in `verification.json`; screenshots in `screenshots/`. This is a prototype interaction/accessibility check, not live Google login, provider correctness, transcription or production readiness verification.

Final run passed: **10 axe WCAG A/AA views with zero reported violations**, no page errors, no outside requests, no horizontal overflow at 360/390/768/800/1024/1280/1440px, reduced-motion loading, successful sample downloads, error/Retry/Edit/copy, diagnostic repair, mobile navigation and panel restrictions. All **65 fingerprinted application source files remained unchanged**. Twenty screenshots capture the preview. Automated checks do not replace manual assistive-technology testing.

`node design_review/detail-study/refinements-check.cjs` additionally checks navigation focus, Back/Forward filter/date/scroll restoration, direct sample links, all three dirty-Back decisions, field-linked validation, 44px phone targets and 16px portrait/landscape touch inputs. `refinements-verification.json` records the results. A 1280px headless animation sample found a stable 656px reading-container width throughout the measured transition and no animated layout-property keyframes. This is not a real-phone FPS, CLS or Safari keyboard/zoom certification.

Selected screenshots: [Lesson dark](screenshots/lesson-dark.png), [Lesson light](screenshots/lesson-light.png), [Phone lesson](screenshots/mobile-dark.png), [Phone pattern panel](screenshots/mobile-pattern.png), [Reply loading](screenshots/reply-loading.png), [Reply error](screenshots/reply-error.png), [Reference processing](screenshots/upload-reading.png), [Unsaved changes](screenshots/unsaved-dark.png).

The design choices and deliberate limits are recorded in [DESIGN.md](DESIGN.md). The root [CHANGELOG.md](../../CHANGELOG.md) records this preview separately from implemented product behavior.

Two independent screenshot reviews identified repeated loading text, truncated course names, weak save hierarchy, narrow phone reading space and a missing intermediate algebra step. The preview now keeps the pending draft internally instead of repeating it in the composer, provides more room for course names, gives modal Save a stronger green fill, moves phone navigation into a drawer and shows the operation on both sides. Keep editing / Discard changes / Save order preserves the owner's requested dialog layout. Theme changes are immediate to avoid low-contrast intermediate color transitions.

The second review scored Design 8, Usability 7.5, Creativity 6.5 and Content 7.5 before the final phone/teaching refinements. Those are independent subjective scores, not a production-readiness claim or a fresh score of the final revision. Familiar workspace behavior is intentional. No latency, FPS or live model benchmark is claimed.
