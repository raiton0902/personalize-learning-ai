# QA and UI defect repair verification

Revision **2026-10-29.1**, 29 October 2026, Asia/Jakarta.

The fixes are implemented in the integrated application. All browser results here use isolated local accounts, temporary databases and synthetic content. No live model, Google OAuth or transcription result is claimed. No `.env`, credentials or private learner database was read or changed; no paid requests, deployment or push occurred.

## Functional evidence

Baseline: **150 passed in 27.65s**. Final full suite, including four-format upload and keyboard-focus coverage: **160 passed in 53.46s**. The focused browser repeat also passed (1 passed, 9 deselected, 29.65s).

| Defect | Fix | Verification |
|---|---|---|
| QA-01 | Clean NVIDIA/Nemotron route syntax; actionable strong-route 404, zero retry/fallback | `test_qa01_strong_404_has_exact_diagnostic_and_no_fallback` and `test_qa01_invalid_strong_slug_is_rejected_before_transport` in `app/tests/test_defect_regressions.py`; provider mocked |
| QA-02 | Saved style in concise direct-answer contract, 1,200-character schema, existing 1,536-token budget; incomplete prose/unclosed fences fail safely | `test_qa02_direct_answer_has_brevity_schema_and_style_contract`, `test_qa02_incomplete_direct_answer_is_not_saved_as_success`, `test_qa02_incomplete_answer_keeps_saved_course_answer` |
| QA-03 | Library refresh on upload/source-preview close | Real local TXT/MD/DOCX/PDF extraction and immediate item/count checks in `browser_defects.cjs` |
| QA-04 | Draft/zero-objective cards say Draft · Finish setup | Browser assertion excludes 1 of 0 objectives |
| QA-05 | Outside-window message requires 500-event cap and older date | Browser fixtures with one vs 500 events |
| QA-06 | Extraction failure alert inside open dialog | Browser intercepted 400, visible dialog alert |
| Intake editing | Previously saved outcome/background remain input fields | Backend intake test and browser save/edit/save |
| History | Course title works after reference selection | Browser existing-reference selection then sidebar navigation |
| Account ARIA | Every menu closure sets aria-expanded false | Browser theme action and final closure handler |

The 193 named browser assertions are in [after-functional.json](data/after-functional.json); all pass. Browser-only regression runs via `test_browser_qa_ui_regressions`. Requests in that test throw on unexpected inference. Existing offline tests continue to cover legacy workflows, ownership, exports and transport controls.

## Focused UI evidence

Repair, practice, spaced review, Library, login and signup were scanned in dark/light at **1440×900, 1024×768, 390×844 and 360×640**. Guest notebook axe scans also passed in both themes. Full broad shell/menu/state inventory is retained separately in `data/results.json`, `contrast.json`, `axe.json`, `focus.json` and screenshots.

| Check | Measured result | Artifact |
|---|---|---|
| UI-01/02 text and icons | 0 failed pairs in either theme; 746 dark / 770 light samples, including placeholders | [after-dom.json](data/after-dom.json), [verified-contrast.json](data/verified-contrast.json) |
| UI-03 placeholders | Minimum dark 8.70:1, light 5.35:1; opacity 1 | Same DOM/checker artifacts |
| UI-04 keyboard focus | Input, textarea and button: 2px solid, 3px offset; RGB145/215/255 dark, RGB33/90/123 light | [after-focus.json](data/after-focus.json), broad `focus.json` |
| UI-05/axe | 48 focused scans, 0 violations; guest notebook has role img, figure unchanged | [after-axe.json](data/after-axe.json), after-functional guest checks |
| UI-06 required form borders | Minimum measured dark 5.41:1, light 3.78:1 against field surface | after-dom bounds |
| UI-07 touch | 0 horizontal overflow; minimum prose 16px/1.5, metadata 12px/1.4; enclosing targets at least 44×44px | after-dom sizes/targets and browser assertions |
| UI-08 repair hierarchy | Closed View lesson keyboard opens/closes; worksheet enters initial viewport at all four widths | after-functional and `screenshots/after-verified-repair-{theme}-{width}.png` |

Contrast was independently recomputed from captured effective foreground/background hex pairs using `C:/Users/raito/.codex/skills/antislop-human/contrast-check.py` through [verify_contrast.py](verify_contrast.py). Its result is **0 dark / 0 light failures**. Decorative notebook elements and genuinely disabled controls are excluded from actionable checks. Required boundaries supplement existing theme colors; intentionally nested lesson surfaces do not get decorative contrast borders.

The broad matrix retained **188 state/theme/viewport axe scans with 0 violations**, plus 304 rest/hover color captures (5,631 pairs per theme). Independent checker results are **0 actionable failures per theme**. Each theme has six raw low-contrast samples from empty/pending, actually disabled chat Send buttons (`chat-live.js` sets `send.disabled=true`); raw measurements and explicit disabled exemptions are retained, not recolored as successes.

Broad harness limits: 12 `results.json` rows say `blocked` because the optional hover locator timed out **after** screenshot/DOM/axe/focus capture. All 188 corresponding axe/DOM captures exist. `browser-errors.json` also contains two fixture-walkthrough timeouts waiting for the obsolete label `Try a changed problem`; this is not a completed live end-to-end walkthrough. These harness warnings remain recorded. The current targeted regression independently exercises the repaired interactions, viewport disclosure and actual extraction; do not interpret the broad runner's exit 0 as proof of every interaction. Source-picker broad snapshots represent the empty state; actual reuse is covered by the focused reference-selection regression.

Axe's `color-contrast` incomplete/manual-review entries remain visible in raw output; they are not counted as passes or violations. The independent computed-color audit and screenshot inspection supplement them. Automated scans do not prove every accessibility requirement.

Screenshots inspected: [390px dark repair](screenshots/after-verified-repair-dark-390.png) and [1440px light repair](screenshots/after-verified-repair-light-1440.png). They retain Times New Roman lining math, aligned equation baselines, crimson mark and Check this sign text. Keyboard focus is intentionally visible in these captures. V09/Home, guest-only notebook motion, one material, orange Submit, green Save and all existing non-color cues remain.

## Limits and continuation

- **UNVERIFIED:** strong-model catalog existence/access and real output adherence. Syntax checks and mocked 404 diagnostics cannot fix external entitlement. No fallback/retry was added.
- Direct-answer terminal-marker/fence checking is a conservative heuristic, not a language parser or semantic-completeness guarantee. Existing provider finish_reason length rejection remains.
- Google OAuth and audio/video transcription were not exercised. Existing pending setup is unchanged.
- PREVIEW folders were not integrated or edited by these fixes; U10 remains PENDING, U17–U18 DEFERRED, legacy Streamlit remains preserved.
- CURRENT_ARCHITECTURE, UNREALIZED_CHANGES, UI_FEATURE_PROVENANCE and CHANGELOG are synchronized to 2026-10-29.1. No new configuration variable is required.
