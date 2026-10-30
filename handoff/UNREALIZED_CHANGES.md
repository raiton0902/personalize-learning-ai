# Unrealized changes and exact interface handoff

## Current handoff — 2026-10-30.16 (30 October 2026)

Reviewed for revision 2026-10-30.16 (`google_callback_url` dynamic reverse proxy / forwarded header / environment override resolution in `app/web_server.py`, with unit test `test_google_callback_url_resolution` in `app/tests/test_web.py` and documentation in `docs/INTEGRATION.md`). No UI, V01–V09, U01–U23 or B01–B07 behavioral contracts changed; no substantive update needed. Verification in CHANGELOG.

## Current handoff — 2026-10-30.15 (30 October 2026)

Reviewed for revision 2026-10-30.15 (Hugging Face Spaces Free Gradio-SDK and Docker packaging `README.md`, `requirements.txt`, `packages.txt`, `Dockerfile`, `.dockerignore`, `app/hf_persistence.py` and `app/tests/test_hf_persistence.py`). No UI, V01–V09, U01–U23 or B01–B07 behavioral contracts changed; no substantive update needed. Remote Hugging Face Space creation, secret provisioning and git push remain owner-performed steps. Verification in CHANGELOG.

## Current handoff — 2026-10-30.14 (30 October 2026)

LIVE OWNER U19/B01–B07: country or language subject matter must never select the instruction language. All plan title/scope/module title+summary/objective title+outcome fields are checked, including short non-Latin script. A non-bundled proposal with detected drift may use exactly one budget-controlled language repair; this is the owner's narrow exception to the older no-automatic-retry policy. Structure and identifiers must survive unchanged; a failed repair preserves the draft and requires manual action. No fallback or transport retry was added. Existing stored plans remain untouched until an explicit generation action; provider accuracy is not live-verified.

LIVE OWNER Plan/V08/P32: learner targets are a single idempotent 13px semantic bullet list immediately after the scope note for ordinary and Cramming plans, with KaTeX retained. Legacy rich-text outcome DIVs must not remain as orphan paragraphs. Module outcomes also use compact bullets. Dark/light and responsive layout contracts remain; short-phone Home tests allow the existing five suggestion pills to extend the first screen. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.13 (30 October 2026)

OWNER P32/U19: valid explicit lesson module_id resolves inconsistent module objective_ids lists; genuinely ambiguous multiple memberships without a valid explicit module still fail safely. Track validation and draft preservation remain. This supersedes the strict conflict-rejection policy in 2026-10-30.1 where an explicit valid module exists. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.12 (30 October 2026)

OWNER UI-H/Library/Activity/V03/P28: the signed-in top header must let the book show through rather than forming an opaque black or white strip, while retaining a blurred translucent surface for legibility. Applies across Home, learning, Library and Activity; sidebars still cover the animation. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.11 (30 October 2026)

OWNER UI-A/UI-H/V03/P28: transparent book favicon, italic crimson x/y; large animated notebook behind signed-in workspace, viewport-centered and covered by sidebars. Home uses soft blur and lower opacity; learning views use stronger blur and fainter opacity. Reduced motion stops the tour; the background must not intercept interaction or enter the accessibility tree. This explicit owner revision supersedes the older guest-only animation constraint. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.10 (30 October 2026)

OWNER V03: all enabled buttons receive visible hover feedback through shared brightness/inset-boundary styles, with existing specific animations retained. Disabled controls stay quiet; language remains arrow-only; reduced motion disables transitions. Dynamic dialog/course buttons inherit the same rule. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.9 (30 October 2026)

OWNER UI-H/U05: standard Home suggestions have a subtle lift and highlight on hover; movement is suppressed for reduced motion. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.8 (30 October 2026)

OWNER UI-H17/U21: replace “Cram for my exam” with “I have presentation this morning”; preserve the starter's Cramming activation and insert matching presentation context. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-30.7 (30 October 2026)

OWNER UI-H08/UI-H16–17/U05/U21: composer second layer uses the theme ground and thin high-contrast outline; Personalize uses an icy-blue person-icon pill matching Cramming. Five suggestions use a centered three-plus-two layout, with two Cramming starters below; smaller screens wrap naturally. The phrase “icy crimson” was interpreted as icy blue for Personalize, complementing the crimson Cramming control. Other contracts reviewed unchanged; see CHANGELOG.

## Current handoff — 2026-10-30.6 (30 October 2026)

OWNER supersedes earlier green Save/orange Submit colors: UI-P/UI-W/U07/P24 save and positive feedback use icy blue, and practice Submit uses crimson in both themes. Account avatar teal becomes blue; Google and file-type identity colors stay. Interactions, accessibility and other V/U/B contracts reviewed unchanged. Verification in CHANGELOG.

## Current handoff — 2026-10-30.5 (30 October 2026)

Owner sizing correction for UI-H16/U21/P33: make Cramming similar in size to Personalize: 36px height on desktop and 44px on phones, with reduced horizontal padding while retaining its icon and crimson styling. Other V/U/B contracts and preview inventory reviewed without substantive change; see CHANGELOG for verification.

## Current handoff — 2026-10-30.4 (30 October 2026)

**Owner contract supersedes the three-choice/extension UI. LIVE code / FIXTURE evidence:** U05/U19/U20, new U21–U23; P32–P35; V01–V03/V09 retained with these explicit supplements.

1. All new standard non-bundled plans show the full Beginner→Intermediate→Advanced progression upfront:3–5 modules,6–18 objectives. Level badges appear on every module card. No intake/revision track-selector, next-track preview or manual extension button, including saved-review views. Preserve old saved plans/defaults, approved versions and step-by-step progression. Legacy extension endpoints remain compatibility-only.
2. **U21 Cramming:** right corner of the attached secondary bar, aligned with Personalize;44px toggle, urgent-clock/lightning identity and aria-pressed. Fourth starter says I got an exam tomorrow. Clicking preserves any typed subject, adds exam context, enables mode and returns caret to the end. Book crimson is exactly#ed3e65 dark /#b41f43 light, with specified tint/border. Tint is composited over the theme ground for readable contrast. Activation scale/ring, icon tilt and2.2s composer perimeter pulse earn attention only on Home; reduced motion is static. No green replacement or new library.
3. Cramming is an explicit course-profile boolean and is also detected from urgent goal phrases. It survives guest auth and intake edits. Four editable exam-focused scope fields use deterministic multi-clause English extraction, including topic lists, weak areas, hours and calculator restrictions. The form always precedes normal generation unless the learner explicitly chooses Skip/provisional. Start cramming plan generates3 progressive exam-focused modules /3–9 lessons; recognized numeric time limits constrain estimated total minutes. No readiness/retention guarantee, paid extraction call or broader history context. Fixed bundled sample stays fixed.
4. **U22 resizing:** history default252/min180/max420; pattern default310/min240/max480. Pointer capture,16px arrow-edge movement, Home/End, double-click reset, separator semantics and current/effective ARIA values. Persist in personal-learning-sidebar-width and personal-learning-right-panel-width only. CSS widths/margins follow variables; preserve320px central space where possible by capping the desktop right panel. No handles at<=760 history /<=1050 pattern. Existing drawer/overlay, dirty guards and interaction locks stay intact.
5. **U23 goal matching:** conversational rephrasing and long-word typos match equal subject AND specificity; broad machine learning differs from unsupervised/reinforcement scope, while reordered same subtopics match. C/C++/C#/R/Go and supervised/unsupervised remain distinct. Same-account existing-course choice uses no model call. Cramming/standard mode differs; Create separately remains available. Unknown terminology is conservative rather than universally understood.

Fresh verification: **203 passed in115.80s**, including isolated headless dark/light at1440×1000 and390×844,1051px constrained resize, reduced motion, no overflow, guest resumption, all new form/control/matching paths and existing regressions. See CHANGELOG for initial failures/corrections and `app/tests/artifacts/cramming/` for synthetic captures. Other V/U/B requirements, pending/deferred/PREVIEW inventories and LEGACY entry point reviewed unchanged. No external dependencies, destructive schema changes, private data/secrets access or paid calls. Real model compliance, Google consent and transcription remain UNVERIFIED.

## Current handoff — 2026-10-30.3 (30 October 2026)

Guest continuity acceptance (UI-A/H, P32, U04/U20): after Back to learning, clearing the goal and reopening auth must clear both pending stores; a deleted goal must not remain queued. This now passes in both themes at1440×1000 and390×844. Nonempty pending goals still resume once after successful auth; failed auth preserves them. Repeated brief's editable four-field intake, three track choices and progress-preserving extension are already LIVE; refreshed track/personal-learning tests:24 passed (66.41s). Other V/U/B contracts, preview and pending/deferred inventory reviewed without substantive changes. Provider compliance and real Google consent remain unverified.

## Current handoff — 2026-10-30.2 (30 October 2026)

The three continuation documents now live together in root `handoff/`. Links and AGENTS.md were updated. Interface/backlog contracts reviewed; no semantic change.

## Current handoff — 2026-10-30.1 (30 October 2026)

P32 track correction: valid module-level `objective_ids` must preserve grouping even without repeated objective `module_id`. Normalizer now honors them and rejects conflicting assignments; selected-track bounds are unchanged. Offline fixtures reproduced the reported error; exact owner response remains unverified. No visual/backlog/preview changes, new dependency or paid request. Other contracts reviewed unchanged; verification in CHANGELOG.

## Current handoff — 2026-10-29.12 (29 October 2026)

**LIVE code / offline FIXTURE evidence:** UI-A/H/P32, U04/U19/U20, V01–V03/V09, B01/B05. This owner-requested supplement supersedes older automatic-intake-bypass descriptions.

Guest nonempty Home goals survive login/signup and OAuth-style navigation in memory/sessionStorage, then submit exactly once after successful account/list restoration. Consume before submission; preserve on failed auth. All normal new courses stop at intake for review, even when the prompt supplied scope. Explicit Skip/provisional remains available. Four scope fields remain editable with conservative deterministic English prefill, note and clearable saved drafts; no extra model extraction request.

Choose your learning track uses three cards: Beginner (1 module,1–5 lessons), Intermediate (2–3,6–12), Beginner to Advanced (3–5,10–24). Native keyboard buttons, aria-pressed, textual selection and44px minimum targets; one column below800px. True black/light, Inter, neutral field focus and existing math/motion remain. Plan revisions expose the selector. Beginner next-track previews describe extensions without implying advanced mastery after foundations.

Extension stays in the existing candidate/version/dedup flow: approved objectives/modules and saved attempts/history/current step remain; completion resumes at the first added lesson. Fixed checked sample cannot extend; app limits remain24 lessons/5 modules. Invalid generated shapes fail safely; no model fallback/retry. Defaulted track/level/minutes fields preserve saved JSON compatibility. Real model compliance and Google consent remain UNVERIFIED; redirect behavior is tested synthetically. Other PENDING/DEFERRED/PREVIEW/LEGACY inventory unchanged. Evidence: [verification](../docs/qa/2026-10-29-learning-tracks.md), CHANGELOG.

**Latest synchronization 2026-10-29.11, plan dialog:** OWNER correction makes revision button match dialog Close styling, retaining its action. Other contracts unchanged.

**Latest synchronization 2026-10-29.10, plan numbering:** OWNER reported repeated numbers; display strips existing numeric title prefixes and avoids manually numbering ordered list items. Stored data and other contracts unchanged.

**Latest synchronization 2026-10-29.9, learning/source and review:** OWNER removed learning-screen source breadcrumb; intake source selection remains. Saved NO_SOLUTION is displayed as unavailable, not as mathematics; future prompt asks for real solution. Other contracts reviewed unchanged; actual provider behavior unverified.

**Latest synchronization 2026-10-29.8, learning header:** OWNER removed the duplicate top-bar course title; page heading and stage navigation remain. Other interface and backlog contracts reviewed unchanged.

**Latest synchronization 2026-10-29.7, practice/help:** only Need help? remains in the practice help row; it retains existing hint/follow-up behavior. Other overlapping shortcuts are documented in CHANGELOG for owner review; other contracts unchanged.

**Latest synchronization 2026-10-29.6, budget:** $1 default local allowance implemented; existing cumulative spending counts, no ledger reset. Provider billing may differ; existing environment override still supported. Other interface/backlog reviewed unchanged.

**Latest synchronization 2026-10-29.5, API-ERROR:** implemented4096-token ceilings for assessment/diagnostic/repair/practice to reduce2048-token truncation. Main route availability/output remains model-dependent; no automatic retry or live call. Other interface/backlog reviewed unchanged.

**Latest synchronization 2026-10-29.4, Activity/API-ERROR:** date/action aligned at44px; explicit process-only strong override disabled on current local server. Main-model inference unverified; restart without override can restore configured Super route. Other backlog/preview contracts reviewed unchanged.

**Latest synchronization: 2026-10-29.3, UI-Library/Activity/V01/P31.** Owner screenshot correction implemented: full themed viewport, no duplicate top Library/Activity labels, compact Library toolbar and responsive grid/list layouts using existing search/filter/upload/open handlers. No placeholder Favorites/Folders features added. Strong route/access remains UNVERIFIED; no environment changes or paid calls. Other pending/preview/backend contracts reviewed unchanged.

**Latest synchronization: 2026-10-29.2 (29 October 2026), UI-04/V03/P31.** Owner correction: no blue focus rectangles on fields. Inputs/textarea/select use neutral boundaries without interior outlines; buttons/links/disclosures retain grey keyboard focus. Earlier blue-ring acceptance is superseded. Other pending/preview/backend contracts reviewed unchanged.

**Handoff revision:** 2026-10-29.1. **Implementation snapshot:** 29 October 2026 — QA-01–QA-06 / UI-01–UI-08 corrections supplement the integrated `V01`–`V09`, `U01`–`U09`, `U11`–`U16`, `U19`, `U20`, `B01`–`B06`, and `P32` workflow. `U10` remains `PENDING` and `U17`–`U18` remain `DEFERRED`. **Authority:** the owner's latest corrections plus the checked-in prototypes. This file records the interface contract and remaining deferred backlog; it does not authorize unrequested features or paid operations.

## Current acceptance supplement — 2026-10-29.1

**LIVE code; FIXTURE verification only.** Affected UI-H/UI-R/Library/Activity/API-ERROR, V01/V03/V04/V09, P23/P31/P32. This supplement supersedes the historical audit's unfixed status for the following local defects:

- QA-01 validates route syntax and preserves explicit strong-route 404 with no retry/fallback; actual catalog access remains an external UNVERIFIED condition.
- QA-02 saved teaching style propagates to concise direct-answer instructions and a 1,200-character schema. Unclosed fences/long nonterminal prose fail safely without replacing the saved answer. No semantic-completeness guarantee or live output claim.
- QA-03 Library refreshes its list/count after shared upload/preview dialog close. QA-04 intake cards show Draft/Finish setup. QA-05 outside-window copy requires the actual 500-event cap and earlier date. QA-06 extraction errors are visible inside the open dialog. Intake draft fields remain editable, history course navigation works after reference selection, and closed account menus reset ARIA.
- V01/UI-01–03/06: readable both-theme action/muted/icon/placeholder tokens and required-control boundaries supplement the palette; placeholders have opacity 1. No new stacked materials or borders on intentional nested lesson surfaces.
- V03/UI-04/05/07: keyboard-visible 2px/3px-offset outlines, notebook image semantics, 16px/1.5 touch prose, 12px/1.4 metadata, 44px enclosing targets and no horizontal overflow. Quiet pointer focus remains.
- V04/UI-08: repeated lesson explanation is behind closed `View lesson`, keyboard-operable, with a 16px gap. The worksheet appears in the first viewport; Times New Roman lining numerals/shared baseline/crimson annotation and text cues remain. V09 attached two-layer composer/divider are unchanged.

Exact tests, measured ratios, axe counts and screenshots: [fix report](../.ui_review/2026-10-29-fixes/report.md). Remaining live provider/OAuth/transcription checks require their existing setup/authorization; this task does not promote them to verified. Other V/U contracts and PREVIEW/DEFERRED/LEGACY inventory were reviewed and have no substantive change. Source inspiration is unchanged; corresponding provenance revision is 2026-10-29.1.

## 0. Instructions to the next LLM

Read these three documents in order, then inspect the named source files:

1. [CURRENT_ARCHITECTURE.md](CURRENT_ARCHITECTURE.md): what actually exists, route/control identifiers, storage, constraints and preview composition.
2. This file: exact target, outstanding changes, backend/data requirements and acceptance checks.
3. [UI_FEATURE_PROVENANCE.md](UI_FEATURE_PROVENANCE.md): source of each idea, adoption decisions, rejected ideas and evidence limits.

The owner can use this prompt:

> Read handoff/CURRENT_ARCHITECTURE.md, handoff/UNREALIZED_CHANGES.md and handoff/UI_FEATURE_PROVENANCE.md, then inspect this project. Treat the latest step-repair prototype as the interface reference, including the equation baseline correction. State which pending IDs you will implement. Preserve working authentication, learner data, API restrictions and legacy Streamlit. Reuse current backend contracts where possible; do not substitute fixed sample responses for real data. Implement only the scope I request, update the three files and CHANGELOG, and verify the interface and backend behavior before saying it is done.

If asked only to reproduce the interface, run/serve or copy the complete `design_review/step-repair/` source. Do not regenerate it from a screenshot or copy only `concept.css`. If asked to integrate it, follow sections 5–8; copying the preview over `app/web/` would discard real functionality.

### Meaning of status words

- **LIVE:** current integrated app code exists; not a claim of newly verified external-provider behavior.
- **PREVIEW:** working local sample UI exists; persistence, model responses or extraction may be simulated.
- **PENDING:** proposed integration, even if demonstrated visually.
- **DEFERRED:** explicitly outside the minimum interface/integration scope.
- **LEGACY:** available only in the separate Streamlit workflow.

Use the IDs below in implementation notes and tests. Mark an ID integrated only after code and checks support that claim.

## 1. Canonical reference and precedence

| Surface | Location / port | Role |
|---|---|---|
| Working app | `app/web_server.py`, `app/web/`, 8780 | Real accounts, resources, courses, question chats and APIs. Preserve. |
| Earlier interface example | `design_review/detail-study/`, 8767 | Prior UI-detail experiment; source for retained shell interactions. Not the latest equation design. |
| **Latest interface example** | **`design_review/step-repair/`, 8768** | Canonical example for this handoff. Includes Thetawave-informed flow and latest owner corrections. |
| **Latest focused proposal sample** | **`design_review/proposal-feedback/`, 8769** | Frontend suggestions1–3 of root proposal. V08 defines its overrides; step-repair remains the shell/math reference. No backend improvements implemented. |
| Older winner concept | `design_review/winner-concept/`, 8766 | Historical exploration. Do not promote over the latest example. |
| Legacy tutor | `app/app.py`, 8502 | Separate Streamlit state/data model. Preserve. |

**Decision order:** latest direct user request → applicable AGENTS/project boundaries → this document's exact target → current prototype source → older research/examples. Source is evidence of current behavior, not permission to broaden data sharing or retain prototype mistakes in production.

The current target is intentionally a familiar learning workspace, not a marketing landing page. Dark default, neutral Inter sidebars, icy blue central learning actions, crimson only for a specific error annotation, guest-only notebook motion. No new framework, decorative course animation, voice feature or infinite canvas is required.

## 2. Reproduce the example exactly before integrating

### Files and load order

`index.html` loads CSS in this exact order:

```text
style.css → learning.css → motion.css → refinements.css → concept.css
```

Scripts load:

```text
navigation.js → script.js → concept.js
```

Also retain `InterVariable.woff2`, `FONT-LICENSE.txt` and `samples/`. `script.js` contains shared shell/menu/form/sample logic; `concept.js` replaces selected renderers and adds `repair`. `concept.css` wins over earlier styles. `motion.css` is currently a retained small placeholder; actual sidebar animation is in `script.js`. Do not conclude there is no motion from reading that file alone.

`concept.js` captures `originalHome`, `originalChat`, `originalLibrary`, then replaces `renderLesson`, `renderHome`, `renderChat`, `renderLibrary`, `paintLibraryRows`, `referenceMenu` and `about`. Final initialization changes the sample struggle and closes the right panel. Removing that initialization or loading the files in another order changes the initial view.

### Run and verify

From repository root:

```powershell
python -m http.server 8768 --bind 127.0.0.1 --directory design_review/step-repair
node design_review/step-repair/check.cjs
```

This is a static production artifact; there is no build step. The checker uses `frontend_tools/node_modules/playwright` and `axe-core`, with isolated headless Chrome. It must not use the user's signed-in browser for account tests. The port serves only the example folder, not the repository root.

Default sample route is `#/learn/algebra/lesson`; supported routes include `#/home`, `#/library`, `#/activity`, `#/learn/algebra/plan`, `#/learn/algebra/practice`, `#/learn/algebra/review` and `#/learn/algebra/questions/why`. Newly created sample thread IDs exist only in memory. The repair micro-step is currently memory state rather than a durable URL parameter. Do not represent these as real production deep links.

### Exact source and visual evidence

- Full shell, controls and sample behaviors: `design_review/step-repair/index.html`, `script.js`, `navigation.js`.
- New episode, source reuse and Library changes: `design_review/step-repair/concept.js`.
- Final geometry/typography: `concept.css` after base/learning/refinements CSS.
- Latest equation crop: [equation-output.png](../design_review/step-repair/screenshots/equation-output.png).
- Latest post-baseline-correction checks: `equation-dark-390.png`, `equation-dark-1440.png`, `equation-light-390.png`, `equation-light-1440.png` in the same screenshot folder.
- Full-layout screenshots 01–13 document the shell/episode. Some were captured before the final math-font change; **the equation crop and explicit CSS below supersede their math font**. Do not reintroduce Georgia from an older screenshot.
- `verification.json` records the interaction suite at its run date. The last math-only correction additionally received focused theme/phone screenshots; do not silently describe an older full-suite run as a new post-font full run.

## 3. Exact visual and interaction contract

### V01. Shell, type and theme

| Item | Required target |
|---|---|
| Type | Local Inter for interface, inputs, sidebars and lesson prose. Do not copy proprietary ChatGPT/Claude fonts. Short equations use the separate math rule in V04. |
| Base dark tokens | `--bg:#000; --panel:#090a0b; --surface:#111315; --hover:#1c1e22; --border:#292c31; --ink:#fff; --muted:#a9adb5; --faint:#858b94`. |
| Base light tokens | `--bg:#faf9f6; --panel:#f2f1ed; --surface:#fff; --hover:#e7e6e1; --border:#d4d3cd; --ink:#17191c; --muted:#646a73; --faint:#6b7078`. |
| Central dark learning | accent/primary `#8fd4f7`, primary ink `#10212c`, learning border `#354751`. |
| Central light learning | accent `#215a7b`, primary `#c5e9fc`, primary ink `#123449`, learning border `#aec6d2`. |
| Error annotation | Dark red `#ef7483` over `#2b171b`; light red `#ae3044` over `#f6e2e6`. Not a full red equation row. |
| Save semantics | Dirty Save? green; clean disabled Saved grey. Preserve the owner's explicit button treatment even though a critic proposed a status line. |
| Root sizing | Rail 60px, history sidebar 248px, right panel 316px, preview bar 36px. At max 799px/coarse pointer preview bar is 48px. |
| Learning width | `.reading.repair-reading` max-width 748px including its padding. Center in available workspace, not the whole window behind panels. The underlying `.reading` padding and all responsive rules remain from the base files. |
| Headings | Repair H1 max 18ch; desktop `clamp(30px,2.6vw,40px)`, tracking −1.3px; max799px H1 32px. Home H1 `clamp(32px,3.2vw,48px)`, max18ch, balanced natural wrapping. No arbitrary hard line breaks. |
| Reading | Intro 16px, line-height1.6, bottom gap24px. Muted means readable secondary text, not disabled content. Project and question titles stay white in dark mode. |
| Theme toggle | One click changes dark/light immediately; no Appearance dialog or System option. Working app may retain its current persistent theme key; example theme is memory-only. |

Use the exact files for every smaller token. Do not extrapolate these colors to all sidebars; central learning blue is deliberately scoped to `main`.

### V02. Shell controls and navigation

- Rail: Home, Library, Activity; no redundant Search rail icon. Theme and preview account dock at bottom left. Existing working account menu/auth remain real during integration.
- History: Personal Learning heading, collapse control, New learning, Search learning, course rows and closed-by-default child-question trees. Text and icon activate the same row. Question chevron toggles only the child list; opening a question reopens its saved chat rather than generating a reply.
- Default example opens the sample lesson with history visible on desktop and **right panel closed**. Personalize reopens it. Keep the familiar sidebar styling; do not substitute dropdowns for its typed fields.
- Both full sidebars are unavailable in desktop Library/Activity. On phone, the navigation drawer may expose Home/Library/Activity routes so users can leave these screens; hide course history/settings there. This exception is deliberate, not a second history surface.
- Course header remains docked above reading. Plan/Learn/Practice/Review is attached to the header with a thin lower border, not floating mid-page. Active stage has icy text and 3px underline. Counter is “Lesson 1 of 3” in the fixed sample, hidden on small screens.
- The repair micro-path is separately labeled **“Repair exercise · This lesson”**. Its three labels are Find the step / Repair it / Try independently. 20px numbered circles, 12px labels, 20px gaps desktop; 18px circles and 10–14px gaps phone. It describes progress, not three freely clickable stage jumps.
- Deliberate navigation focuses the destination H1 without a distracting outline; keyboard focus for actual controls stays visible. Browser Back/Forward restores view, filters/date and reading position where available, subject to dirty-panel protection.

### V03. Panel, forms, popovers and motion

| Control | Required behavior |
|---|---|
| Struggle | Free-text textarea, current course only. New learning starts blank and hides it until there is a course. |
| Teaching style | Free-text textarea, universal account setting. |
| Interests | Free-text input, universal account setting. |
| Course/exam | Free-text input, current course only; reset/hidden on new learning. |
| Language | Automatic unless overridden. Text and right chevron both open the typed language editor; only chevron gets special hover fill. Apply changes draft, not saved account state; Use automatic clears override. Per-course scope. |
| Save | Editing makes Save? green. Saving succeeds before grey Saved/close. No repetitive success toast; a screen-reader status is allowed. Failed save retains draft. |
| Dirty exit | X, navigation and Back cannot silently discard changes. Dialog: Keep editing (white/dark text), Discard changes (red tint/red text), Save (green). Full-width stacked rounded controls. Keep editing retains the view/URL/draft; Discard restores snapshot then performs requested action; Save closes only on successful save then performs action. |
| Text boxes | Enter submits the containing supported form; Shift+Enter inserts newline; do not intercept IME composition or ordinary input typing. No blue interior outline/double border. Provide an outer keyboard-visible cue. |
| Menus | Anchor to trigger; full row icon/text hover and click. One open menu, outside click closes, Escape closes and returns focus; ArrowUp/Down/Home/End navigate. Keep popover inside viewport. |
| X controls | Circular hit area with independently centered icon; do not apply icon hover translation/rotation that makes X off-center. |
| Sidebar motion | 280ms ease-in-out on transform, same edge for enter/exit. Reverse from current computed presentation position. Closing panel immediately inert, hidden only when exit finishes. No lockout while animation runs. |
| Workspace movement | Capture before/after left coordinates, perform one layout update, animate transform to zero. Do not animate margins/width each frame. |
| Scrims | Fade; overlay focus/inert management on narrow screens; prevent background interaction. |
| Reduced motion | Immediate panels, static waiting dot, no reveal movement. Content fully visible. |
| Icon feedback | Whole actionable row triggers icon motion, including text hover. Upload-plus and submit arrows retain the owner's motion exclusions. Disabled controls do not animate as actionable. |
| Phone | Under800px history drawer; under/equal600px hide fixed rail and expose workspace routes in drawer, theme in header. Right panel overlays. Repair action row becomes a one-column grid under/equal600px; each button full width and min44px high. Never squeeze the main label into 3–4 lines beside its secondary action. |
| Touch/text | At max799px or coarse pointer, comfortable 44px hit areas and16px input/body reading. A small glyph may sit inside the larger target. No disabling zoom. |

### V04. Equation baseline and owner-approved simplified output

**This is a mandatory regression constraint, not optional art direction.** The owner's latest annotation concerned different digit heights/baselines within each equation. It did not ask for equals signs to share a vertical column across two differently shaped equations.

Show the equations in a compact left-aligned stack, with these exact dark-sample contents:

```html
<div class="work-sheet">
  <div class="sheet-heading"><strong>Your working</strong><span>Sample attempt</span></div>
  <div class="equation-stack">
    <div class="work-line"><span class="equation-ink"><i>x</i> + 3 = 8</span></div>
    <div class="work-line flagged"><span class="equation-ink"><i>x</i> = 8 <mark aria-label="Incorrect plus sign">+</mark> 3</span></div>
  </div>
</div>
```

Required effective CSS:

```css
.work-sheet { background:var(--surface); border:1px solid var(--learning-line);
  border-radius:14px; overflow:hidden; margin-bottom:20px; }
.sheet-heading { display:flex; justify-content:space-between; gap:12px;
  padding:16px 20px 0; font-size:12px; color:var(--muted); }
.sheet-heading strong { color:var(--ink); font-weight:500; }
.equation-stack { display:grid; gap:14px; padding:22px 24px 24px; }
.work-line { display:flex; align-items:center; min-height:38px; }
.equation-ink { font-family:'Times New Roman',serif; font-size:27px;
  line-height:1.4; letter-spacing:0; font-variant-numeric:lining-nums tabular-nums; }
.equation-ink i { font-style:italic; }
.work-line.flagged .equation-ink mark { font:inherit; vertical-align:baseline;
  background:var(--red-bg); color:var(--red); border-bottom:2px solid var(--red);
  border-radius:4px 4px 0 0; padding:0 4px 2px; }
@media(max-width:799px) {
  .equation-stack { padding:18px 20px 22px; gap:12px; }
  .sheet-heading { padding:14px 16px 0; }
  .equation-ink { font-size:25px; }
}
```

Do not restore Georgia's varying-height numerals. Preserve Inter elsewhere. Do not align the highlight using absolute top/left offsets, separate vertical transforms, flex `space-between` tokens, or screenshots of equations. The expression is text on one baseline; mark inherits font/line height and only changes color/background/underline.

**Must not reappear:** 01/02 row numbers, Starting equation / Check this sign side labels, row separator lines, full-row red background, red number3, raw `$`/`**`/`{execution}` markers. Only the incorrect plus sign is marked. The corrected equation stack has the same geometry without a red mark.

These simple expressions use literal mathematical symbols. For arbitrary generated formulas, reuse the real app's sanitized Markdown/KaTeX pipeline rather than applying the sample's `replaceAll('x',...)` helper to model text. Display math must have consistent numeral/baseline appearance; do not force the UI font onto KaTeX's internal glyph assembly.

Acceptance: compare the latest crop at1440px and390px in both themes; digits3/8 and operators share an optical baseline and consistent digit height. Inspect actual rendered pixels as well as computed family/`fontVariantNumeric`. A bounding rectangle alone cannot prove glyph alignment. If Times New Roman is unavailable on another OS, choose a licensed lining-math equivalent and verify the visual result, rather than claiming the generic serif fallback is identical.

### V05. Exact sample lesson/repair episode

| State | Copy and content | Primary/secondary action and transition |
|---|---|---|
| `notice` | Kicker Solving one-step equations; H1 “Let's find the step that changed.”; intro “Your starting point is right. Look at the operation on the next line.”; V04 original equations. Insight “Keep both sides balanced” / “To remove +3, subtract 3 from both sides. The right side becomes 8 − 3.” | Work through this step → repair. That's not where I'm stuck → correction dialog. |
| `repair` | Kicker One move at a time; H1 “Subtract from both sides.”; intro “The same operation keeps the equation equal.”; worked lines `x + 3 = 8` and `x + 3 − 3 = 8 − 3`. Label **“What is the value of x?”** avoids confusing numeric answer with an entire equation. Placeholder Write x = your result…. | Check this step; accept only5 / x=5 in this sample. Wrong input stays, nearby announced error, `aria-invalid`, focus returns to field. See my original working → notice. |
| `try` | Kicker Changed problem · Same skill; H1 “Your turn. A fresh equation.”; intro “Use the same idea with different numbers.”; problem `x + 4 = 10`, no answer shown. | Check my answer; accept only6 / x=6 in sample. I need a hint reveals subtract4 reminder and marks help. Wrong attempt receives corrective feedback and also marks help. |
| `done` | H1 “You found the missing value.”; “Solved independently” only if no hint/corrective help in this sample; otherwise “Solved with a hint”. Evidence rows: Skill checked, Changed problem, Your answer, Help used, Next check. | Review the repaired step → repair; Restart sample → notice. Recheck later is a suggestion, not a scheduler. |
| `review` | H1 “What this attempt tells us”; show completed evidence or “Finish the changed problem to record evidence from this sample.” | Continue learning returns to current episode without fabricating a result. |

The fixed demo `repair` object has step/nextLine/answer/hint/signal/corrected/error/attempts. Correctable sample focus choices: Knowing which operation to use / Working with negative numbers / Keeping both sides balanced. Choosing a focus updates the visible sample observation only. It does not regenerate the lesson or prove a diagnosis.

Keep the narrow limitation statement: “One sample attempt is not proof of mastery. This preview does not schedule a reminder.” Do not introduce a mastery percentage, streak or award from this episode. The current sample uses `hint` for both explicit hint and corrective help; production evidence must distinguish the help source instead of incorrectly logging every correction as an opened hint.

Known sample quirks to **not promote into production**: numeric regex is not a reasoning grader; repair substeps are not durable routes; restart does not currently reset every correction field; old sample conversation answers are not dynamically derived from the highlighted step; export files are fixed sample checkpoints. Preserve source to replay the demo, but use real state/validation when integrating.

### V06. Source/context, Home, questions, Library and Activity

- Context line: folder icon / Algebra foundations / source button with colored PDF identity and Course notes. Opens source preview. It must identify the actual course/resource when integrated, not remain hardcoded.
- Under episode: “Questions stay with this lesson · Keeping both sides balanced”, then Ask about this step and a compact composer. An empty send is disabled. Existing thread shows original question as title, compact lesson scope and user/assistant turns; follows same-thread context. Off-topic Yes/No is still a local keyword demonstration in the preview; real app has its own logic.
- Home: H1 “What would you like to understand?”; subtitle “Start with a question. Add your notes if they help.” Goal input, plus left/up-arrow submit right, removable selected-reference chip. No Enter helper line. Goal intents Understand a concept / Prepare for an exam / Practice a weak step **fill editable text and do not submit**. Continue where you left off is a full-row action with trailing Continue arrow.
- Plus menu: Upload a file / Paste a link / Use an existing reference. Existing-reference dialog has search, one selected source, strong selected border/fill, checkmark and Selected label. Clicking applies immediately and closes. Preserve typed goal. No hidden model call/reupload. Main file selection is metadata/sample extraction only in the preview; production must use real capability checks.
- Library: H1 + Add a reference, search, All / References / Notes with counts. Full rows, colored file icons, no trailing launch arrow. Reusable-source label. Specific no-match heading quotes query; Clear search recovers. Distinguish genuinely empty library, empty category, request failure and search misses during integration.
- Activity: date picker + All dates; rows reopen associated learning. Current live retrieval is only500 newest events; do not imply an old empty date proves no activity. True historical dates require backend work.
- Export: filled/bordered Download checkpoint as… button; one anchored icon/text popover for MD/DOCX/PDF. Blue Word, red PDF, neutral Markdown identity. No separate always-visible format select. Preview downloads fixed files; app endpoints produce real authenticated exports.

### V07. Waiting, errors and stale responses

One generic waiting row:28px minimum height,13px label,8px dot/gap,12px vertical spacing, opacity pulse around1.3s. Static dot under reduced motion. Position at the pending assistant-answer start, below role label and above composer; for a new plan place below submitted goal heading. Do not expose private chain-of-thought or invent staged progress.

Submitted text remains visible in a user/pending bubble; do not repeat it visibly inside a disabled composer. Retain draft internally. Reply failure appears beside the pending operation, with Retry / Edit question. Edit restores input; Retry reuses logical request identity. After navigating elsewhere, a late result must update its owning thread/state without pulling the current view back.

Reference transfer/read failure stays in active intake dialog with filename and recovery. URL validation retains input, points error at field, focuses it after invalid submit. Plan failure offers Back / Try again without losing original goal/reference. A disabled empty submit should not produce a toast.

### V08. Frontend proposal sample: exact scope and overrides

Source: root `ui_improvement_proposal.md`; user requested a new sample and explicitly deferred backend improvements. Run `design_review/proposal-feedback/` on8769; append proposal.css/proposal.js after V02 source layers. All V01–V04 owner typography, shell, panel and equation-baseline constraints remain. This sample replaces the V05 episode with ordinary Teach/Practice/Submit/Help surfaces. It does not show real help-use evidence or wrong-operator diagnosis from a real attempt.

Default: H1 Try this equation; sample equation x+3=8; Your answer textarea seeded x=5; Your reasoning textarea with subtract3 working; sample My working.md attachment chip; warm Submit answer. Fixed content is labeled and never grades arbitrary answers. Help secondary action follows the response region so it cannot separate Submit from its wait/error.

| Action | Entry | Waiting label | Success |
|---|---|---|---|
| Teach | Preview states→Teach→Teach me this idea | Preparing your lesson… | Fixed short lesson and aligned worked equation stack. |
| Practice | Preview states→Practice→Give me practice | Writing a practice problem… | Sample answer/reasoning form. |
| Submit | Initial form or Preview states→Submit→Submit answer | Checking your answer… | Fixed illustrative feedback explicitly says it has not graded the answer. |
| Help | Preview states→Help or Help action→Help with this step | Preparing help… | Fixed brief subtract3 explanation. |

Every pending operation uses V07's28px row/13px label/8px dot and gap/12px vertical space. Sample timers are1800ms; Preview states can hold them until Finish preview wait. That top-bar control is a local demonstration control, not provider cancellation. No real POST, retry, grading or provider call occurs.

Before applying inert, move focus out of the initiating form to the status region. Keep `#operation-feedback` outside inert ancestors; lock form/header/source-context/rail/history/pattern and other learning controls; restore prior inert states afterward. Trigger width is reserved; text becomes Checking… or Preparing…, disabled and visibly busy. No duplicate action launches. Header is sticky at `top:var(--bar)` with neutral background/z-index12 so it remains below the reserved preview strip. Small-screen waiting/error screenshots are actual viewport captures, not full-page stitching of scrolled fixed UI.

Known pre-send failure: crimson inline card directly after action,14px heading/13px body desktop and16px phone,10px radius/15–16px inset. Text states draft/context is kept and failure happened before sending. Try again replays only the local simulation; Edit restores focus and keeps answer/reasoning/file metadata. Main trigger is subdued/disabled while recovery is shown, restored when editing. There is no bottom error toast. A screen-reader announcement and keyboard focus must remain available despite the interaction lock.

Unknown completion: copy says completion could not be confirmed, draft remains and saved state should be checked. Show **Check saved result** plus Edit, **no unconditional Try again**. The sample opens an explanatory dialog because no server result exists. Real reconciliation/deduplication remains U04/B05. The proposal's request for an A/B backend choice does not block this authorized static demonstration.

Home source picker/removal is reused unchanged from V06. Library demonstrates four separate conditions: Your library is empty→Add a reference; No saved explanations yet→Show all items; No matches for [query]→Clear search; Library could not load→Try again, retaining query/filter. Counts reflect the active sample dataset, including Notes0 in category-empty case. Activity distinguishes No activity yet, No matching events in this view, and dates outside26–27 October sample range; always explain the current app's500-event window without claiming complete history. Preview controls can restore normal sample lists.

Verification command: `node design_review/proposal-feedback/check.cjs`. Check all four wait/error/retry flows, inert/status accessibility, duplicate action blocking, exact draft/attachment preservation, pre-send versus unknown recovery, empty submit, Enter/Shift+Enter, source reuse, distinct list states, both themes, six widths and reduced motion. No external or mutation requests allowed. Nine axe states passed in the recorded run. No LIVE status promotion is implied.

### V09. Owner's centered Home and viewport boundary refinement

Latest owner correction applies to `proposal-feedback/` and supersedes its inherited V06 Home subtitle/left-aligned heading and V08 help label. Four requirements:

1. Home H1 “What would you like to understand?” is centered horizontally within the main reading region, with natural balanced wrapping. Remove the subtitle “Start with a question. Add your notes if they help.” Position the title/composer/intents as a vertically centered first-screen group.
2. Remove the tick before Plan in **every** stage strip, including plan/review. Clear the header's “New learning” label on Home; keep the real New learning sidebar action available.
3. Practice help is exactly **“Need help?”**, white background `#fff`, black text `#000`,14px/500, min44px high,10px corner radius and10px18px padding. Hover is `#e5e5e5`/black. Keep it after the feedback region. These colors apply in both themes; the action still opens the help form.
4. First-screen divider belongs at the viewport's bottom edge. Continue where you left off and all continuation content stay below it until scrolling; do not hide/remove that section.

Implementation: `renderHome` removes subtitle/clears `#page-label`, moves all initial Home nodes before `.resume-learning` into `.home-first-screen`; `.resume-learning` remains its sibling. The wrapper uses `min-height:calc(100svh - var(--bar) - var(--home-header-height))`, flex column/center,32px vertical padding and1px bottom theme border. Home reading has zero top padding; header height variable is74px desktop and66px at max799px. Preview bar remains36px desktop/48px small or coarse-pointer. H1 uses centered text/alignment and margin `0 auto 28px`; intent row centered. At max600px wrapper padding is16px and H1 is32px/1.15. Remove continuation's old top border/margin; keep24px top padding. The border is inside the wrapper so its last pixel is visible at the viewport boundary.

Do not set fixed absolute screen coordinates, hide lower content, or introduce a second inner scrollbar. Preserve source chips, menus and form behavior. The min-height allows content growth rather than clipping if fonts/zoom/long content exceed the available space. At tested1440×1000,1280×800,390×844 and360×640, the continuation's top equals viewport height within1px with the standard sample content. Verify again for layout/font changes, rather than assume the equality holds for arbitrary content or zoom.

`check.cjs` now asserts no Plan SVG tick, empty Home header label, no subtitle, centered H1, white/black help styling, exact four-size fold geometry and scroll reachability; existing operation/source/error/theme checks remain. U01/U02/U05 gain only additional PREVIEW evidence. No backend semantics change.

## 4. Outstanding register: current implementation versus desired integration

All rows below are **PENDING for the live app** unless the LIVE baseline explicitly says otherwise. PREVIEW does not mean backend-integrated. IDs map to architecture control groups, not invented existing routes.

Revision 2026-10-28.5 realizes `U01`–`U09`, `U11`–`U15`, `U20`, and `B01`–`B06` into the live application (`app/web/step-repair-live.css`, `app/web/step-repair-live.js`, `app/episode_helpers.py`, `app/web_server.py`, `app/learning_history.py`, `app/schemas.py`). `U10` remains `PENDING` and `U16`–`U19` remain `DEFERRED`.

| ID | Target / preview | LIVE baseline and exact integration boundary | Backend/AI impact |
|---|---|---|---|
| U01 | **LIVE (2026-10-28.5)** — V01–V04 final visual system, docked stages (no Plan tick), equation alignment (`Times New Roman` lining/tabular numerals) | Integrated in `app/web/step-repair-live.css` and `app/web/step-repair-live.js` over live `app/web/index.html`. | Backed by U12 code-point span validation in `app/episode_helpers.py`. |
| U02 | **LIVE (2026-10-28.5)** — Reversible 280ms panels, mobile 44px/16px, focus/Back continuity, closed-default right panel on course entry | Integrated in `app/web/step-repair-live.css` and `app/web/step-repair-live.js`. | Frontend; preserves real account/course state. |
| U03 | **LIVE (2026-10-28.5)** — Operation-scoped waiting/errors (`#operation-feedback`) and retained drafts for Teach/Practice/Submit/Help | Integrated in `app/web/step-repair-live.js` with `inert` form lock outside `#operation-feedback`, reserved trigger width, and pre-send vs unknown completion recovery. | Paired with U04 `request_id` deduplication. |
| U04 | **LIVE (2026-10-28.5)** — Safe retries (`request_id` deduplication) and structured typed errors (`{error, code, retryable}`) | Implemented in `app/web_server.py` (`creation_request_id` and bounded `completed_requests` on courses, plus `BoundaryMiddleware` error codes). | Server-side idempotency before retry. |
| U05 | **LIVE (2026-10-28.5)** — Existing-reference picker (`[data-existing]`), editable goal intents (`[data-starter]`), removable `.attachment-chip` (`#remove-reference`), centered first-screen Home (`V09`) | Integrated in `app/web/step-repair-live.js` and `step-repair-live.css` using owned `/api/resources` and `resource_id`. | Server ownership checks preserved; no extra model calls. |
| U06 | **LIVE (2026-10-28.5)** — Counted Library filter tabs (`All`/`References`/`Notes`), `+ Add a reference`, 4 distinct Library empty/error states, and Activity 500-event window messaging | Integrated in `app/web/step-repair-live.js`. | Uses loaded account resources/activity; full historical date pagination remains optional future work. |
| U07 | **LIVE (2026-10-28.5)** — Full panel dirty guard (`window.guardNavigation`) across navigation/rail/courses and quiet `Save?`/`Saved` | Integrated in `app/web/step-repair-live.js` + `polish.js`. | Reuses atomic `/api/profile`; failed save retains draft. |
| U08 | **LIVE (2026-10-28.5)** — Compact `.context-line` source/course bar and scoped saved question continuity (`Questions stay with this lesson`) | Integrated in `app/web/step-repair-live.js` + `chat-live.js`. | Preserves real multi-turn question threads. |
| U09 | **LIVE (2026-10-28.5)** — Colored checkpoint format menu (MD/DOCX/PDF) and real authenticated export | Integrated in `app/web/polish.js` and `app/web_server.py`. | Preserves account ownership and real course export content. |
| U10 | **PENDING** — Brief explanation/example support modes | Current lesson/followup generation exists; preview modes are fixed text. | Explicit generation contract and bounded scope/evaluation; no fake selected mode. |
| U11 | **LIVE (2026-10-28.5)** — Structured 3-step repair micro-path (`Find the step` / `Repair it` / `Try independently`) tied to actual attempt | Integrated in `app/episode_helpers.py` (`build_public_episode`), `app/web_server.py`, and `app/web/step-repair-live.js`. | Maps directly onto real `diagnostic` → `repair` → changed `practice`/`attempt` → `feedback` stages. |
| U12 | **LIVE (2026-10-28.5)** — Exact incorrect-step/operator evidence with Unicode code-point span validation | Implemented in `app/episode_helpers.py` (`validate_span`, `detect_deterministic_span`, `build_work_sheet`) and `app/schemas.py` (`Assessment` optional span fields). | Rejects out-of-range/mismatched spans and falls back safely to unhighlighted text. |
| U13 | **LIVE (2026-10-28.5)** — Durable per-exercise assistance tracking (`hint_opened`, `corrective_feedback`) and honest outcome summary (`Solved independently` vs `Solved with a hint` / `Solved with guidance`) | Implemented in `app/episode_helpers.py`, `app/learning_history.py`, `app/web_server.py` (`hint` action persisted before returning hint), and `app/web/step-repair-live.js`. | Includes explicit caveat `"One attempt is not proof of mastery."` |
| U14 | **LIVE (2026-10-28.5)** — Sanitized correctable learner observation (`That's not where I'm stuck`) | Implemented via `correct_observation` action in `app/web_server.py` and `build_public_observation` in `app/episode_helpers.py`. | Ownership-checked; updates `episode_observation` without exposing private `learning_signals`. |
| U15 | **LIVE (2026-10-28.5)** — Generated changed problem (`practice(changed=True)`), guarded solution, and parent attempt linkage | Integrated in `app/web_server.py`, `app/learning_history.py`, and `app/episode_helpers.py`. | Active answers stripped in `public_state`; links `repaired_in_objective`. |
| U16 | **LIVE (2026-10-28.6)** — Integrated spaced review (`start_review` / `skip_review`) over taught, approved-course concepts | Integrated `app/review.py` and `app/review_selector.py` (`Asia/Jakarta` learner date or explicit `on_date`) into `app/web_server.py` (`public_state["review_status"]`) and `app/web/step-repair-live.js` (`.spaced-review-card`). | Bounded 1-item review; `lapses >= 3` routes to relearning explanation; same-session vs delayed review distinguished. |
| U17 | **DEFERRED** — Source-span citations/multiple sources | LIVE one retained resource/excerpt; View source is not an inline citation. | DEFERRED: provenance/span schema, bounded retrieval and explicit context approval. |
| U18 | **DEFERRED** — True upload/extraction progress and cancellation | Current requests complete as JSON; optional transcription is provider-dependent. | DEFERRED: actual jobs/progress/cancel guarantees. No fake percentage/Stop control. |
| U19 | **LIVE (2026-10-28.6)** — Candidate plan revisions (`pending_revision`, `apply_revision`, `discard_revision`) | Revising an already-approved course creates `pending_revision` without overwriting the accepted curriculum or lesson progress until explicitly applied (`app/web_server.py`, `app/web/step-repair-live.js`). | Preserves accepted version and `lesson_history` across candidate review and apply. |
| U20 | **LIVE (2026-10-28.5)** — Capability-aware auth/upload states, multicolor Google icon, and guest-only Hairline notebook/folder figures | Preserved and verified in `app/web/live.js`, `notebook.js`, `folder.js`, and `step-repair-live.js`. | Preserves real capability/auth and guest-only Hairline scene. |
| U21 | **LIVE (2026-10-30.4)** — Cramming mode, exact crimson controls, urgent scope and editable extraction | Home toggle/starter, profile boolean, intake form and exam progression in final live layers. | Deterministic extraction; existing bounded generation/budget; no extra inference. |
| U22 | **LIVE (2026-10-30.4)** — Desktop panel resizing | Native pointer/keyboard separators and local width persistence, responsive caps/overlays. | No backend or model context change. |
| U23 | **LIVE (2026-10-30.4)** — Subtopic-aware similar learning | Core/specificity normalization plus bounded token fuzziness; account-owned similar_learning response. | No embeddings, model call or additional account data transmission. |

Earlier review recommendations R01–R35 and UPM-01–UPM-06 are consolidated here: R01–04/33/34→U03/U04/U18; R05–10/15–19/24/27/28/31→U01/U02/U07/U08; R11–14/21/22/23→U05/U06/U17/U18; R20→U10; R25/32→U11/U13; R26→U09; R29/30→U03/U20; R35→U19. A skeleton is deferred unless an actual loading structure benefits from it. UPM focus/hit area/text/error/Back/transform work→U02/U03/U07. This mapping carries the implementation intent without requiring a fourth document.

## 5. Backend integration design, explicitly proposed

### B01. Reuse the current state machine

Current flow: approve → ready → teach/lesson → practice/attempt → assessment → feedback OR diagnostic → repair → changed practice/attempt. `next` currently requires feedback. Question branches are parallel.

Map the three-step UI to this real flow; do not add sample `notice/repair/try/done` as unchecked server stages:

| UI episode step | Real source of truth |
|---|---|
| Find the step | Submitted attempt + validated public assessment, after diagnosis where necessary. Never invent learner work. |
| Repair it | Real diagnostic response and repair explanation, associated with that attempt/objective. |
| Try independently | New exercise instance targeting the same objective; answer/solution withheld until allowed. |
| Outcome/review | Persisted assessment + assistance evidence, not `repair.hint` in browser memory. |

`app/web_server.py:course`, `app/web_tutor.py:assess/repair/practice`, `app/schemas.py`, `app/web_store.py` and final `app/web/learning-ui.js`/`practice-ui.js` are initial integration points. Read exact current definitions before changing them; the architecture uses ordered overrides.

### B02. Minimal durable episode/evidence schema

Proposed records may initially live inside versioned course JSON because that is current storage. Do not create a new service or database solely for this UI. Use additive defaults for old courses. A normalized table is justified only by query/transaction requirements.

Illustrative **future** public projection (not an existing response):

```json
{
  "episode": {
    "id": "stable-server-id",
    "objective_id": "existing-objective",
    "attempt_id": "stable-attempt-id",
    "exercise_instance": "existing-instance-id",
    "state": "repair",
    "steps": [{"id": "line-2", "text": "x = 8 + 3"}],
    "annotation": {
      "step_id": "line-2", "start": 6, "end": 7,
      "quoted_text": "+", "kind": "possible_error",
      "explanation": "Subtract 3 from both sides.",
      "verification": "model_assessed"
    },
    "assistance": [{"kind": "corrective_feedback", "exercise_instance": "changed-instance"}],
    "outcome": "not_yet_checked"
  }
}
```

Define offsets as Unicode code-point indices, end-exclusive, and validate the quoted substring server-side. The sample offsets above select `+` in the exact shown string. An implementation may use stable token IDs instead; publish one unambiguous convention. Browser JS string slicing uses UTF-16 code units, so convert correctly or use tokens; test emoji/non-ASCII before trusting spans.

Never render model-provided HTML. Store text/math content plus bounded semantic spans; sanitize Markdown/math using existing pipeline. Reject out-of-range/mismatched annotations; fall back to unhighlighted text + tentative explanation. “Cannot identify reliably” is valid. A model-selected sign is not automatically deterministic verification.

Record stable server attempt IDs, episode parentage and changed-from ID. Current `attempts` list lacks this complete public episode contract. Preserve current histories instead of rewriting them from sample data. Attachment binding must include/validate the appropriate exercise identity; current repeated-question fingerprint caveat in architecture still matters.

### B03. Assistance and outcome policy

For each exercise instance, append assistance events such as `hint_opened`, `worked_solution_shown`, `corrective_feedback`, `assistant_answer_revealed`; include server time and event/request identity. The server derives outcome as not_yet_checked / incorrect_or_uncertain / correct_with_help / correct_without_recorded_help. UI labels can remain concise but must not overclaim external assistance detection.

Record help **before** returning its content so a refresh/race cannot erase it. Do not trust a client `independent:true`. A wrong attempt followed by revealed correction counts as help; repeated retries must not clear assistance. Reopening a saved result cannot transform it into independent success. For old attempts with missing evidence, report unknown, not independent.

If help can be revealed inside a same-lesson chat, either conservatively count that relevant disclosure or qualify the evidence as “without recorded hints in this exercise.” Define the policy before presenting global independent mastery. `next` may need stronger server gating; current `feedback` alone does not establish the new evidence policy.

### B04. Correctable observations without exposing internal signals

Publish only a minimal factual/tentative observation: ID, course/objective/attempt link, learner-facing label, evidence excerpt, uncertainty/status and learner correction. Do not return raw `learning_signals`, internal prompts or model metadata. `public_state()` currently removes them deliberately.

An ownership/revision-checked correction action should append a correction, preserve original evidence and mark the inferred label disputed/corrected; don't delete the submitted work. Current profile struggle is learner-entered context, not the same data type as an inferred observation. Keep them separate. If corrections later affect model prompts, state the exact newly sent fields/history bounds and obtain the required scope approval first.

### B05. Contract and write safety

Prefer extending existing course action endpoint rather than a parallel API. Candidate names such as `hint`/`correct_observation` are **proposals, not callable routes**. Every mutation must validate account/course/objective/exercise binding, allowed stage, body bounds and optimistic revision; apply current origin/session/throttle safeguards.

Use stable request identity and server deduplication for billable/mutating operations beyond the existing chat UUID handling. Persist operation result/id before claiming repeat-safe retries. Do not retry arbitrary POST automatically after ambiguous network failure. Preserve `accountEpoch` and add owning view/course/thread checks before enabling navigation during requests.

Suggested error contract: a safe stable `code`, user-readable `message`, `retryable` and optional field identifier. Distinguish validation, stale revision, unavailable capability, access, local budget, provider temporary failure and unknown result. Never expose credentials, raw provider body or private prompts in the error UI.

### B06. Reference reuse and search: keep the first version small

Single existing-reference selection can use existing GET `/api/resources` and course POST `resource_id`. The backend already rejects a resource not owned by the account; keep that. Selection itself needs no inference. Chips/removal change the next-course selection, not delete stored resources. Do not send additional source collections just because the UI has a picker.

Keyword search/counts can use current loaded resource metadata/text. Full historical Activity requires paginated/date-bounded account-owned queries with browser-local day converted to a specified UTC interval; define timezone and boundary behavior. No embeddings are required. Multi-source citations need a separate approved data/model contract.

### B07. Existing capabilities and non-negotiable safety boundaries

- Preserve real Google/email authentication and signed-account resource/course ownership; no mock account replacement.
- Preserve the current multicolor Google icon left of Continue with Google. Preserve real guest-only Hairline notebook/formula scene and whole-row folder feedback when porting the signed-in example; their absence from its initial sample screen is not a removal request. Provenance P28/P29 identifies those origins.
- Preserve model budget reservation, configured capability checks, no paid inference in preview tests, no implicit transcription enablement.
- Preserve main-reference versus reasoning-file pipelines, file/page/text limits, SSRF protections and OCR text review. Do not advertise image-reference or slide/video understanding because another site has it.
- Preserve approved plan/version gate, withheld active answers/solutions, atomic profile scope and question transfer behavior.
- Preserve legacy Streamlit/data and current database revision checks. Back up and migrate with additive defaults; no destructive demo reset of user state.
- Preserve sanitized Markdown/KaTeX; no raw model HTML or accidental rendering of `{execution}`/`{reasoning}` markers as lesson prose.
- No deployment/push, credential disclosure or broader model-context sharing is authorized by this documentation.

## 6. Implementation sequence and stop conditions

1. **Baseline:** run the example, inspect current source/overrides and snapshot relevant app source. Establish current tests using temporary storage and deterministic providers. Do not read `.env` values or private learner bodies into a report.
2. **Visual/frontend pass:** U01/U02/U05/U07/U08/U09/U20 where existing endpoints suffice. Match V01–V07, including equation alignment. Keep meaningful current behavior; no production sample data.
3. **Feedback safety pass:** U03/U04 before removing broad request locks or adding retries. Test stale results, account switch, duplicate POST and failure recovery.
4. **One real episode:** U11/U12/U13/U14/U15 on a bounded checked algebra case. Define additive schemas/assistance policy and model scope; implement only approved scope. Do not expose sample diagnosis as generated behavior.
5. **Deferred decisions:** U10/U16–U19 only on explicit scope/product need. Do not block the simpler interface port on podcasts, multi-source search or scheduling.
6. **Delivery:** update this register per ID, architecture for actual behavior, provenance for altered adaptations and root CHANGELOG with verification/limits.

Stop and request a concrete decision if implementation would newly transmit more learner data than authorized, add a paid provider/service or require an unresolved destructive migration. Routine reversible layout choices within this contract do not require repeated approval.

## 7. Required acceptance checks

### Visual and interaction

- Desktop1440×1000,1280×900,1024×900; phone390×844 and360×900; also768px. Both themes, reduced motion and coarse pointer. No horizontal overflow, no clipped equations/buttons, no3-line squeezed primary action.
- V04 baseline: inspect actual glyphs3/8/+; same size/lining/baseline, marked+ inherits typography. Only+ highlighted. Compare exact crop; do not resurrect rejected row decoration.
- Panel: open/close and reverse mid-motion; starts closed in latest example. Closed inert, focus restored, overlay blocks background only where needed; no per-frame margin animation.
- Text/IME: Enter submits, Shift+Enter newline, composition not submitted; empty buttons disabled. Pointer vs keyboard focus visible without interior blue rectangle.
- Dirty settings: Keep editing/Discard/Save for X, route and browser Back; save failure retains draft and URL/view consistency.
- Menus: mouse, Tab/arrows, Escape, outside click, viewport edge; X centered; text hover triggers same row feedback as icon. Upload/submit exclusions remain.
- Sources: fill intent without submission; reuse source without upload/model call; replace/remove preserves goal; source label equals actual context. Invalid URL focuses linked error and retains draft.
- Chat: reopen saved branch no inference; same-thread follow-up; pending bubble, correctly placed waiting row, manual Retry/Edit, late result does not navigate current view.
- Library: category counts, search all terms, quoted no-match/recovery, no trailing row arrows. Activity: All dates/date selection, correct local-day semantics and honest history window.
- Exports: real integration downloads actual authenticated content, not static preview files; failed export provides recovery without losing course.

### Backend/data/AI when integrating

- Two accounts cannot retrieve/correct/hint/export each other's course/resource/episode. Invalid/stale exercise IDs and stale revisions fail safely.
- Invalid annotation span, quoted-text mismatch, non-ASCII offset, ambiguous diagnosis and unsupported model marker never create misleading highlighted math.
- Hint/corrective help persists across reload/retry/new tab. Duplicate request does not double-generate or clear assistance; uncertain old evidence stays unknown.
- Changed problem links same skill/parent attempt, different exercise identity, no active answer leak. Correct final value with unsupported reasoning is not silently treated as verified reasoning.
- Plan approval/version and `next` gate remain consistent with selected help policy. Reload restores real episode, not fixed algebra defaults.
- Failure before/after persistence, provider timeout, local budget refusal, account switch and stale UI all preserve rightful data and usable drafts.
- Temporary isolated DB and deterministic inference are clearly identified in results. Any permitted live model check records scope/cost and never becomes a universal accuracy claim.

Automated axe success is useful evidence, not a blanket accessibility guarantee. Fresh screenshots must reflect the latest source. Record exactly which suites were rerun after each correction; don't recycle old success claims.

## 8. Maintenance rule

For each future change, update status in section4, add exact new geometry/copy/behavior to section3 if changed, update architecture only for actual implementation, and update provenance if a source/adaptation changes. Keep root CHANGELOG as chronological history, not the only source of the current target. These three files plus project source must remain enough to continue without reconstructing chat history.

**Mandatory synchronization:** read all three files before code changes; update all three records during the same task. If substantive content in one file is unaffected, add a reviewed/no-semantic-change entry explaining why. Apply to application, preview, tests, runtime configuration and visual assets. Root AGENTS.md now contains this owner-required rule for future agents. Never silently mark PREVIEW work LIVE.

| Revision | Scope checked | Status |
|---|---|---|
| 2026-10-28.1 | Latest `step-repair` source, owner equation corrections, real route/tutor/store contracts and prior R01–R35/UPM recommendations | Consolidated target and pending backend plan. Documentation only; individual LIVE-baseline/PREVIEW/PENDING/DEFERRED distinctions in U01–U20 remain unchanged. No integration performed. |
| 2026-10-28.2 | New proposal-feedback source, V08/PF-01–PF-10/P30; U03/U05/U06 sample behavior | Frontend-only PREVIEW added. Backend contracts reviewed and unchanged; no U04/U12/U13 integration or new model data sharing. Nine sample axe views and focused interaction checks passed. |
| 2026-10-28.3 | Proposal Home/layout, V09/P31; U01/U02/U05 and retained V08 behavior | Centered Home, removed subtitle/header label/tick, white need help? and viewport divider. Ten sample axe views plus four-size fold geometry passed. Backend contracts reviewed; no semantic changes. |

### Latest synchronization

| Revision | Scope | Status |
|---|---|---|
| 2026-10-28.4 | V09/P31/PF-12: capitalized Need help?; explicit Plan-icon suppression and versioned preview assets | PREVIEW-only correction verified on active Plan and lesson; backend and other source provenance reviewed with no semantic changes. |
| 2026-10-28.5 | Realized `V01`–`V09`, `U01`–`U09`, `U11`–`U15`, `U20`, and `B01`–`B06` into live `app/web/` (`step-repair-live.css`, `step-repair-live.js`, `index.html`) and backend (`app/episode_helpers.py`, `app/web_server.py`, `app/learning_history.py`, `app/schemas.py`). | Marked `U01`–`U09`, `U11`–`U15`, `U20` and `B01`–`B06` LIVE; kept `U10` PENDING and `U16`–`U19` DEFERRED. Verified with 84 pytest tests and headless Playwright across 6 widths (360–1440px) and both themes. |
| 2026-10-28.6 | Integrated `personal-learning` workflow (`P32`, `U16`, `U19`): compact intake, `direct_question`, source section mapping, flexible module → lesson → concept hierarchy (up to 24 objectives), candidate plan revisions (`apply_revision`/`discard_revision`), adaptive step-size/support-level teaching, optional check (`skip_check` → `unassessed`), schema v2 migration, integrated spaced review (`start_review`/`skip_review`), and hierarchical exports (`checkpoints.py`). | Marked `U16` and `U19` LIVE; kept `U10` PENDING and `U17`–`U18` DEFERRED. Verified with 92 passed pytest tests including headless Chromium Playwright verification. |


## Revision 2026-10-28.7 — A1–A6 owner-requested transport/polish

**LIVE code; NOT live-provider verified:** purpose output/time budgets, optional strong tier and thinking, configurable local budget/pricing estimates, metadata/favicon, semantic heading correction and themed browser 404. Details/defaults are in CURRENT_ARCHITECTURE section 10. No prompt/context expansion or automatic retry. No `.env` read/edit; no inference, deployment or push.

**V09 / UI-H08 / P23/P31 supplement:** the LIVE Home Personalize strip is separated from the composer by 10px; centered geometry and viewport divider remain. Existing previews are retained as PREVIEW and were not modified. Inter is already one 352,240-byte variable WOFF2. Font reduction remains **PENDING** because offline fontTools/pyftsubset is unavailable; license/assets unchanged. Both-theme Home gap/fold/Inter-family/overflow checks passed at four prescribed sizes under pytest.

**Owner checks pending:** verify Nano rates (0.06/0.24) and explicitly UNVERIFIED Super rates (0.30/0.80 USD per million input/output tokens); verify strong-route entitlement/thinking compatibility, then run one manual real session if desired. U10 remains PENDING; U17–U18 remain DEFERRED; LEGACY Streamlit preserved. No backlog promotion from these transport changes.

| Revision | Scope | Verification / limits |
|---|---|---|
| 2026-10-28.7 | A1–A6; API-ERROR/UI-H08/V09/P23/P31 | Reviewed exact interface and backend requirements; supplement only for transport/metadata/10px gap. No semantic changes to V01–V08, pending/deferred contracts or preview inventory. Baseline 92 passed; final 150 passed (50.61s); details in CHANGELOG. |


## Owner correction - 28 October 2026, revision 2026-10-28.8

LIVE frontend: UI-H08 / V09 / P31 restores the attached two-layer Home composer (Personalize strip overlaps by 12px, top padding 12px, bottom rounded corners) and centers prompt suggestions. This supersedes revision .7's 10px detached gap. P32 intake removes the pace badge and repeated small header goal, retains the main H1, and puts file-icon Attach files at the left with Propose curriculum and red/white Skip grouped at the right. Save draft and Answer as a one-off question instead remain below; the latter answers directly without proposing a curriculum. Mobile actions wrap. Existing handlers and backend semantics are unchanged. Other V/U/P contracts, PREVIEW inventory, pending/deferred work and LEGACY entry point reviewed with no semantic changes. No provider calls or configuration changes. Verification: targeted personal-learning pytest suite; result recorded in CHANGELOG.


## Attachment/error correction - 28 October 2026, revision 2026-10-28.9

LIVE UI-R / P32 intake Attach files now opens the actual upload form, not the existing-reference library picker. The shared upload/source preview accepts a selection callback: selecting an uploaded reference keeps the intake form and draft values, updates its source label, and includes selected resource_id in the next existing intake action. Other upload entry points keep their previous behavior. API-ERROR provider 404 now identifies the requested model and relevant default/strong model setting; no automatic fallback, retry or paid verification. Root cause of provider availability remains unconfirmed without checking owner configuration/catalog/project access. Reviewed other V/U/P, previews and deferred work: no semantic changes. Verification recorded in CHANGELOG.


## Browser audit synchronization - 28 October 2026, revision 2026-10-28.10

Reviewed UI-H/UI-R/Library/Activity/API-ERROR/P32 and V09 against live Browser observations: see [feature audit](../docs/qa/2026-10-28-browser-feature-audit.md) for exact passes, QA-01 through QA-06 and blocked work. No application, preview, model configuration or source provenance semantics changed in this task; screenshots/report are audit evidence only. Configured strong route fails live, default direct answer works but is overly long/incomplete; downstream live course stages remain unverified. Separate mocked suite: 150 passed (52.26s). Two owner-authorized real requests submitted. Existing PENDING/DEFERRED/LEGACY status retained; discovered issues are not claimed fixed.
