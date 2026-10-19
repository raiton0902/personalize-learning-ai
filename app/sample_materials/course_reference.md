# Algebra to coordinates: learner reference

Reference ID: `course.algebra_coordinates.v1`  
Audience: learners comfortable with basic arithmetic who need practice with equations.  
Scope: a small prototype course; school or exam alignment is unverified.

## R1 — Linear equations

Objective: `algebra.linear_equations`

An equation says that two expressions have the same value. To find an unknown, undo the operations around it while keeping both sides equal. Add or subtract the same quantity on both sides; multiply or divide both sides by the same nonzero number.

Example: solve `2x + 4 = 10`.

1. Subtract 4 from both sides: `2x = 6`.
2. Divide both sides by 2: `x = 3`.
3. Check in the original equation: `2(3) + 4 = 10`.

Here `2x` means `2 × x`, not `2 + x`.

## R2 — Substitution

Objective: `algebra.substitution`  
Prerequisite: multiplication and addition; understanding a variable as a number placeholder.

To evaluate a formula, replace each occurrence of a variable with its given value. Use parentheses around the replacement. Then follow the order of operations: multiplication before addition or subtraction.

Example: if `y = 3x + 1` and `x = 2`, then `y = 3(2) + 1 = 6 + 1 = 7`.

The rule stays the same; the supplied value of x determines the resulting y.

## R3 — Points on a line

Objective: `geometry.point_on_line`  
Prerequisite: R2 and reading an ordered pair.

In a point `(x, y)`, the first number is the x-coordinate and the second is the y-coordinate. A point belongs to a line when its two coordinates make the line's equation true.

Example: does `(2, 7)` lie on `y = 3x + 1`?

1. Read the coordinates: `x = 2`, `y = 7`.
2. Calculate the right side: `3(2) + 1 = 7`.
3. Compare with the given y-coordinate: `7 = 7`, so yes.

For `(2, 8)` on the same line, the right side is still 7. Since `8 ≠ 7`, that point is not on the line. Checking only x is insufficient: both coordinates must fit together.

## Sources and reuse

This short reference, its worked examples, and the accompanying six questions were written for this project. No textbook prose, figures, or exercise sets are bundled. These original teaching materials may be used, shared, and adapted in the project and its demo.

External reference for mathematical checking: *Elementary Algebra 2e*, Lynn Marecek, MaryAnne Anthony-Smith, and Andrea Honeycutt Mathis, OpenStax. Relevant sections, checked 18 October 2026:

- [2.1: addition and subtraction properties of equality](https://openstax.org/books/elementary-algebra-2e/pages/2-1-solve-equations-using-the-subtraction-and-addition-properties-of-equality) — R1.
- [2.2: division and multiplication properties of equality](https://openstax.org/books/elementary-algebra-2e/pages/2-2-solve-equations-using-the-division-and-multiplication-properties-of-equality) — R1.
- [1.2: use the language of algebra](https://openstax.org/books/elementary-algebra-2e/pages/1-2-use-the-language-of-algebra) — R2.
- [4.1: use the rectangular coordinate system](https://openstax.org/books/elementary-algebra-2e/pages/4-1-use-the-rectangular-coordinate-system) — R3.

External textbook content retains its own license. Link to it for further reading; this package does not redistribute it.
