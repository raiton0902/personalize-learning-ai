# Frontend work in this project

For frontend design and implementation, use the owner's requested `awwwards` and `apple-design` skills at `C:/Users/raito/.codex/skills/awwwards/SKILL.md` and `C:/Users/raito/.codex/skills/apple-design/SKILL.md`. Apply antislop during building; this mode was explicitly selected in this chat.

Read DESIGN.md for the current direction. The latest homepage direction is true black, icy blue and crimson, larger type and goal input, one translucent material, restrained perimeter motion, and a click-to-open/scroll optional-settings disclosure. These owner-requested gradients and motion supersede the earlier green/static palette.

Latest revision: no pause-motion button or starter-course fragment; compact top spacing; a filled rounded “Tailor my learning” button without an arrow inside the goal box; a circular upward-arrow submit button at the right. Keep both actions above the fold. “Your learning pattern” remains rendered below the first screen, even when closed; users can scroll to it directly. Tailor opens it and jumps instantly. Language, starting point and tone are non-editable dropdowns with no internal input outlines. Interests/context remain text inputs. Preserve the wide settings/preview layout and reduced motion.

Preserve the existing Streamlit tutoring workflow, learner data, and API controls. Never expose `.env` or private databases. This instruction does not authorize paid API calls beyond the agreed allowance, deployment, or a Git push.

Current sizing/focus: submit circle 44px, centered 22px up-arrow; larger responsive hero title; no blue summary outline after a pointer-triggered jump, while keyboard focus stays visible; no interior white border in the session-code input.

## Integrated browser app, 25 October 2026

The later user-approved design supersedes the old Streamlit-only homepage instructions above for the new entry point: `app/web_server.py` serves `app/web/` on port 8780. Use guest-only notebook motion, light/dark toggle (dark by default), Inter across the UI, icon rail, account-owned learning history, a right learning-pattern panel accessible only on Home, free-form struggle/style and automatic or explicit language. Preserve `app/app.py` as the legacy Streamlit entry point and its data.

The owner explicitly requested a Markdown record for every project change. Update root `CHANGELOG.md` with meaningful changes and their verification or pending setup; never include credentials or private learner content. `docs/INTEGRATION.md` documents the new application, Google OAuth and transcription setup. Never claim simulated model responses, configured-but-untested Google login, or an absent transcription provider have been live-verified.

## Mandatory three-file handoff, 28 October 2026

The owner requires every agent/LLM making a project code change to read these three files before planning or editing, then inspect the actual affected source:

1. `handoff/CURRENT_ARCHITECTURE.md`: implemented architecture, controls, API/data boundaries and separate preview inventory.
2. `handoff/UNREALIZED_CHANGES.md`: pending work, exact latest interface reproduction contract, backend requirements and acceptance checks.
3. `handoff/UI_FEATURE_PROVENANCE.md`: inspiration/source evidence, adaptation decisions, owner corrections and rejected patterns.

Keep all three synchronized in the same task whenever application, preview, tests, runtime configuration or visual assets change. Update substantive sections when their facts change; if a file's meaning is unaffected, append a concise synchronization entry saying it was reviewed, what changed and why no substantive update was needed. Use consistent revision/date and affected UI/U/V/P IDs. Update root `CHANGELOG.md` with verification and remaining limits. Do not label a task complete with stale handoff records.

The latest interface reference is `design_review/step-repair/` (port 8768), including the simplified equation stack and lining-numeral/shared-baseline correction. `design_review/detail-study/` (8767) is an earlier example; neither is integrated into `app/web/` merely because its UI works. Keep LIVE/PREVIEW/PENDING/DEFERRED/LEGACY distinctions explicit. Preserve owner-requested free-text pattern inputs and automatic/typed language; older Streamlit dropdown instructions do not override the integrated browser/preview direction.

The newer focused sample `design_review/proposal-feedback/` (8769) implements only frontend suggestions1–3 from `ui_improvement_proposal.md`: four course-action wait/error surfaces, source reuse/removal and accurate empty states. It inherits the8768 shell/math constraints. Use UNREALIZED_CHANGES V08 and CURRENT_ARCHITECTURE15.5 for its exact behavior; backend help-use/diagnosis/idempotency work remains pending.

These files support continuation without chat history; they do not replace reading code, authorize implementing every backlog item, broaden model-context transmission or authorize paid calls/deployment/push. Latest direct user instructions take precedence. If code and handoff disagree, investigate, document the discrepancy and synchronize the record rather than blindly overwriting working behavior with a sample.
