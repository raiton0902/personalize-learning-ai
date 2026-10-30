"""Approved browser UI and account-owned API. Run: python -m uvicorn web_server:app."""
from datetime import date
import hashlib
import json
import os
import re
import secrets
import sqlite3
import threading
from pathlib import Path

from dotenv import load_dotenv
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, FileResponse, RedirectResponse, Response, HTMLResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.concurrency import run_in_threadpool
from authlib.integrations.starlette_client import OAuth

import review
import web_store as store
import web_tutor
import references
from content import bundled_source
from llm import ModelRequestError, SetupError
from usage import BudgetExceeded

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env", override=False)
SECRET_FILE = ROOT / "local_results" / "web-session.key"
SECRET_FILE.parent.mkdir(parents=True, exist_ok=True)
if not SECRET_FILE.exists():
    try:
        with SECRET_FILE.open("x") as file:
            file.write(secrets.token_urlsafe(48))
    except FileExistsError:
        pass
oauth = OAuth()
oauth.register(name="google", client_id=os.getenv("GOOGLE_CLIENT_ID", ""), client_secret=os.getenv("GOOGLE_CLIENT_SECRET", ""), server_metadata_url="https://accounts.google.com/.well-known/openid-configuration", client_kwargs={"scope": "openid email profile"})


def user(request):
    account = store.account(request.cookies.get("learning_login", ""))
    if not account:
        raise PermissionError("Please log in to save and continue your learning.")
    return account


def cookie(response, owner):
    response.set_cookie("learning_login", store.login(owner), httponly=True, secure=os.getenv("COOKIE_SECURE", "false").lower() == "true", samesite="lax", max_age=7*86400)
    return response


def public_user(account):
    stored=json.loads(account['profile'])
    return {"id": account["id"], "email": account["email"], "profile": {key:stored.get(key,'') for key in ('tone','interest')}}


def limited_text(value, length):
    if not isinstance(value, str) or len(value) > length:
        raise ValueError(f"Use text shorter than {length} characters.")
    return value.strip()


CORE_PROFILE_LIMITS = {"goal": 700, "language": 80, "level": 700, "tone": 700, "interest": 200, "context": 300, "pace": 100}
EXTRA_INTAKE_LIMITS = {
    "track_type": 20,
    "depth_preference": 20,
    "intended_outcome": 400,
    "starting_knowledge": 700,
    "time_budget": 200,
    "deadline": 200,
    "requirements": 300,
    "lesson_size": 100,
}


def clean_profile(value):
    if not isinstance(value, dict):
        raise ValueError("Supply a learner profile.")
    cleaned = {key: limited_text(value.get(key, ""), maximum) for key, maximum in CORE_PROFILE_LIMITS.items()}
    if 'cramming' in value:
        if not isinstance(value['cramming'], bool):
            raise ValueError('Cramming must be true or false.')
        cleaned['cramming'] = value['cramming']
    for key, maximum in EXTRA_INTAKE_LIMITS.items():
        if key in value and value.get(key) is not None:
            text_val = limited_text(str(value.get(key, "")), maximum)
            if text_val:
                cleaned[key] = text_val
    if cleaned.get("starting_knowledge") and not cleaned["level"]:
        cleaned["level"] = cleaned["starting_knowledge"][:700]
    if cleaned.get("requirements") and not cleaned["context"]:
        cleaned["context"] = cleaned["requirements"][:300]
    if cleaned.get("lesson_size") and not cleaned["pace"]:
        cleaned["pace"] = cleaned["lesson_size"][:100]
    for key in ('track_type', 'depth_preference'):
        if key == 'depth_preference' and cleaned.get(key) == 'advanced':
            cleaned[key] = 'advanced_full'
        if key in cleaned and cleaned[key] not in {'beginner', 'intermediate', 'advanced_full'}:
            raise ValueError('Choose a valid learning track.')
    return cleaned


def me(request):
    account = store.account(request.cookies.get("learning_login", ""))
    return JSONResponse({"user": public_user(account) if account else None, "capabilities": {"google": bool(os.getenv("GOOGLE_CLIENT_ID") and os.getenv("GOOGLE_CLIENT_SECRET")), "video": references.transcription_available(), "documents": ["pdf", "docx", "txt", "md", "srt", "vtt"]}})


async def auth(request):
    data = await request.json()
    email = limited_text(data.get("email", ""), 254).lower()
    password = data.get("password", "")
    if not isinstance(password, str) or len(password) > 200:
        raise ValueError("Use a password of at most 200 characters.")
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise ValueError("Enter a valid email address.")
    store.throttle("auth:"+(request.client.host if request.client else "local"), 30)
    store.throttle("email:"+email, 12)
    existing = store.find_account(email)
    if request.path_params["mode"] == "signup":
        if len(password) < 10:
            raise ValueError("Use a password with at least 10 characters.")
        if existing:
            raise ValueError("An account already exists. Log in instead.")
        try:
            owner = await run_in_threadpool(store.create_account, email, password)
        except sqlite3.IntegrityError:
            raise ValueError("An account already exists. Log in instead.") from None
    else:
        stored = existing["password"] if existing and existing["password"] else store.password_hash("invalid-password")
        candidate = await run_in_threadpool(store.password_hash, password, stored.split(":")[0])
        if not existing or not existing["password"] or not secrets.compare_digest(stored, candidate):
            raise ValueError("Email or password is incorrect.")
        owner = existing["id"]
    store.logout(request.cookies.get("learning_login", ""))
    return cookie(JSONResponse({"ok": True}), owner)


def logout(request):
    store.logout(request.cookies.get("learning_login", ""))
    response = JSONResponse({"ok": True}); response.delete_cookie("learning_login")
    request.session.clear()
    return response


def google_callback_url(request: Request) -> str:
    explicit = os.getenv("GOOGLE_REDIRECT_URI", "").strip()
    if explicit:
        return explicit
    base = os.getenv("APP_BASE_URL", "").strip().rstrip("/")
    if base:
        return f"{base}/auth/google/callback"
    forwarded_proto = request.headers.get("x-forwarded-proto", "").strip().lower()
    proto = forwarded_proto.split(",")[0].strip() if forwarded_proto else ""
    forwarded_host = request.headers.get("x-forwarded-host", "").strip()
    host = (forwarded_host.split(",")[0].strip() if forwarded_host else "") or request.headers.get("host", "").strip()
    if proto and host:
        return f"{proto}://{host}/auth/google/callback"
    return str(request.url_for("google_callback"))


async def google_start(request):
    if not os.getenv("GOOGLE_CLIENT_ID") or not os.getenv("GOOGLE_CLIENT_SECRET"):
        return RedirectResponse("/?auth_error=google_setup_required")
    return await oauth.google.authorize_redirect(request, google_callback_url(request), prompt="select_account")


async def google_callback(request):
    try:
        token = await oauth.google.authorize_access_token(request)
        info = token.get("userinfo")
        if not info or not info.get("email_verified") or not info.get("sub"):
            raise ValueError("Google did not verify this email.")
        existing = store.find_account(info["email"])
        if existing and existing["google_sub"] not in {None, info["sub"]}:
            raise ValueError("The Google account does not match.")
        owner = existing["id"] if existing else store.create_account(info["email"], google_sub=info["sub"])
        if existing and not existing["google_sub"]:
            with store.db() as connection, connection:
                connection.execute("UPDATE accounts SET google_sub=? WHERE id=?", (info["sub"], owner))
        store.logout(request.cookies.get("learning_login", ""))
        return cookie(RedirectResponse("/"), owner)
    except Exception:
        return RedirectResponse("/?auth_error=google_login_failed")


async def profile(request):
    account = user(request)
    data=await request.json()
    value = clean_profile(data)
    course_id=data.get('course_id')
    if course_id is not None and not isinstance(course_id,str):
        raise ValueError('Invalid learning session.')
    store.profile(account["id"], value, course_id)
    return JSONResponse({"profile": value})


async def resources(request):
    account = user(request)
    if request.method == "GET":
        return JSONResponse({"resources": store.resources(account["id"])})
    store.throttle("references:"+account["id"], 40)
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" in content_type:
        async with request.form(max_files=1, max_fields=2, max_part_size=26*1024*1024) as form:
            upload = form.get("file")
            if not upload or not hasattr(upload, "read"):
                raise ValueError("Choose a file first.")
            data = await upload.read(25*1024*1024+1)
            result = await run_in_threadpool(references.document, data, upload.filename or "upload")
    else:
        data = await request.json()
        if data.get("kind") == "url":
            result = await run_in_threadpool(references.read_url, limited_text(data.get("url", ""), 2000))
        elif data.get("kind") == "bundled":
            result = bundled_source()
        elif data.get("kind") == "note":
            result = references.source(limited_text(data.get("text", ""), 9000), limited_text(data.get("title", "Saved explanation"), 160), "Saved explanation", "note")
        else:
            result = references.source(limited_text(data.get("text", ""), 9000), limited_text(data.get("title", "Pasted reference"), 160), "Learner supplied text", "pasted")
    rid = store.add_resource(account["id"], result)
    return JSONResponse({"resource": {**result, "id": rid}})


def public_state(state):
    safe = json.loads(json.dumps(state))
    import episode_helpers
    import learning_history
    from language_rules import resolve,plan_mismatch
    learning_history.normalize_course_state(safe)
    learning_history.record(safe)
    learning_history.public_history(safe.get('lesson_history',[]))
    safe['response_language']=resolve(safe['profile'])
    safe['plan_language_mismatch']=plan_mismatch(safe['profile'],safe.get('curriculum'))
    safe['episode']=episode_helpers.build_public_episode(safe)
    safe['review_status']=review.build_review_status(safe)
    if safe.get("question"):
        safe["question"].pop("answer", None); safe["question"].pop("solution", None)
    safe.pop("metadata", None)
    safe.pop("learning_signals", None)
    safe.pop("completed_requests", None)
    safe.pop("creation_request_id", None)
    safe.pop("saved_before_review", None)
    for thread in safe.get("followups", []):
        if thread.get("pending"):
            thread["pending"].pop("answer", None)
            from question_matching import difficulty_question
            thread['pending']['can_reconsider']=difficulty_question(thread['pending']['text'])
    return safe


def _merge_intake_payload(state, data):
    incoming = {}
    if isinstance(data.get("profile"), dict):
        incoming.update(data["profile"])
    if isinstance(data.get("intake"), dict):
        incoming.update(data["intake"])
    for key in (*CORE_PROFILE_LIMITS, *EXTRA_INTAKE_LIMITS, 'cramming'):
        if key in data and data.get(key) is not None:
            incoming[key] = data[key]
    merged = {**state.get("profile", {}), **incoming}
    state["profile"] = clean_profile(merged)


async def courses(request):
    account = user(request)
    if request.method == "GET":
        return JSONResponse({"courses": store.courses(account["id"])})
    store.throttle("model:"+account["id"], 30)
    data = await request.json()
    raw_profile = dict(data.get("profile") or {})
    stored_universal = json.loads(account.get("profile") or "{}")
    for u_key in ("tone", "interest"):
        if not raw_profile.get(u_key) and stored_universal.get(u_key):
            raw_profile[u_key] = stored_universal[u_key]
    for extra_key in (*EXTRA_INTAKE_LIMITS, 'cramming'):
        if extra_key in data and extra_key not in raw_profile:
            raw_profile[extra_key] = data[extra_key]
    learner = clean_profile(raw_profile)
    learner, extracted = web_tutor.interpret_scope(learner)
    request_id = limited_text(str(data.get("request_id", "")), 80) if data.get("request_id") else ""
    if request_id:
        for existing in store.courses(account["id"]):
            try:
                existing_state, _ = store.course(account["id"], existing["id"])
                if existing_state.get("creation_request_id") == request_id:
                    return JSONResponse({"id": existing["id"], "state": public_state(existing_state), "deduplicated": True})
            except Exception:
                continue
    if not learner["goal"]:
        raise ValueError("Write a learning goal first.")
    if data.get("direct_question"):
        temp_state = {
            "profile": learner,
            "source": {"id": "general", "title": "Direct question", "origin": "Direct question without starting a course", "text": learner["goal"]},
            "curriculum": None,
            "objective_index": 0,
            "stage": "direct",
        }
        reply, _ = await run_in_threadpool(web_tutor.followup, temp_state, learner["goal"])
        return JSONResponse({"direct_answer": reply["answer"], "course_started": False, "approved_version": None})
    from question_matching import is_similar_learning_goal
    if data.get('similar_choice')!='new':
        for existing in store.courses(account['id']):
            if is_similar_learning_goal(learner['goal'], existing['goal']):
                existing_state, _ = store.course(account['id'], existing['id'])
                if bool(existing_state['profile'].get('cramming')) != bool(learner.get('cramming')):
                    continue
                return JSONResponse({'similar_learning':{'id':existing['id'],'title':existing['title']}})
    reference = store.resource(account["id"], data.get("resource_id")) if data.get("resource_id") else None
    if data.get("resource_id") and not reference:
        raise ValueError("Choose a reference from your own Library.")
    if reference:
        # The parser kind is the source identity used by the existing checked tutor.
        reference = dict(reference, id="bundled" if reference.get("origin", "").startswith("Original course") else "reference")
    else:
        reference = {"id":"general", "title":"Learning goal", "origin":"No supplied reference; general model knowledge, unverified", "text":learner["goal"]}

    require_intake = web_tutor.needs_intake(learner, reference, data)
    is_provisional = bool(data.get("skip_intake") or data.get("provisional"))
    intake_state = web_tutor.build_intake_state(
        learner,
        reference,
        data,
        {
            "status": "pending" if require_intake else ("provisional" if is_provisional else "completed"),
            "autofilled": extracted,
            "assumptions": ["Provisional scope and beginner-friendly defaults applied; adjust anytime."] if is_provisional else [],
        },
    )
    state = {
        "schema_version": 2,
        "profile": learner,
        "source": reference,
        "resource_id": data.get("resource_id"),
        "intake": intake_state,
        "curriculum": None,
        "version": 1,
        "approved_version": None,
        "objective_index": 0,
        "stage": "intake" if require_intake else "plan",
        "observations": [],
        "attempts": [],
        "concepts": {},
        "review": {},
        "review_history": [],
        "created": store.now(),
        "completed_requests": {},
    }
    if request_id:
        state["creation_request_id"] = request_id
    if require_intake:
        cid = store.create_course(account["id"], state)
        store.event(account["id"], cid, "Started intake for: " + learner["goal"])
        return JSONResponse({"id": cid, "state": public_state(state)})

    plan, metadata = await run_in_threadpool(web_tutor.propose, state)
    plan = web_tutor.normalize_curriculum(plan, state["source"], state["profile"], strict_validation=False)
    state.update(curriculum=plan, metadata=metadata)
    cid = store.create_course(account["id"], state)
    store.event(account["id"], cid, "Created learning plan: "+plan["title"])
    return JSONResponse({"id":cid,"state":public_state(state)})


ALLOWED_COURSE_ACTIONS = {
    "extend_curriculum",
    "intake",
    "submit_intake",
    "skip_intake",
    "intake_draft",
    "approve",
    "revise",
    "apply_revision",
    "discard_revision",
    "dismiss_export_offer",
    "direct_question",
    "teach",
    "practice",
    "skip_check",
    "attempt",
    "diagnostic",
    "next",
    "start_review",
    "skip_review",
    "profile",
    "question",
    "chat",
    "chat_discard",
    "chat_transfer",
    "chat_reconsider",
    "hint",
    "correct_observation",
}

DEDUPLICATED_ACTIONS = {
    "extend_curriculum",
    "intake",
    "submit_intake",
    "skip_intake",
    "approve",
    "revise",
    "apply_revision",
    "discard_revision",
    "dismiss_export_offer",
    "teach",
    "practice",
    "skip_check",
    "attempt",
    "diagnostic",
    "next",
    "start_review",
    "skip_review",
    "hint",
    "correct_observation",
}


def _apply_candidate_revision(state, candidate):
    plan = candidate["curriculum"]
    state["curriculum"] = plan
    state["version"] = candidate["version"]
    state["approved_version"] = state["version"]
    if plan.get('track_type'):
        state['profile']['track_type'] = plan['track_type']
    if candidate.get('extension'):
        state['profile']['track_type'] = 'advanced_full'
        if state['stage'] == 'complete':
            state['objective_index'] = candidate['previous_count']
            state['stage'] = 'ready'
        state.pop('pending_revision', None)
        return
    review_map = state.get("review") or {}
    new_objectives = plan.get("objectives", [])
    next_idx = 0
    for idx, obj in enumerate(new_objectives):
        if not review_map.get(obj["id"], {}).get("taught"):
            next_idx = idx
            break
    else:
        next_idx = max(0, len(new_objectives) - 1)
    state["objective_index"] = next_idx
    state.pop("pending_revision", None)
    import learning_history
    learning_history.clear_current(state)
    state["stage"] = "ready"


async def course(request):
    account = user(request); cid = request.path_params["cid"]
    state, revision = store.course(account["id"], cid)
    import episode_helpers
    import learning_history
    learning_history.recover_notes(state,store.resources(account['id']),cid)
    if request.method == "GET":
        store.ensure_explanation(account['id'],cid,state)
        return JSONResponse({"id":cid,"state":public_state(state)})
    data = await request.json(); action = data.get("action")
    if action not in ALLOWED_COURSE_ACTIONS:
        raise ValueError("Unknown learning action.")
    request_id = limited_text(str(data.get("request_id", "")), 80) if data.get("request_id") else ""
    completed = state.setdefault("completed_requests", {})
    if request_id and action in DEDUPLICATED_ACTIONS and request_id in completed:
        return JSONResponse({"id": cid, "state": public_state(state), "deduplicated": True})
    store.throttle("model:"+account["id"], 60)
    title = "Updated learning"
    if action in {'revise','extend_curriculum','apply_revision','practice','skip_check','next'}:
        learning_history.record(state)

    if action in {"intake", "submit_intake", "skip_intake", "intake_draft"}:
        _merge_intake_payload(state, data)
        if data.get("resource_id"):
            ref = store.resource(account["id"], data.get("resource_id"))
            if not ref:
                raise ValueError("Choose a reference from your own Library.")
            state["resource_id"] = data.get("resource_id")
            state["source"] = dict(ref, id="bundled" if ref.get("origin", "").startswith("Original course") else "reference")
        if any(k in data or (isinstance(data.get("profile"), dict) and k in data["profile"]) for k in ("tone", "interest")):
            store.profile(account["id"], state["profile"])
        if action == "intake_draft":
            draft = {}
            for k in (*CORE_PROFILE_LIMITS, *EXTRA_INTAKE_LIMITS):
                if state["profile"].get(k):
                    draft[k] = state["profile"][k]
            state["intake"] = web_tutor.build_intake_state(
                state["profile"],
                state["source"],
                {"resource_id": state.get("resource_id")},
                {"status": "pending", "draft": draft},
            )
            title = "Saved intake draft"
        else:
            is_skip = action == "skip_intake" or bool(data.get("provisional") or data.get("skip_intake"))
            assumptions = list(data.get("assumptions") or [])
            if is_skip and not assumptions:
                assumptions = ["Proceeded with provisional beginner-to-intermediate curriculum assumptions."]
            state["intake"] = web_tutor.build_intake_state(
                state["profile"],
                state["source"],
                {"resource_id": state.get("resource_id"), "skip_intake": is_skip},
                {"status": "provisional" if is_skip else "completed", "assumptions": assumptions},
            )
            plan, metadata = await run_in_threadpool(web_tutor.propose, state)
            plan = web_tutor.normalize_curriculum(plan, state["source"], state["profile"], strict_validation=False)
            state.update(curriculum=plan, metadata=metadata, stage="plan", approved_version=None)
            title = "Created learning plan from intake: " + plan["title"]
    elif action == "direct_question":
        q_text = limited_text(data.get("text", ""), 900)
        if not q_text:
            raise ValueError("Write a question first.")
        reply, metadata = await run_in_threadpool(web_tutor.followup, state, q_text)
        state["last_direct_answer"] = {"question": q_text, "answer": reply["answer"], "created": store.now()}
        state["metadata"] = metadata
        title = "Answered direct question"
    elif action == "approve":
        if state.get("pending_revision") and (state["stage"] != "plan" or data.get("apply_revision")):
            cand = state["pending_revision"]
            if data.get("version") is not None and int(data["version"]) != cand["version"]:
                raise ValueError("Curriculum version mismatch. Review the candidate revision before approving.")
            _apply_candidate_revision(state, cand)
            title = "Applied revised learning plan"
        else:
            if state["stage"] == "intake" or not state.get("curriculum"):
                raise ValueError("Complete or skip intake to generate your curriculum before approving.")
            if state["stage"] != "plan":
                raise ValueError("This plan is already accepted.")
            if data.get("version") is not None and int(data["version"]) != state["version"]:
                raise ValueError("Curriculum version mismatch. Review the latest plan before approving.")
            state.update(approved_version=state["version"], stage="ready")
            if not state.get("export_offer"):
                state["export_offer"] = {"shown": True, "dismissed": False, "offered_at": store.now()}
            title = "Accepted learning plan"
    elif action == 'extend_curriculum' or (action == 'revise' and data.get('target_track') == 'advanced_full'):
        if not state.get('curriculum'):
            raise ValueError('Generate a plan before extending it.')
        plan, metadata = await run_in_threadpool(web_tutor.extend_curriculum, state)
        if state.get('approved_version') is not None:
            state['pending_revision'] = {'version': max(state['version'], (state.get('pending_revision') or {}).get('version', 0)) + 1,
                'curriculum': plan, 'extension': True, 'previous_count': len(state['curriculum']['objectives']), 'created': store.now()}
        else:
            state.update(curriculum=plan, version=state['version']+1)
            state['profile']['track_type'] = 'advanced_full'
        state['metadata'] = metadata
        title = 'Proposed advanced path extension'
    elif action == "revise":
        if state["stage"] == "intake" or not state.get("curriculum"):
            raise ValueError("Complete or skip intake before revising the curriculum.")
        changes = limited_text(data.get("text", ""), 700)
        proposal_state = json.loads(json.dumps(state))
        if data.get('target_track'):
            proposal_state['profile'] = clean_profile({**state['profile'], 'track_type': data['target_track']})
        plan, metadata = await run_in_threadpool(web_tutor.propose, proposal_state, changes)
        plan = web_tutor.normalize_curriculum(plan, state["source"], state["profile"], strict_validation=False)
        if state.get("approved_version") is not None and not data.get("replace_immediately"):
            cand_version = max(state.get("version", 1), (state.get("pending_revision") or {}).get("version", 0)) + 1
            state["pending_revision"] = {
                "version": cand_version,
                "curriculum": plan,
                "requested_changes": changes,
                "created": store.now(),
            }
            state["metadata"] = metadata
            title = "Proposed candidate curriculum revision"
        else:
            state.update(curriculum=plan, version=state["version"]+1, approved_version=None, stage="plan", objective_index=0, metadata=metadata)
            state['profile'] = proposal_state['profile']
            state.pop("pending_revision", None)
            learning_history.clear_current(state)
            title = "Revised learning plan"
    elif action == "apply_revision":
        cand = state.get("pending_revision")
        if not cand:
            raise ValueError("There is no pending curriculum revision to apply.")
        if data.get("version") is not None and int(data["version"]) != cand["version"]:
            raise ValueError("Curriculum version mismatch. Review the candidate revision before applying.")
        _apply_candidate_revision(state, cand)
        title = "Applied candidate curriculum revision"
    elif action == "discard_revision":
        if not state.get("pending_revision"):
            raise ValueError("There is no pending curriculum revision to discard.")
        state.pop("pending_revision", None)
        title = "Kept current approved curriculum"
    elif action == "dismiss_export_offer":
        offer = state.setdefault("export_offer", {"shown": True})
        offer["dismissed"] = True
        title = "Dismissed checkpoint export offer"
    elif action == "profile":
        state["profile"] = clean_profile(data.get("profile", {}))
    else:
        if state["approved_version"] != state["version"] and action not in {"chat", "chat_discard", "chat_transfer", "chat_reconsider"}:
            raise ValueError("Accept the current plan before starting a lesson.")
        if action in {"question", "chat", "chat_discard", "chat_transfer", "chat_reconsider"}:
            import question_chats
            try:
                target, updated, thread_id = await question_chats.respond(account["id"], cid, state, revision, data)
            except question_chats.QuestionFeedback as feedback:
                return JSONResponse({"id":cid,"state":public_state(state),**feedback.payload})
            return JSONResponse({"id":target,"state":public_state(updated),"thread_id":thread_id})
        elif action == "teach":
            if state.get("export_offer"):
                state["export_offer"]["dismissed"] = True
            result, metadata = await run_in_threadpool(web_tutor.teach, state)
            state.update(lesson=result, metadata=metadata, stage="lesson")
            title = "Opened lesson: "+state["curriculum"]["objectives"][state["objective_index"]]["title"]
        elif action == "practice":
            if state["stage"] not in {"lesson", "feedback", "repair"}:
                raise ValueError("Open the lesson before practising.")
            from_repair = state["stage"] == "repair"
            active_rev = state.get("active_review")
            target_obj = None
            if active_rev:
                target_obj = next((o for o in state["curriculum"]["objectives"] if o["id"] == active_rev.get("objective_id")), None)
            result, metadata = await run_in_threadpool(web_tutor.practice, state, state["stage"] in {"feedback", "repair"}, target_obj)
            for key in ('attempt','assessment','repair','episode_observation'):state.pop(key,None)
            instance_id = secrets.token_hex(10)
            if active_rev:
                result = {**result, "review_label": active_rev.get("label", ""), "review_objective_id": active_rev.get("objective_id", "")}
            state.update(question=result, metadata=metadata, stage="attempt", exercise_instance=instance_id, assistance=episode_helpers.default_assistance(instance_id))
            if from_repair:
                state["repaired_in_objective"] = True
            title = "Started practice"
        elif action == "skip_check":
            objectives = state["curriculum"]["objectives"]
            current_obj = objectives[min(state["objective_index"], len(objectives) - 1)]
            if current_obj.get("assessment_required", True) and not data.get("optional_check"):
                raise ValueError("This lesson requires a practice check before moving on.")
            if state["stage"] not in {"lesson", "attempt"}:
                raise ValueError("Open the lesson before skipping an optional check.")
            review.record_unassessed(state, current_obj["id"])
            state["objective_index"] += 1
            state["stage"] = "complete" if state["objective_index"] >= len(objectives) else "ready"
            learning_history.clear_current(state)
            title = "Skipped optional check (recorded as unassessed)"
        elif action == "start_review":
            on_date = date.fromisoformat(data["on_date"]) if data.get("on_date") else review.today()
            due_res = review.due(state, on_date=on_date)
            approved = review.approved_ids(state)
            requested_id = data.get("objective_id")
            if requested_id:
                if requested_id not in approved or not (state.get("review") or {}).get(requested_id, {}).get("taught"):
                    raise ValueError("Only previously taught concepts in the approved curriculum can be reviewed.")
                target_id = requested_id
            else:
                candidates = due_res["needs_relearning"] + due_res["selected"]
                if not candidates:
                    raise ValueError("No previously taught concepts are due for review right now.")
                target_id = candidates[0]
            objectives = state["curriculum"]["objectives"]
            target_obj = next(
                (
                    o for o in objectives
                    if o["id"] == target_id or any(c.get("id") == target_id for c in o.get("concepts", []))
                ),
                None,
            )
            if not target_obj:
                raise ValueError("The selected review concept does not belong to the active curriculum.")
            mod_label = target_obj.get("module_title") or "Earlier unit"
            if not state.get("active_review"):
                state["saved_before_review"] = {
                    "stage": state.get("stage"),
                    "question": state.get("question"),
                    "attempt": state.get("attempt"),
                    "assessment": state.get("assessment"),
                    "repair": state.get("repair"),
                    "exercise_instance": state.get("exercise_instance"),
                    "assistance": state.get("assistance"),
                }
            rec = (state.get("review") or {}).get(target_id, {})
            if target_id in due_res["needs_relearning"] or rec.get("status") == "needs_relearning" or rec.get("lapses", 0) >= 3:
                relearn_lesson, metadata = await run_in_threadpool(web_tutor.teach, state, target_obj)
                label = f"Relearning from {mod_label}: {target_obj['title']}"
                state["active_review"] = {
                    "id": target_id,
                    "objective_id": target_obj["id"],
                    "title": target_obj["title"],
                    "module_title": mod_label,
                    "mode": "relearning",
                    "label": label,
                    "on_date": on_date.isoformat(),
                }
                state["repair"] = {
                    "explanation": relearn_lesson["explanation"] + "\n\n" + "\n".join(relearn_lesson.get("worked_example", [])),
                    "observation": f"Relearning {target_obj['title']} step by step before further review.",
                }
                state["metadata"] = metadata
                state["stage"] = "repair"
                title = f"Started relearning review: {target_obj['title']}"
            else:
                result, metadata = await run_in_threadpool(web_tutor.practice, state, True, target_obj)
                label = f"Review from {mod_label}: {target_obj['title']}"
                instance_id = secrets.token_hex(10)
                state["active_review"] = {
                    "id": target_id,
                    "objective_id": target_obj["id"],
                    "title": target_obj["title"],
                    "module_title": mod_label,
                    "mode": "practice",
                    "label": label,
                    "on_date": on_date.isoformat(),
                }
                for key in ('attempt','assessment','repair','episode_observation'):
                    state.pop(key, None)
                state.update(
                    question={**result, "review_label": label, "review_objective_id": target_obj["id"]},
                    metadata=metadata,
                    stage="attempt",
                    exercise_instance=instance_id,
                    assistance=episode_helpers.default_assistance(instance_id),
                )
                title = f"Started review: {target_obj['title']}"
        elif action == "skip_review":
            on_date = data.get("on_date") or review.today().isoformat()
            disable_id = data.get("disable_objective_id")
            if disable_id and disable_id in (state.get("review") or {}):
                state["review"][disable_id]["review_enabled"] = False
            active_rev = state.pop("active_review", None)
            saved = state.pop("saved_before_review", None)
            state["review_skipped_on"] = str(on_date)
            state.setdefault("review_history", []).append({
                "objective_id": (active_rev or {}).get("id") or disable_id or "due_review",
                "status": "skipped",
                "date": str(on_date),
            })
            if saved:
                for k in ("question", "attempt", "assessment", "repair", "exercise_instance", "assistance"):
                    if saved.get(k) is not None:
                        state[k] = saved[k]
                    else:
                        state.pop(k, None)
                state["stage"] = saved.get("stage") or ("lesson" if state.get("lesson") else "ready")
            title = "Skipped optional review"
        elif action == "attempt":
            if state["stage"] != "attempt":
                raise ValueError("Open a practice problem first.")
            answer = limited_text(data.get("answer", ""), 900); work = limited_text(data.get("work", ""), 1400)
            files=store.reasoning_files(account['id'],cid,state,data.get('attachment_ids',[]))
            attached='\n\n'.join('Attached learner reasoning ('+f['name']+'):\n'+f['text'] for f in files)
            if len((work+attached).encode('utf-8'))>6000:
                raise ValueError('Use shorter reasoning or fewer attachments, up to 6 KB of combined text.')
            combined=work+('\n\n'+attached if attached else '')
            if not answer:
                raise ValueError("Write an answer or describe where you got stuck.")
            result, metadata = await run_in_threadpool(web_tutor.assess, state, answer, combined)
            next_stage = "feedback" if result["status"] == "correct" else "diagnostic"
            state.update(attempt={"answer":answer,"work":combined}, assessment=result, metadata=metadata, stage=next_stage)
            if next_stage == "diagnostic":
                episode_helpers.record_assistance_event(state, "corrective_feedback")
            assistance = state.get("assistance") or {}
            help_used = bool(
                assistance.get("hint_opened")
                or assistance.get("corrective_feedback")
                or assistance.get("worked_solution_shown")
                or state.get("repaired_in_objective")
            )
            active_rev = state.get("active_review")
            current_obj = state['curriculum']['objectives'][min(state['objective_index'], len(state['curriculum']['objectives']) - 1)]
            target_oid = active_rev["id"] if active_rev else current_obj["id"]
            on_date = date.fromisoformat(data["on_date"]) if data.get("on_date") else (date.fromisoformat(active_rev["on_date"]) if active_rev and active_rev.get("on_date") else review.today())
            state["attempts"].append({
                "question": state["question"]["prompt"],
                "answer": answer,
                "work": combined,
                "assessment": result,
                "help_used": help_used,
                "independent": result["status"] == "correct" and not help_used,
                "objective_id": target_oid,
                "is_review": bool(active_rev),
                "created": store.now(),
            })
            if active_rev:
                review.record(state, target_oid, result["status"] == "correct", not help_used, review=True, on_date=on_date)
                rec = state["review"][target_oid]
                state.setdefault("review_history", []).append({
                    "objective_id": target_oid,
                    "title": active_rev.get("title", target_oid),
                    "status": result["status"],
                    "independent": not help_used,
                    "review_status": rec["status"],
                    "lapses": rec["lapses"],
                    "date": on_date.isoformat(),
                })
                if rec["status"] == "needs_relearning":
                    active_rev["mode"] = "relearning"
                    state["repair"] = {
                        "explanation": f"Relearning {active_rev.get('title', 'concept')}: let us step back from drilling and trace the core rule one operation at a time. {result.get('evidence', '')}",
                        "observation": f"Routed {active_rev.get('title', target_oid)} to relearning explanation after repeated review lapses.",
                    }
                    state["stage"] = "repair"
            elif result["status"] == "correct":
                review.record(state, target_oid, True, not help_used, review=False, on_date=on_date)
            title = "Submitted practice attempt"
        elif action == "diagnostic":
            if state["stage"] != "diagnostic":
                raise ValueError("There is no pending diagnostic question.")
            result, metadata = await run_in_threadpool(web_tutor.repair, state, limited_text(data.get("text", ""), 1400))
            state.update(repair=result, metadata=metadata, stage="repair", repaired_in_objective=True)
            episode_helpers.record_assistance_event(state, "worked_solution_shown")
            title = "Worked through a diagnostic and repair"
        elif action == "hint":
            if state["stage"] not in {"attempt", "diagnostic", "repair"}:
                raise ValueError("Open a practice problem before requesting a hint.")
            episode_helpers.record_assistance_event(state, "hint_opened")
            title = "Opened a practice hint"
        elif action == "correct_observation":
            if state["stage"] not in {"diagnostic", "repair", "feedback"}:
                raise ValueError("No active teaching observation to update.")
            obs_text = limited_text(data.get("text", ""), 240)
            if not obs_text:
                raise ValueError("Choose or write a correction for the observation.")
            obs_id = limited_text(str(data.get("observation_id", "")), 80) if data.get("observation_id") else ""
            expected_id = episode_helpers.current_exercise_id(state)
            if obs_id and obs_id != expected_id:
                raise ValueError("Observation does not match the current exercise.")
            state["episode_observation"] = {
                "id": expected_id,
                "text": f"Learner note: {obs_text}",
                "corrected": True,
                "learner_note": obs_text,
                "updated": store.now(),
            }
            observations = list(state.get("observations") or [])
            observations.append({"id": expected_id, "text": obs_text, "time": store.now()})
            state["observations"] = observations[-20:]
            title = "Corrected teaching observation"
        elif action == "next":
            if state.get("active_review"):
                state.pop("active_review", None)
                saved = state.pop("saved_before_review", None)
                if saved:
                    for k in ("question", "attempt", "assessment", "repair", "exercise_instance", "assistance"):
                        if saved.get(k) is not None:
                            state[k] = saved[k]
                        else:
                            state.pop(k, None)
                    state["stage"] = saved.get("stage") or ("lesson" if state.get("lesson") else "ready")
                else:
                    state["stage"] = "lesson" if state.get("lesson") else "ready"
                title = "Completed review check"
            else:
                objectives = state["curriculum"]["objectives"]
                current_obj = objectives[min(state["objective_index"], len(objectives) - 1)]
                if state["stage"] == "lesson" and not current_obj.get("assessment_required", True):
                    review.record_unassessed(state, current_obj["id"])
                    state["objective_index"] += 1
                    state["stage"] = "complete" if state["objective_index"] >= len(objectives) else "ready"
                    learning_history.clear_current(state)
                    title = "Completed reading objective (unassessed)"
                else:
                    if state["stage"] != "feedback":
                        raise ValueError("Complete an independent practice attempt before moving on.")
                    if current_obj["id"] not in (state.get("review") or {}):
                        assistance = state.get("assistance") or {}
                        help_used = bool(
                            assistance.get("hint_opened")
                            or assistance.get("corrective_feedback")
                            or assistance.get("worked_solution_shown")
                            or state.get("repaired_in_objective")
                        )
                        review.record(state, current_obj["id"], True, not help_used, review=False)
                    state["objective_index"] += 1
                    state["stage"] = "complete" if state["objective_index"] >= len(objectives) else "ready"
                    learning_history.clear_current(state)
                    title = "Completed learning objective"
    if request_id and action in DEDUPLICATED_ACTIONS:
        completed[request_id] = {"action": action, "stage": state.get("stage"), "time": store.now()}
        if len(completed) > 40:
            oldest = next(iter(completed))
            completed.pop(oldest, None)
    learning_history.normalize_course_state(state)
    learning_history.record(state)
    store.save_course(account["id"], cid, state, revision, save_explanation=action in {'teach','diagnostic'})
    store.event(account["id"], cid, title)
    return JSONResponse({"id":cid,"state":public_state(state)})


_course_locks = [threading.Lock() for _ in range(64)]
_course_endpoint = course
async def guarded_course(request):
    # One in-flight action per session in the supported single-worker server.
    index = int(hashlib.sha256(request.path_params["cid"].encode()).hexdigest(),16) % len(_course_locks)
    lock = _course_locks[index]
    if not lock.acquire(blocking=False):
        raise ValueError("A request for this learning session is already running. Wait before retrying.")
    try:
        return await _course_endpoint(request)
    finally:
        lock.release()


def activity(request):
    return JSONResponse({"events":store.events(user(request)["id"])})


async def reasoning_upload(request):
    account=user(request);cid=request.path_params['cid']
    state,revision=store.course(account['id'],cid)
    if state['stage']!='attempt':raise ValueError('Open a practice problem before attaching reasoning.')
    store.throttle('reasoning:'+account['id'],40)
    async with request.form(max_files=1,max_fields=1,max_part_size=2*1024*1024) as form:
        upload=form.get('file')
        if not upload or not hasattr(upload,'read'):raise ValueError('Choose a reasoning file.')
        import reasoning_files
        value=await run_in_threadpool(reasoning_files.extract,await upload.read(2*1024*1024+1),upload.filename or 'upload')
    rid=store.add_reasoning_file(account['id'],cid,state,revision,value)
    return JSONResponse({'file':{'id':rid,**value}})


def export(request):
    state, _ = store.course(user(request)["id"], request.path_params["cid"])
    import checkpoints
    format=request.query_params.get('format','md').lower()
    body,mime=checkpoints.export(state,format)
    return Response(body,media_type=mime,headers={"Content-Disposition":f'attachment; filename=learning-checkpoint.{format}'})


class BoundaryMiddleware:
    def __init__(self, app): self.app = app
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        request = Request(scope)
        if request.method == "POST":
            origin = request.headers.get("origin")
            if origin and origin.rstrip("/") != str(request.base_url).rstrip("/"):
                return await JSONResponse({"error":"Cross-site requests are not allowed."},403)(scope,receive,send)
        total = 0
        async def bounded_receive():
            nonlocal total
            message = await receive(); total += len(message.get("body",b""))
            if total > 26*1024*1024:
                raise ValueError("Upload is larger than 25 MB.")
            return message
        async def no_cache(message):
            if message["type"] == "http.response.start":
                message["headers"] += [(b"cache-control",b"no-store"),(b"x-content-type-options",b"nosniff"),(b"referrer-policy",b"same-origin")]
            await send(message)
        try:
            await self.app(scope,bounded_receive,no_cache)
        except PermissionError as error:
            await JSONResponse({"error":str(error),"code":"auth_required","retryable":False},401)(scope,receive,send)
        except ModelRequestError as error:
            msg = str(error)
            code = "timeout" if "timed out" in msg.lower() else "model_error"
            await JSONResponse({"error":msg,"code":code,"retryable":True},400)(scope,receive,send)
        except (SetupError, BudgetExceeded) as error:
            await JSONResponse({"error":str(error),"code":"service_unavailable","retryable":False},400)(scope,receive,send)
        except ValueError as error:
            msg = str(error)
            in_flight = "already running" in msg.lower()
            code = "in_flight" if in_flight else ("rate_limit" if "too many" in msg.lower() or "wait" in msg.lower() else "validation")
            await JSONResponse({"error":msg,"code":code,"retryable":in_flight},400)(scope,receive,send)


# Starlette does not provide a regex path converter; use explicit auth routes.
async def not_found(request, exception):
    if request.url.path.startswith('/api/'):
        return JSONResponse({'error':'This page was not found.','code':'not_found','retryable':False},404)
    return HTMLResponse('''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Personal Learning</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:#000;color:#fff;font-family:system-ui,sans-serif}main{max-width:32rem;padding:28px}h1{font-size:2rem}p{color:#a9adb5;line-height:1.6}a{display:inline-block;padding:12px 18px;border:1px solid #a9adb5;border-radius:12px;color:inherit;text-decoration:none}a:hover{background:#25272a}a:focus-visible{outline:2px solid #a5d9f4;outline-offset:4px}@media(prefers-color-scheme:light){body{background:#faf9f6;color:#16181b}p{color:#62656c}a:hover{background:#e9eaed}}</style></head>
<body><main><h1>Page not found</h1><p>We couldn’t find that page. Return home to continue learning.</p><a href="/">Back to learning</a></main></body></html>''',status_code=404)


routes = [Route("/",lambda r:FileResponse(ROOT/"web"/"index.html")),Route("/api/me",me)]
async def signup(request): request.path_params["mode"]="signup"; return await auth(request)
async def signin(request): request.path_params["mode"]="login"; return await auth(request)
routes += [Route("/api/auth/signup",signup,methods=["POST"]),Route("/api/auth/login",signin,methods=["POST"]),Route("/api/logout",logout,methods=["POST"]),Route("/auth/google",google_start),Route("/auth/google/callback",google_callback,name="google_callback"),Route("/api/profile",profile,methods=["POST"]),Route("/api/resources",resources,methods=["GET","POST"]),Route("/api/courses",courses,methods=["GET","POST"]),Route("/api/courses/{cid}",guarded_course,methods=["GET","POST"]),Route("/api/courses/{cid}/reasoning",reasoning_upload,methods=["POST"]),Route("/api/courses/{cid}/export",export),Route("/api/activity",activity),Mount("/assets",StaticFiles(directory=ROOT/"web"),name="assets")]
app = Starlette(routes=routes,exception_handlers={404:not_found},middleware=[Middleware(BoundaryMiddleware),Middleware(SessionMiddleware,secret_key=os.getenv("WEB_SESSION_SECRET") or SECRET_FILE.read_text().strip(),https_only=os.getenv("COOKIE_SECURE","false").lower()=="true",same_site="lax")])
