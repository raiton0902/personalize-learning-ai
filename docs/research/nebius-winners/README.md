# UI patterns from earlier Nebius-sponsored winners

Reviewed 26 October 2026. Research only; no product UI or inference behavior changed.

## Verified award sources

- Q-AI: Nebius Prize winner at the September 2025 Internet of Agents event. Nebius's own event record: https://github.com/nebius/token-factory-cookbook/blob/main/community/events.md . Submission: https://lablab.ai/ai-hackathons/internet-of-agents/q-ai/q-ai-ai-platform-for-generating-data-sets . Live interface: https://qaigenerate.vercel.app/ .
- SynthesisOS: Runner Up Prizes at Enterprise Agents Hackathon by Emergence & Nebius, July 2026. Submission: https://devpost.com/software/synthesisos-qk04dt . Live interface: https://synthesisos.vercel.app/ . The public demo labels itself deterministic, with no API key; its UI is evidence of layout, not verification of live inference.
- Delivery Tracker: First Prize at the same Enterprise Agents event: https://devpost.com/software/delivery-tracker . Its project description was readable through search, but the direct browser hit a security verification screen. No screenshots or visual recommendations are attributed to this project.
- The current Nebius x NVIDIA Global AI Hackathon has no announced winners as of this review. Official rules schedule announcement around 11 January 2027: https://nebiusglobalaihackathon.devpost.com/rules . Earlier sponsored events are distinct competitions.

## Captured controls and proposed adaptations

These PNGs are actual browser screenshot clips at a 1440px desktop viewport, not generated mockups. They show the current public demos, which may have changed since judging. Source branding and UI belong to their owners. Recommendations are our interpretation; award pages do not establish that these controls caused the projects to win.

1. `qai-workflow.png`: compact stage navigation with a clear active state. Adapt to Plan / Learn / Practice / Review, with Lesson 2 of 6 and only valid transitions enabled. Reuse existing course stage data; no extra model input needed.
2. `qai-upload.png`: file drop target with accepted formats and an explicit Select File action. Adapt inside our existing attachment popover rather than adding a second large homepage panel. Include Paste a link and honest availability/errors for video transcription. UI work needs no AI; reading/transcription may use the existing providers and their configured limits.
3. `synthesis-examples.png`: example prompts immediately below the input. Adapt to three short learner goals such as Understand algebra / Prepare for an exam / Learn from my notes. Clicking should populate the editable goal and focus the composer, never silently submit it. No AI is needed for suggestions or filling.
4. `qai-output-choices.png`: recognizable icons and a clear selected state for output choices. Adapt as compact Explain / Show an example / Give me practice actions near a lesson, preserving the existing teaching/practice workflow. Do not add Q-AI's dense technical descriptions. Interface work needs no new model context; new generation behavior remains subject to the owner's approval.

Suggested order: stage indicator, attachment discoverability, optional example prompts, then compact lesson actions. Keep Inter, the existing black/icy-blue/crimson direction, light/dark variants and reduced motion. Use hover/focus feedback for whole controls. Do not copy the example sites' branding, oversized upload panel, or low-contrast labels.

## Verification boundary

Opened both live demos and visually inspected each captured clip. Used synthetic public text only to advance Q-AI from Upload to Configure. Did not click Start AI Analysis or Synthesize, upload private files, sign in, or invoke our paid model. SynthesisOS's empty Audit panel was inspected, but is not presented as proof of a populated audit workflow.
