# Personal Learning interface study

Created 27 October 2026 after inspecting the current integrated Home and lesson screens with the optional learning-pattern panel. This is a separate static prototype. Production `app/web/`, Python backend, databases and API behavior were not edited for this proposal.

Open http://127.0.0.1:8766/ while the local preview server is running.

Restart from the repository root:

```powershell
.\app\.venv\Scripts\python.exe -m http.server 8766 --bind 127.0.0.1 --directory design_review/winner-concept
```

Try the example goal buttons, plus menu, sample course, stage tabs, Personalize, question branches, Library, Activity and theme icon. All settings are held in memory and reset on reload. The file picker only displays a filename; link input only displays a URL label. Neither reads or uploads a resource. Sample answers are prewritten and explicitly labeled. Markdown export downloads a local sample; PDF/Word actions explain that this standalone study is not connected to production exports.

## 1. Behavior or backend work if integrated

- **Explain simply / Show an example:** new explicit lesson actions would need request handling and instructions for a concise simplification or second example. Reuse the current lesson/course context; do not automatically broaden data sent to AI. Integrating these actions requires the owner's decision. No AI is connected in this study.
- **Clickable learning stages:** display uses existing course stage/objective data. Navigation must preserve production approval, assessment and progression gates. This prototype lets reviewers inspect stages freely; that freedom must not bypass real workflow checks. No database redesign is proposed.
- **Drag/drop intake:** connect to the existing file resource flow and show real extraction/transcription status. Upload and paste-link are existing features. Video still depends on configured transcription capabilities; new visual affordances do not make an unavailable provider work.

No wholesale backend replacement is proposed. Authentication, account ownership, existing course history, global/course preference scope, Library, Activity, practice and exports should retain their current implementation boundaries.

## 2. Interface changes using existing behavior

- More deliberate reading width and spacing, readable worked-example surface and compact question composer.
- Stage position made visible instead of inferred from action buttons alone.
- Personalize moved to the workspace header; the panel keeps textareas for struggle/style and text inputs for interests/context. The existing typed language override remains the only disclosure for language.
- Small labels distinguish course-specific settings from global settings. New-learning view keeps only the universal fields, matching the current app.
- Existing file/link actions reorganized into one popover, with a drop target. Format choices retain distinct icons/colors.
- Existing sidebar course/question hierarchy, Library search and Activity date filtering kept, with consistent hover, focus and theme styling. Library/Activity hide the side panels.

## 3. New visible additions

- Three editable goal starters: Understand algebra, Prepare for an exam, Learn from my notes. They fill the composer without submitting.
- Plan / Learn / Practice / Review stage strip and a sample lesson counter.
- Compact Explain simply and Show an example shortcuts; Give me practice exposes the current practice concept beside them.
- File drop target within the attachment popover.

Question branches, saved conversations, Library, Activity/date search, light/dark themes, learning-pattern save/discard, reasoning uploads and checkpoint downloads already exist in the current application. They are not newly invented backend features here.

## Screenshots

- [Home, dark](screenshots/home-dark.png)
- [Lesson and text-based right panel, dark](screenshots/lesson-dark.png)
- [Lesson, light](screenshots/lesson-light.png)
- [Mobile, light](screenshots/mobile-light.png)

## Verification

- Inspected the current app using `frontend_tools/api-browser-fixture.py`, which uses temporary SQLite and deterministic tutoring fixtures. No human account/private records were inspected and no paid inference was invoked.
- `node design_review/winner-concept/check.cjs` passed the interactive controls, goal fill/Enter, reference label, stage/practice navigation, text input types, preference save/discard/language override, sidebar questions, local question draft, Library search/empty state and Activity filtering.
- No page errors and no requests outside the preview server during the browser checks. Axe WCAG A/AA checks reported zero violations on the lesson screen in dark and light themes. This automated result is not a comprehensive accessibility certification.
- No horizontal overflow at 1440, 1024, 390 and 360px widths. Reduced-motion mobile rendering checked. Desktop/mobile screenshots visually inspected and independently reviewed twice; attachment menu positioning refined to avoid covering the heading and example prompts.
- The prototype is intentionally still while reading. Hover, press and keyboard-focus feedback remain available. Local font license is included as FONT-LICENSE.txt.

The earlier winner research is at [docs/research/nebius-winners/README.md](../../docs/research/nebius-winners/README.md). Those patterns inform this proposal; it is not a copy of their branding or evidence of improved learning outcomes.
