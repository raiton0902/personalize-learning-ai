---
title: Personal Learning
emoji: 📘
colorFrom: blue
colorTo: red
sdk: gradio
python_version: "3.12"
app_file: app/hf_persistence.py
app_port: 7860
ssr_mode: false
pinned: false
---

# Personal Learning

The approved interface is integrated into a Python-served browser app: real local accounts, saved learning, Library search, Activity dates, document/public-link intake, dark/light themes and the right learning-pattern panel. Motion is limited to guest decoration and icon hover feedback. See [integration setup and limits](docs/INTEGRATION.md) and [change record](CHANGELOG.md).

**Run the integrated app from this folder:**

```powershell
.\app\.venv\Scripts\python.exe -m uvicorn web_server:app --app-dir app --host 127.0.0.1 --port 8780
```

Open [Personal Learning](http://127.0.0.1:8780). Email/password login works locally. Google sign-in needs your OAuth client credentials; video/audio transcription needs a separately configured service. Transcript uploads already work. The integrated app supports general goals/references with model-generated practice; the checked algebra sample remains available.

The Streamlit instructions below describe the **preserved legacy build**, not the latest integrated interface.

A local algebra tutor built with Streamlit, SQLite, and NVIDIA Nemotron through Nebius Token Factory. The supported starter course is linear equations, substitution, and points on a line.

The app proposes a small curriculum for approval, teaches one objective, accepts an attempt, asks a diagnostic question when needed, offers repair and a changed checked problem, and saves the next action. Preferences, factual help observations, bounded review, and Markdown checkpoints are included.

This is a local candidate for user testing. It is not yet a hosted or submission-ready service. See [current QA and limits](docs/LOCAL_QA.md) and the [first-use guide](docs/LOCAL_TEST_GUIDE.md).

## Run on Windows

In PowerShell, from the project root:

```powershell
cd app
.\.venv\Scripts\python.exe -m streamlit run app.py --server.port 8502
```

Open [the local app](http://127.0.0.1:8502). Ctrl+C stops the server. Keep the generated session URL or code to resume. Opening the root URL begins a separate disposable session; it does not expose a directory of learner profiles.

For a fresh checkout:

```powershell
cd app
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Fill **only the ignored local `.env`** with your key and routing ID:

```dotenv
NEBIUS_API_KEY=your_private_key
NEBIUS_MODEL=nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B
NEBIUS_ALLOW_LIVE=false
```

Check account billing and agree a budget before setting `NEBIUS_ALLOW_LIVE=true`. The existing local setup has been enabled under the user's $2 development allowance. Never put a real key in `.env.example`, commit it, or paste it into chat. Restart the server after changing credentials/model settings.

The selected model uses the [documented Nebius endpoint](https://docs.tokenfactory.nebius.com/quickstart). Check [billing](https://docs.tokenfactory.nebius.com/other-capabilities/billing-new) and [model structured-output support](https://docs.tokenfactory.nebius.com/ai-models-inference/json) for your own account.

## Tests and cost

From the project root:

```powershell
.\app\.venv\Scripts\python.exe -m pytest -q
```

Offline and Streamlit AppTest tests use isolated temporary databases and mocked model transport. They do not contact Nebius. Explicit live probes are separate:

```powershell
cd app
.\.venv\Scripts\python.exe check_nebius.py
.\.venv\Scripts\python.exe check_nebius.py --live
```

The second command makes one live request. `live_checks.py --live` runs the nine original constrained probes, skipping checks already recorded locally. Those are smoke checks, not blind accuracy benchmarks.

`usage.py` records local calls against a $2 estimated development allowance. It reserves $0.01 per call until reported usage is available, uses checked rates only for the exact selected Nano route, bounds prompt/schema size to 24 KB and output to 2048 tokens, sets a 60-second timeout, and disables automatic retries. Nano reasoning output is disabled for short course requests. The meter is not an account-wide provider-enforced spending cap and does not cover other apps, playground usage, taxes, hosting, or future rate changes. Do not delete its database to bypass the allowance.

The verified total after the initial build is 22 calls, approximately $0.00317052 in inference. Further use changes that total; check Nebius for actual charges and credit expiry. Raw synthetic test results, profiles, attempts, and usage are in ignored `app/local_results/`.

## Project files

- `app/app.py`: focused staged interface.
- `app/styles.css` and `app/.streamlit/config.toml`: requested dark layout and local-only server defaults.
- `app/tutor.py`, `schemas.py`, `content.py`: model workflows, field validation, checked course questions, PDF extraction, and answer checking without eval.
- `app/storage.py`: isolated session snapshots, attempts, request leases, and stale-tab protection.
- `app/review.py`, `review_selector.py`: prototype review scheduling and due-topic selection. The selector was reviewed and reused from the user's personal-learning skill workspace.
- `app/llm.py`, `usage.py`: Nebius requests, safe errors, and estimated development usage.
- `app/sample_materials/`: original [learner reference](app/sample_materials/course_reference.md) and private-to-tutoring [answer key](app/sample_materials/questions_and_solutions.md). Keep the key out of pre-attempt learner prompts.

## Before inviting testers or publishing

Use non-sensitive disposable profiles. Selected references, preferences, and attempts are sent to Nebius during generation. Anyone with a session URL/code can access that profile on this local installation. It is not public-service authentication. The server binds to 127.0.0.1; do not expose it publicly without implementing the chosen hosted access/storage design.

Review uses prototype scheduling rules, not demonstrated retention. There are only six seed questions; repeat exposure is recorded as weaker evidence than fresh transfer. Randomized placement within a mixed quiz remains pending. Indonesian mathematics checks passed the examples tried, but wording needs a native reader's review. Automated browser PDF attachment was blocked by extension permissions; parsing tests passed, and manual browser verification is still required.

No public deployment, final submission, new Git commit, or push was performed as part of this build. Follow [BUILD_PLAN.md](BUILD_PLAN.md) for remaining team tasks, learner testing, judge access, and submission materials.
