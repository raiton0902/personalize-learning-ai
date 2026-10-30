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

An AI tutor that turns a learning goal into an editable curriculum, teaches one lesson at a time, and offers practice, feedback and follow-up conversations. Built with Python Starlette, SQLite and an HTML/CSS/JavaScript interface, using NVIDIA Nemotron through Nebius Token Factory.

[Open the Hugging Face Space](https://huggingface.co/spaces/Kaizennnn/personal-learning)

## How it works

1. Describe what you want to learn and optionally add references or preferences.
2. Review the scope form. Optional details can be left blank for a provisional plan.
3. Review or revise the Beginner → Intermediate → Advanced curriculum, then approve it.
4. Learn each lesson, ask questions and attempt practice exercises.
5. Revisit saved lessons and tests, review earlier concepts or download a checkpoint.

Cramming mode prioritizes urgent exam or presentation preparation within your scope and time budget. It does not guarantee readiness.

## Features

- Email/password accounts and optional Google sign-in.
- Account-owned learning history and follow-up question threads.
- Searchable Library and date-filtered Activity.
- Teaching-style, interest, struggle and course-context preferences.
- Automatic or explicitly selected response language. Language detection does not block curriculum generation or trigger automatic translation requests.
- Document and public-webpage references, plus reasoning attachments. Audio/video transcription requires a separately configured provider; image OCR depends on the host environment.
- Markdown code blocks, LaTeX equations, dark/light themes and resizable sidebars.
- Notebook motion with reduced-motion support.
- Markdown, Word and PDF checkpoint exports.

General-subject explanations and exercises are model-generated and not independently verified. The bundled algebra sample has a fixed scope and checked questions.

## Run locally on Windows

Use Python 3.12. From the repository root in PowerShell:

```powershell
python -m venv app/.venv
.\app\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item app/.env.example app/.env
```

Copy the example only on a fresh setup; preserve an existing `app/.env`. Edit that private file with your settings:

```dotenv
NEBIUS_API_KEY=your_private_key
NEBIUS_MODEL=nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B
NEBIUS_ALLOW_LIVE=true
NEBIUS_BUDGET_USD=5
NEBIUS_ENABLE_THINKING=false
COOKIE_SECURE=false
```

The $5 budget above is an example, not an account balance. Enabling live generation can incur charges. Keep credentials, databases and learner uploads out of Git.

```powershell
.\app\.venv\Scripts\python.exe -m uvicorn web_server:app --app-dir app --host 127.0.0.1 --port 8780
```

Open [localhost:8780](http://127.0.0.1:8780). Keep the terminal running; Ctrl+C stops it. Restart after changing environment settings.

Google login requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Register `http://127.0.0.1:8780/auth/google/callback` locally and your deployed HTTPS callback for hosting. `GOOGLE_REDIRECT_URI` or `APP_BASE_URL` can explicitly set the deployed callback/base URL. Use `COOKIE_SECURE=true` on HTTPS deployments.

## Hugging Face deployment

`app/hf_persistence.py` provides the hosted entry point on port 7860, with a Gradio-SDK compatibility wrapper and a Docker launch path. This README's frontmatter configures the Gradio entry point; the Dockerfile starts the same app. Match the deployment method to your Space's SDK settings.

The [GitHub Actions workflow](.github/workflows/sync-huggingface.yml) syncs app/runtime files to `Kaizennnn/personal-learning` on pushes to `main`, or through a manual run. Add a GitHub Actions repository secret named `HF_TOKEN` with write access to that Space.

The workflow preserves the Space's existing README/configuration and does not delete remote files removed from GitHub. This GitHub README therefore does not automatically replace the Space README. A green sync confirms upload; check the Space's build logs and running app separately.

Set Nebius, Google and optional transcription credentials in **Space Settings → Secrets**.

### Persistent data

Accounts, learning history and usage are stored in SQLite under `app/local_results/` by default. Ephemeral hosting disks alone do not preserve these files across rebuilds or restarts.

The hosted entry point optionally restores and periodically backs up `workspace.sqlite3`, `usage.sqlite3` and `web-session.key` to a private Hugging Face Dataset when both settings are configured:

```dotenv
HF_DATASET_REPO=your-account/private-learning-backups
HF_TOKEN=your_private_dataset_write_token
```

The Dataset must be private. The Space's `HF_TOKEN` secret is separate from the GitHub Actions secret of the same name; scope each token to its intended repositories. Periodic backup is not real-time replication and can lose recent writes after abrupt shutdown. Use a single application instance with this backup design.

## Limits and costs

- Curriculum and lesson requests allow up to **32,768 output tokens** with a **600-second timeout**. Other request types have smaller limits; see `app/llm.py`.
- These are app ceilings, not a guarantee of provider completion or a verified provider maximum. Larger responses can take longer and cost more.
- `NEBIUS_BUDGET_USD` controls estimated cumulative app usage. The default is **$1** when unset; it is separate from the token ceiling and is not an account-wide Nebius spending cap.
- Usage estimates depend on model pricing and reported usage. Check Nebius for actual charges. Do not delete the usage database to bypass the allowance.
- Automatic provider retries are disabled. Invalid curriculum structure or unusable practice content preserves existing work and requires a manual retry.
- Selected references, preferences and relevant learner responses are sent to Nebius when generating help.

## Tests

With the development/test dependencies from `app/requirements.txt` installed:

```powershell
.\app\.venv\Scripts\python.exe -m pytest app/tests -q
```

Tests use isolated databases and mocked inference. Some browser tests require Playwright and Chrome; tooling lives in `frontend_tools/`. Deployment, model quality, Google OAuth and transcription require separate live verification.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/web_server.py` | HTTP routes, authentication and learning actions |
| `app/web/` | Integrated browser interface and content rendering |
| `app/web_tutor.py`, `app/tutor.py`, `app/schemas.py` | Generation, schemas and curriculum validation |
| `app/web_store.py`, `app/learning_history.py` | Account storage and lesson/test history |
| `app/references.py`, `app/reasoning_files.py` | Reference and reasoning-attachment extraction |
| `app/llm.py`, `app/usage.py` | Model requests, limits and usage controls |
| `app/hf_persistence.py` | Hosted entry point and optional Dataset backups |
| `app/tests/` | Offline and browser regression checks |

## Legacy Streamlit build

`app/app.py` preserves the earlier focused algebra tutor. With its dependencies installed, run it separately:

```powershell
.\app\.venv\Scripts\python.exe -m streamlit run app/app.py --server.port 8502
```

The integrated browser app on port 8780 is the current local development entry point.
