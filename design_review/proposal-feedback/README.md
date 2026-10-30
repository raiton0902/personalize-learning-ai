# Proposal feedback interface sample

Frontend sample of [ui_improvement_proposal.md](../../ui_improvement_proposal.md), suggestions1–3. Built28 October2026. Open **http://127.0.0.1:8769/** while its static server runs.

```powershell
python -m http.server 8769 --bind 127.0.0.1 --directory design_review/proposal-feedback
node design_review/proposal-feedback/check.cjs
```

## Try it

- Starts on a filled sample practice form. Submit answer shows Checking your answer… beside the action, then fixed sample feedback. Answer, reasoning and attachment metadata stay intact.
- **Preview states** configures the next action's outcome: Success, Failure before sending, or Completion unknown. Enable Keep the waiting state visible to inspect the indicator; Finish preview wait resolves the local demo. These controls live in the preview bar, not the proposed learner flow.
- Choose Teach / Practice / Submit / Help in Preview states to reach each action. Each has a distinct label: Preparing your lesson… / Writing a practice problem… / Checking your answer… / Preparing help….
- Learning controls are locked while waiting. The waiting region is outside the inert form so it remains visible to accessibility APIs. No navigation-unlocking feature or backend concurrency change is implemented.
- Failure before sending offers Try again and Edit answer/question or Back to learning. Retry is local and resolves to simulated success. Completion unknown offers Check saved result and Edit instead; its dialog explains that production would reconcile saved state. Nothing is submitted to a server.
- Home retains typed goal intents, removable reference chip and searchable existing-reference picker. Selecting/removing a reference preserves the typed goal.
- Preview states includes whole-library empty, empty Notes category, library fetch error, normal library, empty Activity and normal Activity. Keyword search has its own no-match recovery. Older Activity dates are described as outside the loaded sample range rather than proof of no historical activity.
- Pattern inputs stay free text, default language Automatic, Save?/Saved guard preserved. Dark/light, reduced motion, aligned equation numerals and mobile navigation remain.
- Owner Home refinement: title centered with no subtitle or New learning header label; no Plan tick. The first-screen divider meets the viewport bottom and the continuation section is reached by scrolling. Practice help is a white/black Need help? button in both themes.

## Scope

No backend, provider, database, authentication integration, model-context change, paid call or deployment. No real upload/extraction occurs. All responses are fixed content, with no grading, durable help-use evidence or real-attempt diagnosis annotation. Proposal items4–5 remain deferred. Static sample data reset on reload.

This example copies the earlier step-repair shell to remain self-contained. Base load order is unchanged; `proposal.css` and `proposal.js` load last. They replace the course renderer and demo controls, add four operation states, and refine list emptiness. The earlier8768 example and actual8780 application remain separate.

## Verification

`check.cjs` tests all four waiting/failure/retry paths, readable status outside inert controls, preserved reasoning/attachments, unknown completion without unsafe retry, Enter/Shift+Enter, source selection/removal, four Library empty/error cases, Activity range messaging, six widths, themes, free-text panel and reduced motion. Owner refinements add exact four-size Home fold/centering, white help colors, tick/subtitle/header removal and continuation scrolling. Ten tested axe WCAG A/AA views reported zero violations; no page errors, external requests or mutation requests. Results: `verification.json`; images: `screenshots/`. These are isolated prototype checks, not a live backend or assistive-technology certification.

Latest correction: Plan icons are explicitly suppressed and relevant preview assets carry revision20261028-4 to refresh older browser files. Active Plan was checked with no tick; help capitalization is Need help?.
