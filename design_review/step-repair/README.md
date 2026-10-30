# Personal Learning: step-repair interface example

Open http://127.0.0.1:8768/ while the local preview server is running.

```powershell
python -m http.server 8768 --bind 127.0.0.1 --directory design_review/step-repair
```

This is a separate example based on [Thetawave research](../../docs/THETAWAVE_COMPETITIVE_REVIEW.md), built from the earlier detail-study preview. It does not modify or connect to the application. Responses, accounts, sources and equations are sample content. No paid calls, uploads, source extraction or real diagnosis occur.

## Try the new flow

1. Inspect the highlighted +3 in the learner's sample working. Click **Work through this step**.
2. Write `x = 5` or `5`. Enter submits; Shift+Enter inserts a line break. An incorrect value produces a nearby error and keeps your draft.
3. Solve the changed equation with `x = 6` or `6`. The interface records whether you opened a hint or received corrective feedback.
4. Review **Solved independently** versus **Solved with a hint**. Neither means mastery. Rechecking later is a suggestion, not a scheduled reminder.
5. **That's not where I'm stuck** changes the sample difficulty observation. It does not adapt a real course.
6. **New learning** shows editable intent shortcuts and optional material. In the plus menu, **Use an existing reference** opens searchable sample references without losing the goal.
7. Library has category counts, reusable-source labels and a specific no-search-match state. Activity retains the date filter. Side panels stay restricted to learning/Home.
8. Open saved question branches, export a static sample checkpoint, change the theme, or edit the right panel. Existing unsaved-change protection, free-text inputs, typed language, question/chat examples and error-state demonstrations remain.

## What would change if integrated?

| Kind | Changes |
|---|---|
| Interface only | Lesson scope line, compact repair path, annotated equation, action hierarchy, source labels and Library counts. Existing neutral sidebars/Inter and text-input panel preserved. |
| Frontend behavior | Existing-reference picker, editable intent chips, correction choice, hint state and demonstration of outcome evidence. |
| Backend/data/AI | Real step alignment/diagnosis, validated mathematical assessment, persistent hint-use records, correctable learner observations, durable evidence and delayed reviews. Existing attempt/diagnostic routes are a starting point, not a finished implementation of these features. |
| New demonstrated features | Visible exact-step repair, changed independent problem, honest helped/independent outcome, correcting a tentative difficulty and reusing a selected reference. |

All preview data is memory-only. Reload resets it. Routes identify the sample course/view; this is not a durable learning record. A free-form goal still opens a fixed algebra sample plan with an explicit simulation label. Arbitrary subjects are not generated.

## Verification

`node design_review/step-repair/check.cjs` uses the repository's existing Playwright/axe tools and an isolated browser. It checks the repair episode, errors, Enter, helped versus independent outcomes, source reuse, filters, six viewport widths, phone panel, reduced motion, outside requests and WCAG A/AA automated checks. Results: `verification.json`; screenshots: `screenshots/`.

The design rationale is in [DESIGN.md](DESIGN.md). See root [CHANGELOG.md](../../CHANGELOG.md) for the project change record. The actual application and earlier preview are separate.

Final automated run: ten WCAG A/AA axe views with zero reported violations; six viewport widths without horizontal overflow; no page errors or outside requests. Two screenshot-review passes informed corrections; fourteen screenshots include desktop/phone, dark/light and the right input panel. All 65 fingerprinted application source files remained unchanged. See [QA.md](QA.md) for scope and delivery checks.
