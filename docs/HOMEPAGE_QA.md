# Homepage revision QA, 25 October 2026

## Latest: compact submit and larger title

The submit circle is 44px, with a centered 22px SVG arrow and the existing accessible submit name. The desktop title now scales to 128px; phone and short-screen variants are larger too. The pattern disclosure remains below the first screen. Pointer-triggered summary focus has no blue outline; keyboard focus remains available. The session-code input has no interior border/shadow.

**44 browser checks pass** with no browser JavaScript errors, including exact circle/arrow centering, larger title, no pointer outline, borderless session-code field, initial action visibility and instant open/jump at five sizes. Existing Python/AppTest results from the preceding revision remain 46 passes; no Python behavior changed in this CSS/JS refinement. [Current browser evidence](homepage-qa/revision4/interaction-checks.json); [desktop](screenshots/homepage-v4-desktop.png), [phone](screenshots/homepage-v4-mobile.png), [session code](screenshots/homepage-v4-session.png). Earlier sections below record historical designs and test counts.

## Latest: five-point control correction

Implemented the clarified controls: filled rounded Tailor button with no arrow; circular ↑ submit at the right with its accessible name preserved; “Your learning pattern” always present below the first viewport and independently openable; instant Tailor open/scroll; non-editable language, starting-point and tone choices; no interior input border/shadow. The goal and optional interest/context text fields stay editable. Native outer focus feedback remains.

The 46 existing tests and 39 browser checks pass. Checks cover selection by pointer, inability to type a new choice, no inner choice-input borders, direct disclosure opening, goal retention, preview updates, keyboard operation, motion/reduced motion, and initial action visibility and instant jumps at five viewport sizes. Current screenshots: [homepage](screenshots/homepage-v3-desktop.png), [phone](screenshots/homepage-v3-mobile.png), [preferences](screenshots/homepage-v3-preferences.png), [phone preferences](screenshots/homepage-v3-mobile-preferences.png). Previous revision sections below are historical, especially their rule hiding the closed panel.

The runtime now waits for Streamlit's sibling widget batches before initializing. Choice inputs are kept read-only when React remounts them. No inference calls, push, deployment or credential changes were needed.

An instant-jump race was caught by the browser check: the collapsed section's old scroll limit could stop the jump short. The correction observes both the panel and its content ancestor until the actual target position is reached, and is cancelled by manual scrolling. It does not depend on the animation clock. The independent evidence-only reviewer found no remaining supported failure against the five clarified requirements after the 39-pass rerun. Its minor caption readability finding was addressed by setting the caption text color explicitly.

## Latest: revision 2

The owner's annotated feedback is implemented: pause button and starter-course fragment removed, top spacing reduced, both actions inside the resized goal box, optional preferences initially hidden, and a wider two-column preferences/preview layout. Closing the panel restores focus to the CTA. Phone layouts stack the columns. The example is explicitly local sample content; selected language, starting point, tone and optional interests/context update the preview without inference. User text is HTML-escaped.

**46 existing tests and 26 browser checks pass.** The checks include both actions visible without scrolling at 1440x900, 1280x630, 1920x950, 390x844 and 390x640; no overflow at five widths; CTA open/scroll/close/keyboard behavior; a side-by-side preview; and preserved goal text. The retired saved pause flag cannot stop the new background. Motion has larger travel and a shorter 16-second period, and still stops while typing/hidden/reduced motion.

Current screenshots: [homepage](screenshots/homepage-v2-desktop.png), [phone](screenshots/homepage-v2-mobile.png), [expanded preferences](screenshots/homepage-v2-preferences.png). Evidence folders are `homepage-qa/revision2-pass1` and `homepage-qa/revision2-pass2`. The first report detects `desktop.idleMotion=true`, reports no console/network failures or axe violations, and confirms reduced-motion hidden text = 0 / moving = false. The existing slow-network startup and layout-shift limits remain open.

Both screenshot passes are complete. The fresh critic could not run because the agent service returned a usage limit; the revision received an explicitly labelled [self-review](homepage-qa/revision2-pass2/review.md), not an independent or award-level sign-off. The final report also detects idle motion, no errors/failures/axe violations and reduced-motion parity. Its throttled mobile startup/scroll performance remains below target and is recorded in the review.

## Earlier revision evidence

The material below records the previous layout, including its now-removed pause button. It does not describe the latest control placement.

Implemented the owner's supplied references with the awwwards and apple-design workflows. The concept is two slow blue/crimson currents framing a still black learning workspace. Existing Streamlit, native form widgets, bundled GSAP and a scoped Lenis adapter preserve the tutor workflow. No inference calls were made for this revision.

## Verified behavior

- Existing offline and Streamlit AppTest suite: **46 passed**.
- [19 browser interaction checks](homepage-qa/pass2/interaction-checks.json): motion at rest, pause/resume and reload persistence, stop while writing, open/focus/scroll preferences, preserve the typed goal across preference updates, manual close, keyboard reopen, and reduced motion. No horizontal overflow at 390, 768, 1024, 1440 and 1920 px. No JavaScript errors.
- Two complete screenshot passes: desktop, phone, reduced motion, keyboard focus, hover. Independent fresh critics review each pass. The final 17-image set was inspected directly and as a contact sheet.
- [Second critic](homepage-qa/pass2/critic.md): internal weighted score 6.50/10, with Responsive 8 and remaining startup/metadata limits below the skill's broader award-site target. No award-level claim is made.
- [Final automated report](homepage-qa/pass2/report.json): no console errors or failed requests; no overflow; reduced-motion hidden text = 0 and moving = false; no axe violations; visible keyboard focus and skip link first.
- The generic report's `idleMotion=false` is not used to claim no movement: the targeted check samples the curve transforms and confirms movement at rest and exact stability while paused/writing/reduced. Generic hover classification flags the motion button as color-only, but the inspected pair shows its whole rectangular background filling on hover; the primary submit also moves and gains a two-color shadow.
- Contrast pairs: main ink/black 19.57:1; muted text/control surface 10.05:1; boundary/control surface 5.79:1; primary label/fill 19.57:1. Text over perimeter gradients was visually inspected in desktop, phone and reduced-motion captures.

Screenshots: [desktop](screenshots/homepage-desktop.png), [phone](screenshots/homepage-mobile.png), [expanded preferences](screenshots/homepage-preferences.png).

## Changes after first review

Kept the decorative layer behind all content, removed the overlapping framework homepage header, placed the stylesheet before the content, labelled the starter-course scope, removed the small heading permalink, and added a filled hover treatment to the motion control. The disclosure uses native summary activation so its visual arrow, accessible state and fields agree. Scrolling waits for the expanded content's height to settle before measuring the target.

The static HTML sanitizer strips SVG and rejects some minified JavaScript comparisons as markup. Curves therefore use local SVG data backgrounds; a small bootstrap decodes only the checked-in trusted JS bundle. No user input enters executable HTML. Motion libraries are bundled locally; there is no runtime CDN dependency. Reduced transparency or higher contrast requests remove the translucent material.

## Measured limits

This is a local Streamlit prototype, not a claim of an award-ready or production site. The [static audit](homepage-qa/pass2/audit.txt) has four failures and seven warnings: its server shell lacks description/h1/main, unknown paths return 200, social/canonical metadata is absent, and the generic asset estimate counts framework font resources. The hydrated page has its heading and main landmark. A public server-rendered shell, metadata, and proper routing are separate hosting/frontend architecture work.

Cold-load performance misses the awwwards targets. Final report: desktop LCP 728 ms, CLS 0.488; simulated slow-4G/4x-CPU phone LCP 13,532 ms, CLS 0.286. Scroll samples were 60/61 FPS in headless software rendering; these are not real-device guarantees. The page needs startup/layout-shift optimization before public mobile deployment. This revision does not mark those performance gates as passed.

No artwork, testimonials, adoption counts or learning-outcome claims were added. The supplied third image informed color only. Manual learner feedback and the earlier PDF-upload/hosting checks remain open.

Run the app normally with its existing Python environment. Optional browser checks are documented in [frontend_tools](../frontend_tools/README.md). Future frontend skill preferences are recorded in [AGENTS.md](../AGENTS.md); the design system and intentional exceptions are in [DESIGN.md](../DESIGN.md).
