# UI/UX improvement proposal: grounded in the three handoff docs

**Status:** REALIZED IN LIVE APP (Revision `2026-10-28.5`). Original mockups were static HTML renders in the artifact folder; on 28 October 2026, a separate interactive sample was built at `design_review/proposal-feedback/` (port 8769), and subsequently all 5 ranked improvements (`U03`/`U04`, `U05`, `U06`, `U13`/`B03`, `U12`/`V04`/`B02`) plus `V01`–`V09`, `U01`–`U02`, `U07`–`U09`, `U11`, `U14`–`U15`, `U20`, and `B01`–`B06` were realized in the live application (`app/web/`, `app/web_server.py`, `app/episode_helpers.py`, `app/learning_history.py`, `app/schemas.py`).

## Assumptions (stated, not guessed silently)
- You want **a ranked shortlist plus one worked sample**, not a full redesign or every U01–U20 item.
- The live app (`app/web/`, port 8780) is the target. `design_review/step-repair/` is the visual reference.
- No backend, paid model calls or deployment are in scope for the sample.

## Ranked shortlist

| # | Improvement | IDs | Why it ranks here | Backend needed? |
|---|---|---|---|---|
| **1** | **Visible waiting + inline recoverable errors for Teach / Practice / Submit / Help** | U03, V07, P16/P17 | Real gap verified in source: `polish.css` sets `.live-status:not(.error){display:none!important}`, so these actions lock the page (`inert`) with **nothing visible**. Failures show a bottom toast with `pointer-events:none` and no Retry. The architecture audit names this the largest detail gap (§13). | **No** for the visual pass (keep the global lock). Unlocking navigation during requests requires U04 first. |
| 2 | Existing-reference picker + removable chip on Home | U05, P04/P06 | `#source-state` is just a title. You can't remove it or reuse a Library item from the composer. The existing `GET /api/resources` + `resource_id` already support this. | No |
| 3 | Library/Activity empty states that tell the cases apart | U06, P14 | "No results" currently covers an empty library, an empty category and a missed search. Activity silently caps at 500 events. | No (copy + counts). Full date history needs pagination. |
| 4 | Help-used / independent evidence after practice | U13, P12 | Strongest differentiator, but it needs durable assistance events server-side. | **Yes** (B03) |
| 5 | Exact wrong-operator highlight from real attempts | U12, V04 | Visually ready in preview, but it needs validated spans (B02). | **Yes** |

Following the Karpathy principles (simplicity first, surgical changes), **#1 is the recommended first step**. It fixes a real usability failure, touches only the frontend and needs no new data contract.

## Sample: improvement #1

````carousel
![Today: Submit pressed. The page is inert, there's no visible wait, and a failure becomes a toast you can't click](C:/Users/raito/.gemini/antigravity/brain/d1ef4156-85a5-4612-8808-9abb90c637b3/u03-before.png)
<!-- slide -->
![Proposed: a waiting row where the result will appear (V07: 28px row, 8px dot, 13px label)](C:/Users/raito/.gemini/antigravity/brain/d1ef4156-85a5-4612-8808-9abb90c637b3/u03-wait.png)
<!-- slide -->
![Proposed: inline failure beside the action, draft kept, Try again / Edit answer](C:/Users/raito/.gemini/antigravity/brain/d1ef4156-85a5-4612-8808-9abb90c637b3/u03-error.png)
````

### Design decisions
- **Placement:** the waiting row sits where the result will render, below the triggering action, using the same component as the existing chat `thinkingRequest` (V07). It does not add a new pattern.
- **Labels describe the action, not the model:** "Preparing your lesson", "Writing a practice problem", "Checking your answer", "Preparing help". It doesn't show any chain-of-thought or fake progress stages.
- **Error card:** crimson tint is reserved for errors (V01). The message says the draft is kept, and that is true because the DOM form is preserved today. It does **not** claim "nothing was saved", because the result is unknown until U04.
- **Try again** repeats the same POST manually, matching the existing plan-generation "Try again" (UI-H15). It never retries automatically.
- Reduced motion uses a static dot.

> [!WARNING]
> **Try again** for `attempt`/`diagnostic` can bill a second model call, and without request deduplication (U04) it could double-record an attempt if the first one actually succeeded. Option A: show Retry only for errors that clearly happened before the request was sent. Option B: implement U04 request IDs for these actions first. I need your choice before building it.

### Minimal implementation plan (if approved)
1. Wrap the four course actions in the existing `thinkingRequest`-style helper in the **final** handler layer (`learning-ui.js` / `practice-ui.js`) → verify: a 6-second delayed fixture shows the row at the right position for each action.
2. Catch errors into an inline card with Retry/Edit instead of the global banner → verify: a synthetic failure keeps answer, reasoning and attachments; Edit focuses the field.
3. Leave the global `inert` lock and `accountEpoch` unchanged → verify: no double submit, and switching account discards late responses.
4. Update the three handoff docs + CHANGELOG (U03 → partially LIVE).

**Success criteria:** every model-backed course action has a visible, correctly placed wait state and a recoverable inline failure. No draft loss. Existing tests pass. No new endpoints.

## Frontend sample implementation record,28 October2026

- [Open the local sample](http://127.0.0.1:8769/) while its server runs; [README](design_review/proposal-feedback/README.md) explains restart and demo controls.
- PREVIEW only: Teach/Practice/Submit/Help waiting and inline recovery, existing-reference selection/removal and distinct Library/Activity empty states. No backend suggestions implemented.
- All results are fixed local simulations. Pre-send failure offers Try again; unknown completion offers Check saved result/Edit with an explanation, avoiding an unconditional real POST retry. This sample does not require resolving the earlier backend A/B implementation choice.
- Preserves form DOM/drafts and sample attachment names; learning controls stay locked while pending, with accessible status outside inert form. Busy initiating action changes text; failed trigger is subdued while recovery is shown.
- Nine sample axe views and targeted interactions passed; no external/mutation requests. Production integration success criteria above remain pending. Handoff revision2026-10-28.2 records exact V08/PF controls/P30 provenance.
