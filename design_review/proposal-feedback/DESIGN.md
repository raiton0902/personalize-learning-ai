# Feedback stays with the action

28 October2026. Interface sample only, following ui_improvement_proposal.md suggestions1–3 and the owner's instruction to defer backend improvements.

## Direction

Audience: a learner answering a question or asking for help. Job: make the current action understandable during success, waiting and failure while preserving the learner's work.

Three concepts considered:

| Concept | Signature | Originality / fit / feasibility / portability (lower portability is better) |
|---|---|---|
| Feedback beside the action | A waiting row becomes nearby recoverable feedback; form remains intact. |3 /5 /5 /3 |
| Global status dock | One bottom progress center across all actions. |2 /2 /5 /5 |
| Conversation-only work | Move lesson/practice/forms into chat bubbles. |2 /2 /3 /5 |

Choose Feedback beside the action: it directly addresses the proposal's visibility/recovery gap and preserves the existing learning UI. No new visual system or framework is justified.

Design read: familiar work surface, single next action, status exactly where the result belongs. ENERGY2 / RHYTHM2 / MOTION2. The still page is intentional for concentration; press/hover/focus and a small waiting pulse provide meaningful feedback.

## System and continuity

- Stack: existing static HTML/CSS/JavaScript, local Inter; reuse step-repair shell, sidebars, menus, guards and themes. Final styles/scripts: `proposal.css` / `proposal.js`.
- Palette: owner black/neutral, central icy-blue next action, existing warm Submit confirmation identity, crimson only for errors. Light theme uses existing darker accents. No gradients, WebGL or new illustration.
- Geometry: same centered reading measure and sidebars. Input/reading16px, compact metadata. 28px waiting row,13px label,8px dot/gap,12px top/bottom. Error card sits after triggering form/action,15–16px inset,10px radius;14px heading,13px body desktop/16px body phone. Buttons have visible hover/press/focus and min44px phone targets.
- Equation: retains owner's latest lining Times New Roman numerals, zero tracking,1.4 line height and ordinary shared baseline. No wrong-operator annotation is newly generated in this proposal sample.
- Motion: inherited reversible280ms panels, reduced-motion immediate alternative. Waiting dot opacity only. No artificial thinking phases/percentages; sample timer1800ms is not a provider latency claim.
- Pending interaction: preserve global learning-control lock for this sample. Status is a sibling outside the inert form; sidebar/rail/header/context controls also become inert. Restore previous inert flags after completion. Preview-only Finish control is available for a held demonstration; it is not a production Cancel button.
- Error semantics: pre-send simulation may retry locally. Unknown completion cannot offer unconditional resend; reconcile explanation first. Real deduplication remains backend work.

```text
Header / course / stages
Current context
Problem
Answer + reasoning + attachment metadata (preserved)
Submit / Help
Waiting → inline failure or sample response
Explicit sample boundary
```

Phone: full reading width, stacked actions, comfortable text/targets; existing history drawer and typed pattern overlay. No hidden status behind the global lock and no bottom toast.

## Acceptance and limits

Use `check.cjs`, `verification.json` and screenshots. Inspect Teach/Practice/Submit/Help waits and errors, light/dark, phone, source reuse and accurate empty states. No claim that a fixed response grades arbitrary input. No hint-use persistence, validated diagnosis spans, new endpoints, idempotency protocol or backend change.

## Delivery checks

- Hard gate PASS for tested states: nine axe views without reported violations, six widths without overflow, no page errors/external or mutation requests, no fabricated metrics/testimonials, and clearly labeled fixed content.
- Purpose gate PASS: no added decorative techniques; icons identify actions, crimson identifies error, waiting pulse identifies pending work. Exact local source and proposal provide the design rationale.
- Liveliness PASS: controlled focal point, continuous form/result relationship, inherited press/hover/focus, explicit low-motion dials and readable reduced-motion state.
- Craft PASS within tested scope: actionable recovery, preserved drafts, accurate empty categories, same equation baseline, consistent themes and comfortable phone controls. This is not universal browser/performance/accessibility certification.

Two independent screenshot reviews completed. The first flagged phone header continuity, unchanged ready-looking pending buttons and duplicate recovery emphasis. Refined the sticky header below the reserved preview strip, moved focus before applying inert, added busy/failed trigger treatments and placed Help after the result region. Phone captures use actual viewport screenshots to avoid stitched fixed-element artifacts. Final review found no visible blocking issue; subjective Design7/Usability7/Creativity6/Content7. Familiarity and existing owner constraints are intentional; these are not performance or award claims.

Owner refinement supersedes the earlier Home composition: title centered, subtitle and header New learning removed, Plan tick removed, practice Need help? white/black. Initial title/composer/intents are grouped in a viewport-height wrapper with an inside bottom border; continuation remains below and scrollable. Header/bar heights are subtracted rather than hardcoding a y-coordinate. Exact first-screen geometry checked at four desktop/phone sizes, with ten accessibility states passing after the change. See handoff V09/P31 for exact CSS and precedence.

Latest correction: Plan icons are explicitly suppressed and relevant preview assets carry revision20261028-4 to refresh older browser files. Active Plan was checked with no tick; help capitalization is Need help?.
