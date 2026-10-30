# Change record

## 2026-10-30 — Prevent curriculum language drift and compact learner targets (2026-10-30.14)

- Separated response language from country/culture/language subject matter in system and user prompts. Detect short CJK script and inspect all requested plan fields, including module titles/summaries; Latin-target plans reject CJK/Arabic/Cyrillic regardless of field length. Short English country goals and curriculum labels avoid known detector false positives.
- Added the explicitly requested single language-repair pass for non-bundled proposals. It uses existing request/budget controls, preserves structural IDs, order, membership, prerequisites, source identifiers, minutes, concept IDs and assessment flags, and stops after one repair. This can incur one extra provider request when drift is detected. No automatic transport retry or fallback; stored plans are not regenerated on load.
- Removed orphan rich-text outcome blocks from Plan. Standard and Cramming targets now render as one idempotent semantic bullet list after scope, at 13px with KaTeX intact; module outcomes use matching compact bullets. Three handoff files synchronized.
- Full suite passed: 238 tests (112.73s), including one-pass repair success/failure/structure guards, correct-language no-repair, system/user instruction checks and existing workflows. Headless checks cover 12 ordinary guest/auth/redirect cases plus 4 Cramming theme/viewport cases; verify one target list, no orphan outcomes, 13px text and KaTeX after repeated renders. Eight synthetic Plan screenshots captured in `app/tests/artifacts/plan-targets/`; representative dark desktop and light mobile images visually reviewed. Older browser assertions now wait for route transitions and allow five Home suggestions to extend short screens. No paid API calls, credential inspection/changes, private database inspection or dependencies. Provider language compliance remains untested live. Local server restarted with the existing main-route/$1 overrides; root HTTP 200 confirmed.

## 2026-10-30 — Resolve redundant module mapping conflicts (2026-10-30.13)

- A valid explicit lesson module_id now determines the lesson's single module if generated objective_ids lists disagree; title and lists are rebuilt consistently. Multiple listed modules without a valid explicit assignment are still rejected, and existing track/grounding/approval validation remains. The model prompt now requests consistent mappings. This addresses one reproducible class of the reported error; the owner's actual provider response was not inspected.
- Isolated track and Cramming suite: 43 passed, 1 browser test deselected (5.19s). Covers both resolvable conflict forms and ambiguous rejection. No paid model calls or automatic retries. Three handoff files synchronized; local server restarted with existing main-route/$1 overrides and access logging disabled.

## 2026-10-30 — Show workspace book through header (2026-10-30.12)

- Replaced the signed-in header's opaque theme background with a translucent, blurred surface so the notebook can appear behind the top strip. Applied across Home, learning, Library and Activity in both themes; sidebars continue to cover the book. Three handoff records synchronized.
- Isolated browser QA passed (1 test, 31.92s), including Home, Library and Activity at desktop and mobile sizes in both themes, the learning header, no horizontal overflow and the existing contrast/navigation checks. The first run exposed a test color-serialization mismatch and mobile sidebar test setup; both were corrected. No model calls.

## 2026-10-30 — Book favicon and workspace background (2026-10-30.11)

- Replaced the favicon with a transparent SVG book, icy-blue outline and crimson italic x/y; added a cache-busting icon URL. Mounted the existing Hairline notebook as a large non-interactive, aria-hidden workspace background, including projected formulas, gentle page motion, responsive theme updates and reduced-motion shutdown. It stays viewport-centered behind the sidebars; learning views use lower opacity and stronger blur. The main surface is transparent over the theme ground so the book remains visible. Guest notebook remains available.
- Three handoff files synchronized. Two isolated browser regression tests passed (85.12s) before the final background-layer visibility correction; the browser QA regression passed again afterward (1 test, 29.84s). Eight synthetic dark/light, desktop/mobile and normal/reduced-motion cases verified positioning, sidebar stability, formulas, blur and SVG contents. The final dark Home layer was visually inspected after correcting the opaque main background. No paid model calls.

## 2026-10-30 — Shared button hover feedback (2026-10-30.10)

- Scanned current button/hover rules and added shared animated brightness plus an inset boundary for enabled buttons, covering future/dynamically rendered menus, dialogs, Library, Activity and course actions. Kept specific transforms and icon exclusions, disabled-state behavior, language arrow-only highlighting and reduced-motion support. Theme-specific brightness avoids washing out light controls. Three handoff documents synchronized.
- Verified84 enabled-button hover states across Home, auth and dynamic dialogs in both themes with normal/reduced motion. Existing isolated browser QA regression passed (1 test,26.66s), covering account/reference/navigation and theme/accessibility checks. No model calls.

## 2026-10-30 — Suggestion hover feedback (2026-10-30.9)

- Added subtle lift, border and color feedback on the three standard Home suggestions; reduced-motion users receive static color feedback. Three handoff documents synchronized. Isolated browser checks passed for all three buttons in both themes with normal and reduced motion; no model calls.

## 2026-10-30 — Presentation suggestion (2026-10-30.8)

- Changed the second Cramming suggestion to “I have presentation this morning” and made its inserted context refer to the presentation, including for an existing goal. The suggestion still enables Cramming. Three handoff documents synchronized. JavaScript syntax and isolated browser checks passed for empty and existing goals; no model calls.

## 2026-10-30 — Composer controls and suggestion layout (2026-10-30.7)

- Made the second composer layer match the theme background with a thin contrasting border; styled Personalize as an icy-blue person-icon pill. Added a second Cramming suggestion and arranged three standard suggestions above two Cramming suggestions, with responsive wrapping. Both Cramming options activate the existing mode and preserve typed goals. Interpreted “icy crimson” as icy blue for Personalize.
- Three handoff files synchronized. Isolated browser regression passed (1 test, 38.92s), covering guest login, five suggestions, both Cramming starters, both themes, desktop/mobile and no horizontal overflow. The dark desktop result was visually reviewed. No model calls.

## 2026-10-30 — Ice-blue save and crimson submit (2026-10-30.6)

- Recolored green save/positive states and the teal account avatar to icy blue, and orange practice/confirmation Submit to crimson. Existing file-type and Google brand colors remain. Three handoff records synchronized.
- Isolated browser QA regression passed (1 test, 31.04s), including both themes. Synthetic screenshots show representative button and positive-state colors; light-theme dialog specificity was checked and explicitly overridden after the run. No paid inference.

## 2026-10-30 — Match Cramming button sizing (2026-10-30.5)

- Reduced Cramming toggle height and padding to align with Personalize: 36px desktop height, similar width, and 44px touch height on phones. Crimson, icon, animation and behavior remain. Three handoff documents synchronized.
- Verified in isolated headless Chrome at 1440px and 390px, in dark and light themes: Personalize measured 105px wide, Cramming 103px; both measured 36px high on desktop and 44px on mobile, without horizontal overflow. No model calls.

## 2026-10-30 — Unified progression, Cramming, panel resizing and scoped matching (2026-10-30.4)

- New non-bundled standard proposals always generate Beginner→Intermediate→Advanced upfront (3–5 modules /6–18 objectives). Removed track cards from intake/revision, next-track previews and extension buttons from all current/saved-review surfaces; module level badges remain visible. Saved courses/defaulted schema fields and legacy extension API are retained, with plan approval and sequential teaching unchanged.
- Added right-aligned crimson Cramming toggle and exam-tomorrow starter to the two-layer composer. Exact notebook colors/tints, activation ring/icon feedback,2.2s perimeter pulse and reduced-motion suppression. Course-specific boolean survives guest auth and drafts; urgent goal phrases enable it. Deterministic extraction fills the Calculus topics/weak area/time/calculator-rule example; every field stays editable. Cramming proposes3 exam-focused modules /3–9 lessons and rejects estimated workloads above recognized numeric hour/minute budgets. No extra extraction model call or exam-readiness guarantee.
- Added pointer/keyboard separators: history180–420/default252 and pattern240–480/default310. Arrow keys16px, Home/End, reset by double-click, localStorage persistence, rendered-width ARIA and desktop central-space cap. Handles hidden on existing mobile/overlay breakpoints; pointer cancellation clears resizing lock. No width settings sent to backend.
- Similar-learning matching now compares core subject AND residual specificity after framing/typo normalization. Broad rephrased machine learning resumes the same saved-course choice; narrowed unsupervised scope creates a separate learning. C/C++/C#/R/Go, supervised/unsupervised and different technical subtopics remain distinct. Standard/Cramming courses do not collide. No embeddings or new model context. Guest recapture refreshes mode/profile with the same logical request UUID.
- Verification: full offline suite **203 passed (115.80s)**. Includes12 signup/login/simulated-redirect scenarios and4 new Cramming scenarios across1440×1000/390×844 and dark/light; reduced motion, exact crimson, control alignment, editable prefill, no selector/extension UI, all module levels, resize drag/keyboard/reset/bounds/persistence,1051px constrained layout and zero horizontal overflow. Existing axe and account/source/workflow regressions pass. Initial run found two obsolete single-module generation fixtures and a crimson-on-raised contrast failure; fixtures now provide full progressive proposals and tint composites over theme ground. A theme-color assertion now waits for the actual CSS transition to finish. New negative tests prevent supervised/unsupervised fuzzy collisions.
- Synthetic captures visually reviewed under app/tests/artifacts/cramming/. Existing docs/qa/screenshots/tracks captures are regenerated by their browser regression and now show unified intake; historical test counts remain dated. Three handoff files synchronized, including substantive contracts and U21–U23/P33–P35 inventory. Local8780 was initially off; started updated uvicorn in a managed terminal session with existing main-model/$1 process-only overrides, then verified HTTP200/current assets.
- Delivery checks: five changed JavaScript files passed node --check; all16 changed text files passed whitespace checks; three current handoff revision headers and all relative Markdown links resolved.
- No new dependency/destructive DB migration, legacy Streamlit edit, .env/private learner DB inspection, paid provider request, real Google consent test, deployment or Git push. Parsing/matching are conservative English/lexical heuristics; live model correctness/latency/plan compliance and transcription remain unverified. Existing transport limits, budget controls and manual-only retries remain.

## 2026-10-30 — Recheck learning-track brief and cancel cleared guest goals (2026-10-30.3)

- Re-read the repeated implementation brief using the three documents' current handoff/ paths and inspected the live auth, intake, track/schema, revision and extension code. Guest auto-resume, editable scope prefill, three tracks and progress-preserving extension already exist; no duplicate implementation added.
- Fixed captureGuestLearning in app/web/live.js: an empty/whitespace goal at auth entry clears memory and sessionStorage instead of retaining a previously deleted guest submission. Nonempty-goal capture, failed-login retention, UUID reuse and consume-before-submit remain unchanged. Added four cancellation regressions to app/tests/browser_tracks.cjs across both themes and required desktop/phone sizes.
- Reproduction: new browser regression failed against the old code with the cancelled goal still queued. After correction, app/tests/test_learning_tracks.py + app/tests/test_personal_learning.py: **24 passed (66.41s)**, including12 headless signup/login/simulated-redirect scenarios, all track choices, revision selector, extension preservation,44px targets, neutral field focus and zero overflow. Four regenerated intake screenshots visually reviewed. Full176-test suite was not rerun in this focused frontend correction; its earlier result remains dated in its original entry. Both changed JavaScript files passed node --check; tracked-file git diff --check passed.
- Three handoff files synchronized to2026-10-30.3. No CSS redesign, new dependency, backend/schema or legacy change, .env/private learner DB access, paid provider request, real Google consent test, deployment or Git push. English-pattern intake interpretation and24-lesson full-track ceiling remain documented limits.

## 2026-10-30 — Group handoff documents (2026-10-30.2)

- Moved CURRENT_ARCHITECTURE.md, UNREALIZED_CHANGES.md and UI_FEATURE_PROVENANCE.md from docs/ into root handoff/. Updated mandatory AGENTS.md paths, continuation prompt and relative evidence/research/inbound documentation links. Earlier dated entries retain their original path names as historical records.
- Verified all176 relative links in the three moved documents resolve. Application code, settings and learner data unchanged; no test rerun needed for document organization only. All three handoff records synchronized to2026-10-30.2.

## 2026-10-30 — Preserve generated module membership (2026-10-30.1)

- Reproduced selected-track error with valid Intermediate/Advanced responses that specify module objective_ids but omit optional objective module_id. Normalizer previously ignored the module lists, assigned all lessons to the last module and removed the empty modules.
- Honor module membership for unassigned objectives; reject multiple-module or contradictory explicit assignments. Track bounds/progression remain enforced, without automatic retry/fallback. Owner's actual failed response was not inspected; no .env/private learner data access, paid calls, dependencies or schema changes. Three handoff documents synchronized.
- Verification: regression first failed for Intermediate/Advanced and passed for Beginner; after correction, track/personal-learning suites22 passed (44.78s), then full offline suite **176 passed (112.38s)** including conflicting-mapping cases and headless browser flows. Scoped whitespace check passed. Local8780 server restarted with existing main-model/$1 overrides; no live generation retried.

## 2026-10-29 — Guest continuity and learning tracks (2026-10-29.12)

- Guest Home submissions and auth-entry clicks preserve goal/profile/resource/request UUID in memory plus sessionStorage, consume once after successful email auth or authenticated boot, close pattern and start course creation. Failed login retains pending data; reload does not resubmit. Boot waits for the learning handler when necessary.
- New courses stay in editable intake unless explicitly skipped/provisional/completed. Deterministic English clause extraction fills outcome, prior knowledge, time/deadline, requirements and track; explicit values win and all four inputs remain editable/clearable. No extra extraction model call.
- Intake and plan revision expose three track cards with aria-pressed/Selected text and44px minimum targets: Beginner1module/1–5lessons, Intermediate2–3/6–12, Full3–5/10–24. Schema fields are additive/defaulted. Generated counts, ordered levels and references are validated; beginner preview shows future tracks. No unlimited-path promise beyond the existing24-objective cap.
- Extend to Advanced path is available for eligible non-bundled plans/active/completed/saved-review views. Existing module/objective definitions are retained; ownership/version/dedup and candidate approval are reused. Approved extension keeps current lesson/index, histories and attempts; completed courses resume at first added lesson. Fixed sample and oversized saved plans get explicit limits. Only extension requests add the existing curriculum to model context; no new chat/test history transmission.
- Verification: full offline suite **171 passed in95.58s**; final targeted feature suite **11 passed in34.57s**, including12 headless signup/login/simulated-redirect×theme×viewport scenarios at1440×1000/390×844. Checks cover failed auth, exactly-once course creation/reload, editable prefill, all track choices, revision selector, neutral field focus,44px targets, zero overflow, schema defaults and Beginner/Intermediate active/completed extension preservation. Older downstream tests explicitly skip intake where intake is outside their purpose.
- Evidence: `docs/qa/2026-10-29-learning-tracks.md` and synthetic `docs/qa/screenshots/tracks/`. Three handoff documents synchronized to2026-10-29.12. No new dependency/destructive DB migration, protected .env/private learner DB inspection, paid model call, real Google consent test, deployment or Git push. Legacy Streamlit and previews retained. Live model pedagogy/shape compliance remains unverified.

## 2026-10-29 — Revision dialog button (2026-10-29.11)

- Removed composer-only secondary class from Request curriculum revision; it now uses the dialog's compact Close-style button treatment in both themes. Three handoff documents synchronized.

## 2026-10-29 — Plan numbering (2026-10-29.10)

- Removed manually repeated numbers inside ordered plan lists and normalize leading numeric prefixes on displayed objective titles, including saved plans and revision previews. Stored learner data is unchanged; three handoff documents synchronized.

## 2026-10-29 — Learning source row and missing solution (2026-10-29.9)

- Removed the course/source breadcrumb from the learning screen; intake source selection remains. Existing saved `NO_SOLUTION` placeholders display an honest unavailable message rather than broken math; new practice prompt asks for a real solution. Its origin in the reported example is unverified, and model output can still be imperfect. No paid inference. Three handoff documents synchronized.

## 2026-10-29 — Remove top course title (2026-10-29.8)

- Removed the duplicate course title from the learning-page top bar; the page title and stage navigation remain. No backend changes. Three handoff documents synchronized.

## 2026-10-29 — Remove duplicate hint control (2026-10-29.7)

- Removed the duplicate I need a hint button from practice; Need help? retains its existing hint request / follow-up focus behavior. Reviewed other overlapping controls: Personalize and the panel icon both open learning pattern; Library + New and its empty-state Add a reference both open upload; Review stage and Start quick review can both initiate review when due and no history exists. These contextual shortcuts remain for owner decision. No backend/provider calls; UI handoff documents synchronized.

## 2026-10-29 — Owner $1 budget (2026-10-29.6)

- Default local allowance now$1; current server explicitly receives NEBIUS_BUDGET_USD=1. Existing cumulative ledger retained, no reset. Local estimate/reservation guard remains distinct from a provider billing cap; environment may override default on future starts. No .env access or paid test.

## 2026-10-29 — Output headroom (2026-10-29.5)

- Increased assessment/diagnostic/repair/practice output ceilings2048→4096; existing timeout, thinking toggle, budget, incomplete-output rejection and manual-only retry remain. Higher ceiling may increase per-request token use; no inference sent. Transport expectation tests updated; three handoff files synchronized.

## 2026-10-29 — Activity alignment and explicit local routing (2026-10-29.4)

- Activity date and All dates now share a flex row, zero margins and equal 44px height; headless browser geometry verified.
- Restarted local 8780 server with process-only NEBIUS_MODEL_STRONG blank override, explicitly selecting the configured main model for all purposes. Existing load_settings blank-to-None behavior; no automatic fallback, .env read/edit or paid call. Actual inference remains unverified. Override lasts only for this server run.

## 2026-10-29 — Library layout and theme canvas (2026-10-29.3)

- HTML canvas now follows theme; overview pages fill viewport, removing black footer strip in light mode. Duplicate top Library/Activity label removed while page H1 remains.
- Library adopts owner-provided ChatGPT screenshot: compact search/New toolbar, responsive file-card grid, colored PDF/Word icons, functional grid/list toggle and existing filters/upload/open/search behavior.
- Strong-model 404 explained as unresolved catalog/access configuration; no .env inspection/change, fallback or inference calls. Three handoff files synchronized. JS syntax and diff whitespace checks pass. Headless browser confirmed black/white root canvas, grid/list switching and no desktop overflow; isolated browser regression passes across both themes/four widths, including uploads/search and axe. Intermediate checks caught and corrected toggle/PDF light-theme contrast. Historical .1 review artifacts are overwritten by this regression and describe current UI captures, not a fresh full audit.

## 2026-10-29 — Owner focus correction (2026-10-29.2)

- Removed interior focus outlines from all integrated input/textarea/select controls, including the goal composer. Existing neutral field/composer boundaries identify them. Buttons, links and disclosures retain neutral grey keyboard focus instead of blue, in both themes. Owner correction supersedes the earlier blue-ring contract. Backend unchanged. Headless Chrome verified focused goal outline and box-shadow both none in dark/light; browser regression expectations updated for the owner correction.

This file records project changes. Entries distinguish working code, automated verification, and external setup that remains pending. Earlier design iterations are summarized rather than assigned invented dates.

## 2026-10-29 — QA/UI defect fixes (Revision 2026-10-29.1)

- QA-01: `app/llm.py` validates clean NVIDIA/Nemotron default/strong route syntax before transport. Exact strong-route 404 diagnostic, no automatic retry and no fallback preserved. This does not establish catalog availability or entitlement; no configuration inspection/change.
- QA-02/P32: `web_tutor.py` propagates saved brevity/style into direct-answer instructions, uses a 1,200-character schema with the existing 1,536-token limit, and rejects long nonterminal prose/unclosed code fences. An integration test proves incomplete output preserves the prior saved answer. Heuristic completeness and prompt brevity still require live-model evaluation; no model calls made.
- QA-03–06: Library refreshes list/count on source-preview close (actual TXT/MD/DOCX/PDF extraction tested); draft cards show Draft/Finish setup; Activity outside-window copy requires 500 retained events plus an older date; extraction errors appear as alerts inside open dialogs. Saved intake outcome/background stay editable. Sidebar course clicks work after reference selection; account menu closure resets aria-expanded.
- UI-01–08 / V01/V03/V04/V09 / P23/P31/P32: final theme tokens repair action/muted/icon/placeholder contrast and required-control boundaries. Keyboard input/textarea/button focus is 2px with 3px offset; pointer focus stays quiet. Guest notebook gets image semantics without figure changes. Touch prose 16px/1.5, metadata 12px/1.4, enclosing controls >=44px and no horizontal overflow. Repair explanation moves into a closed View lesson disclosure with 16px gap, preserving equation font/numerals/baseline/crimson mark/text cues and placing worksheet in first viewport.
- Verification: baseline **150 passed (27.65s)**; final `app/.venv/Scripts/python.exe -m pytest -q`: **160 passed (53.46s)**. New `test_defect_regressions.py` and isolated `browser_defects.cjs`: 193 assertions passing. Four prescribed widths and both themes; 48 focused axe scans with 0 violations, 1,516 captured color pairs with 0 failures, input/textarea/button focus verified. Broad matrix: 188 axe scans with 0 violations, 11,262 computed color samples with 0 actionable failures (12 genuinely disabled Send samples retained as exemptions). `contrast-check.py` independently recomputes pairs. Raw axe manual-review items and broad hover/obsolete-label harness warnings are disclosed, not treated as live passes.
- Evidence and limits: `.ui_review/2026-10-29-fixes/report.md`, `data/after-functional.json`, `after-dom.json`, `after-axe.json`, `after-focus.json`, `verified-contrast.json` and screenshots. Test environment blocks protected `.env` loads, sets a synthetic session secret and uses temporary databases. All three handoff documents synchronized to **2026-10-29.1**; PREVIEW inventory, U10 PENDING, U17–U18 DEFERRED and legacy Streamlit preserved. Google OAuth, transcription and actual strong route remain UNVERIFIED. No owner secrets/private learner DB access, paid calls, deployment or push.

## 2026-10-28 - Live Browser feature audit

- Report: `docs/qa/2026-10-28-browser-feature-audit.md`, with three screenshots and explicit live/manual, mocked and blocked coverage.
- User authorized synthetic local account and up to five inference requests; two submitted. Strong-tier curriculum returns provider 404; default-tier direct answer succeeds but is long and cut off. No retries/fallback, environment inspection or configuration/code changes.
- Recorded stale Library after upload, invalid draft progress, misleading Activity date copy, hidden modal extraction error and follow-up concerns. TXT/MD/DOCX/PDF, intake uploads/drafts, preferences/language UI, authentication, references, search, navigation and 404 exercised in Browser.
- Separate offline full suite: 150 passed in 52.26s. Later real lesson/chat/export stages remain blocked by unavailable strong route. Google OAuth and transcription not live-verified. Synthetic test data retained; no owner learner data edited, deployment or push. No application or preview code changed. Three handoff records synchronized to 2026-10-28.10 with audit evidence and unchanged implementation/provenance semantics.

## 2026-10-28 - Intake upload and provider-error diagnosis (Revision 2026-10-28.9)

- Fixed `step-repair-live.js` intake Attach files opening an empty existing-reference picker. It now opens actual upload; `live.js` upload/source-preview selection callback preserves intake/drafts and updates selected source. Existing ownership/extraction limits retained.
- `llm.py`: provider 404 now names selected model and relevant NEBIUS_MODEL/NEBIUS_MODEL_STRONG setting. This diagnoses the requested route without exposing keys or adding fallback/retry. Actual catalog availability, entitlement and owner configuration remain unconfirmed; no `.env` inspection or live inference.
- Extended personal-learning browser test to upload a synthetic TXT through intake, select it, and assert draft/intake/source continuity. Verification: 70 request/personal-learning tests passed (20.33s), then the newly extended upload browser test passed (13.66s). Local server restarted; no paid inference.
- All three handoff documents synchronized to .9; UI-R/P32/API-ERROR affected, other design provenance, previews and deferred inventory reviewed unchanged.

## 2026-10-28 - Owner composer and intake correction (Revision 2026-10-28.8)

- `app/web/step-repair-live.css`: restored attached two-layer Personalize strip, centered Home suggestions, compact intake actions with icon/label alignment and red/white Skip. Both-theme tokens and wrapping retained.
- `app/web/step-repair-live.js`: removed visible pace badge and repeated small intake header goal; kept main H1. Attach files has a file icon; Skip sits after Propose curriculum in the same action group. Existing upload/reference picker, draft, direct-answer and curriculum handlers retained; no inference requests made.
- `app/tests/test_personal_learning.py`: updated Home overlap geometry expectation and added intake header/Skip/file-icon checks. Verification: 8 passed in 20.22s, including isolated headless Chromium Home geometry at four sizes in both themes and intake/workflow checks. No paid model calls.
- Synchronized all three handoff records to .8. This owner instruction supersedes .7's detached Personalize gap; other backend, source provenance and preview semantics reviewed unchanged.

## 2026-10-28 — Purpose limits, optional model controls and metadata polish (Revision 2026-10-28.7)

- **A1:** `app/llm.py` now applies purpose-specific output/timeout limits: curriculum/lesson 4096 tokens/120 seconds; assessment/diagnostic/repair/practice 2048/60; question chats 1536/60; other purposes 512/60. Absolute ceiling 8192, integer validation, 24 KB input bound, length error and zero automatic retries remain. `app/tutor.py` delegates output selection to that table; existing `web_tutor.py` purpose labels already match and its prompts/context were not changed.
- **A2:** optional `NEBIUS_MODEL_STRONG` defaults to the existing model and selects only curriculum/lesson/diagnostic/repair when configured. Both IDs require NVIDIA Nemotron validation. Assessment retains the default model to preserve requested cost behavior and existing deterministic bundled checking; general-subject correctness is still model-dependent. Settings no longer retains the API key; request construction reads it locally.
- **A3:** `app/usage.py` accepts optional `NEBIUS_BUDGET_USD` (default 2.0; finite positive values up to 100). Pending/unknown $0.01 reservations remain transactional. Nano estimates remain 0.06/0.24 USD per million input/output tokens; Super estimates 0.30/0.80 are explicitly UNVERIFIED. Unknown routes/missing usage keep cost None and reservation. The meter remains a local estimate, not a provider billing cap.
- **A4:** optional `NEBIUS_ENABLE_THINKING` defaults false; true enables only assessment/repair with a 4096-token limit. Reasoning-only/empty responses give safe errors after metering; private reasoning fields are not shown. No prompt changes or retries.
- **A5:** `app/web/index.html` adds description/canonical/Open Graph/Twitter metadata and `app/web/favicon.svg`. `app/web_server.py` serves themed browser 404 with H1/home link while unknown APIs retain JSON errors. `app/web/step-repair-live.js` and `app/web/live.js` correct H1-to-H3 skips; `account-revision.css`, `step-repair-live.css` and inline example CSS preserve the existing heading appearance.
- **A6:** final Home CSS separates Personalize strip from composer by 10px, preserving V09 centered geometry and first-screen divider. **Font reduction not delivered:** actual Inter asset is already one 352,240-byte variable WOFF2, not the reported 598 KB; no offline fontTools/pyftsubset found. No package installation; font and license unchanged.
- **Tests:** `app/tests/conftest.py` prevents collection/runtime reads of protected `app/.env` while allowing synthetic test configuration. Extended `test_llm.py`, `test_usage.py`, `test_web.py`, `test_personal_learning.py` cover request limits/timeouts, default/strong transport and ledger selection, budget parsing/prices, thinking, reasoning-only safety, metadata/favicon/404, and Home gap/fold/Inter-family/overflow at four viewports in both themes. Replaced an existing fixed 200ms export-dismiss test wait with a wait for removal after a full-run timing failure.
- **Verification:** baseline `92 passed` (34.47s); final root `app/.venv/Scripts/python.exe -m pytest -q`: **150 passed** (50.61s), with isolated temporary data and mocked providers. Intermediate full run: 149 passed / 1 browser timing failure, corrected as above. No `app/.env` access/edit, paid inference, deployment or push. Legacy `app/app.py`, accounts and private learner databases untouched by this task.
- **A7:** synchronized `docs/CURRENT_ARCHITECTURE.md`, `docs/UNREALIZED_CHANGES.md`, `docs/UI_FEATURE_PROVENANCE.md` to revision 2026-10-28.7. Corrected stale architecture prose claiming all plans had three objectives (general plans already supported 24 since .6); replaced stale fixed output/timeout/thinking/meter descriptions. Historical preview/audit evidence stays dated; U10 remains PENDING and U17–U18 DEFERRED.
- **NOT live-verified / owner actions:** confirm Nano and Super prices in Token Factory console, strong-route entitlement and thinking compatibility, then optionally run one manual real learning session after owner configuration. All three new environment variables are optional; nothing breaks if none are added. Font subsetting remains pending offline tooling. Production server was not restarted, so owner restart is needed to load backend changes.

## 2026-10-28 — Personal-learning workflow upgrade, flexible curriculum hierarchy, and spaced review (Revision 2026-10-28.6)

- Upgraded the integrated browser learning application (`app/web_server.py`, `app/web_tutor.py`, `app/web_store.py`, `app/learning_history.py`, `app/review.py`, `app/review_selector.py`, `app/checkpoints.py`, `app/schemas.py`, `app/web/step-repair-live.js`, `app/web/step-repair-live.css`) to implement the `personal-learning` workflow (`P32`, `U16`, `U19`) while preserving existing authentication, ownership checks, episode evidence, deterministic algebra checks, and the legacy Streamlit app:
  - **Compact intake & direct questions:** Added `web_tutor.needs_intake` and `build_intake_state` so broad goals lacking essential context open a compact intake step (`stage = "intake"`) capturing `intended_outcome`, `starting_knowledge`, `time_budget`/`deadline`, and `requirements` while reusing universal preferences (`tone`, `interest`) and course references. Added `submit_intake`, `intake`, `skip_intake`, and `intake_draft` actions (persisted across reload), plus `direct_question` on `POST /api/courses` and `POST /api/courses/{cid}` to answer standalone questions without starting a course or falsely approving a curriculum.
  - **Source-aware planning & flexible hierarchy (`Course → Modules → Lessons/Objectives → Concepts`):** Removed the 3-objective cap on general courses (`GeneralPlan.objectives` supports `min_length=1` up to `MAX_CURRICULUM_OBJECTIVES = 24`) while preserving the 3-topic (`TOPICS`) deterministic constraint on bundled algebra (`Curriculum`). Added `web_tutor.inspect_source` to extract identifiable source headings (`source_sections`) and flag truncated/unavailable coverage (`grounding_status = "partial_source"`, `unavailable_sections`) or mark sourceless plans as `unverified_general`. Added `ConceptItem` and `CurriculumModule` schemas, prerequisite bridges (`prerequisite_bridges`), cumulative review points (`review_opportunities`), and separated `optional_enrichment`, with server-side validation of IDs, references, and prerequisite cycles (`normalize_curriculum`).
  - **Approval, candidate revisions (`U19`), and one-time export offer:** Revising an already-approved course creates a candidate revision (`pending_revision` with `version = state["version"] + 1`) requiring explicit `apply_revision` (or `discard_revision`) without overwriting the accepted curriculum or lesson progress. Approving a plan shows a one-time checkpoint export offer (`export_offer`, `dismiss_export_offer`) and updates `app/checkpoints.py` to export the module/lesson/concept hierarchy, current position/next step, and concept/review state across `.md`, `.docx`, and `.pdf`.
  - **Adaptive teaching, optional checks, and schema v2 continuity:** Added `compute_teaching_adaptation` (`step_size`: `split` / `single` / `combined`; `support_level`: `worked_example` / `guided_completion` / `independent_application`) driven by recent attempt and assistance evidence, concrete domain examples (code variable trace, math steps, observable criteria), and 21 KB prompt context budgeting across all purposes. Added `skip_check` for objectives with `assessment_required: False` (records `status = "unassessed"`, never mastered) while enforcing server-side assessment gates where `assessment_required: True`. Added deterministic `schema_version = 2` migration in `learning_history.normalize_course_state` preserving flat v1 courses, `current_position`, and `next_action`.
  - **Integrated spaced review (`U16`):** Connected `app/review.py` and `app/review_selector.py` (`Asia/Jakarta` learner date or explicit `on_date` / `LEARNING_REVIEW_DATE`) to `public_state["review_status"]` and course actions `start_review` and `skip_review` (bounded to 1 previously taught, approved-course concept; repeated lapses `>= 3` route to relearning explanation rather than endless drilling; same-session success sets `"developing"` while delayed review sets `"secure"`).
- Synchronized `docs/CURRENT_ARCHITECTURE.md`, `docs/UNREALIZED_CHANGES.md`, and `docs/UI_FEATURE_PROVENANCE.md` to revision `2026-10-28.6`.
- Verification: `92 passed` in `app/tests` (`pytest`), including 8 new end-to-end scenario tests in `app/tests/test_personal_learning.py` (Scenarios A–I including headless Chromium Playwright verification across `1440×900` desktop and `390×844` mobile viewports with `0` page errors and `0` horizontal overflow). Used temporary isolated SQLite storage and deterministic fixtures; no paid live model calls, live Google OAuth consent, or live external transcription provider was invoked; no deployment or Git push performed.

## 2026-10-28 — Live realization of step-repair, proposal-feedback, and owner viewport refinements (Revision 2026-10-28.5)

- Realized `V01`–`V09`, `U01`–`U09`, `U11`–`U15`, `U20`, and `B01`–`B06` into the live integrated browser application (`app/web/index.html`, `app/web/step-repair-live.css`, `app/web/step-repair-live.js`, `app/episode_helpers.py`, `app/web_server.py`, `app/learning_history.py`, and `app/schemas.py`) while keeping `U10` (`PENDING`) and `U16`–`U19` (`DEFERRED`) explicit.
- Added backend `app/episode_helpers.py` and updated `app/web_server.py`, `app/learning_history.py`, and `app/schemas.py`:
  - Implemented `request_id` idempotency/deduplication (`creation_request_id` and bounded `completed_requests`) across `POST /api/courses` and `POST /api/courses/{cid}` (`approve`, `revise`, `teach`, `practice`, `attempt`, `diagnostic`, `next`, `hint`, `correct_observation`), plus structured error JSON (`{error, code, retryable}`) in `BoundaryMiddleware`.
  - Implemented Unicode code-point span validation (`0 <= start < end <= len(line)` and `line[start:end] == quoted_text`) and deterministic operator/sign error detection with safe unhighlighted fallback when uncertain.
  - Added `hint` course action (persists `hint_opened` on the current `exercise_instance` in SQLite before returning hint text) and `correct_observation` action (ownership and `observation_id` validated; records learner-selected focus without exposing private `learning_signals`).
  - Added public `state["episode"]` projection (`steps`, `work_sheet`, `observation`, `assistance`, `outcome`) distinguishing `correct_without_recorded_help` (`Solved independently`), `correct_with_help` (`Solved with a hint` / `Solved with guidance`), `repaired_needs_transfer`, and `unresolved`, with explicit caveat `"One attempt is not proof of mastery."`
- Added frontend `app/web/step-repair-live.css` and `app/web/step-repair-live.js`:
  - Centered Home first-screen (`.home-first-screen`) with balanced `What would you like to understand?` H1, removed subtitle and Home header label, placed `1px` bottom divider at the first-viewport edge with `.resume-learning` below the fold, added editable goal starters (`[data-starter]`), `+` menu `Use an existing reference` dialog over owned `/api/resources`, and removable `.attachment-chip` (`#remove-reference`).
  - Docked stage strip (`Plan` / `Learn` / `Practice` / `Review`) with no Plan SVG tick, closed-default right personalization panel on first course entry, and compact `.context-line` course/source bar.
  - Added operation-scoped waiting indicator (`#operation-feedback .thinking`) with action-specific labels (`Preparing your lesson…`, `Writing a practice problem…`, `Checking your answer…`, `Preparing help…`), reserved trigger width, `inert` form lock outside `#operation-feedback`, and inline pre-send vs unknown-completion error recovery (`Try again` reusing `request_id`, `Check saved result`, `Edit answer`/`Edit step`) preserving drafts and attachments.
  - Added `Need help?` button (`#fff` fill, `#000` ink, `44px` min-height, `10px` radius in both themes), `I need a hint` button, 3-step repair micro-path (`1. Find the step`, `2. Repair it`, `3. Try independently`), `.work-sheet` / `.equation-stack` in `'Times New Roman', serif` (`27px` desktop / `25px` mobile, `lining-nums tabular-nums`) with `<mark>` operator highlight, `That's not where I'm stuck` correction dialog, and counted Library/Activity empty states.
- Synchronized `docs/CURRENT_ARCHITECTURE.md`, `docs/UNREALIZED_CHANGES.md`, `docs/UI_FEATURE_PROVENANCE.md`, and `ui_improvement_proposal.md` to revision `2026-10-28.5`.
- Verification: `84 passed` in `app/tests` (`pytest`), plus isolated headless Playwright verification (`0` page errors, `0` horizontal overflow across `360`, `390`, `768`, `1024`, `1280`, and `1440` widths in dark and light themes) using temporary SQLite storage and deterministic fixtures. No paid inference, live Google OAuth consent, or live external transcription provider was invoked; no deployment or Git push performed.

## 2026-10-28 — Explicit Plan-tick removal and help capitalization

- Added explicit Plan SVG suppression alongside the already text-only renderer, and versioned the relevant proposal preview script/style URLs so a fresh page loads the revised files. Changed practice help to Need help? while preserving white fill/black text.
- Checked active Plan: label Plan with zero icon nodes; checked returned lesson help capitalization. Updated the sample check and all three handoff records to2026-10-28.4. Preview-only change; actual app/backend unchanged.

## 2026-10-28 — Owner's Home viewport and help-button refinements

- Centered the proposal sample Home title, removed its subtitle and header New learning label, and removed the Plan tick from all sample stage strips. Kept the sidebar New learning action.
- Restyled practice help as white background/black text labeled exactly need help? in both themes. Home initial content now occupies the available first viewport, with its divider at the bottom and the continuation section below for scrolling.
- Updated all three handoff files to2026-10-28.3 with V09/P31/PF-11/PF-12 and refreshed sample checks/screenshots. Verification passed ten axe states, existing operation/source/recovery checks, and exact fold/centering checks at1440×1000,1280×800,390×844,360×640; continuation remains scroll-accessible. No page errors/external or mutation requests. Sample only; application/backend unchanged.

## 2026-10-28 — Frontend sample from UI improvement proposal

- Added separate `design_review/proposal-feedback/` on8769, applying frontend suggestions1–3 from `ui_improvement_proposal.md`. Reuses local Inter, familiar sidebars, typed pattern panel, themes and aligned math. Teach/Practice/Submit/Help have action-specific status, busy triggers, preserved forms/files and nearby errors; learning controls remain locked with status outside inert ancestors.
- Demonstrates safe local pre-send Retry/Edit versus unknown-completion reconciliation, existing-reference picker/removal and distinct Library empty/category/search/fetch cases plus Activity history-range messaging. All operations use fixed local content; no grading, real POST, server deduplication, durable help-use or diagnosis implementation.
- Added sample README/design/test/results/screenshots; two independent visual passes informed sticky phone header, busy/failed action emphasis and feedback placement. Updated proposal implementation record, AGENTS and all three handoff files to revision2026-10-28.2 with V08/PF-01–PF-10/P30.
- Verification: four operation wait/error/retry flows, retained answer/reasoning/attachments, unknown outcome without unconditional retry, Enter/Shift+Enter, source reuse/removal, list empty/recovery, both themes, six widths and reduced motion. Nine axe WCAG A/AA sample views reported zero violations; no page errors/external or mutation requests. Application/backend unchanged; no paid inference, deployment or Git push.

## 2026-10-28 — Three-file LLM handoff and mandatory synchronization

- Added `docs/UNREALIZED_CHANGES.md`: exact latest interface contract (shell, tokens, typed panel, focus/motion, equation lining/baseline CSS, copy, controls and states), U01–U20 pending-work register, current-versus-preview distinctions, proposed backend/schema/assistance/annotation contracts, integration sequence and acceptance checks. Includes latest owner corrections and known sample quirks that must not become production behavior.
- Added `docs/UI_FEATURE_PROVENANCE.md`: P01–P29 feature/source/adaptation mapping, dated observed-versus-documented evidence, primary URLs and local captures, owner-origin requirements (including guest Hairline figures and Google identity), rejected patterns and backend boundaries. No new external browsing or competitor generation claimed in this consolidation.
- Updated `docs/CURRENT_ARCHITECTURE.md` with the three-file continuation index, latest preview's exact source/load order, memory-only state, PV-01–PV-24 control map, integration boundaries and synchronization record. Preserved the original live-app inventory and its dated verification claims.
- Added the owner's mandatory rule to root `AGENTS.md`: every agent reads all three before code changes, inspects actual source, and synchronizes all three plus CHANGELOG in the same task. An unaffected file must receive an explicit reviewed/no-semantic-change record; pending work is never silently marked live.
- Verification: local references/ID coverage, exact math contract and current source boundaries checked; application and preview code unchanged in this documentation task. No learner data, secrets, provider settings, paid inference, deployment or Git push changed. Historical UI tests are identified by date; no fresh live-provider or production-readiness claim.

## 2026-10-27 — Aligned equation numerals in the interface example

- Replaced Georgia's varying-height numerals in the step-repair example with Times New Roman and explicit lining/tabular numerals. Set a consistent equation line height and made the highlighted operator inherit the same typography and baseline. Sidebar and body fonts remain Inter.
- Preview-only typography correction; no application or backend changes. Refreshed the equation screenshot and checked both themes and phone sizing.

## 2026-10-27 — Simplified equation output in the interface example

- Removed row numbers, side annotations, horizontal row dividers and the full crimson row from the step-repair example. Equations now share a compact aligned stack, with only the incorrect plus sign highlighted. Applied the same simpler layout to the worked repair.
- Scope: `design_review/step-repair/` only; application and backend unchanged. Verification recorded in the preview's interaction/accessibility results and refreshed screenshots.

## 2026-10-27 — Thetawave-informed step-repair interface example

- Added separate `design_review/step-repair/` concept on port 8768, preserving the working application and earlier 8767 preview. Uses local Inter, familiar sidebars, the existing free-text learning-pattern panel, themes, dirty-save protection and reversible panel motion; right panel starts closed to prioritize the lesson.
- Demonstrates an annotated incorrect sign, short guided repair, changed problem, tracked hint use and honest helped/independent outcome evidence. Includes correcting a sample difficulty, explicit lesson/source scope, editable goal intents, searchable existing-reference selection and counted Library filters. All responses, equations and resources remain fixed samples; no real step diagnosis, scheduling, extraction or model integration is claimed.
- Added design/README/QA records, a repeatable interaction/accessibility check and fourteen screenshots. Two independent screenshot reviews informed prompt, progress, selection and layout refinements; direct QA fixed phone button wrapping and light-theme contrast.
- Verification: ten tested axe WCAG A/AA views reported zero violations; six widths without horizontal overflow; checked repair errors/Enter, hint outcome, reference reuse, filters, reduced motion, retained panel inputs, dirty Save/Keep editing, saved question follow-up/loading, static sample export and upload recovery. No page errors or outside requests; all 65 fingerprinted application source files unchanged. No application integration, private learner data, paid inference, deployment or Git push changed.

## 2026-10-27 — Thetawave competitor inspection

- Added `docs/THETAWAVE_COMPETITIVE_REVIEW.md`: observed dashboard/intake/study/library behavior, official feature claims, replacement risk, detailed UI patterns mapped to current architecture controls, and a focused step-repair/independent-transfer hypothesis with acceptance checks. Explicitly recognizes Thetawave's existing daily-level, mistake-practice and advertised exam-progress overlap.
- Applied Karpathy Guidelines and targeted UI/UX Pro Max searches, rejecting unrelated search matches. Separated current integrated functionality, preview/legacy capabilities, proposed backend/AI work and untested competitive claims.
- Saved three bounded interface crops under `docs/research/thetawave-2026-10-27/`, excluding private note content and account identifiers. Later screenshot timeouts limited further captures. Browser inspection reached a subscription selector; no trial, purchase, generation, upload, recording or sharing was submitted. Opening an existing note updated its last-viewed metadata; the browser was returned to the dashboard.
- Verification: checked local report links/images and application source fingerprints. Documentation/research only; no application integration, learner database, provider configuration, paid inference, deployment or Git push changed. Comparative tutoring quality, mobile/accessibility behavior and learning outcomes remain unverified.

## 2026-10-27 — UI/UX Pro Max improvements in the interface example

- Implemented the six review refinements only in `design_review/detail-study/`: destination focus; comfortable 44px phone/coarse-pointer targets; 16px mobile reading and input text; focused, field-linked URL validation; direct sample routes and Back/Forward restoration; and transform-based workspace movement instead of animated margins.
- Browser-history handling keeps route/sample IDs in the URL and transient filters/scroll in memory. Back with dirty preferences offers Keep editing/Discard/Save without leaving URL and view mismatched. Existing icy-blue learning styling, sidebar identity, text inputs, quiet Save?/Saved, 280ms easing and reduced motion remain.
- Updated README/design notes and review section 11. Added focused refinement checks/results and refreshed twenty screenshots. Preview messages/preferences remain memory-only; URLs do not add durable conversations or backend integration.
- Verification: focused checks passed direct links, focus, all dirty-Back decisions, filters/date/reading-position restoration, field errors, touch sizes and text. Full preview suite passed ten axe WCAG A/AA views with zero reported violations, both themes, seven widths, reduced motion, menus, sample practice/export and rapid sidebar reversal. No page errors or outside requests; all 65 fingerprinted application source files unchanged. Narrow desktop animation sampling found no animated layout-property keyframes; real-device FPS, Safari keyboard/zoom and screen-reader behavior are not claimed verified.

## 2026-10-27 — UI/UX Pro Max skill cross-check

- Read the requested skill and its quick-reference/pro-rules checklists, ran targeted local searches with category/platform fit checks, and added section 10 to `docs/UI_UX_DETAIL_REVIEW.md`. Preserved the existing approved design instead of generating another palette or assuming a frontend framework.
- Fresh isolated preview probe measured 36–40px phone control heights, 15px lesson body/13px pattern inputs, missing destination focus, missing invalid-link error association, and unchanged URLs across views. Documented six prioritized refinements plus the layout-cost risk of margin animation; no unsupported FPS/CLS or real-device claim.
- Explicitly distinguished comfortable web hit areas from native 44pt/48dp rules, and rejected native/React Native search output as a plain-JavaScript implementation match. Recorded search fallbacks where no applicable database match was found.
- Review/documentation only: no UI, backend, model context, credentials, private learner data, deployment or Git push changed.

## 2026-10-27 — Sidebar easing in the interface preview

- Added 280ms ease-in-out entrance/exit slides to both preview sidebars, with desktop reading-space movement and fading overlay scrims. Closing panels stay rendered until the exit finishes and become inert immediately; rapid reversals continue from the current position instead of snapping.
- Added reduced-motion bypass and responsive-resize handling to prevent animated margins producing temporary overflow. Existing preference discard/save protection, keyboard focus return and sidebar styling remain intact. Only the separate `design_review/detail-study/` preview is affected.
- Verification: preview interaction/accessibility checks rerun, with added rapid close/reopen position checks and immediate reduced-motion sidebar checks. Results and refreshed screenshots are stored with the preview; production source fingerprint checks remain part of the run. No backend or learner data changes.

## 2026-10-27 — Owner's icy-blue learning-preview refinement

- Updated only `design_review/detail-study/`: removed the visible Enter/Shift+Enter helper without changing shortcuts, matched the checkpoint trigger to the current app's filled/bordered design, and docked stage navigation beneath the course title in a full-width header.
- Added `learning.css` to apply the owner's supplied reference to the central learning area only: icy-blue primary support action and stage indicator, cool outlines, centered worked steps and a compact question composer. Left/right sidebar styling and text-input behavior remain unchanged; light theme uses darker blue text for contrast.
- Clarified the stage reference: Q-AI workflow capture and review R18 supplied the concept; detached spacing was a prototype choice. Updated design/README notes and refreshed screenshots.
- Verification: full preview interaction check passed, including ten axe WCAG A/AA views with zero reported violations, seven viewport widths, both themes, mobile navigation, reduced motion, menus, error/retry and sample downloads. No page errors or outside requests; all 65 fingerprinted application source files remained unchanged. The main app and backend are not integrated with this preview.

## 2026-10-27 — Detailed interactive interface example

- Added the separate `design_review/detail-study/` preview on port 8767, based on `docs/UI_UX_DETAIL_REVIEW.md`. Starts on a labeled sample lesson and retains the icon rail/history, text-input learning-pattern panel and local Inter. Includes dark/light themes, a responsive phone navigation drawer and worked algebra steps.
- Demonstrates assistant-side loading, retained pending/error drafts, Retry/Edit, inline upload errors, metadata-only attachment selection, keyboard/viewport-aware menus, copy feedback, dirty navigation protection, language editing, Library keyword/category search, Activity date filtering, sample plan approval, read-only history and confirmed sample practice. Top-level Preview states lets the owner inspect waits/failures without paid or real API operations.
- Added static sample Markdown/DOCX/PDF checkpoint downloads, local font/license, README/design notes, screenshots and a repeatable interaction/accessibility check. All extraction and tutoring responses are explicitly simulated; sample downloads contain no account or user-selected file content. No production integration or React migration is included.
- Verification: isolated headless-browser checks passed controls, error/Retry/Edit/copy, diagnostic repair, sample downloads, themes, seven responsive widths and reduced motion. Ten axe WCAG A/AA views reported zero violations; no page errors or outside requests. All 65 fingerprinted application source files remained unchanged. Twenty screenshots and `verification.json` record the result. Two independent visual reviews informed refinements. No app API, provider configuration, learner database, paid inference, deployment or Git push was changed.

## 2026-10-27 — Current architecture and detailed UI research

- Added `docs/CURRENT_ARCHITECTURE.md`: real frontend script/CSS precedence, 135 distinct UI control/state identifiers including reference and reasoning upload buttons, grouped legacy controls, API/action/state contracts, ownership/persistence, model context and transport, parsing/export limits, asynchronous feedback, and a 143-symbol Python source appendix.
- Added `docs/UI_UX_DETAIL_REVIEW.md`: Nebius sponsored-event winner patterns and ChatGPT, Claude, AI Studio, NotebookLM/Gemini Notebook and Stitch comparisons, mapped to current architecture IDs. Its 35 recommendations distinguish visual changes, frontend behavior, backend contracts and AI context; specify loading locations/sizes/timing, error copy/recovery, menu/focus/hover behavior, drafts, uploads, calendar/search and verification cases.
- Captured bounded public/new-workspace screenshots and DOM control measurements. Personal chat histories were collapsed, no third-party prompts were submitted, and no private learner contents or credentials are included. Stitch stayed blank, so working-canvas conclusions use explicitly labeled official media rather than invented live observations.
- Verification: inspected the real frontend/API on temporary isolated storage with deterministic responses, artificial waits and one deliberate service failure; confirmed the question draft and saved chat survive that failure. Resolved local document/image links and verified all 79 initially fingerprinted application/prototype/tool source files unchanged. No production code, learner database, provider settings, paid inference, deployment or push changed. This research is a recommendation set, not implemented product behavior.

## 2026-10-27 — Language consistency, similar goals and learning review

- Resolved Automatic to a concrete response language before each model request, with explicit language choices taking precedence and code syntax preserved. Added pinned local `langdetect` profiles with a fixed seed, safe fallback for short/code-only input, and script/phrase handling for common learner messages. Mixed-language plans expose a manual Regenerate in the intended language action; there are no automatic paid regeneration loops.
- Added conservative local main-goal matching for equivalent introductory wording such as I want to learn C++ and Explain C++ to me. Only the account's own courses are considered. The learner can open the existing learning or explicitly create a separate one; C, C++ and C# and different subtopics remain distinct.
- Persisted lesson/test review records across objective transitions and repeated practice. Added Review lessons and tests with a read-only view and Return to current step. Pending practice/diagnostic solutions stay private until correct assessment or completed repair. Current progress and approval gates are not rewound by review.
- Older saved Library explanations and existing test attempts are available for review where data exists; overwritten unsaved lessons cannot be reconstructed. Completed checkpoint exports retain saved lesson material while still excluding question/test logs. Question chats can use their own saved objective's lesson after advancement.
- A submitted new goal now opens the learning window immediately with its goal and Thinking indicator. This is the owner's requested exception to keeping the source screen during ordinary navigation. Duplicate-goal choices and generation failures appear in that window, with explicit retry/back controls.
- Verification: 82 Python tests; browser checks passed immediate generation view, duplicate-goal reuse, read-only lesson/test review, unchanged progress, language repair, themes/mobile and the existing tutoring/chat flows. One synthetic live Nebius C++ plan returned English outcomes and passed language checks. No private learner data was inspected or used for the live check.

## 2026-10-27 — Separate interactive interface proposal

- Inspected the current browser app on temporary deterministic fixtures, then created a standalone study at `design_review/winner-concept/`, served separately on port 8766. The real frontend, backend, provider configuration and learner data are unchanged by this proposal.
- Demonstrated a stage strip, compact lesson shortcuts, goal starters and a file drop popover, while preserving the right panel's textarea/text-input system and existing global/course preference scope. Included local Library/Activity navigation, theme switching, sample questions and dirty/save/discard interactions.
- Documented which ideas reuse existing behavior, which add frontend interactions and which would require AI/backend wiring. No actual AI replies, upload processing, transcription or account access are simulated as real services.
- Verification: browser interaction checks passed; no external requests or page errors; zero automated Axe WCAG A/AA violations on the lesson in both themes; no overflow at 360/390/1024/1440px. Desktop/mobile/reduced-motion screenshots inspected and two visual reviews completed. Added screenshots, local Inter license and restart instructions. No paid inference was invoked.

## 2026-10-26 — Reasoning files, confirmed submission and clean checkpoints

- Aligned View source with its reference text. Added a file-style plus menu below Show your reasoning for Markdown, PDF, DOCX and PNG/JPEG/WebP images, with a magenta image outline in both themes. Attachment chips support removal and extracted-text review.
- Implemented authenticated, course/exercise-bound reasoning extraction. Document parsing and Windows image OCR run locally; raw images are temporary and extracted text is stored privately. Up to three attachments can accompany an attempt. Text enters the existing assessment request only when the learner confirms submission, with size checks and source-excerpt budgeting.
- Replaced Check my attempt with orange Submit and a centered confirmation dialog containing matching orange Submit and grey Cancel actions. Cancel preserves the current answer, reasoning and attachment selection.
- Lesson and repair explanations now save automatically to Library, with content deduplication including previously manually saved notes. Removed the repeated Save explanation to Library button. Opening an older lesson can add its explanation; course loading refreshes Library before displaying the result.
- Changed Markdown, DOCX and PDF checkpoint exports to learning notes only: curriculum, progress, lesson, worked examples, repair and reference. Practice questions, attempts, question chats and raw saved-state JSON are omitted. Common Markdown/LaTeX artifacts and internal markers are converted to readable text/math, code content is preserved, and unsupported nonbreaking punctuation is normalized.
- Created a clean copy of the supplied checkpoint without overwriting its original. Visually verified all pages of Word- and ReportLab-rendered outputs. The packaged renderer lacked LibreOffice; the installed Microsoft Word renderer and Poppler were used for DOCX visual verification.
- Verification: 75 Python tests; browser checks passed source alignment, auto-save, document/image upload with real local OCR, extracted-text preview, confirmation/cancel, both themes, scoped assessment text and existing tutoring/navigation behavior. Model responses in browser tests were deterministic fixtures. No paid inference, new remote OCR service or model training was used.

## 2026-10-26 — Suggestion lifecycle and stable navigation

- Similar-question feedback now belongs to the current draft: editing or clearing either the lesson question box or chat composer cancels its animation and removes the suggestion. Late feedback for a changed draft is ignored.
- Added a 1.2-second suggestion fade/short slide, with its actions unavailable until revealed. Reduced-motion users get the suggestion immediately. The Hairline skill was reviewed; this text-only disclosure uses native UI motion rather than adding an unrelated isometric figure or modifying its engine.
- Removed the loading-opacity reduction. Async work now locks interaction across the body and any open modal dialogs without a dark overlay. Course/chat navigation keeps the source view until data is ready, and failed loading restores access on the unchanged page. Authentication also waits for account data before changing its visible screen. Existing focus is restored when the same control remains available.
- Verification: `navigation-feedback-check.mjs` passed edit/clear cancellation, 1200ms reveal, reduced motion, original-page retention, body/modal locking, full opacity in both themes and failed-navigation recovery. Existing chat and frontend/API/SQLite browser checks passed with deterministic offline model fixtures. No model requests or private learner data were used.

## 2026-10-26 — Quiet question feedback, matching and compact composer

- Reduced the chat composer to roughly 58 px when empty, with a centered submit icon and an input that grows for multiline text. Empty sends are disabled. Both themes use the existing tokens.
- Suppressed native browser validation balloons throughout the app while retaining field validation, accessible invalid states and keyboard focus. Added an inline Thinking/pulsing-dot indicator for initial learning generation, lesson questions and chat replies, with a reduced-motion fallback.
- Added conservative local question matching within the same account/course/objective. Punctuation variants, close wording and generic difficulty-question variants offer Open previous answer or Ask separately before inference. The local comparison sends nothing to an AI; numbers, negation and operators remain distinct. It does not claim universal semantic matching.
- Strong keyboard-smash signals (including the reported random string) now ask for rephrasing with the input quoted, without an inference request. Ambiguous model responses also request clarification; transport failures instead state that a reply could not be obtained. Inputs and saved conversation remain intact and no automatic retry occurs.
- Resolved generic references such as this subject against the current course. Added a safeguard for model scope/clarification inconsistencies and an Ask in this learning recovery action for older false difficulty-question topic decisions; saved records are not silently removed.
- Verification: 70 Python tests passed. Browser checks passed quiet validation, zero-history clarification, duplicate confirmation/reuse, thinking in Home/lesson/chat, compact sizing, both themes and reduced motion. The existing chat browser flow passed as well. Two synthetic live Nebius calls checked a generic algebra difficulty question and an ambiguous phrase; the latter exposed an inconsistent scope label, now covered by a deterministic guard/regression test. No private learner content was inspected or used for these tests.

## 2026-10-26 — Connected question chats and adaptive explanations

- The owner authorized the formerly interface-only course/chat context. Connected persisted multi-turn chats, private per-question context (up to six recent messages), retry protection, and old-record migration. Removed the 50-question cap while retaining rate, request-size and $2 development controls.
- Added scope-first model classification and working Yes/No topic decisions. No discards the pending question; Yes creates a new learning and seeds its question/answer, with atomic persistence and a fresh plan-acceptance gate. Old course references, struggle and exam details stay out of the new learning. Failed generation leaves the pending decision intact.
- Matched the direct-answer, explanation-of-why and small concrete example style from “Fix C++ if condition syntax”. Simple replies stay short; explicit step-by-step requests return structured steps. Existing saved answers are unchanged.
- Fixed light-theme text contrast for chat controls and sidebar rows. Enabled the chat composer with Enter to send and Shift+Enter for a new line, themed decision controls and a return-to-plan action. Removed the obsolete disabled-chat view. Readable checkpoints include accepted conversation turns.
- Verification: 64 Python tests; browser chat checks passed multi-turn persistence, Yes/No, reload, keyboard behavior, both themes and mobile. Existing sidebar/preferences and frontend-to-API tutoring checks passed with deterministic model fixtures. Seven synthetic live Nebius requests checked style/context/scope; an initial false in-scope classification was caught and the revised prompt correctly classified the retest. Final ledger: 36 requests, estimated $0.00418434 total, no unknown reservations. No private learner data or credentials were used in these checks.

## 2026-10-26 — Earlier Nebius winner UI research

- Added `docs/research/nebius-winners/README.md` and four real screenshot clips from Q-AI and SynthesisOS public demos, with award verification, source links and proposed adaptations for the learning app.
- Distinguished earlier sponsored-event prizes from the current Global AI Hackathon, whose winners have not yet been announced. Documented blocked visual access to Delivery Tracker and the deterministic-demo limitation of SynthesisOS.
- Verification: visually inspected screenshot clips; navigated Q-AI configuration using synthetic text without starting analysis. No product code, private learner data or model context changed; no paid inference was invoked.

## 2026-10-26 — Sidebar question UI and preference scope

- The owner chose “Build the interface only for now” for multi-turn question chats and unrelated-topic routing. No new conversational context feed, scope-classification call, automatic topic transfer, or Yes/No course-creation flow was enabled. The existing single-question feature remains available.
- Added compact, closed-by-default question branches under each saved course in the left sidebar. A question opens a chat-style view of its saved question/answer, with a return-to-lesson action. Additional replies are visibly disabled pending model-context approval. Long older answers can be expanded with Show more instead of occupying the entire initial view.
- Replaced repeated generic download icons with distinct colored Markdown, Word and PDF artwork. Sidebar question rows and disclosures use compact spacing; the old large question cards were removed from the lesson view.
- Tightened the existing single-question prompt to normally 2–3 sentences/30–60 words and at most 100 words, with a smaller response schema. No additional input data is sent by this change. Explicitly disallowed leaked internal markers and prose/currency mixed into LaTeX.
- Cleaned known leaked {reasoning}/{execution}/{relevance} markers at display time, repaired the reported malformed currency example, and kept valid mathematical expressions in KaTeX. This does not rewrite stored learner messages or regenerate saved answers.
- Separated universal preferences (Teaching style, Interests) from course-specific fields (Struggle, Language, Course/exam). Only universal keys are exposed as account preferences. Course-specific values remain in their saved course, are cleared/hidden on fresh Home, and restore when reopening that course. Current universal preferences overlay every course on load.
- Restyled the unsaved dialog as centered text with full-width pill actions: white Keep editing, tinted-red Discard changes and tinted-green Save. Both themes use matching contrast-aware variants.
- Verification: 59 Python tests passed, including account/course preference separation. Browser checks passed colored icons, collapsed branches, read-only saved chat, formatting cleanup, global/local preference restoration, stacked-dialog ordering, themes and no page errors. The existing browser-to-API flow passed after adapting its preference test to the new scopes. No paid model requests were made.

## 2026-10-26 — Checkpoint popover and readable lessons

- Replaced the format select with one “Download checkpoint as…” trigger that opens a file-style popover of Markdown, Word and PDF actions with icons. Added Escape, arrow-key navigation, click-away dismissal and matching light/dark styling. Existing authenticated export endpoints are unchanged.
- Removed the AI-generated/check-course eyebrow from the reading view and its top gap. The course title now aligns vertically with the sidebar's New learning row.
- Capitalized sentence openings in rendered titles, subtitles, paragraphs, worked steps and session labels without rewriting stored learner input.
- Replaced plain-text lesson rendering with locally bundled Marked + DOMPurify for sanitized Markdown and KaTeX for inline/display LaTeX. Math is protected during Markdown parsing so backslash commands survive; code blocks remain literal. Images, scripts, event handlers and unsafe links are excluded. KaTeX runs with trust disabled and bounded expansion. Library source previews remain literal source text.
- Added vendor licenses and local math fonts; no third-party CDN request is required for reading a lesson. Existing saved lessons receive the rendering fix without regeneration or new paid calls.
- Verification: reading browser checks passed capitalized headings, title alignment, bold text, inline/display equations, sanitization, popover/Escape, both themes, mobile overflow and no page errors. Save/discard/download browser checks and the full browser-to-API tutoring flow also passed. Python backend code and its previously verified 58-test suite are unchanged by this UI revision.

## 2026-10-26 — Quiet save feedback and checkpoint formats

- Removed the sidebar account-save caption and its divider, homepage save captions, generic helper descriptions and automatic-language helper line. Actual attached-reference names and actionable errors remain available.
- Removed success/working toast notifications. Learning-pattern feedback now stays on the button: green “Save?” when edited, grey “Saved” when unchanged/saved. Text changes and automatic/explicit language changes update the dirty state.
- Closing the learning-pattern panel with unsaved edits opens a confirmation dialog. Discard changes is red with white text and restores the saved fields; Save persists changes before closing; Keep editing cancels the close. Failed saves retain the draft and show the error.
- Replaced the Markdown text link with a download icon/button and a format dropdown for Markdown, DOCX and PDF. All three formats have authenticated backend exports; DOCX/PDF are readable checkpoint documents, while Markdown also retains machine-readable saved state.
- Added ReportLab for PDF output and embedded an available local Unicode font to avoid viewer font substitution. Export generation requires no AI calls.
- Learning-pattern save updates the account and current course together in one transaction, so a rejected course update cannot leave a partially saved profile.
- Verification: 58 Python tests passed, including real PDF/DOCX signatures/content, export authorization and atomic profile saving. Browser checks passed save/edit/discard/save-and-close, removed footer/toasts, actual PDF/DOCX downloads and both themes. Existing browser-to-backend flow passed after updating its save assertions. A synthetic PDF was rendered and visually inspected. No paid inference was used.

## 2026-10-26 — Notebook, keyboard behavior and saved question branches

- Enlarged the integrated guest notebook to 320 px on desktop and 250 px on mobile. Added decorative math formulas in icy blue/crimson as an HTML overlay whose projected page coordinates follow the actual animated paper. The Hairline kernel and bench remain unchanged. Light-theme formula colors use darker variants for contrast.
- Added delegated Enter-to-submit handling for composer, forms, reference dialogs, language override, learning preferences and searches; Shift+Enter preserves textarea newlines. IME composition is excluded. Learning forms are temporarily inert while a course action is running, preventing input from being lost during a view replacement.
- Fixed stale Library/Activity selection when returning Home or opening a learning session. Navigation now updates both the selected class and aria-current.
- Replaced the right-panel close glyph with a centered SVG in a fixed 40 px hover target, and standardized alignment of the other icon-only controls. The close hit area no longer scales off-centre.
- On switching to a phone-width viewport, the left drawer closes; its shadow is removed when closed so it cannot shade the lesson from offscreen.
- Added per-course saved follow-up question branches with expandable answers, objective associations and timestamps. Asking a question preserves the current teaching/practice stage; reopening an answer does not invoke the model. Repeated identical questions for the same objective reuse the saved answer.
- Added internal, factual requested-help observations from questions, without fixed ability labels. The most recent relevant observations are passed to general practice generation; they are not rendered as learner diagnoses. This is contextual prompting, not model training. The checked sample question bank remains finite and unchanged.
- Added API tests for question persistence, duplicate reuse, stage preservation, private signals and practice context. Python suite: 56 tests passed. Browser tests passed Enter/Shift+Enter, auth submission, Home selection, close-icon centering, saved questions after reload, themes/mobile and no page errors. Existing browser-to-API flow also passed. Model responses in these tests were deterministic fixtures; no additional paid model calls were made.
- Hairline notebook validation and eight-view/motion checks passed after adding projected-content support. Both the standalone geometry and the integrated formula overlay were visually inspected.

## 2026-10-25 — Approved design integrated with backend

- Added `app/web_server.py` (Starlette) and `app/web/` (approved browser UI). The real application runs at port 8780; port 8765 remains the independent design preview.
- Integrated the two-layer composer, real email/password account flow, sidebar, right learning pattern, dark/light themes, guest-only notebook motion, row hover icons, Library keyword search, and Activity local-date filtering.
- Preserved `app/app.py`, legacy bearer-code sessions, their database, checked algebra questions, and the existing Nebius request/budget controls.
- Added `web_store.py`: account-owned SQLite profiles, resources, courses, events, salted scrypt passwords, expiring HttpOnly login cookies, login/request throttles and revision conflict checks. New data is stored in ignored `app/local_results/workspace.sqlite3`.
- Added `references.py`: PDF/DOCX/TXT/Markdown/SRT/VTT extraction, public HTTP/HTTPS HTML/text/PDF URLs, bounded downloads, public-address validation on every redirect, and connections pinned to the validated address. DOCX tables are included. Large webpage extracts are marked as excerpts.
- Implemented bounded FFmpeg audio extraction and a configurable OpenAI-compatible transcription adapter for video/audio. Uploads without transcription configuration return an explicit setup message; transcript uploads work immediately. No paid transcription request was made.
- Implemented Google OAuth/OIDC through Authlib. It requires the owner's Google web-client credentials; no live Google login was claimed or tested.
- Added `web_tutor.py`: general-subject plans and practice alongside the checked bundled course, required plan approval, lesson/attempt/diagnostic/repair/next flow, and source validation. General model-generated exercises are labelled as not independently verified.
- Connected saving explanations to Library, private learning history and resume after reload, profile/language preferences, real activity events and Markdown checkpoint export. Removed the preview account, fake history and sample-date behavior from the integrated runtime.
- Fixed initialization/login timing, cleared learner fields on logout, rejected stale frontend responses after account changes, and adjusted newly added action buttons for both themes. Passwords retain intentional whitespace; their stored values remain salted hashes.
- Added `docs/INTEGRATION.md`, dependency pins, optional credential placeholders in `.env.example`, and the current run command in README. The actual `.env` was not overwritten or exposed.
- Added a project instruction to maintain this change record for subsequent work.
- Verification: 54 Python tests passed, including account isolation, DOCX intake, approval/repair/resume/export, public fetch transport, redirect-to-private rejection, cross-origin rejection, transcript fallback, and real FFmpeg extraction with a mocked transcription endpoint. Existing Streamlit tests still pass.
- Browser integration passed from actual HTML through API and temporary SQLite: signup, preferences, reference intake, approved plan, lesson, saved note, attempt/repair, reload/resume, keyword search, date filters, theme/mobile and logout. Its model replies were offline fixtures, not live inference.
- Live verification: public Python documentation URL extraction succeeded. A synthetic general Python learning plan, lesson and practice passed live Nemotron schema validation. The first plan check failed its reference/order validation; the source enum and prerequisite instructions were tightened before the successful run. Four new requests increased the ledger from 22 calls/$0.00317052 to 26 calls/$0.00343158 (increase $0.00026106); the $2 allowance remains unchanged.
- Pending owner setup: Google client ID/secret and an explicitly enabled transcription provider. Live video transcription, Google login, multilingual quality, human learner acceptance and hosting remain unverified. No model training, Git push or deployment was performed.

## Earlier design work — 2026-10-25

- Built the standalone `design_review/` prototype and iterated based on the owner's screenshots.
- Added guest-only Hairline notebook motion and folder hover animation, Inter typography, dark/light toggle, Google sign-in appearance, collapsible navigation, and right learning-pattern panel.
- Added sample Library keyword search and Activity date filtering, removed duplicate navigation and Library arrows, and made project/chat text white in dark mode.
- Removed textbox focus outlines in the preview and Streamlit styles; added row hover highlights and row-wide folder animation.
- Authentication, history and reference processing in the standalone preview were simulations, not backend integration.

## 2026-10-26 — Google OAuth configuration check

- Owner supplied Google OAuth credentials in the ignored local environment file; no credential values were printed or copied into documentation.
- Restarted the integrated app and verified Google capability is enabled. The login route returned HTTP 302 to accounts.google.com with the expected local callback and state/nonce parameters.
- End-to-end Google consent and callback completion still require the owner's sign-in; redirect verification alone does not confirm successful account login.
