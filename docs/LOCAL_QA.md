# Local build QA, 25 October 2026

Homepage revision: see [homepage QA](HOMEPAGE_QA.md) for the latest black, blue and crimson design, motion/disclosure checks, screenshots, and measured performance limits. The original static/green design assessment below records the earlier candidate and is superseded for homepage appearance.

This is a local candidate for user/learner testing, not a declaration of a submission-ready service.

## Functional evidence

**46 offline and Streamlit UI tests passed.** Dependency validation (`pip check`) also passed. Desktop and mobile screenshots were inspected, and no real API key was found in the tracked or non-ignored candidate files scanned.

- Offline tests cover missing/disabled credentials, bounded requests, no automatic retry, safe errors, unknown usage reservations, budget allowance enforcement, incomplete model output, and structured-response parsing.
- SQLite tests cover separate learner tokens, process-restart restoration, stale-tab writes, duplicate-call leases, idempotent attempt updates, and isolated deletion.
- Workflow tests enforce approval/version checks before a model call, supported numerical/yes-no answers without eval, source-ID/prerequisite validation, uncertain short answers, and deterministic diagnostic prompts that do not disclose the answer.
- Streamlit AppTest drives goal validation; source-mode preview/empty validation; plan generation/revision/approval; explanation; wrong attempt; diagnostic help; changed problem; completion; preferences; explanation pace; observation edit/delete; review skip; checkpoint control; separate session; and deletion. Model calls in these tests are mocked and incur no API charge.
- PDF tests cover extracted text/page labels, invalid bytes, blank pages, page count, and byte limits. The browser file chooser opened, but automation could not attach a file because the Chrome extension does not have file-URL access. Complete the manual check in the test guide.

## Live inference

Total so far: **22 calls, estimated $0.00317052** from reported usage and the checked Nano rates. This includes the previous ten initial probes. The selected routing key is `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`. Rates/usage estimates are not a billing statement.

A real browser plan and lesson were generated. The first plan omitted two topics, so validation now requires the three selected topics for the bundled course and uses their canonical titles. A longer request exhausted 2048 tokens; enabling Nano's reasoning-off chat-template option produced the complete three-topic JSON plan in 302 output tokens. No automatic retries were introduced.

A real integrated AppTest session then exercised an incorrect ALG-01 attempt, a diagnostic response, generated repair, ALG-02, a correct independent changed answer, and completion. Both attempts were stored. A real Streamlit server stop/start followed, and reopening the saved browser URL showed the correct completed-unit next action.

Two live geometry assessments distinguished swapped coordinates from an arithmetic mistake. Two live lesson profiles kept the checked solution x=3 while changing language and requested pace. Generated Indonesian wording contained awkward phrases; it is not yet human-validated. Explanation pacing is also enforced by the display: one step at a time, or optional collapsed worked steps for familiar material.

Generated teaching observations were unreliable prose. The app instead records factual help-request observations tied to an actual attempt; learners can edit/delete them. Private assessment fields are never rendered wholesale during diagnosis. Repair also shows the checked seed solution.

## Design and delivery gate

Direction: the user's Stitch reference, dark contrast, clear next action, and few visible features. ENERGY 1 / RHYTHM 2 / MOTION 1. See DESIGN.md. Screenshots are in docs/screenshots/.

| Item | Result and evidence |
|---|---|
| R-02 copy | PASS: application-authored copy avoids em dashes; generated model wording is not claimed stylistically validated. |
| R-03 responsive layout | PASS: browser widths 390, 768, and 1280 showed document scrollWidth equal to viewport width. Narrow layout screenshot inspected. |
| R-17/R-18/R-36/R-38 claims/content | PASS: no invented testimonials, learner results, adoption counts, or mastery claims; only the actual three-topic course and test data appear. |
| R-23 assets | PASS: no generated logos, avatars, stock photos, or decorative artwork. User explicitly requested this app layout. |
| R-24/R-26 controls | PASS for implemented core paths: AppTest and browser actions recorded above; no empty navigation targets. File chooser opens; full upload awaits manual verification. |
| R-25 contrast | PASS: measured main text/canvas 16.88:1, secondary text/surface 9.31:1, primary action text/background 13.49:1. Control boundary/surface 4.48:1 exceeds the 3:1 non-text threshold. Actual caption color checked in the browser. |
| R-27 states | PASS: empty-goal validation; empty-source disabled action; request spinners; actionable errors; timeout preserves work and releases the lease. |
| R-28 FAQ | PASS: no filler FAQ. |
| R-32 keyboard | PASS for checked entry controls: Tab reaches the optional settings with a visible solid focus outline; Enter opens/closes it. Native labelled inputs and buttons are used throughout. |
| R-33 source edits | PASS: UI and styles were edited directly in their source files. |
| R-34 themes | PASS: fixed dark theme is the user's explicit choice; no unsupported theme toggle is shown. |
| R-35 complete verification | PENDING user check: core browser/AppTest paths pass, but complete browser PDF attachment was blocked by extension permissions. Human first-use QA also remains pending. Do not present this candidate as fully signed off. |
| Purpose gate: R-01/04/06/07/08/09/10/12/13/14/19/22 | PASS: charcoal reading canvas and one action accent have written purposes; no gradients, decorative icons, background grids, capsule labels, glass, glows, uniform feature-card grids, template motion, or unrelated illustrations. System sans-serif supports reading. |
| Liveliness | PASS within the quiet direction: one goal/plan/problem focal point; structural whitespace; one action accent; repeated small numbered learning sequence. |
| Craft/quality: C-1 through C-5 and R-05/11/15/16/20/21/29/30/31 | PASS for the local candidate: the learning task determines each screen; one accent and a small radius set; specific action labels; no marketing claims; dark is requested; interpretation of the reference is documented rather than a Google-branded copy. Final learner/design judgment still belongs to the user. |

## Remaining work

Run the manual PDF check and first-use design review; recruit two or three consented learners and record actual failures. Randomized review placement within a mixed quiz, more fresh questions, full source-alignment assessment, durable hosted storage/access controls, judge access, video, and submission remain open. No learning-efficacy claim is supported by these software tests.
