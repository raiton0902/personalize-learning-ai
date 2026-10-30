# Workspace design preview

This standalone HTML preview does not change the Streamlit application or connect authentication, AI, URL retrieval, or file processing. Library records, activity, accounts, and lessons are illustrative.

Run from the repository root:

```powershell
.\app\.venv\Scripts\python.exe -m http.server 8765 --bind 127.0.0.1 --directory design_review
```

Open http://127.0.0.1:8765. Use Sign up → Preview signed-in experience. Do not use a real password.

- Guest: notebook illustration and theme button; no history.
- Signed in: still workspace, collapsible navigation, Library, Activity, two sample lessons, right learning-pattern panel, bottom-left account menu.
- Theme button switches directly between Light and Dark; new visits default to Dark. Only this browser preference is stored locally.
- All surfaces use locally bundled Inter and shared theme tokens. This is an alternative, not a claim that Inter is the current proprietary ChatGPT or Claude web sidebar font. Its license is included in fonts/LICENSE.txt.
- The icon rail contains Home, Library and Activity. Search remains in the navigation panel without a duplicate rail icon. Google sign-in includes a multicolor Google icon but remains a simulated authentication flow.

## Hairline notebook

`notebook.js` builds the open notebook and two reference slips using the unchanged Hairline engine. The active page lifts; on leaving, it settles back. The silhouette is highlighted, with dim interior rules. There is no source SVG to adopt.

The self-contained `hairline-notebook.html` uses the original, unchanged skill bench and engine. Open it with `?play=1` or press Play to review its tour: left page, right page, inner page, leave. Rules emphasized: fixed hit regions, bounded movement, one stroke highlight, composed rest, sleeping frame loop, discrete tweens, rounded solids, and no text in the drawing.

`look.mjs` passed frame bounds, read-out, console, settling, and response checks. The eight-view and motion sheets were visually inspected. The page silhouette, interior lines, and tucked reference slips remain visible at thumbnail size in both themes; no crossing or clipping was observed. Human judgement of the playback tour is still pending.

## Verification

Library now has local keyword search combined with its All/References/Notes filter. In this preview it searches the two sample records and their known sample content, not real uploaded documents. No AI is used. Activity has a native calendar/date input, exact-date matching, an empty state, and an All dates reset. Sample dates are October 24–25, 2026; real user-local activity storage is not connected.

Library row arrows are removed. Interface icons have bounded hover motions, except Add reference/upload and submit. The course/reference folder is rebuilt with Hairline as a rounded folder with staggered rising papers; other small interface icons retain simpler hover transforms. Reduced motion suppresses movement. `folder.js` builds `hairline-folder.html` with the unmodified Hairline bench and kernel. Its frame, read-out, console, settling and response checks passed; both the look and motion sheets were visually inspected. Tour: folder centre, upper papers, lower front, leave. Human judgement of the tour remains pending.

Additional check: `node frontend_tools/discovery-review-check.mjs`.

Run from the repository root:

```powershell
node frontend_tools/workspace-review-check.mjs
```

Checks cover guest-only illustration, theme switching, account menu, library filtering, activity-to-lesson navigation, mobile overflow, and page errors. Screenshots are written into this folder.
