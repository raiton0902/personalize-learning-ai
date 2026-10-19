# Six checked seed questions

Content version: 1, 18 October 2026. Source: [learner reference](course_reference.md).

This is the tutor/team answer key. Present only the question before an attempt; keep solutions and diagnostic answers out of learner-facing requests until needed for feedback. Ask learners to show their steps. A correct final answer alone does not establish independent mastery.

Use the first question in each pair for practice and the second after feedback to check transfer. For delayed review, an unused second question can be held for a later session; log the real interval. Reusing a seen question is allowed but must be recorded and is weaker evidence of transfer. These six questions are a starter set, not a full assessment bank.

## ALG-01 — Practice

Objective: `algebra.linear_equations`; reference: R1.

**Question:** Solve `3x + 5 = 17`. Show your steps.

**Answer:** `x = 4`.

1. Subtract 5 from both sides: `3x = 12`.
2. Divide both sides by 3: `x = 4`.
3. Check: `3(4) + 5 = 12 + 5 = 17`.

**Possible mistakes:** stopping at `x = 12` forgets the coefficient; writing `3x = 22` may indicate using addition instead of subtraction. These are hypotheses until the learner's work supports them.

**Probe:** “After subtracting 5 from both sides, what equation remains? What does 3x mean?”

**Repair:** show the equal subtraction, then explain that `3x = 12` means three equal groups totaling 12. Follow with ALG-02.

## ALG-02 — Changed example / eligible delayed review

Objective: `algebra.linear_equations`; reference: R1.

**Question:** Solve `4x + 3 = 23`. Show your steps.

**Answer:** `x = 5`.

1. Subtract 3 from both sides: `4x = 20`.
2. Divide both sides by 4: `x = 5`.
3. Check: `4(5) + 3 = 20 + 3 = 23`.

**Possible mistakes:** stopping at 20; subtracting 3 on only one side; arithmetic error in `23 - 3`.

**Probe:** “Write both sides after subtracting 3. Then explain how to turn 4x into x.”

**Repair:** address the first unsupported step; do not repeat the entire lesson when only arithmetic needs correction.

## SUB-01 — Practice

Objective: `algebra.substitution`; reference: R2.

**Question:** Given `y = 2x + 3`, find y when `x = 4`. Show the substitution and calculation.

**Answer:** `y = 11`.

1. Replace x with 4: `y = 2(4) + 3`.
2. Multiply first: `y = 8 + 3`.
3. Add: `y = 11`.

**Possible mistakes:** 9 may come from treating `2x` as `2 + x`; 14 may come from calculating `2(4 + 3)`.

**Probe:** “Rewrite 2x using a multiplication sign. Which operation comes first in 2 × 4 + 3?”

**Repair:** distinguish multiplication from addition and keep the formula's grouping intact. Follow with SUB-02.

## SUB-02 — Changed example / eligible delayed review

Objective: `algebra.substitution`; reference: R2.

**Question:** Given `y = 3x + 2`, find y when `x = 5`. Show the substitution and calculation.

**Answer:** `y = 17`.

1. Substitute: `y = 3(5) + 2`.
2. Multiply: `y = 15 + 2`.
3. Add: `y = 17`.

**Possible mistakes:** adding `3 + 5 + 2`; changing the formula to `3(5 + 2)`; multiplying correctly but adding incorrectly.

**Probe:** “Show the expression immediately after replacing x, before calculating.”

**Repair:** separate replacing the symbol from evaluating the expression, then address the observed error.

## GEO-01 — Practice and diagnostic demo

Objective: `geometry.point_on_line`; reference: R3, with R2 as prerequisite.

**Question:** Does `(3, 8)` lie on `y = 2x + 2`? Show how you decide.

**Answer:** Yes.

1. Read `(x, y)`: `x = 3`, `y = 8`.
2. Substitute: compare `8` with `2(3) + 2`.
3. Calculate: `2(3) + 2 = 6 + 2 = 8`.
4. Both sides equal 8, so the point lies on the line.

**Two different reasons for the same wrong answer, “No”:**

- Coordinate-order confusion: the learner uses `x = 8`, `y = 3` and compares 3 with 18.
- Arithmetic difficulty: the learner reads `x = 3`, `y = 8` correctly but calculates `2 × 3 = 5`, obtaining 7 instead of 8.

**Diagnostic sequence:**

1. Ask: “In (3, 8), which number is x and which is y?” Expected: x is 3, y is 8.
2. If correct, ask: “Replace x in 2x + 2, then show the multiplication and addition separately.” Expected: `2(3) + 2`, then `6 + 2 = 8`.
3. If both are correct, ask: “The given y is 8 and the calculated value is 8. What does that tell you about the point?” Expected: it lies on the line.

**Choose the repair from the evidence:** teach ordered-pair order after a coordinate error; repair substitution or arithmetic after a calculation error; explain the equality criterion after a comparison error. With missing or conflicting evidence, ask another short question and record uncertainty.

Then use GEO-02 without exposing its solution.

## GEO-02 — Changed example / eligible delayed review

Objective: `geometry.point_on_line`; reference: R3.

**Question:** Does `(4, 11)` lie on `y = 2x + 2`? Show how you decide.

**Answer:** No.

1. Read the coordinates: `x = 4`, `y = 11`.
2. Calculate the right side: `2(4) + 2 = 8 + 2 = 10`.
3. Compare: `11 ≠ 10`, so the point does not lie on the line.

**Possible mistakes:** saying yes because x can be substituted; replacing the supplied y with 10 and checking the different point `(4, 10)`; calculating the expression incorrectly.

**Probe:** “What y does the equation give when x is 4? What y does the supplied point have? Are they equal?”

**Repair:** distinguish the equation's calculated y from the point's supplied y. Both must match for membership.

## Feedback and recording rules

- Record final-answer correctness and reasoning separately. Accept equivalent valid methods.
- With a correct answer but no work, request one small explanation before drawing conclusions about the method.
- With an incorrect answer, identify the first observed error; do not infer a cause solely from the number submitted.
- Record hints, diagnostic responses, and whether the changed example was solved independently.
- A failed changed example needs further teaching and a fresh checked question; the six-question set is not permission to declare mastery after repeated exposure.

## Answer verification

Checked by direct calculation and substitution on 18 October 2026:

| ID | Check | Expected result |
|---|---|---|
| ALG-01 | `3 × 4 + 5 = 17` | x = 4 |
| ALG-02 | `4 × 5 + 3 = 23` | x = 5 |
| SUB-01 | `2 × 4 + 3 = 11` | y = 11 |
| SUB-02 | `3 × 5 + 2 = 17` | y = 17 |
| GEO-01 | `8 = 2 × 3 + 2` | Yes |
| GEO-02 | `11 ≠ 2 × 4 + 2` | No |

Human learner testing has not yet been performed.
