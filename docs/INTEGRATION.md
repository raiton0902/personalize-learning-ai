# Integrated application

The approved browser design is now served by Python in `app/web_server.py`, using the existing Nebius transport, budget meter, and checked algebra tutor. The old Streamlit entry point remains available; its private databases have not been migrated or deleted.

## Start

From the repository root in PowerShell:

```powershell
.\app\.venv\Scripts\python.exe -m pip install -r app/requirements.txt
cd app
.\.venv\Scripts\python.exe -m uvicorn web_server:app --host 127.0.0.1 --port 8780
```

Open http://127.0.0.1:8780. Create an account with an email and a password of at least ten characters. This is real local signup; no preview account is provided. Email delivery, verification and password recovery are not implemented. Use the local build for testing; public hosting needs those product decisions, HTTPS, secure cookies, backups, and hosting configuration.

To keep using the earlier Streamlit build, run `streamlit run app.py --server.port 8502` with the same virtual environment. Existing bearer-code sessions remain separate; the new account UI cannot browse those legacy sessions.

## Working features

- Email/password signup, login, logout, account switching, salted scrypt hashes and expiring HttpOnly session cookies.
- Account-owned SQLite courses, references, saved explanations, preferences and learning events. One account cannot access another account's resource or course ID.
- Approved UI: two-layer composer, dark/light toggle, guest-only notebook motion, hover icons, history, account menu, Home-only side panels, free-text struggle/style/interests, automatic or explicitly selected response language.
- PDF (ordinary text, 2 MB/12 pages), DOCX (paragraphs and tables), UTF-8 TXT/Markdown, and SRT/VTT transcripts. References are bounded to 9,000 characters.
- Public HTML/text/PDF URLs with bounded downloads and redirects. HTTP/HTTPS only; private and reserved addresses rejected, including redirects. Connections use the validated IP address while HTTPS verifies the original hostname. Login/paywall and JavaScript-only pages may need pasted text.
- Source text preview before use, source identification in lessons, and an explicit notice when only the opening web excerpt was retained. This is not passage-level generated citation verification.
- AI curriculum approval/revision, lesson, practice, answer plus reasoning, diagnostic, repair, changed practice, next objective, saved explanation and Markdown checkpoint export.
- Teaching style and Interests are universal account preferences. Struggle, Language and Course/exam are course-specific, hidden/cleared on fresh Home and restored from the selected course. Saving account preferences does not expose another course's local context.
- Enter submits text areas/forms; Shift+Enter inserts a newline in text areas. Searches filter locally; Enter applies the current query. IME composition does not accidentally submit.
- The learning-pattern button shows green “Save?” for unsaved edits and grey “Saved” after persistence. Closing with edits offers Discard changes, Save, or Keep editing. Success toasts and generic save captions are removed; errors remain visible.
- Checkpoints download as Markdown, DOCX or PDF from the format control. PDF/DOCX are readable summaries; Markdown also includes the saved JSON state. PDF uses a local embedded Unicode font when available (`CHECKPOINT_PDF_FONT` can specify an appropriate licensed TTF/TTC on another host), with a standard-font fallback. No model call is made for exports.
- The checkpoint button opens an icon-and-text popover rather than a separate select box. Lessons, practice text and follow-up answers render sanitized Markdown and inline/display LaTeX using local vendor assets. Raw source previews and exported Markdown keep their original source syntax; PDF/DOCX exports are text summaries, not a LaTeX typesetting engine.
- Original bundled sample uses the checked algebra question bank and assessment overrides. General goals/references use flexible objective IDs and model-generated exercises; those exercises are not independently verified.
- Library keyword search over saved titles, origin and extracted text, combined with References/Notes filters. No AI calls for search.
- Activity date filter uses actual saved timestamps converted to the browser's local timezone. No AI calls for filtering.

The existing `NEBIUS_ALLOW_LIVE` gate, $2 estimated development allowance, prompt/output limits and no-automatic-retry policy still apply. The exact Nano route's checked token prices remain the only prices used by the meter. New tutoring actions use the same ledger. The app is served by one Uvicorn worker; per-course request guards avoid duplicate simultaneous actions in that configuration.

## Google login — needs your credentials

Register a Google OAuth web client in your Google Cloud project. Configure this redirect URI exactly:

```text
http://127.0.0.1:8780/auth/google/callback
```

Add the following to the existing ignored `app/.env`; do not replace the Nebius values:

```dotenv
GOOGLE_CLIENT_ID=your_web_client_id
GOOGLE_CLIENT_SECRET=your_private_client_secret
COOKIE_SECURE=false
```

Restart the server. Google login uses Authlib's OpenID Connect authorization-code flow, state/nonce validation and verified Google email. Without credentials, the UI gives a setup message. No real Google account flow was executed by the automated tests.

Google OAuth documentation: https://developers.google.com/identity/openid-connect/openid-connect

## Audio/video transcription — needs a service

Upload endpoints accept MP4, MOV, WebM, MKV, MP3, WAV and M4A, up to 25 MB and five minutes. FFmpeg extracts mono 16 kHz audio in a temporary directory, then a configured OpenAI-compatible transcription service produces text. Temporary media is deleted when processing ends. The tutor reads the transcript; slides, diagrams and silent visual content are not analysed.

FFmpeg was found on this machine. In `app/.env`, configure a transcription provider that supports `POST /audio/transcriptions`:

```dotenv
TRANSCRIPTION_BASE_URL=https://your-transcription-provider.example/v1
TRANSCRIPTION_MODEL=your_supported_transcription_model
TRANSCRIPTION_API_KEY=your_private_transcription_key
TRANSCRIPTION_ALLOW_PAID=false
```

`TRANSCRIPTION_ALLOW_PAID=true` explicitly enables service calls after you check that provider's price. **The Nebius text-inference $2 meter does not cover this separate service.** It remains off by default. Restart after changing settings. Uploading a video without this setup returns a clear setup message; uploading its SRT/VTT/TXT transcript works now with no transcription charge.

There is no custom model training requirement. This app does not download a speech model or assume the configured text-only Nemotron route accepts video.

## Language

Automatic follows the learner's goal/latest response, rather than the source language. An explicitly typed language takes precedence. Model quality varies by language; Mandarin is not among the Nano card's listed supported languages. The checked sample still has English canonical labels/diagnostic overrides. These are not evidence of universal multilingual quality.

## Local persistence and checks

Private data lives in ignored `app/local_results/workspace.sqlite3`, and the OAuth/session signing key in `app/local_results/web-session.key`. Do not publish that directory. The Nebius ledger remains `app/local_results/usage.sqlite3`.

```powershell
.\app\.venv\Scripts\python.exe -m pytest -q
```

Browser integration test: start `.\app\.venv\Scripts\python.exe frontend_tools/api-browser-fixture.py`, then run `node frontend_tools/live-integration-check.mjs` in another terminal. The fixture uses a temporary database and deterministic model replies. It is a test server on port 8781, not the user's app or a production mode.

See `CHANGELOG.md` for the running change record. Deployment, email verification/reset, live Google OAuth and live paid transcription remain separate setup/acceptance tasks.

## Question chats and teaching style — 26 October 2026

The owner authorized the previously deferred conversational context. Sidebar question branches now open ongoing, persisted chats. Each model request includes the course goal/profile/reference, the question's objective, the current lesson when it matches, the pending exercise prompt, and up to six recent messages from that same question chat. Other question chats and their requested-help observations are excluded. Large references become explicitly marked excerpts and older messages may be omitted to fit the existing 24 KB transport boundary; full history remains stored locally. No model training is required.

Replies answer the exact question first, explain why, and use one concrete example when useful, following the owner's referenced C++ tutoring chat. Simple questions stay short. Explicit step-by-step requests use a structured list of two to four steps. This adjusts future replies; existing answers are preserved.

The model classifies scope before answering. Related questions persist in the current thread without advancing the lesson. A clearly unrelated question stays pending until the learner chooses Yes or No. No discards it. Yes generates a separate plan and atomically moves the question/answer into a new learning; old references, struggle and exam context are not copied. The new plan still needs acceptance before lessons can start. The topic check is model-based and can make mistakes; a synthetic live test exposed a false in-scope result, and the revised scope-first prompt passed the same case. A pending topic's generated answer is withheld from the browser until Yes. One reply uses one inference call; Yes additionally generates a plan. API failures preserve the pending decision and existing work; there are no automatic inference retries.

Old single-question records migrate lazily on their next reply. Stable request IDs prevent duplicate saved turns on retries. The previous 50-question cap is removed; development budget, rate and request-size limits still apply. Internal requested-help evidence remains hidden and tentative. Checkpoint exports now contain learning notes only, as described below.

Verification: Python tests cover persistence, isolation, six-message context, migration, retry protection, topic decisions, failed transfer recovery, atomic transfer, approval gates, structured steps and bounded prompt data. `frontend_tools/chat-live-check.mjs` exercises the real frontend/API/temporary SQLite path with deterministic model fixtures (port 8781). Real Nebius tests used synthetic Python and photosynthesis questions, not private learner data. Google login and video transcription retain their previously documented setup/verification boundaries.

### Quiet feedback and saved-answer matching

Question text is compared locally with saved question titles in the same course/objective. Strong matches offer Open previous answer (no inference) or Ask separately. Punctuation and a narrow family of generic difficulty paraphrases are recognized; mathematical numbers, negation and operators are protected. This is conservative matching, not an embedding service or universal semantic search. No other chat's message body is added to the AI prompt.

The composer grows from one line. Empty messages do not submit; native validation balloons are suppressed while required/email/password validation remains enforced. Inline Thinking feedback replaces a waiting notification for learning generation and questions and honors reduced motion.

Obvious keyboard-smash input requests clarification locally. Other ambiguous questions can be classified as clarify by the model. A clarification-shaped answer is not treated as evidence of a new subject even if its scope field is inconsistent. Network/model transport failures are displayed inline and preserve the draft and saved chat; they are not falsely described as evidence that the question was unintelligible. There are no automatic paid retries. Previously misrouted generic difficulty questions expose Ask in this learning for explicit recovery. For browser regression coverage, run `node frontend_tools/question-feedback-check.mjs` against the temporary fixture server.

### Suggestion timing and navigation

Similar-question feedback is discarded as soon as its question text changes. Its reveal lasts 1200 ms; the suggestion's buttons unlock when it finishes. Removing the feedback cancels the reveal. Reduced-motion users receive it immediately.

Async operations lock the body and any open dialog through native inert state. The current view stays visible without opacity/filter changes while course/chat data loads. Screen replacement occurs after data retrieval; errors release the lock on the original view. Authentication waits for account resources before showing the signed-in screen. The existing field/button focus is restored if that control remains in the current view. `frontend_tools/navigation-feedback-check.mjs` covers delayed and failed requests, draft editing, reveal cancellation and modal locking against the temporary offline fixture server.

## Reasoning attachments, automatic Library and checkpoint exports

The practice form supports Markdown, text PDF, DOCX, PNG, JPEG and WebP reasoning attachments through `/api/courses/{cid}/reasoning`. Files are limited to 2 MB, PDFs to 12 pages, and images to 12 megapixels before bounded resizing. An attachment may contain up to 5 KB of extracted UTF-8 text; up to three can be selected, with a combined typed/attached reasoning limit of 6 KB. Images use the installed Windows OCR engine through `ocr_image.ps1`, not the text-only Nebius model or a paid service. This requires Windows and an available OCR language; other hosts return an explicit setup message. Scanned PDFs should be uploaded as page images. OCR may misread handwritten equations: clicking the filename lets the learner inspect extracted text and remove/re-enter it if necessary.

Only extracted text is retained in the private workspace database. Original image files are temporary. Attachment IDs are checked against the signed-in owner, course and current exercise fingerprint. Confirming the orange Submit dialog includes selected extracted text in the existing assessment call; Cancel sends no assessment. Large references become marked excerpts when needed to preserve the assessment request-size boundary; attachment reasoning is not silently dropped.

Lesson and repair explanations save to Library automatically. Existing exact-content notes are reused; reopening a lesson does not create another copy. Question chats remain in history rather than becoming Library notes.

Checkpoint downloads are readable learning notes, not a full database backup. MD/DOCX/PDF omit practice questions, answer attempts, question conversations and embedded state JSON. They keep curriculum/progress, lesson, worked examples, repair and references, and convert common Markdown/LaTeX to readable text and linear/Unicode math. Saved chats and assessment history remain in the account. `frontend_tools/practice-ui-check.mjs` exercises the integrated practice controls, real local image OCR and confirmation using a temporary database and mocked text-model responses.

## Language, repeated goals and previous steps — 27 October 2026

Automatic language is resolved locally to a concrete output language before inference. Explicit Language preferences override detection. Code-only and ambiguous short messages fall back to the goal's language (or English if undetermined); common script and phrase rules avoid misreading short Chinese/Indonesian/English goals. `langdetect==1.0.9` uses its existing local profiles with a fixed seed, not learner training or a remote language service. See the [upstream language detection documentation](https://github.com/Mimino666/langdetect) for its short-text ambiguity and seed behavior. All natural-language JSON fields receive the same explicit output instruction. Detected plan mismatches show a manual regeneration action rather than silently charging for retries. Model/detection quality can still vary by language.

Main goal matching strips introductory/request wording while retaining subject/operator distinctions. A match against the signed-in account's saved goal offers Open learning or Create separately before model generation. It is a conservative local comparison, not universal semantic matching, and never combines unrelated users' courses.

Lesson history records each visited objective and repeated practice instance, including submitted answers, feedback and repair. Review is read-only and does not change the current objective, approval or completion status. Unsubmitted/diagnostic practice solutions are redacted. Old Library notes with course ownership metadata and existing attempts can be displayed; missing past content is not invented. Checkpoint exports include saved lesson explanations/examples but continue to exclude practice/chat logs. The standalone legacy Streamlit workflow remains available.

New goal submission intentionally moves directly to a learning-generation screen with Thinking, superseding the earlier stay-on-Home behavior for this one action. Ordinary saved-course navigation still keeps its source view until loaded. Failed generation leaves explicit retry/back actions; no automatic paid retry occurs. `frontend_tools/learning-progress-check.mjs` covers the new browser flow with real local routes/storage and deterministic model fixtures.

## Hugging Face Spaces (Docker Free) + Private Dataset SQLite Sync — 30 October 2026

Root `Dockerfile`, `.dockerignore` and `app/hf_persistence.py` package the integrated browser application (`app/web_server.py` + `app/web/`) for Hugging Face Spaces (`CPU Basic` free Docker runtime, port `7860`) without rewriting any Python routes, schemas or frontend scripts.

### How persistence works across container sleep

Free Hugging Face Spaces sleep after roughly 48 hours of inactivity and reset their local container disk on restart. When `HF_DATASET_REPO` and `HF_TOKEN` are configured in the Space's **Variables and secrets**:

1. **Startup restore (`restore_all`):** Before launching Uvicorn, `app/hf_persistence.py` downloads `workspace.sqlite3`, `usage.sqlite3` and `web-session.key` from your **Private Hugging Face Dataset** repository into `app/local_results/` (verifying `PRAGMA integrity_check` on SQLite files before activating them).
2. **Online atomic snapshots (`sync_once`):** Every `HF_SYNC_INTERVAL_SECONDS` (default `15` seconds) and on `SIGTERM` shutdown, `app/hf_persistence.py` uses SQLite's online backup API (`sqlite3.Connection.backup`) to copy a consistent snapshot and uploads only files whose SHA-256 digest changed.
3. **Zero local impact:** When `HF_DATASET_REPO` or `HF_TOKEN` is unset, `hf_persistence.py` leaves local disk behavior unchanged.

### Required manual setup on Hugging Face (needs your account)

1. Create a **Private Dataset** on Hugging Face (for example, `<your-username>/personal-learning-data`). Keep it **Private** so learner databases and session keys are never public.
2. Create a Hugging Face **User Access Token** (Fine-grained with Read and Write permissions to that private dataset repository).
3. Create a new **Space** on Hugging Face, select **Docker** as the Space SDK (choose the **Blank** Docker template and **CPU basic · Free** hardware).
4. In the Space's **Settings -> Variables and secrets**, add these **Secrets**:
   - `HF_TOKEN`: your write-capable Hugging Face token
   - `HF_DATASET_REPO`: `<your-username>/personal-learning-data`
   - `NEBIUS_API_KEY`: your Nebius API key
   - `NEBIUS_ALLOW_LIVE`: `true` (only when you want live paid model calls enabled)
   - `NEBIUS_BUDGET_USD`: `1` (or your chosen USD budget ceiling)
   - `NEBIUS_MODEL`: your configured Nebius model slug
   - *(Optional)* `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `WEB_SESSION_SECRET`
5. Share the **Direct Space URL** (`https://<your-username>-<space-name>.hf.space`) with your users rather than the embedded `huggingface.co/spaces/...` wrapper page so first-party `SameSite=Lax` cookies (`COOKIE_SECURE=true`) work across browsers.
6. Note: Linux containers do not include Windows PowerShell WinRT OCR (`Windows.Media.Ocr`); image reasoning uploads on Linux return the existing prompt to upload Markdown, text PDF or DOCX instead.
