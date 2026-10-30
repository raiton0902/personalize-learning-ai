# Isolated fixture UI review - 28 October 2026

**Review only. No application, CSS, docs or environment file was edited. All evidence is under this folder.**

## Five highest-impact fixes

1. **Light-theme action fills:** `#library-add-reference`, `#start-review-btn`, `#skip-review-btn` use #202124 on #242c37 (**1.14:1**). Replace the light fill with #e9eaed while keeping #202124 ink. Dark treatment can remain unchanged. Evidence: library-populated-light-1440.png; spaced-review-light-1440.png.
2. **Light source/correction controls:** source text/icon #62656c on #242c37 is **2.41:1**; correction link #215a7b on that fill is **1.89:1**. Use a light-neutral fill and retain readable neutral/blue ink. Evidence: plan-light-1440.png and repair-light-1440.png. DOM collection can include off-viewport descendants; scroll/focus companions and selector data locate them.
3. **Placeholder contrast:** #757575 on #111315 is **4.04:1** dark; on #f5f5f5 **4.23:1** light. Set placeholder opacity to 1, dark #a9b2c0 and light #62656c. Evidence: signed-home-dark-1440.png, question-thread-light-1440.png, focus companions.
4. **Keyboard focus on text inputs:** sampled goal textarea focus computes outline `none` and shadow `none`; current CSS explicitly removes both for input/textarea. Restore a keyboard-only 2px ring with 3px offset (dark #91d7ff, light #215a7b) and test against each local surface. Keep the owner-approved quiet pointer focus. Evidence: guest-home-focus-dark-1440.png, data/focus.json.
5. **Notebook accessibility:** axe flags aria-prohibited-attr on `.guest-notebook` in both themes. Give the labeled illustration an appropriate role (for example role=img if the whole figure is one image), or remove an unnecessary label if decorative. Evidence: guest-home-dark-1440.png and guest-home-light-1440.png, data/axe.json. Do not redesign or remove the approved notebook animation.

**Actionable failing-pair count:** 3 dark / 14 light (deduplicated selector + foreground/background + threshold). There is also **one disabled-control pair per theme**, retained in the raw candidate count but excluded from these actionable counts. **Axe:** 1 dark / 8 light unique violating nodes; one rule in dark, two in light. The table below preserves raw measured candidates; incomplete checks and compositing limitations remain explicit.

## Scope and evidence limits

Real integrated app assets/routes, isolated headless Chrome using frontend_tools Playwright, fresh browser contexts, separate temporary SQLite, fixed synthetic model replies. Screens are fixtures, not live model output. External browser requests blocked; live inference disabled and guarded. No owner account DB or .env accessed. Current production app/server and signed-in browser were not used. The fixture harness excludes dotenv loading and bypasses only legacy session-key bootstrap using a synthetic session secret.

Requested 1440x900, 1024x768, 390x844 touch, plus 360x640 Home. Screenshots are single viewport captures; repair/diagnostic may be scrolled to the worksheet. Extra focus/hover images are evidence companions. The final videos/dark.webm and videos/light.webm each complete the requested fixture walkthrough; data/walkthrough.json records all steps as passed. Earlier failed harness attempts are not the final videos. Both recordings use synthetic model replies.

DOM text/background pairs use computed styles, ancestor alpha compositing, inherited opacity, WCAG luminance and OKLab Euclidean deltaE (scaled by 100). Borders/surfaces are candidate separation warnings at ratio <1.3 or deltaE <5. Gradients/images, blur/backdrop-filter and overlap cannot be established exactly by this DOM method; unresolved pairs are explicitly marked. No false pixel-exact guarantee. Text over layered notebook artwork and modal backdrops remains a manual/pixel-validation limitation. Source picker and primary hover supplemental captures wait for transitions to settle. Inert waiting text is measured by the supplemental collector; other screens exclude explicit inert descendants. The antislop-human contrast-check.py was used to independently recompute each saved RGB pair. Rounded RGB recomputation can differ at a near threshold; raw DOM ratios are retained.

Normal text >=4.5; WCAG large text >=24px or >=18.66px bold uses >=3. UI icons/boundaries >=3 where necessary for identification. Disabled controls are measured as requested but are exempt from WCAG contrast; neutral decorative surfaces are not automatically accessibility violations. Small-type and touch warnings include labels/control text, not just prose. Similar-color and color-only conclusions require semantic review.

## Counts (deduplicated selector + pair per theme)

| Theme | Contrast candidates | Axe node violations | Axe rule IDs |
|---|---:|---:|---:|
| dark | 4 | 1 | 1 |
| light | 15 | 8 | 2 |

Counts include repeated states deduplicated by selector/pair. data/axe.json preserves every state occurrence and incomplete checks. Contrast candidate counts are not all confirmed WCAG failures because compositing/disabled/decorative exceptions apply.

## State x theme x width summary

| State | Theme | Width | Contrast | Similar colors | Size | Axe | Overflow | Screenshot |
|---|---|---:|---|---|---|---|---|---|
| guest-home | dark | 1440 | PASS (0) | FLAG (9) | FAIL (12) | FAIL (1) | False | [image](screenshots/guest-home-dark-1440.png) |
| login | dark | 1440 | PASS (0) | FLAG (7) | PASS (0) | PASS (0) | False | [image](screenshots/login-dark-1440.png) |
| signup | dark | 1440 | PASS (0) | FLAG (7) | PASS (0) | PASS (0) | False | [image](screenshots/signup-dark-1440.png) |
| signed-home | dark | 1440 | FAIL (2) | FLAG (24) | FAIL (5) | PASS (0) | False | [image](screenshots/signed-home-dark-1440.png) |
| plus-menu | dark | 1440 | FAIL (1) | FLAG (14) | FAIL (2) | PASS (0) | False | [image](screenshots/plus-menu-dark-1440.png) |
| pattern-clean | dark | 1440 | FAIL (1) | FLAG (17) | FAIL (1) | PASS (0) | False | [image](screenshots/pattern-clean-dark-1440.png) |
| pattern-dirty-exit | dark | 1440 | FAIL (1) | FLAG (17) | FAIL (1) | PASS (0) | False | [image](screenshots/pattern-dirty-exit-dark-1440.png) |
| plan | dark | 1440 | FAIL (1) | FLAG (23) | FAIL (1) | PASS (0) | False | [image](screenshots/plan-dark-1440.png) |
| lesson | dark | 1440 | FAIL (2) | FLAG (15) | FAIL (1) | PASS (0) | False | [image](screenshots/lesson-dark-1440.png) |
| practice | dark | 1440 | FAIL (2) | FLAG (19) | FAIL (4) | PASS (0) | False | [image](screenshots/practice-dark-1440.png) |
| diagnostic | dark | 1440 | FAIL (2) | FLAG (25) | FAIL (5) | PASS (0) | False | [image](screenshots/diagnostic-dark-1440.png) |
| repair | dark | 1440 | FAIL (2) | FLAG (24) | FAIL (5) | PASS (0) | False | [image](screenshots/repair-dark-1440.png) |
| changed-problem | dark | 1440 | FAIL (2) | FLAG (18) | FAIL (4) | PASS (0) | False | [image](screenshots/changed-problem-dark-1440.png) |
| feedback-correct | dark | 1440 | FAIL (2) | FLAG (21) | FAIL (4) | PASS (0) | False | [image](screenshots/feedback-correct-dark-1440.png) |
| completion | dark | 1440 | FAIL (2) | FLAG (15) | FAIL (1) | PASS (0) | False | [image](screenshots/completion-dark-1440.png) |
| spaced-review | dark | 1440 | FAIL (2) | FLAG (18) | FAIL (1) | PASS (0) | False | [image](screenshots/spaced-review-dark-1440.png) |
| question-thread | dark | 1440 | FAIL (3) | FLAG (11) | FAIL (2) | PASS (0) | False | [image](screenshots/question-thread-dark-1440.png) |
| topic-decision | dark | 1440 | FAIL (3) | FLAG (14) | FAIL (3) | PASS (0) | False | [image](screenshots/topic-decision-dark-1440.png) |
| language-editor | dark | 1440 | FAIL (2) | FLAG (23) | FAIL (1) | PASS (0) | False | [image](screenshots/language-editor-dark-1440.png) |
| account-menu | dark | 1440 | FAIL (1) | FLAG (14) | FAIL (2) | PASS (0) | False | [image](screenshots/account-menu-dark-1440.png) |
| export-menu | dark | 1440 | FAIL (2) | FLAG (16) | FAIL (1) | PASS (0) | False | [image](screenshots/export-menu-dark-1440.png) |
| library-populated | dark | 1440 | FAIL (1) | FLAG (10) | FAIL (4) | PASS (0) | False | [image](screenshots/library-populated-dark-1440.png) |
| library-no-match | dark | 1440 | FAIL (1) | FLAG (9) | FAIL (3) | PASS (0) | False | [image](screenshots/library-no-match-dark-1440.png) |
| library-empty | dark | 1440 | FAIL (1) | FLAG (9) | FAIL (3) | PASS (0) | False | [image](screenshots/library-empty-dark-1440.png) |
| library-error | dark | 1440 | FAIL (1) | FLAG (10) | FAIL (3) | PASS (0) | False | [image](screenshots/library-error-dark-1440.png) |
| activity | dark | 1440 | FAIL (1) | FLAG (12) | PASS (0) | PASS (0) | False | [image](screenshots/activity-dark-1440.png) |
| error-row | dark | 1440 | FAIL (2) | FLAG (24) | FAIL (4) | PASS (0) | False | [image](screenshots/error-row-dark-1440.png) |
| 404 | dark | 1440 | PASS (0) | PASS (0) | PASS (0) | PASS (0) | False | [image](screenshots/404-dark-1440.png) |
| reduced-motion | dark | 1440 | FAIL (1) | FLAG (17) | FAIL (1) | PASS (0) | False | [image](screenshots/reduced-motion-dark-1440.png) |
| guest-home | dark | 1024 | PASS (0) | FLAG (9) | FAIL (12) | FAIL (1) | False | [image](screenshots/guest-home-dark-1024.png) |
| login | dark | 1024 | PASS (0) | FLAG (7) | PASS (0) | PASS (0) | False | [image](screenshots/login-dark-1024.png) |
| signup | dark | 1024 | PASS (0) | FLAG (7) | PASS (0) | PASS (0) | False | [image](screenshots/signup-dark-1024.png) |
| signed-home | dark | 1024 | FAIL (1) | FLAG (12) | PASS (0) | PASS (0) | False | [image](screenshots/signed-home-dark-1024.png) |
| plus-menu | dark | 1024 | FAIL (1) | FLAG (13) | FAIL (1) | PASS (0) | False | [image](screenshots/plus-menu-dark-1024.png) |
| pattern-clean | dark | 1024 | FAIL (1) | FLAG (16) | PASS (0) | PASS (0) | False | [image](screenshots/pattern-clean-dark-1024.png) |
| pattern-dirty-exit | dark | 1024 | FAIL (1) | FLAG (16) | PASS (0) | PASS (0) | False | [image](screenshots/pattern-dirty-exit-dark-1024.png) |
| plan | dark | 1024 | FAIL (1) | FLAG (23) | FAIL (1) | PASS (0) | False | [image](screenshots/plan-dark-1024.png) |
| lesson | dark | 1024 | FAIL (2) | FLAG (15) | FAIL (1) | PASS (0) | False | [image](screenshots/lesson-dark-1024.png) |
| practice | dark | 1024 | FAIL (2) | FLAG (19) | FAIL (4) | PASS (0) | False | [image](screenshots/practice-dark-1024.png) |
| diagnostic | dark | 1024 | FAIL (2) | FLAG (25) | FAIL (5) | PASS (0) | False | [image](screenshots/diagnostic-dark-1024.png) |
| repair | dark | 1024 | FAIL (2) | FLAG (24) | FAIL (5) | PASS (0) | False | [image](screenshots/repair-dark-1024.png) |
| changed-problem | dark | 1024 | FAIL (2) | FLAG (18) | FAIL (4) | PASS (0) | False | [image](screenshots/changed-problem-dark-1024.png) |
| feedback-correct | dark | 1024 | FAIL (2) | FLAG (21) | FAIL (4) | PASS (0) | False | [image](screenshots/feedback-correct-dark-1024.png) |
| completion | dark | 1024 | FAIL (2) | FLAG (15) | FAIL (1) | PASS (0) | False | [image](screenshots/completion-dark-1024.png) |
| spaced-review | dark | 1024 | FAIL (2) | FLAG (18) | FAIL (1) | PASS (0) | False | [image](screenshots/spaced-review-dark-1024.png) |
| question-thread | dark | 1024 | FAIL (3) | FLAG (11) | FAIL (2) | PASS (0) | False | [image](screenshots/question-thread-dark-1024.png) |
| topic-decision | dark | 1024 | FAIL (3) | FLAG (14) | FAIL (3) | PASS (0) | False | [image](screenshots/topic-decision-dark-1024.png) |
| language-editor | dark | 1024 | FAIL (2) | FLAG (23) | FAIL (1) | PASS (0) | False | [image](screenshots/language-editor-dark-1024.png) |
| account-menu | dark | 1024 | FAIL (1) | FLAG (13) | FAIL (1) | PASS (0) | False | [image](screenshots/account-menu-dark-1024.png) |
| export-menu | dark | 1024 | FAIL (2) | FLAG (16) | FAIL (1) | PASS (0) | False | [image](screenshots/export-menu-dark-1024.png) |
| library-populated | dark | 1024 | FAIL (1) | FLAG (10) | FAIL (4) | PASS (0) | False | [image](screenshots/library-populated-dark-1024.png) |
| library-no-match | dark | 1024 | FAIL (1) | FLAG (9) | FAIL (3) | PASS (0) | False | [image](screenshots/library-no-match-dark-1024.png) |
| library-empty | dark | 1024 | FAIL (1) | FLAG (9) | FAIL (3) | PASS (0) | False | [image](screenshots/library-empty-dark-1024.png) |
| library-error | dark | 1024 | FAIL (1) | FLAG (10) | FAIL (3) | PASS (0) | False | [image](screenshots/library-error-dark-1024.png) |
| activity | dark | 1024 | FAIL (1) | FLAG (12) | PASS (0) | PASS (0) | False | [image](screenshots/activity-dark-1024.png) |
| error-row | dark | 1024 | FAIL (2) | FLAG (24) | FAIL (4) | PASS (0) | False | [image](screenshots/error-row-dark-1024.png) |
| 404 | dark | 1024 | PASS (0) | PASS (0) | PASS (0) | PASS (0) | False | [image](screenshots/404-dark-1024.png) |
| reduced-motion | dark | 1024 | FAIL (1) | FLAG (16) | PASS (0) | PASS (0) | False | [image](screenshots/reduced-motion-dark-1024.png) |
| guest-home | dark | 390 | PASS (0) | FLAG (9) | FAIL (19) | FAIL (1) | False | [image](screenshots/guest-home-dark-390.png) |
| login | dark | 390 | PASS (0) | FLAG (7) | FAIL (10) | PASS (0) | False | [image](screenshots/login-dark-390.png) |
| signup | dark | 390 | PASS (0) | FLAG (7) | FAIL (10) | PASS (0) | False | [image](screenshots/signup-dark-390.png) |
| signed-home | dark | 390 | FAIL (1) | FLAG (10) | FAIL (7) | PASS (0) | False | [image](screenshots/signed-home-dark-390.png) |
| plus-menu | dark | 390 | FAIL (1) | FLAG (11) | FAIL (18) | PASS (0) | False | [image](screenshots/plus-menu-dark-390.png) |
| pattern-clean | dark | 390 | FAIL (1) | FLAG (14) | FAIL (10) | PASS (0) | False | [image](screenshots/pattern-clean-dark-390.png) |
| pattern-dirty-exit | dark | 390 | FAIL (1) | FLAG (14) | FAIL (14) | PASS (0) | False | [image](screenshots/pattern-dirty-exit-dark-390.png) |
| plan | dark | 390 | FAIL (1) | FLAG (21) | FAIL (23) | PASS (0) | False | [image](screenshots/plan-dark-390.png) |
| lesson | dark | 390 | FAIL (2) | FLAG (13) | FAIL (16) | PASS (0) | False | [image](screenshots/lesson-dark-390.png) |
| practice | dark | 390 | FAIL (2) | FLAG (17) | FAIL (29) | PASS (0) | False | [image](screenshots/practice-dark-390.png) |
| diagnostic | dark | 390 | FAIL (2) | FLAG (23) | FAIL (31) | PASS (0) | False | [image](screenshots/diagnostic-dark-390.png) |
| repair | dark | 390 | FAIL (2) | FLAG (22) | FAIL (30) | PASS (0) | False | [image](screenshots/repair-dark-390.png) |
| changed-problem | dark | 390 | FAIL (2) | FLAG (16) | FAIL (27) | PASS (0) | False | [image](screenshots/changed-problem-dark-390.png) |
| feedback-correct | dark | 390 | FAIL (2) | FLAG (19) | FAIL (32) | PASS (0) | False | [image](screenshots/feedback-correct-dark-390.png) |
| completion | dark | 390 | FAIL (2) | FLAG (13) | FAIL (16) | PASS (0) | False | [image](screenshots/completion-dark-390.png) |
| spaced-review | dark | 390 | FAIL (2) | FLAG (16) | FAIL (19) | PASS (0) | False | [image](screenshots/spaced-review-dark-390.png) |
| question-thread | dark | 390 | FAIL (3) | FLAG (9) | FAIL (11) | PASS (0) | False | [image](screenshots/question-thread-dark-390.png) |
| topic-decision | dark | 390 | FAIL (3) | FLAG (12) | FAIL (14) | PASS (0) | False | [image](screenshots/topic-decision-dark-390.png) |
| language-editor | dark | 390 | FAIL (2) | FLAG (21) | FAIL (26) | PASS (0) | False | [image](screenshots/language-editor-dark-390.png) |
| account-menu | dark | 390 | FAIL (1) | FLAG (11) | FAIL (12) | PASS (0) | False | [image](screenshots/account-menu-dark-390.png) |
| export-menu | dark | 390 | FAIL (2) | FLAG (14) | FAIL (19) | PASS (0) | False | [image](screenshots/export-menu-dark-390.png) |
| library-populated | dark | 390 | FAIL (1) | FLAG (8) | FAIL (16) | PASS (0) | False | [image](screenshots/library-populated-dark-390.png) |
| library-no-match | dark | 390 | FAIL (1) | FLAG (7) | FAIL (13) | PASS (0) | False | [image](screenshots/library-no-match-dark-390.png) |
| library-empty | dark | 390 | FAIL (1) | FLAG (7) | FAIL (13) | PASS (0) | False | [image](screenshots/library-empty-dark-390.png) |
| library-error | dark | 390 | FAIL (1) | FLAG (8) | FAIL (14) | PASS (0) | False | [image](screenshots/library-error-dark-390.png) |
| activity | dark | 390 | FAIL (1) | FLAG (10) | FAIL (11) | PASS (0) | False | [image](screenshots/activity-dark-390.png) |
| error-row | dark | 390 | FAIL (2) | FLAG (22) | FAIL (31) | PASS (0) | False | [image](screenshots/error-row-dark-390.png) |
| 404 | dark | 390 | PASS (0) | PASS (0) | PASS (0) | PASS (0) | False | [image](screenshots/404-dark-390.png) |
| reduced-motion | dark | 390 | FAIL (1) | FLAG (14) | FAIL (10) | PASS (0) | False | [image](screenshots/reduced-motion-dark-390.png) |
| home-360 | dark | 360 | FAIL (1) | FLAG (14) | FAIL (10) | PASS (0) | False | [image](screenshots/home-360-dark-360.png) |
| guest-home | light | 1440 | PASS (0) | FLAG (11) | FAIL (12) | FAIL (1) | False | [image](screenshots/guest-home-light-1440.png) |
| login | light | 1440 | FAIL (1) | FLAG (9) | PASS (0) | FAIL (1) | False | [image](screenshots/login-light-1440.png) |
| signup | light | 1440 | FAIL (1) | FLAG (9) | PASS (0) | FAIL (1) | False | [image](screenshots/signup-light-1440.png) |
| signed-home | light | 1440 | FAIL (5) | FLAG (25) | FAIL (5) | FAIL (2) | False | [image](screenshots/signed-home-light-1440.png) |
| plus-menu | light | 1440 | FAIL (2) | FLAG (17) | FAIL (2) | FAIL (1) | False | [image](screenshots/plus-menu-light-1440.png) |
| pattern-clean | light | 1440 | FAIL (2) | FLAG (19) | FAIL (1) | PASS (0) | False | [image](screenshots/pattern-clean-light-1440.png) |
| pattern-dirty-exit | light | 1440 | FAIL (2) | FLAG (22) | FAIL (1) | PASS (0) | False | [image](screenshots/pattern-dirty-exit-light-1440.png) |
| plan | light | 1440 | FAIL (3) | FLAG (23) | FAIL (1) | FAIL (1) | False | [image](screenshots/plan-light-1440.png) |
| lesson | light | 1440 | FAIL (4) | FLAG (17) | FAIL (1) | FAIL (1) | False | [image](screenshots/lesson-light-1440.png) |
| practice | light | 1440 | FAIL (4) | FLAG (26) | FAIL (4) | FAIL (1) | False | [image](screenshots/practice-light-1440.png) |
| diagnostic | light | 1440 | FAIL (5) | FLAG (26) | FAIL (5) | FAIL (2) | False | [image](screenshots/diagnostic-light-1440.png) |
| repair | light | 1440 | FAIL (5) | FLAG (25) | FAIL (5) | FAIL (2) | False | [image](screenshots/repair-light-1440.png) |
| changed-problem | light | 1440 | FAIL (4) | FLAG (26) | FAIL (4) | FAIL (1) | False | [image](screenshots/changed-problem-light-1440.png) |
| feedback-correct | light | 1440 | FAIL (5) | FLAG (27) | FAIL (4) | FAIL (2) | False | [image](screenshots/feedback-correct-light-1440.png) |
| completion | light | 1440 | FAIL (4) | FLAG (17) | FAIL (1) | FAIL (1) | False | [image](screenshots/completion-light-1440.png) |
| spaced-review | light | 1440 | FAIL (6) | FLAG (20) | FAIL (1) | FAIL (3) | False | [image](screenshots/spaced-review-light-1440.png) |
| question-thread | light | 1440 | FAIL (3) | FLAG (12) | FAIL (2) | PASS (0) | False | [image](screenshots/question-thread-light-1440.png) |
| topic-decision | light | 1440 | FAIL (3) | FLAG (15) | FAIL (3) | PASS (0) | False | [image](screenshots/topic-decision-light-1440.png) |
| language-editor | light | 1440 | FAIL (5) | FLAG (25) | FAIL (1) | FAIL (1) | False | [image](screenshots/language-editor-light-1440.png) |
| account-menu | light | 1440 | FAIL (1) | FLAG (17) | FAIL (2) | PASS (0) | False | [image](screenshots/account-menu-light-1440.png) |
| export-menu | light | 1440 | FAIL (4) | FLAG (19) | FAIL (1) | FAIL (1) | False | [image](screenshots/export-menu-light-1440.png) |
| library-populated | light | 1440 | FAIL (3) | FLAG (11) | FAIL (4) | FAIL (1) | False | [image](screenshots/library-populated-light-1440.png) |
| library-no-match | light | 1440 | FAIL (3) | FLAG (10) | FAIL (3) | FAIL (1) | False | [image](screenshots/library-no-match-light-1440.png) |
| library-empty | light | 1440 | FAIL (3) | FLAG (10) | FAIL (3) | FAIL (1) | False | [image](screenshots/library-empty-light-1440.png) |
| library-error | light | 1440 | FAIL (3) | FLAG (11) | FAIL (3) | FAIL (1) | False | [image](screenshots/library-error-light-1440.png) |
| activity | light | 1440 | FAIL (1) | FLAG (13) | PASS (0) | PASS (0) | False | [image](screenshots/activity-light-1440.png) |
| error-row | light | 1440 | FAIL (4) | FLAG (29) | FAIL (4) | FAIL (1) | False | [image](screenshots/error-row-light-1440.png) |
| 404 | light | 1440 | PASS (0) | PASS (0) | PASS (0) | PASS (0) | False | [image](screenshots/404-light-1440.png) |
| reduced-motion | light | 1440 | FAIL (1) | FLAG (15) | FAIL (1) | PASS (0) | False | [image](screenshots/reduced-motion-light-1440.png) |
| guest-home | light | 1024 | PASS (0) | FLAG (11) | FAIL (12) | FAIL (1) | False | [image](screenshots/guest-home-light-1024.png) |
| login | light | 1024 | FAIL (1) | FLAG (9) | PASS (0) | FAIL (1) | False | [image](screenshots/login-light-1024.png) |
| signup | light | 1024 | FAIL (1) | FLAG (9) | PASS (0) | FAIL (1) | False | [image](screenshots/signup-light-1024.png) |
| signed-home | light | 1024 | FAIL (1) | FLAG (13) | PASS (0) | PASS (0) | False | [image](screenshots/signed-home-light-1024.png) |
| plus-menu | light | 1024 | FAIL (2) | FLAG (15) | FAIL (1) | FAIL (1) | False | [image](screenshots/plus-menu-light-1024.png) |
| pattern-clean | light | 1024 | FAIL (2) | FLAG (17) | PASS (0) | PASS (0) | False | [image](screenshots/pattern-clean-light-1024.png) |
| pattern-dirty-exit | light | 1024 | FAIL (2) | FLAG (20) | PASS (0) | PASS (0) | False | [image](screenshots/pattern-dirty-exit-light-1024.png) |
| plan | light | 1024 | FAIL (3) | FLAG (23) | FAIL (1) | FAIL (1) | False | [image](screenshots/plan-light-1024.png) |
| lesson | light | 1024 | FAIL (4) | FLAG (17) | FAIL (1) | FAIL (1) | False | [image](screenshots/lesson-light-1024.png) |
| practice | light | 1024 | FAIL (4) | FLAG (26) | FAIL (4) | FAIL (1) | False | [image](screenshots/practice-light-1024.png) |
| diagnostic | light | 1024 | FAIL (5) | FLAG (26) | FAIL (5) | FAIL (2) | False | [image](screenshots/diagnostic-light-1024.png) |
| repair | light | 1024 | FAIL (5) | FLAG (25) | FAIL (5) | FAIL (2) | False | [image](screenshots/repair-light-1024.png) |
| changed-problem | light | 1024 | FAIL (4) | FLAG (26) | FAIL (4) | FAIL (1) | False | [image](screenshots/changed-problem-light-1024.png) |
| feedback-correct | light | 1024 | FAIL (5) | FLAG (27) | FAIL (4) | FAIL (2) | False | [image](screenshots/feedback-correct-light-1024.png) |
| completion | light | 1024 | FAIL (4) | FLAG (17) | FAIL (1) | FAIL (1) | False | [image](screenshots/completion-light-1024.png) |
| spaced-review | light | 1024 | FAIL (6) | FLAG (20) | FAIL (1) | FAIL (3) | False | [image](screenshots/spaced-review-light-1024.png) |
| question-thread | light | 1024 | FAIL (3) | FLAG (12) | FAIL (2) | PASS (0) | False | [image](screenshots/question-thread-light-1024.png) |
| topic-decision | light | 1024 | FAIL (3) | FLAG (15) | FAIL (3) | PASS (0) | False | [image](screenshots/topic-decision-light-1024.png) |
| language-editor | light | 1024 | FAIL (5) | FLAG (25) | FAIL (1) | FAIL (1) | False | [image](screenshots/language-editor-light-1024.png) |
| account-menu | light | 1024 | FAIL (1) | FLAG (15) | FAIL (1) | PASS (0) | False | [image](screenshots/account-menu-light-1024.png) |
| export-menu | light | 1024 | FAIL (4) | FLAG (19) | FAIL (1) | FAIL (1) | False | [image](screenshots/export-menu-light-1024.png) |
| library-populated | light | 1024 | FAIL (3) | FLAG (11) | FAIL (4) | FAIL (1) | False | [image](screenshots/library-populated-light-1024.png) |
| library-no-match | light | 1024 | FAIL (3) | FLAG (10) | FAIL (3) | FAIL (1) | False | [image](screenshots/library-no-match-light-1024.png) |
| library-empty | light | 1024 | FAIL (3) | FLAG (10) | FAIL (3) | FAIL (1) | False | [image](screenshots/library-empty-light-1024.png) |
| library-error | light | 1024 | FAIL (3) | FLAG (11) | FAIL (3) | FAIL (1) | False | [image](screenshots/library-error-light-1024.png) |
| activity | light | 1024 | FAIL (1) | FLAG (13) | PASS (0) | PASS (0) | False | [image](screenshots/activity-light-1024.png) |
| error-row | light | 1024 | FAIL (4) | FLAG (29) | FAIL (4) | FAIL (1) | False | [image](screenshots/error-row-light-1024.png) |
| 404 | light | 1024 | PASS (0) | PASS (0) | PASS (0) | PASS (0) | False | [image](screenshots/404-light-1024.png) |
| reduced-motion | light | 1024 | FAIL (2) | FLAG (17) | PASS (0) | PASS (0) | False | [image](screenshots/reduced-motion-light-1024.png) |
| guest-home | light | 390 | PASS (0) | FLAG (11) | FAIL (19) | FAIL (1) | False | [image](screenshots/guest-home-light-390.png) |
| login | light | 390 | FAIL (1) | FLAG (9) | FAIL (10) | FAIL (1) | False | [image](screenshots/login-light-390.png) |
| signup | light | 390 | FAIL (1) | FLAG (9) | FAIL (10) | FAIL (1) | False | [image](screenshots/signup-light-390.png) |
| signed-home | light | 390 | FAIL (1) | FLAG (11) | FAIL (7) | PASS (0) | False | [image](screenshots/signed-home-light-390.png) |
| plus-menu | light | 390 | FAIL (2) | FLAG (13) | FAIL (18) | FAIL (1) | False | [image](screenshots/plus-menu-light-390.png) |
| pattern-clean | light | 390 | FAIL (2) | FLAG (15) | FAIL (10) | PASS (0) | False | [image](screenshots/pattern-clean-light-390.png) |
| pattern-dirty-exit | light | 390 | FAIL (2) | FLAG (18) | FAIL (14) | PASS (0) | False | [image](screenshots/pattern-dirty-exit-light-390.png) |
| plan | light | 390 | FAIL (3) | FLAG (21) | FAIL (23) | FAIL (1) | False | [image](screenshots/plan-light-390.png) |
| lesson | light | 390 | FAIL (4) | FLAG (15) | FAIL (16) | FAIL (1) | False | [image](screenshots/lesson-light-390.png) |
| practice | light | 390 | FAIL (4) | FLAG (24) | FAIL (29) | FAIL (1) | False | [image](screenshots/practice-light-390.png) |
| diagnostic | light | 390 | FAIL (5) | FLAG (24) | FAIL (31) | FAIL (2) | False | [image](screenshots/diagnostic-light-390.png) |
| repair | light | 390 | FAIL (5) | FLAG (23) | FAIL (30) | FAIL (2) | False | [image](screenshots/repair-light-390.png) |
| changed-problem | light | 390 | FAIL (4) | FLAG (24) | FAIL (27) | FAIL (1) | False | [image](screenshots/changed-problem-light-390.png) |
| feedback-correct | light | 390 | FAIL (5) | FLAG (25) | FAIL (32) | FAIL (2) | False | [image](screenshots/feedback-correct-light-390.png) |
| completion | light | 390 | FAIL (4) | FLAG (15) | FAIL (16) | FAIL (1) | False | [image](screenshots/completion-light-390.png) |
| spaced-review | light | 390 | FAIL (6) | FLAG (18) | FAIL (19) | FAIL (3) | False | [image](screenshots/spaced-review-light-390.png) |
| question-thread | light | 390 | FAIL (3) | FLAG (10) | FAIL (11) | PASS (0) | False | [image](screenshots/question-thread-light-390.png) |
| topic-decision | light | 390 | FAIL (3) | FLAG (13) | FAIL (14) | PASS (0) | False | [image](screenshots/topic-decision-light-390.png) |
| language-editor | light | 390 | FAIL (5) | FLAG (23) | FAIL (26) | FAIL (1) | False | [image](screenshots/language-editor-light-390.png) |
| account-menu | light | 390 | FAIL (1) | FLAG (13) | FAIL (12) | PASS (0) | False | [image](screenshots/account-menu-light-390.png) |
| export-menu | light | 390 | FAIL (4) | FLAG (17) | FAIL (19) | FAIL (1) | False | [image](screenshots/export-menu-light-390.png) |
| library-populated | light | 390 | FAIL (3) | FLAG (9) | FAIL (16) | FAIL (1) | False | [image](screenshots/library-populated-light-390.png) |
| library-no-match | light | 390 | FAIL (3) | FLAG (8) | FAIL (13) | FAIL (1) | False | [image](screenshots/library-no-match-light-390.png) |
| library-empty | light | 390 | FAIL (3) | FLAG (8) | FAIL (13) | FAIL (1) | False | [image](screenshots/library-empty-light-390.png) |
| library-error | light | 390 | FAIL (3) | FLAG (9) | FAIL (14) | FAIL (1) | False | [image](screenshots/library-error-light-390.png) |
| activity | light | 390 | FAIL (1) | FLAG (11) | FAIL (11) | PASS (0) | False | [image](screenshots/activity-light-390.png) |
| error-row | light | 390 | FAIL (4) | FLAG (27) | FAIL (31) | FAIL (1) | False | [image](screenshots/error-row-light-390.png) |
| 404 | light | 390 | PASS (0) | PASS (0) | PASS (0) | PASS (0) | False | [image](screenshots/404-light-390.png) |
| reduced-motion | light | 390 | FAIL (2) | FLAG (15) | FAIL (10) | PASS (0) | False | [image](screenshots/reduced-motion-light-390.png) |
| home-360 | light | 360 | FAIL (2) | FLAG (15) | FAIL (10) | PASS (0) | False | [image](screenshots/home-360-light-360.png) |
| source-picker | dark | 1440 | PASS (0) | FLAG (8) | FAIL (4) | PASS (0) | False | [image](screenshots/source-picker-dark-1440.png) |
| waiting-row | dark | 1440 | FAIL (2) | FLAG (18) | FAIL (4) | PASS (0) | False | [image](screenshots/waiting-row-dark-1440.png) |
| source-picker | dark | 1024 | PASS (0) | FLAG (8) | FAIL (4) | PASS (0) | False | [image](screenshots/source-picker-dark-1024.png) |
| waiting-row | dark | 1024 | FAIL (2) | FLAG (18) | FAIL (4) | PASS (0) | False | [image](screenshots/waiting-row-dark-1024.png) |
| source-picker | dark | 390 | PASS (0) | FLAG (8) | FAIL (9) | PASS (0) | False | [image](screenshots/source-picker-dark-390.png) |
| waiting-row | dark | 390 | FAIL (2) | FLAG (16) | FAIL (28) | PASS (0) | False | [image](screenshots/waiting-row-dark-390.png) |
| source-picker | light | 1440 | PASS (0) | FLAG (10) | FAIL (4) | PASS (0) | False | [image](screenshots/source-picker-light-1440.png) |
| waiting-row | light | 1440 | FAIL (4) | FLAG (24) | FAIL (4) | FAIL (1) | False | [image](screenshots/waiting-row-light-1440.png) |
| source-picker | light | 1024 | PASS (0) | FLAG (10) | FAIL (4) | PASS (0) | False | [image](screenshots/source-picker-light-1024.png) |
| waiting-row | light | 1024 | FAIL (4) | FLAG (24) | FAIL (4) | FAIL (1) | False | [image](screenshots/waiting-row-light-1024.png) |
| source-picker | light | 390 | PASS (0) | FLAG (10) | FAIL (9) | PASS (0) | False | [image](screenshots/source-picker-light-390.png) |
| waiting-row | light | 390 | FAIL (4) | FLAG (22) | FAIL (28) | FAIL (1) | False | [image](screenshots/waiting-row-light-390.png) |

## Readability failures, ranked by measured shortfall

| Theme | Selector/type | Ratio / required | Colors | Proposed foreground / ratio | Evidence |
|---|---|---|---|---|---|
| light | `#start-review-btn` (text) | 1.14 / 4.5 | #202124 on #242c37 | #ffffff / 14.09 | [image](screenshots/spaced-review-light-1440.png) |
| light | `#skip-review-btn` (text) | 1.14 / 4.5 | #202124 on #242c37 | #ffffff / 14.09 | [image](screenshots/spaced-review-light-1440.png) |
| light | `#library-add-reference` (text) | 1.14 / 4.5 | #202124 on #242c37 | #ffffff / 14.09 | [image](screenshots/library-populated-light-1440.png) |
| light | `#correct-observation-btn` (text) | 1.89 / 4.5 | #215a7b on #242c37 | #ffffff / 14.09 | [image](screenshots/signed-home-light-1440.png) |
| light | `button.back` (text) | 2.17 / 4.5 | #a6b1c0 on #ffffff | #000000 / 21.00 | [image](screenshots/login-light-1440.png) |
| light | `span.` (text) | 2.41 / 4.5 | #62656c on #242c37 | #ffffff / 14.09 | [image](screenshots/signed-home-light-1440.png) |
| light | `small.` (text) | 2.65 / 4.5 | #8d99aa on #f5f5f5 | #000000 / 19.26 | [image](screenshots/plus-menu-light-1440.png) |
| light | `button.` (text) | 2.65 / 4.5 | #8f9093 on #e9eaed | #000000 / 17.46 | [image](screenshots/question-thread-light-1440.png) |
| light | `#start-review-btn` (text) | 2.86 / 4.5 | #202124 on #626870 | #ffffff / 5.62 | [image](screenshots/spaced-review-primary-hover-light-1024.png) |
| light | `svg` (icon) | 1.99 / 3 | #a6b1c0 on #f5f5f5 | #000000 / 19.26 | [image](screenshots/pattern-clean-light-1440.png) |
| light | `svg` (icon) | 2.41 / 3 | #62656c on #242c37 | #ffffff / 14.09 | [image](screenshots/signed-home-light-1440.png) |
| dark | `input.search` (placeholder) | 4.04 / 4.5 | #757575 on #111315 | #ffffff / 18.62 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `#followup-question` (placeholder) | 4.04 / 4.5 | #757575 on #111315 | #ffffff / 18.62 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `textarea.` (placeholder) | 4.04 / 4.5 | #757575 on #111315 | #ffffff / 18.62 | [image](screenshots/question-thread-dark-1440.png) |
| light | `span.filter-count` (text) | 4.14 / 4.5 | #6b7078 on #e9eaed | #000000 / 17.46 | [image](screenshots/library-populated-light-1440.png) |
| light | `input.search` (placeholder) | 4.23 / 4.5 | #757575 on #f5f5f5 | #000000 / 19.26 | [image](screenshots/signed-home-light-1440.png) |
| light | `#followup-question` (placeholder) | 4.23 / 4.5 | #757575 on #f5f5f5 | #000000 / 19.26 | [image](screenshots/signed-home-light-1440.png) |
| light | `textarea.` (placeholder) | 4.23 / 4.5 | #757575 on #f5f5f5 | #000000 / 19.26 | [image](screenshots/question-thread-light-1440.png) |
| dark | `button.` (text) | 4.47 / 4.5 | #818284 on #1a1b1f | #ffffff / 17.21 | [image](screenshots/question-thread-dark-1440.png) |

Proposals above are computed passing foregrounds on each measured solid backdrop, not blanket application instructions. Preserve accent semantics and owner choices; prefer matching muted tokens where they pass. For a border/icon, changing the necessary boundary rather than text may be appropriate. Image/gradient-affected pairs require pixel review before applying a token.

## Similar-color problems / separation candidates

| Theme | Selector / pair | Colors | Ratio | OKLab deltaE | Evidence |
|---|---|---|---:|---:|---|
| dark | `main.` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `header.main-header` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `button.guest-theme.motion-symbol-button` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `button.auth-button.login` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `div.composer` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `div.secondary` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `button.` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/guest-home-dark-1440.png) |
| dark | `button.google.motion-icon-button` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/login-dark-1440.png) |
| dark | `#live-email` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/login-dark-1440.png) |
| dark | `#live-password` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/login-dark-1440.png) |
| dark | `aside.sidebar` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `input.search` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `header.main-header.has-stages` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `#pattern-toggle` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `button.context-source.motion-icon-button` border-surface | #292c31 / #242c37 | 1.01 | 1.32 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `select.` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `section.work-sheet` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `div.work-line` border-surface | #111315 / #111315 | 1.00 | 0.00 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `div.work-line.flagged` surface-parent | #2b171b / #111315 | 1.10 | 5.99 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `div.work-line.flagged` border-surface | #170c0e / #2b171b | 1.13 | 6.40 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `mark.` surface-parent | #1f1114 / #2b171b | 1.08 | 3.68 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `span.flag-tag` surface-parent | #111315 / #2b171b | 1.10 | 5.99 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `span.flag-tag` border-surface | #0a0b0c / #111315 | 1.06 | 3.55 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `div.observation-row` surface-parent | #090a0b / #000000 | 1.06 | 14.40 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `button.` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `button.` border-surface | #292a30 / #1a1b1f | 1.20 | 6.37 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `#followup-question` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `button.checkpoint-trigger.motion-icon-button` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `nav.icon-rail` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `button.rail-button.selected.motion-icon-button` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/signed-home-dark-1440.png) |
| dark | `div.menu` surface-parent | #111315 / #111315 | 1.00 | 0.00 | [image](screenshots/plus-menu-dark-1440.png) |
| dark | `button.learning-card` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/plus-menu-dark-1440.png) |
| dark | `dialog.` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `div.library-search` surface-parent | #111315 / #111315 | 1.00 | 0.00 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `#done` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `#done` border-surface | #292a30 / #1a1b1f | 1.20 | 6.37 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `aside.right-panel` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/pattern-clean-dark-1440.png) |
| dark | `#style` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/pattern-clean-dark-1440.png) |
| dark | `#interest` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/pattern-clean-dark-1440.png) |
| dark | `button.save-pattern` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/pattern-clean-dark-1440.png) |
| dark | `button.save-pattern` border-surface | #292a30 / #1a1b1f | 1.20 | 6.37 | [image](screenshots/pattern-clean-dark-1440.png) |
| dark | `dialog.discard-dialog` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/pattern-dirty-exit-dark-1440.png) |
| dark | `button.discard-pattern` surface-parent | #362021 / #111315 | 1.23 | 9.47 | [image](screenshots/pattern-dirty-exit-dark-1440.png) |
| dark | `section.grounding-banner` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/plan-dark-1440.png) |
| dark | `span.grounding-badge.unverified_general` surface-parent | #090a0b / #111315 | 1.06 | 4.15 | [image](screenshots/plan-dark-1440.png) |
| dark | `span.meta-pill` surface-parent | #090a0b / #111315 | 1.06 | 4.15 | [image](screenshots/plan-dark-1440.png) |
| dark | `section.module-card` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/plan-dark-1440.png) |
| dark | `article.lesson-card` surface-parent | #090a0b / #111315 | 1.06 | 4.15 | [image](screenshots/plan-dark-1440.png) |
| dark | `span.meta-pill` surface-parent | #090a0b / #090a0b | 1.00 | 0.00 | [image](screenshots/plan-dark-1440.png) |
| dark | `span.concept-pill` surface-parent | #090a0b / #090a0b | 1.00 | 0.00 | [image](screenshots/plan-dark-1440.png) |
| dark | `#attempt-answer` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/practice-dark-1440.png) |
| dark | `#attempt-work` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/practice-dark-1440.png) |
| dark | `div.reasoning-chip` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/practice-dark-1440.png) |
| dark | `#need-help-btn` border-surface | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/practice-dark-1440.png) |
| dark | `#request-hint` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/practice-dark-1440.png) |
| dark | `#request-hint` border-surface | #292a30 / #1a1b1f | 1.20 | 6.37 | [image](screenshots/practice-dark-1440.png) |
| dark | `#need-help-btn` border-surface | #e5e5e5 / #ffffff | 1.26 | 7.81 | [image](screenshots/practice-dark-1440.png) |
| dark | `#diagnostic-response` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/diagnostic-dark-1440.png) |
| dark | `section.result-summary` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/feedback-correct-dark-1440.png) |
| dark | `section.spaced-review-card` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/spaced-review-dark-1440.png) |
| dark | `span.grounding-badge.partial_source` surface-parent | #12232e / #111315 | 1.16 | 6.66 | [image](screenshots/spaced-review-dark-1440.png) |
| dark | `article.chat-message.chat-user` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/question-thread-dark-1440.png) |
| dark | `form.chat-composer` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/question-thread-dark-1440.png) |
| dark | `button.` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/question-thread-dark-1440.png) |
| dark | `#struggle` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/language-editor-dark-1440.png) |
| dark | `#context` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/language-editor-dark-1440.png) |
| dark | `#preferred-language` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/language-editor-dark-1440.png) |
| dark | `button.checkpoint-trigger.motion-icon-button` surface-parent | #121416 / #000000 | 1.14 | 19.00 | [image](screenshots/language-editor-dark-1440.png) |
| dark | `button.checkpoint-trigger.motion-icon-button` border-surface | #292a30 / #121416 | 1.29 | 9.68 | [image](screenshots/language-editor-dark-1440.png) |
| dark | `div.account-menu` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/account-menu-dark-1440.png) |
| dark | `div.checkpoint-menu` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/export-menu-dark-1440.png) |
| dark | `div.library-search` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/library-populated-dark-1440.png) |
| dark | `button.active` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/library-populated-dark-1440.png) |
| dark | `b.` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/library-populated-dark-1440.png) |
| dark | `button.rail-button.motion-icon-button.selected` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/library-populated-dark-1440.png) |
| dark | `#live-status` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/library-error-dark-1440.png) |
| dark | `#live-activity-date` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/activity-dark-1440.png) |
| dark | `#all-activity-dates` surface-parent | #1a1b1f / #000000 | 1.22 | 22.29 | [image](screenshots/activity-dark-1440.png) |
| dark | `#all-activity-dates` border-surface | #292a30 / #1a1b1f | 1.20 | 6.37 | [image](screenshots/activity-dark-1440.png) |
| dark | `button.activity-item.event-row.motion-icon-button` surface-parent | #111315 / #000000 | 1.13 | 18.55 | [image](screenshots/activity-dark-1440.png) |
| dark | `div.operation-error` surface-parent | #2b171b / #000000 | 1.24 | 23.58 | [image](screenshots/error-row-dark-1440.png) |
| dark | `div.operation-error` border-surface | #1b0e11 / #2b171b | 1.11 | 5.03 | [image](screenshots/error-row-dark-1440.png) |
| dark | `#retry-operation` surface-parent | #111315 / #2b171b | 1.10 | 5.99 | [image](screenshots/error-row-dark-1440.png) |
| dark | `#reconcile-operation` surface-parent | #111315 / #2b171b | 1.10 | 5.99 | [image](screenshots/error-row-dark-1440.png) |
| dark | `#edit-operation` surface-parent | #111315 / #2b171b | 1.10 | 5.99 | [image](screenshots/error-row-dark-1440.png) |
| dark | `aside.sidebar.closed` surface-parent | #000000 / #000000 | 1.00 | 0.00 | [image](screenshots/signed-home-dark-390.png) |
| light | `main.` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/guest-home-light-1440.png) |
| light | `header.main-header` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/guest-home-light-1440.png) |
| light | `button.guest-theme.motion-symbol-button` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/guest-home-light-1440.png) |
| light | `button.auth-button.login` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/guest-home-light-1440.png) |
| light | `button.auth-button.signup` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/guest-home-light-1440.png) |
| light | `div.composer` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/guest-home-light-1440.png) |
| light | `div.composer` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/guest-home-light-1440.png) |
| light | `div.secondary` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/guest-home-light-1440.png) |
| light | `button.` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/guest-home-light-1440.png) |
| light | `button.google.motion-icon-button` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/login-light-1440.png) |
| light | `#live-email` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/login-light-1440.png) |
| light | `#live-password` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/login-light-1440.png) |
| light | `button.auth-submit` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/login-light-1440.png) |
| light | `aside.sidebar` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/signed-home-light-1440.png) |
| light | `input.search` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/signed-home-light-1440.png) |
| light | `header.main-header.has-stages` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/signed-home-light-1440.png) |
| light | `#pattern-toggle` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/signed-home-light-1440.png) |
| light | `select.` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/signed-home-light-1440.png) |
| light | `select.` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/signed-home-light-1440.png) |
| light | `span.` surface-parent | #dfefe4 / #ffffff | 1.19 | 6.67 | [image](screenshots/signed-home-light-1440.png) |
| light | `span.` surface-parent | #e2eef5 / #ffffff | 1.18 | 6.00 | [image](screenshots/signed-home-light-1440.png) |
| light | `section.work-sheet` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/signed-home-light-1440.png) |
| light | `div.work-line` border-surface | #f5f5f5 / #f5f5f5 | 1.00 | 0.00 | [image](screenshots/signed-home-light-1440.png) |
| light | `div.work-line.flagged` surface-parent | #f6e2e6 / #f5f5f5 | 1.14 | 4.60 | [image](screenshots/signed-home-light-1440.png) |
| light | `span.flag-tag` surface-parent | #f5f5f5 / #f6e2e6 | 1.14 | 4.60 | [image](screenshots/signed-home-light-1440.png) |
| light | `div.observation-row` surface-parent | #f2f1ed / #ffffff | 1.13 | 4.25 | [image](screenshots/signed-home-light-1440.png) |
| light | `button.` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/signed-home-light-1440.png) |
| light | `button.` border-surface | #dedfe3 / #e9eaed | 1.11 | 3.31 | [image](screenshots/signed-home-light-1440.png) |
| light | `#followup-question` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/signed-home-light-1440.png) |
| light | `#followup-question` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/signed-home-light-1440.png) |
| light | `button.checkpoint-trigger.motion-icon-button` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/signed-home-light-1440.png) |
| light | `button.checkpoint-trigger.motion-icon-button` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/signed-home-light-1440.png) |
| light | `nav.icon-rail` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/signed-home-light-1440.png) |
| light | `button.rail-button.selected.motion-icon-button` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/signed-home-light-1440.png) |
| light | `div.menu` surface-parent | #f5f5f5 / #f5f5f5 | 1.00 | 0.00 | [image](screenshots/plus-menu-light-1440.png) |
| light | `div.menu` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/plus-menu-light-1440.png) |
| light | `button.learning-card` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/plus-menu-light-1440.png) |
| light | `button.learning-card` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/plus-menu-light-1440.png) |
| light | `dialog.` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/source-picker-light-1440.png) |
| light | `dialog.` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/source-picker-light-1440.png) |
| light | `div.library-search` surface-parent | #f5f5f5 / #f5f5f5 | 1.00 | 0.00 | [image](screenshots/source-picker-light-1440.png) |
| light | `div.library-search` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/source-picker-light-1440.png) |
| light | `#done` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/source-picker-light-1440.png) |
| light | `#done` border-surface | #dedfe3 / #e9eaed | 1.11 | 3.31 | [image](screenshots/source-picker-light-1440.png) |
| light | `aside.right-panel` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/pattern-clean-light-1440.png) |
| light | `#style` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/pattern-clean-light-1440.png) |
| light | `#interest` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/pattern-clean-light-1440.png) |
| light | `button.save-pattern` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/pattern-clean-light-1440.png) |
| light | `button.save-pattern` border-surface | #dedfe3 / #e9eaed | 1.11 | 3.31 | [image](screenshots/pattern-clean-light-1440.png) |
| light | `dialog.discard-dialog` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/pattern-dirty-exit-light-1440.png) |
| light | `dialog.discard-dialog` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/pattern-dirty-exit-light-1440.png) |
| light | `button.discard-pattern` surface-parent | #fbe5e5 / #f5f5f5 | 1.10 | 3.89 | [image](screenshots/pattern-dirty-exit-light-1440.png) |
| light | `button.confirm-save.unsaved` surface-parent | #e1f0e7 / #f5f5f5 | 1.08 | 3.49 | [image](screenshots/pattern-dirty-exit-light-1440.png) |
| light | `#done` surface-parent | #eeeeee / #f5f5f5 | 1.06 | 2.10 | [image](screenshots/pattern-dirty-exit-light-1440.png) |
| light | `section.grounding-banner` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/plan-light-1440.png) |
| light | `span.grounding-badge.unverified_general` surface-parent | #f2f1ed / #f5f5f5 | 1.04 | 1.35 | [image](screenshots/plan-light-1440.png) |
| light | `span.meta-pill` surface-parent | #f2f1ed / #f5f5f5 | 1.04 | 1.35 | [image](screenshots/plan-light-1440.png) |
| light | `section.module-card` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/plan-light-1440.png) |
| light | `article.lesson-card` surface-parent | #f2f1ed / #f5f5f5 | 1.04 | 1.35 | [image](screenshots/plan-light-1440.png) |
| light | `span.meta-pill` surface-parent | #f2f1ed / #f2f1ed | 1.00 | 0.00 | [image](screenshots/plan-light-1440.png) |
| light | `span.concept-pill` surface-parent | #f2f1ed / #f2f1ed | 1.00 | 0.00 | [image](screenshots/plan-light-1440.png) |
| light | `#attempt-answer` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/practice-light-1440.png) |
| light | `#attempt-answer` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/practice-light-1440.png) |
| light | `#attempt-work` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/practice-light-1440.png) |
| light | `#attempt-work` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/practice-light-1440.png) |
| light | `div.reasoning-chip` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/practice-light-1440.png) |
| light | `div.reasoning-chip` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/practice-light-1440.png) |
| light | `#need-help-btn` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/practice-light-1440.png) |
| light | `#need-help-btn` border-surface | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/practice-light-1440.png) |
| light | `#request-hint` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/practice-light-1440.png) |
| light | `#request-hint` border-surface | #dedfe3 / #e9eaed | 1.11 | 3.31 | [image](screenshots/practice-light-1440.png) |
| light | `#need-help-btn` border-surface | #e5e5e5 / #ffffff | 1.26 | 7.81 | [image](screenshots/practice-light-1440.png) |
| light | `#diagnostic-response` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/diagnostic-light-1440.png) |
| light | `#diagnostic-response` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/diagnostic-light-1440.png) |
| light | `section.result-summary` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/feedback-correct-light-1440.png) |
| light | `div.outcome-badge.independent` surface-parent | #dfefe4 / #f5f5f5 | 1.09 | 3.99 | [image](screenshots/feedback-correct-light-1440.png) |
| light | `section.spaced-review-card` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/spaced-review-light-1440.png) |
| light | `span.grounding-badge.partial_source` surface-parent | #e2eef5 / #f5f5f5 | 1.08 | 3.22 | [image](screenshots/spaced-review-light-1440.png) |
| light | `article.chat-message.chat-user` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/question-thread-light-1440.png) |
| light | `form.chat-composer` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/question-thread-light-1440.png) |
| light | `form.chat-composer` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/question-thread-light-1440.png) |
| light | `button.` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/question-thread-light-1440.png) |
| light | `#struggle` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/language-editor-light-1440.png) |
| light | `#context` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/language-editor-light-1440.png) |
| light | `#preferred-language` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/language-editor-light-1440.png) |
| light | `div.account-menu` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/account-menu-light-1440.png) |
| light | `div.account-menu` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/account-menu-light-1440.png) |
| light | `div.checkpoint-menu` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/export-menu-light-1440.png) |
| light | `div.checkpoint-menu` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/export-menu-light-1440.png) |
| light | `div.library-search` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/library-populated-light-1440.png) |
| light | `button.active` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/library-populated-light-1440.png) |
| light | `b.` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/library-populated-light-1440.png) |
| light | `button.rail-button.motion-icon-button.selected` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/library-populated-light-1440.png) |
| light | `#live-status` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/library-error-light-1440.png) |
| light | `#live-activity-date` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/activity-light-1440.png) |
| light | `#live-activity-date` border-surface | #dedfe3 / #f5f5f5 | 1.22 | 6.63 | [image](screenshots/activity-light-1440.png) |
| light | `#all-activity-dates` surface-parent | #e9eaed / #ffffff | 1.20 | 6.30 | [image](screenshots/activity-light-1440.png) |
| light | `#all-activity-dates` border-surface | #dedfe3 / #e9eaed | 1.11 | 3.31 | [image](screenshots/activity-light-1440.png) |
| light | `button.activity-item.event-row.motion-icon-button` surface-parent | #f5f5f5 / #ffffff | 1.09 | 2.98 | [image](screenshots/activity-light-1440.png) |
| light | `div.operation-error` surface-parent | #f6e2e6 / #ffffff | 1.24 | 7.35 | [image](screenshots/error-row-light-1440.png) |
| light | `#retry-operation` surface-parent | #f5f5f5 / #f6e2e6 | 1.14 | 4.60 | [image](screenshots/error-row-light-1440.png) |
| light | `#reconcile-operation` surface-parent | #f5f5f5 / #f6e2e6 | 1.14 | 4.60 | [image](screenshots/error-row-light-1440.png) |
| light | `#edit-operation` surface-parent | #f5f5f5 / #f6e2e6 | 1.14 | 4.60 | [image](screenshots/error-row-light-1440.png) |
| light | `button.guest-theme.motion-symbol-button` surface-parent | #e6e7ea / #ffffff | 1.24 | 7.21 | [image](screenshots/guest-home-light-390.png) |
| light | `button.auth-button.login` surface-parent | #fbfbfb / #ffffff | 1.03 | 1.19 | [image](screenshots/guest-home-light-390.png) |
| light | `button.` surface-parent | #f1f1f1 / #ffffff | 1.13 | 4.19 | [image](screenshots/guest-home-light-390.png) |
| light | `aside.sidebar.closed` surface-parent | #ffffff / #ffffff | 1.00 | 0.00 | [image](screenshots/signed-home-light-390.png) |
| light | `button.checkpoint-trigger.motion-icon-button` surface-parent | #f4f4f4 / #ffffff | 1.10 | 3.28 | [image](screenshots/diagnostic-light-390.png) |
| light | `button.checkpoint-trigger.motion-icon-button` border-surface | #dedfe3 / #f4f4f4 | 1.21 | 6.34 | [image](screenshots/diagnostic-light-390.png) |
| dark | `#start-review-btn` surface-parent | #1f232a / #111315 | 1.18 | 7.04 | [image](screenshots/spaced-review-primary-hover-dark-1440.png) |
| dark | `#start-review-btn` surface-parent | #21272f / #111315 | 1.24 | 8.58 | [image](screenshots/spaced-review-primary-hover-dark-390.png) |
| dark | `button.existing-reference-row.motion-icon-button` surface-parent | #12232e / #111315 | 1.16 | 6.66 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `b.` surface-parent | #111315 / #12232e | 1.16 | 6.66 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `button.existing-reference-row.motion-icon-button` surface-parent | #111315 / #111315 | 1.00 | 0.00 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `b.` surface-parent | #111315 / #111315 | 1.00 | 0.00 | [image](screenshots/source-picker-dark-1440.png) |
| dark | `#start-review-btn` surface-parent | #1a1b1f / #111315 | 1.08 | 3.76 | [image](screenshots/spaced-review-primary-hover-dark-1440.png) |
| light | `button.existing-reference-row.motion-icon-button` surface-parent | #e2eef5 / #f5f5f5 | 1.08 | 3.22 | [image](screenshots/source-picker-light-1440.png) |
| light | `b.` surface-parent | #f5f5f5 / #e2eef5 | 1.08 | 3.22 | [image](screenshots/source-picker-light-1440.png) |
| light | `button.existing-reference-row.motion-icon-button` surface-parent | #f5f5f5 / #f5f5f5 | 1.00 | 0.00 | [image](screenshots/source-picker-light-1440.png) |
| light | `b.` surface-parent | #f5f5f5 / #f5f5f5 | 1.00 | 0.00 | [image](screenshots/source-picker-light-1440.png) |
| light | `#start-review-btn` surface-parent | #e9eaed / #f5f5f5 | 1.10 | 3.33 | [image](screenshots/spaced-review-primary-hover-light-1440.png) |

For required form/control boundaries, propose dark #89919d or light #767676 and verify >=3:1 against both adjacent surfaces. For hierarchy-only surfaces, retain the approved true-black base and use a thin boundary before adding another material. Identical nested backgrounds are often intentional and should not all be changed.

## All axe violations (deduplicated nodes)

| Theme | Rule | Impact | Selector | Evidence |
|---|---|---|---|---|
| dark | aria-prohibited-attr | serious | `['.guest-notebook']` | [image](screenshots/guest-home-dark-1440.png) |
| light | aria-prohibited-attr | serious | `['.guest-notebook']` | [image](screenshots/guest-home-light-1440.png) |
| light | color-contrast | serious | `['.back']` | [image](screenshots/login-light-1440.png) |
| light | color-contrast | serious | `['.context-source > span:nth-child(2)']` | [image](screenshots/signed-home-light-1440.png) |
| light | color-contrast | serious | `['#correct-observation-btn']` | [image](screenshots/signed-home-light-1440.png) |
| light | color-contrast | serious | `['.menu > small']` | [image](screenshots/plus-menu-light-1440.png) |
| light | color-contrast | serious | `['#start-review-btn']` | [image](screenshots/spaced-review-light-1440.png) |
| light | color-contrast | serious | `['#skip-review-btn']` | [image](screenshots/spaced-review-light-1440.png) |
| light | color-contrast | serious | `['#library-add-reference']` | [image](screenshots/library-populated-light-1440.png) |

Full failure summaries and every state occurrence are in data/axe.json and data/deduplicated-findings.json. Axe incomplete color checks are not passes.

## Text, focus, touch and motion

190 deduplicated small-text/touch-type observations and 216 sub-44px target candidates are in data/deduplicated-findings.json. Some are nested SVG drawings rather than actual hit areas: inspect the enclosing button before treating as a touch failure.

Up to 40 Tab stops per screen, active labels, outline and shadow are in data/focus.json. Focus screenshots show the endpoint, not every focused element. A missing outline may have a box-shadow alternative; weak/missing rings require comparison against neighbors. Reduced-motion screenshots verify a rendering state, not vestibular safety or measured frame rate. Hover companions cover captured controls; not every icon animation is independently performance-tested.

## Design improvements - quick wins

1. Restore contrast through shared light-theme muted/secondary and input-placeholder tokens using measured failures above. Keep Inter, existing hierarchy and true-black dark canvas. Expected effect: labels, source pills and status copy readable without redesign.
2. Give necessary input/control borders >=3:1 contrast. Use the boundary proposal above, with explicit hover/selected geometry or icon/text confirmation rather than relying on small surface shifts. Expected effect: forms and selected references become distinguishable.
3. Make keyboard focus visible on textarea/input and every icon action: proposed `2px solid #91d7ff` dark and `2px solid #215a7b` light, offset 3px; validate contrast against each local neighbor. Keep pointer-focus suppression where approved. Expected effect: reliable keyboard location.
4. At touch widths raise prose below 16px to 16px/1.5 and metadata below 12px to 12px/1.4. Use 44px minimum enclosing button hit areas, not enlarged SVG drawings. Expected effect: fewer tiny labels and mistaps.
5. Bring the repair worksheet into the first useful reading viewport by collapsing repeated lesson explanation above it (proposed 16px top gap and an accessible View lesson disclosure). See repair screenshots. Keep equation lining numerals/shared baseline and crimson annotation unchanged.

## Larger improvements

- Consolidate source/context/lesson metadata into a consistent semantic row and maintain H1 -> H2 hierarchy; axe heading findings identify exact screens.
- Review focus restoration and hidden/inert controls across modal/panel transitions. Keep closing path and origin consistent; respect reduced motion without removing feedback.
- Use local announced waiting/error rows; preserve text + icon for errors and Step/Check this sign for equation annotation. Those labels help avoid color-only meaning. Selected/active states and hover need semantic state checks beyond numerical color deltas.
- Add a deliberately long-content and 200% zoom follow-up audit; do not infer robust truncation/reflow from these short synthetic fixtures.

## Owner decisions to reconsider

- The full first-screen Home divider/spacing is owner-approved V09. At 360x640 it may add scrolling and dilute density; do not remove it without approval. Compare home-360 screenshots.
- True black and one translucent material are retained. Do not solve weak control separation by adding stacked glass or a new decorative palette.
- Crimson equation annotation, icy-blue accents, orange Submit, green Save and colored format/image icons reflect existing owner decisions. Contrast can be corrected without replacing those meanings. List weak combinations as proposals, not applied redesign.

## Proposed token table - implementation follow-up only

| Scope | Old value/source | Dark proposal | Light proposal | Rationale |
|---|---|---|---|---|
| Primary ink | See computed per-screen tokens in contrast.json | #ffffff | #16181b | Preserve neutral readable body |
| Muted text | Measured failing muted pairs | #b8c0cc | #525866 | Raise secondary-text contrast on base/surfaces |
| Faint/placeholder | Measured failing placeholder pairs | #a9b2c0 at opacity 1 | #62656c at opacity 1 | Avoid compounded alpha |
| Required control border | Measured border/surface candidates | #89919d | #767676 | Target >=3:1; check both sides |
| Keyboard ring | Per-control computed outline/shadow | #91d7ff, 2px, offset 3px | #215a7b, 2px, offset 3px | Separate pointer and keyboard states |
| Touch prose/metadata | Size entries in findings JSON | 16px/1.5 and min12px metadata | Same | Readability at 390/360 widths |

Exact old RGB values and passing per-backdrop replacement ratios appear in the failure table. This table is a proposed mapping, not evidence that a global replacement passes every material.

### Follow-up prompt

> Implement only the confirmed readability fixes from this report after reading the three handoff documents and actual cascade. Preserve V01-V09 and owner colors/materials. Start with light-theme foreground/placeholder contrast, required control boundaries, keyboard rings and touch type. Use the measured old -> proposed foreground pairs and rerun the state matrix; do not apply candidate surface warnings blindly or alter unrelated backend behavior.

## Not verified / limitations

- No real model, account, Google/OAuth, transcription, OCR or external network integrations; fixture response quality is not AI quality.
- No real touch device/virtual keyboard, screen reader, OS forced colors, zoom or comprehensive color-blindness simulation.
- Gradient/notebook text-over-art and blurred overlapping materials need pixel-level sampling; ancestor compositing alone cannot certify them.
- Color-only conveyance requires manual semantic review. Error and equation annotation have text labels; untested icon/selected states are not certified.
- See data/browser-errors.json and rows marked INCOMPLETE for capture or walkthrough gaps. The final dedicated walkthrough trace passes in both themes. Earlier matrix-harness interaction warnings remain recorded separately; they do not invalidate successfully saved screenshots/DOM measurements. Some optional hover attempts failed and are not blanket passes.
- Attachment chips, export icons and worksheets only count as captured if their actual selectors/content appear; absent states remain gaps rather than simulated pixels.

## Color-only and similar-color interpretation

- Equation highlight has Step labels, Check this sign text and a highlighted token: it does not rely on crimson alone. Do not remove those non-color cues.
- Error rows include written failure text; waiting rows include an operation label. DOM role/aria-live/busy effectiveness still needs assistive-technology testing; visual presence alone does not prove announcement.
- The selected-reference row says Selected versus Select and exposes pressed state; selection is not conveyed solely by a tiny surface-color shift. Supplemental source-picker screenshots include both rows.
- Save?/Saved text distinguishes dirty state from saved state. Disabled Saved is measured but should remain identifiable without making it appear actionable.
- Active stage uses an underline as well as color; ensure current-stage semantics are announced. Hover colors are feedback, not the sole indication that a control exists.
- Borders near 1:1 must only be raised where they identify a control. Same-color nested lesson surfaces are intentional candidates, not automatic defects.

## Concrete follow-up token pairs (proposed, not applied)

| Control | Dark old -> proposed | Light old -> proposed | Proposed light ratio |
|---|---|---|---:|
| Add reference / review buttons | Existing #242c37 fill retained; readable ink retained | #202124 on #242c37 -> #202124 on #e9eaed | 13.38:1 |
| Source-reference pill | Existing dark fill; proposed #b8c0cc ink if needed | #62656c on #242c37 -> #202124 on #e9eaed | 13.38:1 |
| Correction action | Existing dark treatment retained | #215a7b on #242c37 -> #215a7b on #e9eaed | 6.21:1 |
| Back to learning | Existing dark muted text retained | #a6b1c0 on #fff -> #525866 on #fff | 7.13:1 |
| Placeholder | #757575 -> #a9b2c0 on #111315 | #757575 -> #62656c on #f5f5f5 | 5.35:1 |

The proposed dark placeholder ratio is 8.70:1. Apply through existing theme tokens/scoped rules, not broad inline overrides. No color substitution was applied.

## Final capture and runtime verification

- All 188 requested state/theme/width rows have screenshot/DOM/axe records (31 states at three widths in each theme, plus the two short Home captures). Supplemental hover records are extra, not additional requested-state passes.
- Final dedicated walkthrough trace: both themes completed; all 13 requested sequence steps passed per theme.
- Primary rest/hover pairs: plan, practice, repair and spaced review in both themes at all three main widths. Other hover attempts have explicit interaction warnings; not every icon animation is certified.
- Practice screenshots include the synthetic work.md attachment chip. Repair screenshots show the validated highlighted plus sign in the V04 worksheet.
- Cleanup: temporary review server stopped, temporary SQLite files removed, no review browser process left running. Production server and signed-in browser were not used or stopped.

## Process and preservation proof

See data/git-status-before.txt, data/git-status-after.txt, data/preservation.json and data/cleanup.json. Existing workspace changes predate this audit. Only the new .ui_review evidence directory is allowed to differ.

### Additional boundary count and preservation detail

Text/icon failing-pair totals above do not include all decorative borders. Required-control boundary candidates below 3:1: {'dark': 18, 'light': 17} (deduplicated selector + colors). These remain candidates until the boundary's role in identification and alternative cues are checked; they are separate from the <1.3 surface-similarity flags. Every measured border pair and ratio remains in contrast.json.

Git status before/after entries are identical; the evidence directory is ignored/unlisted by the current status configuration. All 144 protected source/document/asset hashes match. Full status snapshots are included rather than claiming this previously modified working tree is clean.
