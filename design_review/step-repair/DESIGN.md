# A visible repair

Separate interface concept, 27 October 2026. Based on `docs/THETAWAVE_COMPETITIVE_REVIEW.md`. The working application and previous interface example stay intact.

## Brief and choice

Help a learner who can follow examples but becomes stuck when solving alone. Retain the owner's quiet Inter sidebars, free-text learning pattern, automatic/typed language and central icy-blue emphasis. Learn from Thetawave's material reuse and scope without turning the product into a catalog of generators.

Three territories considered:

| Concept | Signature | Subject anchor | Originality / fit / feasibility / portability (lower portability is better) |
|---|---|---|---|
| Visible repair | Annotate the exact changed operation, then remove scaffolding for a fresh problem. | Our diagnostic-and-repair loop. | 4 / 5 / 5 / 2 |
| Material desk | Sources, notes and questions share a document workspace. | Reusable learning references. | 3 / 4 / 5 / 4 |
| Daily learning trail | A visible sequence of short daily exercises. | Continued practice. | 2 / 3 / 4 / 4 |

Choose Visible repair: its strongest frame demonstrates the task and offers a specific distinction to evaluate. A larger source dashboard alone would imitate the competitor without showing our purpose.

Idea: make an incorrect reasoning move visible, repair it, then check an independent attempt.
Metaphor: a tutor annotating a learner's working.
Signature: the second equation line receives a restrained crimson sign annotation; the next view applies the operation to both sides; the changed problem removes the worked solution.
Emotion: understood, oriented and ready for one small action.
Design read: familiar learning workspace with one annotated reasoning move as the focal point. ENERGY 2 / RHYTHM 2 / MOTION 2: calm reading, task-dependent spacing and restrained interaction feedback.
Motion verb: reveal and settle. Existing reversible sidebars keep their 280ms easing. No input lock or loader.
Screenshot: black workspace, compact lesson scope, a learner's two-line equation and one highlighted operation, framed by familiar sidebars.

## System

Stack: existing vanilla HTML/CSS/JavaScript, local Inter and static assets. Reuse the separate detail-study preview's interaction engine, menus, routing, theme, dirty-state protection and panel motion. No framework migration or new animation dependency is necessary for this bounded example.

Roles: ground #000000, ink #ffffff, muted #a9adb5, line #354751, ice #8fd4f7, annotation #ef7483. Light-theme tokens use dark blue/red for readable text. The sidebars inherit the existing neutral theme. Crimson communicates the sign to inspect rather than general failure; ice marks the next learning action.

Inter is used for UI and reading; local system Times New Roman with lining/tabular numerals is reserved for short mathematical expressions, with italic x and literal arithmetic symbols. The operator highlight inherits the same baseline. This avoids Georgia's varying-height numeral appearance. No Markdown delimiters or unsupported formula macros appear. Complex LaTeX would need a real renderer; this sample uses simple semantic HTML math presentation.

Main reading measure 748px including padding, 16px body and 30–40px heading. Fields and action labels remain comfortable on touch screens. Annotated working uses a 14px outer radius, smaller controls 9–10px. No gradients, decorative illustrations, background motion or marketing metrics. The still reading surface is intentional for a signed-in learning workflow; hover/press/focus and the meaningful repair transition provide feedback.

```text
Icon rail | Course / questions | Course header + docked stages | Pattern inputs
                                Source / current lesson
                                Find step > Repair > Try
                                Specific heading
                                Original learner working
                                Highlighted sign
                                Short explanation / next action
                                Scoped question composer
```

Phone: hide rail, move workspace navigation into the drawer, preserve full reading width, overlay the pattern panel and keep 16px editable text. Path labels wrap only if needed. Keyboard focus and reduced-motion access remain functional.

## Implementation boundaries

- All equations, observations and replies are fixed illustrative content. Only x = 5 and x = 6 are checked; this does not grade arbitrary reasoning.
- Opening a hint or receiving corrective feedback marks the result as helped. No mastery percentage, retention claim or scheduled notification.
- Correcting a difficulty changes a sample observation only, not a generated curriculum or account profile.
- Existing-reference selection is single-selection over sample metadata. It preserves the goal and makes no upload or generation request.
- No private account, provider, application API, microphone, external font request or user file content is accessed.
- Keep the original preview on 8767 and the application on 8780; this concept runs on 8768.

UI/UX Pro Max searches verified web error-summary and all-platform empty-state guidance. Error messages are field-associated and receive deliberate focus after failure; Library search has a relevant clear action. Karpathy principles bound the work to one coherent demonstration and explicit pass conditions. Antislop during-mode comes from the project instructions, with owner-established palette and type preserved.

## Review

Run `node design_review/step-repair/check.cjs`. Review screenshots and verification.json, not just source. Check the wrong-sign frame, repaired equation, changed problem without its answer, independent/helped evidence, new-learning intents, existing-reference picker, Library, both themes and phone panel. This is prototype verification, not provider correctness or a learning-outcome benchmark.

Two independent screenshot reviews were completed. The first identified an ambiguous repair-answer prompt, competing progress hierarchy, weak reference selection and persistent sidebar competition. Updated the question to ask for x, labeled the exercise sequence, strengthened selected rows and started the right panel closed while retaining its input system and reopening control. A phone action-row wrap and light-theme line-number contrast were fixed during direct QA. The owner's quiet Saved button remains, despite a critic's alternative status suggestion.

The final reviewer inspected fourteen images and found no visible blocking issue. Subjective scores: Design 7.2, Usability 7.0, Creativity 6.6, Content 7.8. Familiarity is intentional and not inflated into an award claim. Automated accessibility checks are separate evidence; no real-device FPS, screen-reader or learning-effectiveness certification is claimed.

Owner refinement: the equation output felt messy. Removed row numbers, detached side labels, row separators and the full-row crimson fill. Both original and repaired working now use a compact equation stack; only the incorrect operator receives a small crimson mark. Refreshed screenshots and reran the existing checks: ten axe views without reported violations, six widths without overflow and no page errors/outside requests.
