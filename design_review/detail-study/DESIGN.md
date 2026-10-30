# Detailed interface preview

Scope: a separate local interface example of `docs/UI_UX_DETAIL_REVIEW.md`, with fixed algebra content and explicit simulated states. No production integration or framework migration. Plain HTML/CSS/JavaScript matches the current app and avoids a build/runtime dependency for a review artifact.

## Owner refinement, 27 October 2026

- Both sidebars slide in/out with a 280ms `ease-in-out` curve. Desktop space is updated once and reading/header position is animated with transforms; margins no longer animate per frame. Mobile/medium-width panels overlay. Exit surfaces remain rendered until motion finishes, become inert immediately on close, and can reverse from the current on-screen position. Reduced motion uses immediate visibility changes. Resizing cancels workspace interpolation rather than animating across responsive breakpoints. Scrims fade without moving text.
- UI/UX Pro Max implementation: 44px phone/coarse-pointer hit areas with non-overlapping spacing; 16px reading/input text on touch/small layouts; programmatic destination focus without blue inner input rectangles; field-linked/focused URL validation; hash routes containing only view/sample IDs, browser-history restoration and dirty-navigation protection. Filter/reading-position snapshots remain in memory, not in URLs or a new persistent learner store.
- Remove the visible Enter/Shift+Enter hint while preserving those keyboard actions.
- Match the existing application's filled, bordered checkpoint-download trigger, including its format popover.
- Dock stage navigation directly beneath the course name in a full-width workspace header. The earlier stages were based on the Q-AI workflow reference and review R18; their detached placement was a prototype spacing decision, not a copied floating component.
- Apply the owner's supplied icy-blue learning reference to the center only: blue active-stage underline, blue example label, cool outlined example/composer, centered worked steps and a blue Explain simply action with outlined companion actions. Keep both sidebars and their inputs unchanged. `learning.css` isolates this central treatment and supplies accessible light-theme colors.

## Brief and alternatives

The learner needs to understand one idea, ask about it, and recover when an action fails. Preserve the familiar icon rail, collapsible learning history, central reading area and free-text learning-pattern panel.

| Direction | Signature | Fit / feasibility / distinctiveness (1–5) |
|---|---|---|
| Lesson workbench | One continuous line from explanation to worked example to question; feedback appears where the result belongs. | 5 / 5 / 4 |
| Source desk | References occupy a persistent second column. | 3 / 4 / 3 |
| Conversation first | Everything becomes a message, including practice and preferences. | 3 / 4 / 2 |

Selected: lesson workbench. It preserves the tutoring workflow and exposes the review's interaction details without another broad redesign.

Idea: keep the learner's place through every action.
Metaphor: a workbook with a readable lesson and notes in its margin.
Signature: a submitted question stays visible while a small assistant-side Thinking row becomes a concise answer or a recoverable error.
Emotion: familiar, focused, predictable.
Motion verb: settle, within 120–180ms; no signed-in idle decoration.
Screenshot: worked algebra example beside the unchanged text-input pattern panel.

## System

- ENERGY 2, RHYTHM 2, MOTION 1. Still while reading; local press/hover/state motion only. Pending pulse marks an actual simulated operation and stops on completion. Reduced motion makes it static.
- Black #000000 ground, #111315 field surface, #ffffff primary text, #a9adb5 metadata, #292c31 boundaries. Icy blue #a5d9f4 marks the current learning step; crimson #ef7483 marks error/discard. Green only for a dirty Save? action. File-type marks retain semantic colors. Light theme uses #faf9f6 / #ffffff / #17191c / #646a73 with darkened semantic accents.
- Local licensed Inter throughout, matching the owner's chosen app font. 14px navigation/panel; 16px/1.75 reading; 36px/1.15 lesson heading; 48px new-goal heading. Equations use a serif italic variable, never raw Markdown/LaTeX delimiters.
- Rail 60px, history 248px (room for course identification), right panel 316px. Reading 680px with responsive 24–48px gutters. Right panel overlays below 1280px; drawer overlays below 800px. Below 600px the rail becomes navigation in the drawer, freeing reading width; theme is in the header. Library/Activity hide learning history and preferences; their mobile drawer contains navigation only.
- Fields 12px radius; composer 22px; popovers 12px; modal 20px; pills only for the owner's stacked unsaved-change buttons. One translucent material: modal backdrop. Solid reading surfaces.
- SVG line marks correspond to actual actions; no decorative sparkle/logo. Existing navigation is preserved. The AL avatar and all history/events are visibly covered by the persistent Sample content preview label.
- Shared menus: 244px width, 40px rows, 18px icons, 8px anchor gap, click-away, Escape/focus return, ArrowUp/Down, one open menu. No layout jump on opening.
- Loading: 28px row, 13px text, 8px dot/gap, 12px vertical space. Assistant-side placement. Local inline errors use 14px text/12px padding and retain drafts. No success toasts.

## Composition

```text
Preview label / state controls
Rail | History | Course title / Personalize | Learning pattern inputs
     | Course  | Plan / Learn / Practice / Review
     | Questions collapsed                 | Course struggle
     |         | Lesson title              | Global teaching style
     |         | Reference chip            | Global interests
     |         | Explanation + example     | Course context
     |         | Support / practice        | Language disclosure
Avatar         | Question composer         | Save? / Saved
```

Real extraction, provider generation, citations, cancellable jobs, safe retries and persistence are integration work. This study simulates waits/errors explicitly and does not present them as functioning backend services. Sample checkpoint downloads contain sample content only.
