# Personal Learning

Local setup for a small algebra tutoring prototype. The current browser app displays a practice question. The Nebius connection helper is prepared, but live inference, persistence, and the full tutoring workflow are not yet verified or implemented.

## Run on Windows

Open PowerShell in the project root:

```powershell
cd app
.\.venv\Scripts\python.exe -m streamlit run app.py
```

Open the localhost URL printed by Streamlit. Click **Start learning** to display the equation. Stop with Ctrl+C. This button currently makes no AI request.

For a fresh checkout, create and install the environment first:

```powershell
cd app
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Tested locally with Python 3.14.7 on Windows. The dependency snapshot includes platform-specific packages; other operating systems are not yet validated.

## Next handoff: Nebius access

1. Log in to [Token Factory](https://tokenfactory.nebius.com/). Check your actual credits, expiry, model prices, and automatic charging before enabling requests.
2. Create an API key in the correct project and paste it only into `app/.env`, beside `NEBIUS_API_KEY=`. That file is excluded from Git. Do not paste the key into chat.
3. In the account's model catalog, choose an available NVIDIA Nemotron text model. Copy its exact ID beside `NEBIUS_MODEL=`. Confirm JSON-mode support on its model card for the later curriculum work. No default model is guessed here.
4. Leave `NEBIUS_ALLOW_LIVE=false`. Tell the development agent your chosen model ID and the budget you authorize; no secret is needed in chat.

After filling the key and model, this checks local configuration only (run inside `app/`):

```powershell
.\.venv\Scripts\python.exe check_nebius.py
```

It does not test credentials or contact the provider. After the budget is agreed, set `NEBIUS_ALLOW_LIVE=true` and explicitly run:

```powershell
.\.venv\Scripts\python.exe check_nebius.py --live
```

This sends one fixed math question, with a 60-second timeout, a 512-token output limit, and no automatic retries. It prints the answer, requested/returned model IDs, elapsed time, and token usage if supplied. Reasoning models may exhaust this output limit before answering; check reasoning settings before increasing it. A timeout or truncated result may still incur usage. These request bounds are not an account-wide dollar spending cap.

The helper uses Nebius's [documented OpenAI-compatible endpoint](https://docs.tokenfactory.nebius.com/quickstart). Nebius's [billing documentation](https://docs.tokenfactory.nebius.com/other-capabilities/billing-new) describes mandatory billing setup with a card and automatic charging. Promo credit is not a guaranteed cap. Verify your own account terms. [Structured-output support](https://docs.tokenfactory.nebius.com/ai-models-inference/json) depends on the chosen model.

The helper has not yet been connected to a browser request button. That and the first real response remain part of Milestone 2B.

## Offline checks

From the project root:

```powershell
.\app\.venv\Scripts\python.exe -m pytest -q
```

API tests use an in-memory HTTP transport and fictional test model IDs; they do not contact Nebius or spend credits. They cover disabled calls, missing configuration, bounded requests, metadata, safe errors, timeouts, and incomplete responses.

Course content: [learner reference](app/sample_materials/course_reference.md) and [team answer key](app/sample_materials/questions_and_solutions.md). Keep the answer key out of learner-facing prompts until feedback is appropriate.

Follow [BUILD_PLAN.md](BUILD_PLAN.md) for milestones. Recruiting testers and confirming team roles still require the team.
