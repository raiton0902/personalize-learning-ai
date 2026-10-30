# Homepage checks

The app runs through Python as before. Node is only needed to refresh the bundled motion libraries or run these browser checks.

From this folder:

```powershell
npm ci
node homepage-check.mjs
```

Start the local app at http://127.0.0.1:8502 first. The check uses installed Chrome in an isolated headless session. Its 44 checks cover motion, the rounded Tailor button, the compact centered-arrow submit, the larger title, pointer focus treatment, the always-rendered collapsed learning-pattern section, direct opening, instant jumps across five viewport sizes, non-editable choices, borderless inputs including session code, preview updates, goal retention, reduced motion, overflow, and both actions above the fold. It makes no model requests and creates no learner session.

The checked-in `app/frontend/vendor/` files let the app run without npm or a runtime CDN. Only trusted project files enter the executable HTML. User inputs are rendered through native Streamlit controls and never enter that bundle.
