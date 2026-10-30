# Guest continuity, editable intake and learning tracks

## Reverification — 30 October 2026, revision2026-10-30.3

Repeated feature brief checked against the current integrated source. Added a guest cancellation regression: enter auth with a goal, return Home, clear to whitespace, reopen auth; memory and sessionStorage must both be empty. It failed before correction and passed afterward in all four theme/viewport combinations. Existing12 signup/login/simulated-redirect browser scenarios still pass, along with track generation, schema compatibility, grouping/conflict validation and extension progress/dedup tests. Fresh focused command: `app/.venv/Scripts/python.exe -m pytest app/tests/test_learning_tracks.py app/tests/test_personal_learning.py -q` — **24 passed (66.41s)**. Four intake screenshots regenerated and visually inspected. No live provider or Google consent test; no full-suite rerun in this focused correction. Historical counts below retain their original dates.

Revision **2026-10-29.12**, 29 October 2026. Implementation is in the integrated browser app; isolated accounts, temporary SQLite and deterministic model fixtures verify behavior. No live provider/OAuth consent test, external dependency, protected environment/private learner data access or push/deploy.

Full offline suite: **171 passed in95.58s**. Final focused feature suite, including finished screenshots/revision-selector checks: **11 passed in34.57s**. JavaScript syntax and scoped whitespace checks passed. Original intake-bypass assumptions produced19 expected old-test failures in the first full run; older downstream tests now opt into Skip explicitly, while new independent-client tests exercise actual default intake.

## Verified behavior

- `test_detailed_goal_still_enters_editable_intake_without_inference`: example C++/STL/university-exam prompt fills outcome, Python background, hours/deadline and requirements, retains intake stage and all four questions, and permits correction/clearing before generation.
- `test_tracks_schema_prompt_and_generation`: three tracks pass schema/prompt/count/level checks; module workload is derived from lesson minutes.
- `test_invalid_track_shape_rejected_and_old_schema_defaults`: old JSON retains default compatibility; unsuitable full-path shape rejected.
- `test_extension_candidate_preserves_progress_and_deduplicates`: Beginner/Intermediate × active/completed courses retain original objectives, saved attempts and current lesson. Approved extension uses candidate/version checks and deduplicates request IDs; completed courses resume at the first new lesson.
- `test_unapproved_extension_and_rejected_candidate_leave_original_intact`: unapproved plan extends directly and repeat extension fails without altering its plan.
- `test_guest_and_tracks_browser`:12 combinations of signup/login/simulated redirect, dark/light and1440×1000/390×844. One automatic creation, identical request UUID, consumed sessionStorage, no creation on failed login, no creation after reload, editable prefill, selected track semantics,44px targets, no input outline and zero horizontal overflow. Redirect return delays learning-ui script to exercise boot timing. All three choices and unapproved extension tested through UI/API.

Synthetic full-page intake captures: [dark desktop](screenshots/tracks/dark-1440.png), [light desktop](screenshots/tracks/light-1440.png), [dark phone](screenshots/tracks/dark-390.png), [light phone](screenshots/tracks/light-390.png). These show fixture content, not real learner data.

## Scope and limits

Intake prefill recognizes conservative English patterns; unknown phrasing/languages remain editable rather than generating guessed facts. Existing explicit values win. It does not skip intake. Full path caps at24 lessons, not unlimited. Schema shape/progression checks do not prove advanced pedagogical quality; production model output still needs authorized evaluation. Invalid generated content produces a manual recovery error with original state preserved.

Extension sends the existing curriculum to the model as necessary for stable IDs, plus the existing bounded profile/source/current-objective context; saved chats/tests are not newly added. The fixed checked algebra sample remains a fixed sample. Oversized old courses cannot append past the existing ceiling. Existing no-retry/no-fallback/budget behavior remains.

Older downstream workflow tests now opt into explicit skip_intake where intake is outside their purpose. New feature tests use an independent client and exercise the actual default intake-first behavior. Exact final suite result is recorded in CHANGELOG after completion.
