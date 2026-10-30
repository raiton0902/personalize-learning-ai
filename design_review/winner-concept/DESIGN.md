# Separate learning workspace concept

27 October 2026. This is an interactive interface study, not an app integration.

Inspected the current integrated frontend on a temporary database with deterministic model fixtures: Home, lesson and open learning-pattern panel. Current screenshots live in ignored `app/local_results/interface-proposal/`. No private account was inspected and no paid inference was invoked.

Use the existing plain HTML/CSS/JavaScript stack for a self-contained static prototype. Do not import production scripts or call application APIs. Serve only this directory on 127.0.0.1:8766. Inter is copied locally from the app.

## Direction

- Audience: learners moving between a course, worked examples, practice and saved questions.
- Purpose: make the next learning step visible without increasing reading load.
- Concept: the same notebook, with clearer chapter markers. Stage navigation is the repeated visual motif, not decorative dashboards.
- Alternatives considered: source-first three-pane notebook (too many competing panels); chat-first screen (hides practice workflow); chapter-marker workspace (chosen because it exposes existing tutoring stages).
- Ground #000000, text #f5f5f5, muted #a4a6ad, surfaces #101114/#191a1e, boundary #2b2c33. Icy blue marks current learning stage, crimson marks a learning-specific gap or destructive action. Light theme uses white/off-white and darker accessible accent variants.
- Typography: existing Inter, body 14px, reading 16px, responsive title 32–44px. Sidebar 14px, panel fields 14px. Rounded controls, flat reading area, no background motion while signed in.
- ENERGY 1 / RHYTHM 2 / MOTION 1. Intentional still workspace. Microinteractions respond on hover/press; drawers use short interruptible CSS transitions, not sequential animation locks. Honor reduced motion.
- Right panel retains textareas for struggle/style and text inputs for interests/context. Only the existing language chooser opens a typed override. Global/local scope remains consistent with the current app.

## Functional boundary

Example goals fill the composer. Course navigation, plan/lesson/practice/review, question branches, source preview, file/link selection, Library search, Activity date filter, theme, sidebar/panel controls and dirty/save/discard states work locally with explicit sample content. No learner data, provider keys, API requests, remote file reads, transcription or AI calls are involved. Sample question submission records only the typed draft and labels that no AI reply was generated.

Implementation classification and source references are in README.md. Preserve the real app and its backend unchanged.
