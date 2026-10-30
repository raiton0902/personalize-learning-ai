# Browser feature audit - 28 October 2026

Target: http://127.0.0.1:8780/ (integrated app, not a design preview).
Method: actual Codex in-app Browser clicks, typing, native file-chooser uploads, reloads, screenshots and visible DOM/accessibility observations. Separate offline pytest run supplements the manual coverage; it does not establish live AI correctness.

## Outcome

The app is usable for account setup, references, intake drafts, preferences, Library search and Activity navigation. It is **not ready for a complete live course demo** with the current strong-model configuration. The requested strong route fails, and the working default-model direct answer is overly long and visibly cut off.

This is a broad feature audit, **not a claim that every feature passed**. Curriculum-dependent steps are blocked, and external integrations requiring owner login/setup remain unverified. No application code or configuration was changed during this audit.

## Environment, authorization and retained test data

- User authorized a separate local account containing synthetic content. Account: `qa-browser-20261028@example.invalid`. Its password is intentionally omitted.
- User subsequently authorized at most five real Nebius test requests within the existing budget. **Two requests were submitted**: curriculum failed with provider 404; direct answer succeeded. No inference retries or fallback calls were made. Actual provider charge was not inspected or calculated.
- No `.env`, API keys or private learner databases were read. Existing owner learning was not edited. No deployment or Git push.
- Retained synthetic account data: one physics intake/draft, one direct answer, four file-format uploads plus an additional intake Markdown upload, one pasted reference, learning preferences and related activity. The equation attachment was deliberately a test fixture, not a claim of source relevance to physics.
- Synthetic source files: `C:/Users/raito/AppData/Local/Temp/tutor-browser-qa/qa-equations.{txt,md,docx,pdf}`.
- Browser left on Home, dark theme, signed in as the test account. Temporary viewport override reset. Test data not deleted.

## Confirmed issues, reproduction and priority

### QA-01 - High - Strong model unavailable (configuration/provider blocker)

1. Create a broad physics goal, fill intake, save draft.
2. Click Propose curriculum.
3. Observe local waiting state followed by: `Model unavailable: nvidia/NVIDIA-Nemotron-3-Super-120b-a12b. Check NEBIUS_MODEL_STRONG against the exact Token Factory catalog ID and your project access. No automatic fallback was made.`

Expected: a proposed curriculum or an available configured route. Actual: provider 404 blocks curriculum and all subsequent live lesson stages. Exact cause (route ID/catalog availability/project entitlement) remains unconfirmed; the configuration file was not read. The successful default-tier request shows this is not a total service outage. Check the exact strong route in Token Factory; do not silently substitute another model or auto-retry. Evidence: [model error](2026-10-28-model-error.png).

### QA-02 - High - Direct answer ignores brevity and ends mid-sentence

1. Use the test account with saved teaching style requesting one short explanation and one example.
2. In physics intake, click Answer as a one-off question instead.
3. Observe a long continuous answer with multiple repetitive examples, ending `through repeated practice and immediate`.

Expected: concise, complete answer. Actual: visible cut-off output is presented as successful. This verifies the default model can answer in English, not that its response quality is acceptable. Investigate generation length and post-processing/schema truncation before deciding the cause. Evidence: [direct answer](2026-10-28-long-answer.png).

### QA-03 - Medium - Library stays stale after a successful upload

1. Open empty Library; click + Add a reference.
2. Upload TXT and Read file; preview contains extracted text.
3. Close preview. Library still says 0 items/empty.
4. Navigate Home then Library: uploaded item appears. Repeated for MD/DOCX/PDF, with the displayed count remaining at its old value until re-entry.

Expected: list and counts refresh when successful upload/preview closes. Extraction/storage work; current Library render is stale.

### QA-04 - Medium - Intake draft card shows impossible progress

After saving an intake draft and returning/reloading Home, the resume card says `1 of 0 objectives` before any curriculum exists. Expected: Draft/Finish setup or similar intake status. Evidence: [Home](2026-10-28-home.png).

### QA-05 - Low - Date empty state claims a 500-event boundary with only two events

With two activity events, choose 2000-01-01. Actual heading: `Date is outside the recent 500-event window`; body says the list goes back to 2026-10-28. The account has not filled a 500-event window. Expected: no activity on that date, reserving the capped-window explanation for genuinely truncated history.

### QA-06 - Medium - Reference error is hidden behind its modal

Home + -> Paste link -> https://example.com/ -> Read reference. The dialog remains on the input with no visible error. Closing it reveals `Could not read this public page. Upload or paste its content instead.` Expected: error inside the open modal. Link retrieval failed in this environment; network/provider/site-specific cause was not diagnosed. Do not generalize this one result to all links.

## Other observations requiring follow-up

- After Save draft, previously entered outcome/background move to known-context badges and their inputs disappear. Persistence works, but there is no obvious way to correct those values from the intake form. Treat as a usability concern, not proven data loss.
- At one point after selecting a saved reference, repeated clicks on the sidebar physics title left Home unchanged, while the Continue learning card successfully opened it. Earlier sidebar navigation worked. Intermittent history navigation needs a focused reproduction; no console errors were reported at the inspected checkpoints.
- Account menu aria-expanded appeared true after the theme action closed the menu. Reopening worked. Check accessibility state synchronization.

## Live Browser coverage

| Area | Checks and observed result | Status |
|---|---|---|
| Guest Home | Title, notebook illustration, goal composer and three suggestion buttons render; suggestions fill the goal | PASS |
| Guest access gate | Personalize opens account creation rather than private settings/history | PASS |
| Account creation | Authorized synthetic local signup enters signed-in app | PASS |
| Account login | Wrong password yields safe incorrect-credentials message; correct password restores account/history/preferences | PASS |
| Switch account | Returns to login and removes signed-in workspace | PASS |
| Account settings | Opens modal with test account identity and guidance | PASS |
| Theme | Light/dark toggle works; light survives reload; restored dark | PASS |
| Guest motion | Notebook visible for guest and absent from signed-in Home | PASS (presence, not frame-rate audit) |
| Learning pattern | Signed-in automatic opening; close/reopen via Personalize/header | PASS |
| Preferences | Teaching style/interests editable; Save? changes to disabled Saved; values survive reload and login | PASS |
| Dirty close | Keep editing preserves draft; Discard changes dismisses unsaved edits | PASS |
| Language | Course panel shows automatic; opening permits typed Mandarin; Apply updates label and dirty state; discard works | PASS UI; actual Mandarin output NOT tested |
| Preference scope | Home shows universal style/interests; course panel additionally shows struggle/context/language | PASS UI; exhaustive cross-course isolation NOT tested |
| Sidebar | Close/open controls present; history search removes nonmatching title | PASS search; intermittent navigation concern above |
| Home references | Plus menu, source preview, selected chip, removal and existing-reference search/selection | PASS |
| TXT upload | File chooser -> Read file -> literal extracted preview | PASS |
| Markdown upload | File chooser -> Read file -> literal extracted preview | PASS |
| DOCX upload | Text extracted including heading/body | PASS |
| PDF upload | Page text extracted and previewed | PASS |
| Intake upload | Attach files opens actual upload; selection keeps typed fields and source title | PASS |
| Pasted reference | Saves and previews synthetic physics passage; Use this reference adds chip | PASS |
| Public URL | example.com extraction failed, error hidden behind modal | FAIL / external cause unconfirmed |
| Library | Empty initial state; search by PDF title; no-match message; Notes empty category; counts after re-entry | PASS except stale-after-upload QA-03 |
| Library/Activity panels | Home history/pattern panels unavailable on overview pages; rail remains available | PASS |
| Intake creation | Broad physics goal opens compact intake without inference; main title appears once outside history | PASS |
| Intake actions | File icon, compact action group, red Skip, draft/direct-answer controls present | PASS visual/presence; Skip generation not exercised |
| Intake draft | Saved outcome/background/reference reappear after reload/resume | PASS persistence; correction usability concern above |
| Activity | Created intake/draft events shown; click event resumes course | PASS |
| Activity calendar | Date changes filter; All dates restores events | PASS control; inaccurate empty copy QA-05 |
| AI waiting/error | Curriculum local waiting text and scoped error; Dismiss restores editable state | PASS UI; provider route FAIL |
| Real direct answer | Default tier responds in English and uses saved interests | PARTIAL; brevity/completeness FAIL QA-02 |
| Responsive Home/panel | Narrow and desktop layouts inspected; narrow Home had no measured horizontal overflow and panel opens/closes | PASS limited smoke check |
| 404 | Unknown local path displays H1 and Back to learning; link returns to app | PASS |

Responsive note: Browser viewport overrides requested 1440x1000 and 390x844. The narrow DOM reported innerWidth 354, scrollWidth 340. Report the actual observation rather than claiming an exact 390px rendering. Existing offline suite separately checks its prescribed viewports. No exhaustive keyboard/screen-reader, hover animation, performance/FPS or zoom audit was performed.

## Not live-verified / blocked features

- Curriculum approval/revision/apply/discard, module/lesson progress, teaching, generated practice, assessment, reasoning-file/image submission, repair/hints, previous-step review and spaced review: blocked by QA-01; no successful real curriculum was created in this test account.
- Question threads, follow-ups, similar-question reuse, unrelated-topic Yes/No branching, saved lesson explanations and checkpoint MD/DOCX/PDF downloads: unavailable without reaching the relevant course stages; NOT manually verified here.
- Similar-course choice, Skip generation and repeated direct-answer submissions: not exercised to avoid repeating known failing/costly paths. AI allowance is a maximum, not a target.
- Google OAuth: sign-in button present; Google account authentication/consent not performed for this synthetic local account.
- Audio/video: upload dialog explicitly reports transcription needs setup and suggests transcripts. No live transcription or audiovisual understanding claim. Image OCR in reasoning not reached.
- File size/unsupported-file and malicious-file edge cases, account ownership/security isolation, rate-limit exhaustion, deletion and production deployment: not manually exercised.
- Full saved-language behavior across Mandarin/other languages and semantic math/code correctness: NOT verified by one English direct response.

## Separate automated coverage

Command from repo root: `app/.venv/Scripts/python.exe -m pytest -q`.
Result: **150 passed in 52.26s**. Includes mocked tutor/provider tests, usage/transport, ownership/workflows, exports and isolated headless browser scenarios. The private environment file is excluded by the test guard. These results do not prove that the configured strong route, Google OAuth or transcription work live. Passing tests did not catch the manually observed quality/configuration/render-refresh issues.

## Recommended next work

1. Correct/verify strong-model route or explicitly choose existing default tier; run one curriculum smoke test after owner configuration.
2. Fix direct-answer brevity and incomplete-output handling.
3. Refresh Library after upload; place extraction errors inside the modal.
4. Fix draft progress and Activity date empty copy; investigate history navigation and intake editing concerns.
5. Once a real plan works, finish the blocked lesson/chat/export walkthrough and append results here.

## Evidence

- [Strong-model error screenshot](2026-10-28-model-error.png)
- [Long/incomplete direct answer screenshot](2026-10-28-long-answer.png)
- [Signed-in Home / draft progress screenshot](2026-10-28-home.png)

Audit only: issues above are recorded, not fixed in this task.
