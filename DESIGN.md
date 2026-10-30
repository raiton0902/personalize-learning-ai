# Personal Learning design direction

## Learning progress revision, 27 October 2026

Submitting a new goal opens the learning window immediately and shows the submitted goal with the existing Thinking animation. Other async navigation keeps its current screen until data arrives. Similar goals offer Open learning or Create separately. A compact Review lessons and tests control opens a read-only saved lesson/test view, with Return to current step. Preserve both themes, keyboard focus and reduced motion. Automatic language follows the user's input; explicit language overrides remain available.


## Latest size and focus refinement, 25 October 2026

Submit is a 44px circle with a geometrically centered 22px up-arrow drawing; the accessible submit label remains intact. The desktop title scales up to 128px, with larger phone and short-screen variants that still keep both initial actions visible. The introduction's first-viewport minimum keeps the learning-pattern section below the fold while the larger title uses more of the former empty gap. Pointer activation of Tailor suppresses the summary's blue focus outline; keyboard activation and subsequent keyboard use retain focus feedback. Session-code inputs use the same borderless interior as the other text fields.

## Latest control correction, 25 October 2026

The owner's explicit five-point clarification supersedes hidden preferences and the earlier CTA treatment. Tailor my learning is a filled rounded rectangle without an arrow. Submission is a circular up-arrow icon at the goal box's right; its accessible name stays “Build my learning plan.” The initial goal area occupies the first viewport; the collapsed “Your learning pattern” disclosure is always rendered below it and opens normally without the CTA. Tailor opens it and uses an instant native jump after its content mounts. Do not hide a closed panel.

Language, starting point and tone have fixed choices: filtering/typing is disabled and their input elements are read-only, with a transparent caret and no interior border or shadow. Keep an outer focus indication. The interest and course-context fields remain free text because they have no fixed options. The right preview and the existing teaching flow stay in place. Initialization waits for Streamlit's separately committed widgets before binding interactions.

## Homepage revision 2, 25 October 2026

Latest owner feedback supersedes the prior composition: remove the pause button and starter-course fragment; reduce top padding; keep both actions inside the goal surface and visible on arrival. The optional section is completely hidden until its CTA opens it. Use a full-width closeable preferences panel: large settings on the left, an honest example lesson and live selected-setup summary on the right. Stack these on phones. The preview uses local content and makes no inference request.

Motion now has a 16-second shared phase with approximately 85px horizontal and 40px vertical travel, rather than the nearly imperceptible 38-second/20px drift. It ignores the retired saved pause flag, stops while writing or hidden, and respects reduced-motion preferences. No pause control is rendered, as explicitly requested. The black reading center remains still. The native disclosure and focus restoration retain keyboard access.

Fit contract: both “Tailor my learning” and “Build my learning plan” fit on initial view at 1440x900, 1280x630, 1920x950, 390x844 and 390x640. Textarea height is 160px; display type remains fluid and larger than the original app. Goal surface and preferences share the main reading width. Avoid filler on the right: the teaching example is labelled and the setup reflects actual choices. User text is HTML-escaped.

## Homepage revision, 25 October 2026

The owner now explicitly requests larger display type and goal box, true #000000, a slightly transparent input surface, and animated red/blue gradients based on the supplied cool-blue/crimson image. Replace the previous green throughout. The optional controls should sit below a small CTA that opens and scrolls to them, with a normal closeable disclosure. Use awwwards and apple-design for frontend work from this point in this project; antislop stays in during mode. These are session/project instructions, not a change to global agent memory.

This explicit direction supersedes the earlier quiet-static/green palette. Red/blue gradients, translucent material, and idle motion are intentional owner-requested elements, rather than default decorations. The UI uses no anime characters or copied illustration assets.

### Brief and concepts

The homepage's job is to capture a learner's goal without overwhelming them. The audience and actual three-topic course remain unchanged.

| Territory | Concept and signature | Emotion / screenshot | Subject anchor | Originality / fit / feasibility / portability (lower portability is better) |
|---|---|---|---|
| Learning process | Two currents: cool understanding and a warm missing step frame the neutral goal; a disclosure settles into view. | Focused curiosity; a large goal surface between two peripheral currents. | The tutor separates what a learner understands from the missing step. | 4 / 5 / 5 / 2 |
| Mathematical material | Working margins: red annotations and blue working marks reveal a compact notebook. | Familiar concentration; an enlarged writing area with marginal marks. | The learner shows equation-solving steps. | 3 / 4 / 5 / 3 |
| Spatial focus | Quiet observatory: two distant light sources frame a central reading surface. | Calm depth; a black central plane surrounded by cool and warm edges. | The user requested a hyper-focused workspace. | 3 / 4 / 4 / 4 |

Choose **Two currents** because it connects the supplied color reference with the actual diagnosis-and-repair product, while keeping the primary task still and readable.

Idea: two different learning signals settle around one clear next step.
Metaphor: two currents meeting around a stable writing surface.
Signature: the red and blue peripheral strokes share a slow GSAP clock; choosing “Tailor my learning” opens the optional panel and scrolls directly to it.
Emotion: focused, slightly cinematic, immediately understandable.
Motion verb: drift and settle.
Screenshot: large white display text above a translucent goal surface, flanked by icy blue and crimson.

### System

Stack: existing Streamlit with native inputs/disclosure, authored CSS, bundled GSAP, and a scoped Lenis scroll adapter. No framework migration, invented routes, loader, or WebGL is needed for this homepage revision. Existing course stages are the inner-screen types. Keep the app's native cursor and skip link.

Palette: ground #000000; ink #F5F7FA; muted #B8C0CC; boundary #89919D; ice #91D7FF; crimson #ED3E65. The two accents come from the provided visual. The main button uses a neutral high-contrast fill; the colors belong to the perimeter and focus feedback. The input uses one translucent dark material; do not stack glass surfaces.

System sans-serif remains the type family: no new font download or font dependency. The display uses a larger fluid scale and tight tracking/leading; body text stays 16–18 px with comfortable leading. Homepage reading width grows to about 1200 px, while later tutoring screens retain their narrow measure. The box is intentionally larger than the old 110 px textarea. Rounded material surfaces have a 20–28 px radius; small controls use 8–12 px.

Homepage composition:

```text
Personal Learning                                      Pause motion

                 What would you like
                    to understand?
                     short subtitle

     blue current    [ large translucent goal box ]    red current
                     [ Build my learning plan    ]

                       Tailor my learning ↓

                 optional settings (closed until chosen)
                 saved session / privacy detail
```

Motion: one GSAP ticker owns a slow shared phase and Lenis updates; no separate animation-frame or scroll loops. Drift stays at the edges, pauses while writing and when the page is hidden, and has an explicit pause control. The CTA opens the native disclosure before scrolling, respects user interruption, and restores no scroll lock. Reduced motion makes the currents static and scroll immediate. Reduced transparency / higher contrast makes the goal surface solid. Focus/press feedback remains visible.

Genericness check: avoid a central glowing gradient orb, feature-card rows, decorative dots, and a full-screen looping texture. Use two lateral currents from the actual reference, a genuinely large input, and the goal/settings disclosure as the signature. No added marketing claims or fabricated statistics.

User direction, 25 October 2026: use Stitch as a reference for a simple, focused layout that is understandable on first sight, with few features on each screen and a contrasting dark theme. Apply antislop during building.

Implementation interpretation: a centered learning workspace, a large goal input on entry, and one primary action per stage. Secondary settings and progress live in expandable details. Keep course approval separate from teaching. Use ordinary text and familiar controls; no decorative illustrations, dashboards, gradients, or marketing sections.

Reading this as: a focused learning workspace for classmates reviewing algebra, in a dark, quiet visual language. ENERGY 1 / RHYTHM 2 / MOTION 1.

Palette: charcoal #111315 canvas, #1D2023 surfaces, #F4F4EF text, #BFC4C8 secondary text, and #D6EB98 accent for the next action. Accent text is #171B10. Borders/focus use #7F878D for discoverability. Dark is the user's explicit preference. System sans-serif keeps mathematical prose readable without external font requests. A narrow reading column and a small numbered course line are the repeated learning motif.

Use native accessible controls, visible keyboard focus, labels, and full-width mobile actions. The layout stays single-column; action groups wrap at narrow widths. Source, profile, progress, and export are available on demand rather than competing with the current problem. No motion beyond native hover/focus and the request spinner.

Reference inspected: https://stitch.withgoogle.com/ . Its visible accessibility tree exposes a prominent prompt box and secondary options. Browser screenshot capture of the reference was unavailable, so no pixel-level match is claimed. This is an interpretation of the user's direction, not a copy of Google branding or assets.
