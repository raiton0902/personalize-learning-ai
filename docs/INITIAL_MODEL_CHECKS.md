# Initial live model checks

Date: 24 October 2026. Model routing key: `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`.

## Verified

- A real request through `https://api.tokenfactory.nebius.com/v1/` returned the correct solution x=4 for 3x+5=17, with subtract-5 and divide-by-3 steps. Response time: 2.985 seconds; 41 input tokens and 192 output tokens.
- Nine further requests returned JSON conforming to a Pydantic-derived schema. Scenarios covered a changed equation, substitution, point membership (yes and no), an ambiguous wrong answer, coordinate confusion, arithmetic error, insufficient mastery evidence, and an Indonesian response.
- All nine matched the constrained schema/label checks. These prompts supplied substantial guidance, sometimes including the expected labels. They establish API and schema operation; they are not an independent model-accuracy benchmark or evidence of learning gains.
- Seventeen offline tests pass, including disabled calls, safe errors, no automatic retry, timeouts, incomplete responses, and budget reservations.

## Content findings to fix during tutor integration

- For a learner's bare “No” on the point-membership question, the model marked the cause ambiguous and asked for a calculation. Its `answer` field repeated “No”, although the mathematically correct membership answer is yes. Keep learner-answer assessment and the checked mathematical answer separate; do not use this field as the answer key.
- For the arithmetic-error case, the model supplied `answer: yes` despite the instruction not to disclose the full solution yet. During a diagnostic stage, render only the diagnostic question, not private assessment fields. Validate the workflow in code instead of relying only on prompt obedience.
- The “I understand” probe correctly remained uncertain, but its follow-up was generic. Supply the current objective and a concrete checked question in the real tutor.

These issues do not require a model change yet. The next test should exercise an integrated workflow with hidden reference answers, explicit state, and comparable untutored assessment prompts.

## Cost and controls

Ten requests in total. Estimated inference cost: **$0.00108852**, calculated from reported usage at $0.06 per million input tokens and $0.24 per million output tokens. This is not a billing statement or proof of remaining account credit. Reference: [Nebius Nano pricing](https://nebius.com/services/token-factory/models/nvidia-nemotron-models-inference).

The local SQLite meter has a $2 development allowance, reserves $0.01 before each request, and replaces the reservation with a usage-based estimate for the exact selected route when metadata is available. Unknown usage retains the reservation. Requests have a 24 KB prompt/schema limit, a maximum output limit of 2048 tokens, a 60-second timeout, and no automatic retries. Actual tested outputs used 512 or 1024 token limits.

This meter governs calls made through this helper and is not an account-wide provider-enforced cap. It does not cover playground calls, another application, rate changes, hosting, taxes, or deleting the local usage database. Keep judge/demo credit separate and verify the account balance in Nebius.

Raw synthetic responses and the usage database are in ignored `app/local_results/`. No learner data was used. `app/.env` remains live-disabled; explicit authorized test scripts enabled only their in-memory settings.

## Credential handling

The user had filled tracked `app/.env.example` rather than private `app/.env`. Values were moved locally to the ignored private file and the example was cleared. The key was not found in the three commits reachable from local refs or the staged example. This does not inspect unknown remote history or other copies. The real key was not printed in tool output.

## Pending

- Resolve the interface skill's during/after choice before UI edits, then connect the real helper to the browser with safe retry and duplicate prevention.
- Finish Milestone 2B in the browser before proceeding through persistence and the full tutor workflow.
- Team agreement and real learner recruitment/testing remain pending.
