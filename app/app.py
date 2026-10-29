import uuid
import re
from datetime import datetime, timezone
from pathlib import Path

import streamlit as st

import storage
import tutor
import review
import homepage
from content import TOPICS, QUESTIONS, bundled_source, questions_for, pdf_source
from llm import ModelRequestError, SetupError
from usage import BudgetExceeded

st.set_page_config(page_title="Personal Learning", layout="centered", initial_sidebar_state="collapsed")
st.html('<span hidden data-learning-styles></span><style>' + Path(__file__).with_name("styles.css").read_text() + (Path(__file__).with_name("frontend") / "home.css").read_text() + "</style>")


def now():
    return datetime.now(timezone.utc).isoformat()


def save():
    storage.save(token, state)


def action(label, operation):
    if not storage.claim(token):
        st.warning("A request is already running for this session. Wait for it to finish. An interrupted request unlocks after three minutes.")
        return
    success = False
    try:
        current = storage.load(token)
        if current["_revision"] != state["_revision"]:
            raise RuntimeError("This session changed in another tab. Reload before continuing.")
        with st.spinner(label):
            operation()
            save()
        success = True
    except (ModelRequestError, SetupError, BudgetExceeded, ValueError, RuntimeError) as error:
        st.error(str(error))
        st.caption("Your saved progress is preserved. Retry the action when ready.")
    finally:
        storage.release(token)
    if success:
        st.rerun()


def start_question(question_id, stage="attempt", help_used=False):
    state.update(pending=question_id, stage=stage, help_used=help_used, attempt=None, assessment=None)
    state.pop("diagnostic_response", None)
    state["attempt_id"] = uuid.uuid4().hex


token = st.query_params.get("session", "")
state = storage.load(token) if token else None

if not state:
    st.html(homepage.scene_markup())
    with st.container(key="home_intro"):
        with st.container(key="home_hero"):
            st.title("What would you like to understand?", anchor=False)
            st.write("A short plan. One idea at a time. Help with the step that holds you up.")
        with st.form("start"):
            goal = st.text_area("Your learning goal", placeholder="Tell me what you want to learn, or where you're getting stuck…", max_chars=700, height=160, key="onboarding_goal", label_visibility="collapsed")
            with st.container(key="home_actions"):
                tailor_action, build_action = st.columns([1, 1.4])
                with tailor_action:
                    st.html('<button id="tailor-learning" type="button" aria-controls="learning-details" aria-expanded="false">Tailor my learning</button>')
                with build_action:
                    submitted = st.form_submit_button("Build my learning plan", type="primary", icon=":material/arrow_upward:", use_container_width=False)
    with st.container(key="home_details"):
        st.html('<div id="learning-details" tabindex="-1"></div>')
        with st.expander("Your learning pattern"):
            settings, preview = st.columns([1, 1.1], gap="large")
            with settings:
                st.subheader("Make it fit you", anchor=False)
                st.write("Choose how you want to learn. Every detail is optional.")
                language = st.selectbox("Teaching language", ["English", "Bahasa Indonesia"], key="onboarding_language", filter_mode=None)
                level = st.selectbox("Starting point", ["I know arithmetic; equations are difficult", "I need a refresher", "I can solve basic equations"], key="onboarding_level", filter_mode=None)
                interest = st.text_input("An interest for examples", max_chars=100, key="onboarding_interest")
                tone = st.selectbox("Tone", ["Calm and direct", "Friendly and encouraging", "Formal"], key="onboarding_tone", filter_mode=None)
                context = st.text_input("Course or exam context", max_chars=200, key="onboarding_context")
            with preview:
                with st.container(key="home_preview"):
                    st.html(homepage.preview_markup(language, level, interest, tone, context))
            st.caption("Your choices are kept while you write your goal. Close this section whenever you like.")
    with st.container(key="home_secondary"):
        with st.expander("Return to a saved session"):
            resume = st.text_input("Session code", type="password")
            if st.button("Resume session"):
                if storage.load(resume.strip()):
                    st.query_params["session"] = resume.strip()
                    st.rerun()
                else:
                    st.error("That session code was not found on this local installation.")
        st.caption("Local test build. Use non-sensitive demo material only. Your selected references, preferences, and attempts are sent to Nebius when generating help.")
    if submitted:
        if not goal.strip():
            st.error("Write a learning goal so the plan has a clear purpose.")
        else:
            token = storage.create({"goal": goal.strip(), "language": language, "level": level, "interest": interest, "tone": tone, "context": context, "pace": "One reasoning move at a time"})
            st.query_params["session"] = token
            st.rerun()
    st.html(homepage.motion_markup(), unsafe_allow_javascript=True)
    st.stop()

st.markdown("**Personal Learning**")
stage = state["stage"]
st.caption("1 · Your goal / 2 · Your plan / 3 · Your next step")

if stage == "source":
    st.title("What are we learning from?")
    st.write("Bring a short reference, or use the course prepared for this prototype.")
    modes = ["Use the starter course", "Paste text", "Upload a PDF"]
    source_mode = {"bundled": 0, "pasted": 1, "pdf": 2}.get((state.get("source") or {}).get("id"), 0)
    mode = st.radio("Reference", modes, index=source_mode, horizontal=True)
    source = bundled_source()
    if mode == "Paste text":
        text = st.text_area("Reference text", value=(state.get("source") or {}).get("text", "") if (state.get("source") or {}).get("id") == "pasted" else "", max_chars=9000, height=200)
        source = {"id": "pasted", "title": "Pasted reference", "origin": "Learner supplied", "text": text}
    elif mode == "Upload a PDF":
        upload = st.file_uploader("Short text-based PDF · up to 2 MB and 12 pages", type=["pdf"])
        source = state.get("source") if (state.get("source") or {}).get("id") == "pdf" else None
        if upload:
            try:
                source = pdf_source(upload.getvalue(), upload.name)
            except Exception as error:
                st.error(str(error) if isinstance(error, ValueError) else "This PDF could not be read. Paste the relevant text instead.")
    if source:
        with st.expander("Preview the reference", expanded=mode != "Use the starter course"):
            st.text(source["text"])
    st.caption("Supported topics: linear equations, substitution, and points on a line. School or exam alignment is unverified.")
    if st.button("Propose my plan", type="primary", use_container_width=True, disabled=not source or not source["text"].strip()):
        def propose():
            state["source"] = source
            save()
            plan, metadata = tutor.propose(state)
            state.update(curriculum=plan, version=state["version"]+1, approved_version=None, stage="plan", metadata=metadata)
        action("Reading your reference and proposing a small plan…", propose)

elif stage == "plan":
    st.title("Does this plan fit?")
    st.write(state["curriculum"]["scope_note"])
    with st.form("approve_plan"):
        title = st.text_input("Course title", state["curriculum"]["title"], max_chars=120)
        outcomes = []
        for i, item in enumerate(state["curriculum"]["objectives"]):
            st.subheader(f"{i+1}. {item['title']}")
            outcomes.append(st.text_area("What you will be able to do", item["outcome"], key=f"outcome_{state['version']}_{i}", max_chars=350))
            st.caption(f"About {item['minutes']} minutes · Source: {state['source']['title']}")
        approved = st.form_submit_button("Accept this plan", type="primary", use_container_width=True)
    if approved:
        if not title.strip() or any(not x.strip() for x in outcomes):
            st.error("Keep a title and an outcome for each topic.")
        else:
            state["curriculum"]["title"] = title
            for item, outcome in zip(state["curriculum"]["objectives"], outcomes):
                item["outcome"] = outcome
            state["approved_version"] = state["version"]
            state.update(stage="ready", objective_index=0)
            save(); st.rerun()
    with st.expander("Change the scope or order"):
        changes = st.text_area("What should change?", max_chars=700)
        if st.button("Request a revised plan", disabled=not changes.strip()):
            def revise():
                plan, metadata = tutor.propose(state, changes)
                state.update(curriculum=plan, version=state["version"]+1, approved_version=None, metadata=metadata)
            action("Revising the plan…", revise)
    st.caption("Teaching begins only after you accept this version. School alignment remains unverified.")

elif stage == "ready":
    item = tutor.objective(state)
    st.title(item["title"])
    st.write(item["outcome"])
    st.caption(f"Topic {state['objective_index']+1} of {len(state['curriculum']['objectives'])} · Your plan is accepted")
    if st.button("Teach me this idea", type="primary", use_container_width=True):
        def lesson():
            result, metadata = tutor.teach(state)
            state.update(lesson=result, metadata=metadata, stage="lesson", lesson_step=0)
            cid = item["id"]
            if cid not in state["review"]:
                review.record(state, cid, False, False)
                state["review"][cid].update(status="unassessed", evidence="Explanation opened; not yet independently assessed")
        action("Preparing one explanation and a worked example…", lesson)

elif stage == "lesson":
    st.title(tutor.objective(state)["title"])
    st.markdown(state["lesson"]["explanation"])
    worked = state["lesson"]["worked_example"]
    if isinstance(worked, list):
        pace = state["profile"]["pace"]
        if pace == "Skip familiar steps":
            with st.expander("Worked steps, if useful"):
                for i, step in enumerate(worked):
                    st.markdown(f"{i+1}. " + re.sub(r"^\d+[.)]\s*", "", step))
        else:
            limit = min(state.get("lesson_step", 0)+1, len(worked))
            for i, step in enumerate(worked[:limit]):
                st.markdown(f"{i+1}. " + re.sub(r"^\d+[.)]\s*", "", step))
            if limit < len(worked) and st.button("Show the next worked step"):
                state["lesson_step"] = limit; save(); st.rerun()
    else:
        st.markdown(worked)
    if st.button("Try it myself", type="primary", use_container_width=True):
        start_question(questions_for(tutor.objective(state)["id"])[0]); save(); st.rerun()
    with st.expander("Adjust the explanation"):
        support = st.radio("Support", ["Smaller steps", "Show a worked example", "Skip familiar steps"])
        if st.button("Adjust this explanation"):
            def adjust():
                state["profile"]["pace"] = support
                state["lesson_step"] = 0
                save()
                state["lesson"], state["metadata"] = tutor.teach(state, support)
            action("Adjusting the explanation…", adjust)

elif stage in ("attempt", "changed", "review_attempt"):
    st.title("A quick review" if stage == "review_attempt" else "Your turn")
    st.subheader(QUESTIONS[state["pending"]]["prompt"])
    if stage == "review_attempt":
        st.caption("A previously taught idea, due for review. You may skip it.")
    previous = state.get("attempt") or {}
    with st.form("attempt_" + state["attempt_id"]):
        answer = st.text_input("Your answer", value=previous.get("answer", ""), max_chars=100)
        work = st.text_area("Show your steps or explain your decision", value=previous.get("work", ""), max_chars=1800, height=150)
        submitted = st.form_submit_button("Check my reasoning", type="primary", use_container_width=True)
    if submitted:
        if not answer.strip() and not work.strip():
            st.error("Try an answer or describe where you got stuck.")
        else:
            def evaluate():
                state["attempt"] = {"question_id": state["pending"], "answer": answer, "work": work, "time": now(), "help_used": state["help_used"], "kind": stage}
                storage.add_attempt(token, state["attempt_id"], state["attempt"])
                save()
                result, metadata = tutor.assess(state, state["pending"], answer, work)
                state.update(assessment=result, metadata=metadata, return_stage=stage, stage="feedback")
                storage.add_attempt(token, state["attempt_id"], {**state["attempt"], "assessment": result})
            action("Checking your answer and the steps behind it…", evaluate)
    if stage == "review_attempt" and st.button("Skip review and continue"):
        state.update(stage="complete", review_offered=True)
        state["review_history"].append({"objective": QUESTIONS[state["pending"]]["objective"], "time": now(), "outcome": "skipped"})
        save(); st.rerun()

elif stage == "feedback":
    result = state["assessment"]
    st.title("Let's check one step" if result["status"] != "correct" else "That reasoning works")
    if result["status"] == "correct":
        st.write(result["evidence"])
        st.caption("This is evidence from one attempt, not a claim of mastery.")
        if st.button("Continue", type="primary", use_container_width=True):
            cid = QUESTIONS[state["pending"]]["objective"]
            is_review = state.get("return_stage") == "review_attempt"
            review.record(state, cid, True, not state["help_used"], review=is_review)
            if is_review:
                state["review_history"].append({"objective": cid, "time": now(), "outcome": "correct"})
                state.update(stage="complete", review_offered=True)
            elif state["pending"] == questions_for(cid)[0]:
                start_question(questions_for(cid)[1], "changed")
            else:
                state.update(stage="complete")
            save(); st.rerun()
    else:
        st.write("The answer does not match the checked result." if result["checked_answer"] is False else "I need one more step to understand your reasoning.")
        # Private assessment fields can contain answers; render only the diagnostic at this stage.
        st.write(result["diagnostic_question"])
        with st.form("diagnostic"):
            diagnostic = st.text_area("Your response", value=state.get("diagnostic_response", ""), max_chars=1500)
            submitted = st.form_submit_button("Help with this step", type="primary", use_container_width=True)
        if submitted:
            if not diagnostic.strip():
                st.error("Show the step, or write 'I'm not sure'.")
            else:
                def help_step():
                    state["diagnostic_response"] = diagnostic
                    save()
                    state["repair"], state["metadata"] = tutor.repair(state, diagnostic)
                    state["observations"].append({"text": state["repair"]["observation"], "attempt_id": state["attempt_id"], "time": now()})
                    storage.add_attempt(token, state["attempt_id"], {**state["attempt"], "assessment": state["assessment"],
                        "help_used": True, "diagnostic_response": diagnostic, "repair": state["repair"]})
                    cid = QUESTIONS[state["pending"]]["objective"]
                    is_review = state.get("return_stage") == "review_attempt"
                    review.record(state, cid, False, False, review=is_review)
                    if is_review:
                        state["review_history"].append({"objective": cid, "time": now(), "outcome": "needs_help"})
                    state.update(stage="repair", help_used=True)
                action("Using that step to choose suitable help…", help_step)

elif stage == "repair":
    st.title("Work through the missing step")
    st.markdown(state["repair"]["explanation"])
    st.markdown("**Checked solution**")
    st.write(QUESTIONS[state["pending"]]["solution"])
    cid = QUESTIONS[state["pending"]]["objective"]
    pair = questions_for(cid)
    other = pair[1] if state["pending"] == pair[0] else pair[0]
    st.caption("The starter set has two questions per topic. Repeated questions are practice, not fresh evidence of transfer.")
    if st.button("Try a different problem", type="primary", use_container_width=True):
        start_question(other, "changed", False); save(); st.rerun()

elif stage == "complete":
    st.title("One step further")
    st.write("Your attempts and next step are saved. You can continue now or return to this session later.")
    if state.get("review_offer_date") != review.today().isoformat():
        state.update(review_offered=False, review_offer_date=review.today().isoformat(), review_candidate=None)
        save()
    due = review.due(state)
    if due["selected"] and not state.get("review_offered"):
        cid = state.get("review_candidate") or due["selected"][0]
        if not state.get("review_candidate"):
            state["review_candidate"] = cid
            save()
        st.write(f"A short review is due: {TOPICS[cid]}.")
        if st.button("Try the review", type="primary", use_container_width=True):
            state["review_offered"] = True
            start_question(questions_for(cid)[1], "review_attempt")
            state["review_history"].append({"objective": cid, "time": now(), "outcome": "selected"})
            save(); st.rerun()
        if st.button("Continue without review"):
            state["review_offered"] = True; save(); st.rerun()
    elif state["objective_index"] + 1 < len(state["curriculum"]["objectives"]):
        if st.button("Move to the next idea", type="primary", use_container_width=True):
            state.update(objective_index=state["objective_index"]+1, stage="ready", pending=None, help_used=False, review_offered=False)
            save(); st.rerun()
    else:
        st.write("You have reached the end of this small course. Return when a review is due.")
        if due["needs_relearning"]:
            st.write("Some topics need another explanation before further review.")
            if st.button("Relearn the first flagged idea"):
                cid = due["needs_relearning"][0]
                state.update(objective_index=next(i for i,x in enumerate(state["curriculum"]["objectives"]) if x["id"]==cid), stage="ready", review_offered=False)
                save(); st.rerun()

with st.expander("Your session · preferences, progress, and source"):
    st.caption("Keep this URL or session code to resume after closing the browser. Anyone with it can access this disposable local profile. This is not public-service authentication.")
    st.code(token, language=None)
    with st.form("preferences"):
        languages = ["English", "Bahasa Indonesia"]
        language = st.selectbox("Language", languages, index=languages.index(state["profile"]["language"]))
        interest = st.text_input("Interest", state["profile"].get("interest", ""), max_chars=100)
        paces = ["One reasoning move at a time", "Smaller steps", "Show a worked example", "Skip familiar steps"]
        pace = st.selectbox("Explanation pace", paces, index=paces.index(state["profile"]["pace"]))
        tones = ["Calm and direct", "Friendly and encouraging", "Formal"]
        tone = st.selectbox("Teaching tone", tones, index=tones.index(state["profile"]["tone"]))
        level = st.text_input("Starting level", state["profile"]["level"], max_chars=150)
        context = st.text_input("School or exam context", state["profile"].get("context", ""), max_chars=200)
        if st.form_submit_button("Save preferences"):
            state["profile"].update(language=language, interest=interest, pace=pace, tone=tone, level=level, context=context)
            save(); st.rerun()
    if state.get("source"):
        st.write("Reference: " + state["source"]["title"])
        st.text(state["source"]["text"])
    if state["review"]:
        st.write("Review dates use initial prototype rules; they are not measured retention.")
        for cid, item in state["review"].items():
            st.write(f"{TOPICS[cid]}: {item['evidence']}. Next check: {item['next_due']}.")
    for i, observation in enumerate(state["observations"]):
        text = st.text_input("Teaching observation · you can correct it", observation["text"], key=f"obs_{i}")
        st.caption(f"Evidence: attempt {observation['attempt_id'][:8]} · {observation['time']}")
        if st.button("Save observation", key=f"save_obs_{i}"):
            state["observations"][i]["text"] = text; save(); st.rerun()
        if st.button("Delete observation", key=f"delete_obs_{i}"):
            state["observations"].pop(i); save(); st.rerun()
    st.download_button("Download Markdown checkpoint", tutor.export_checkpoint(state, storage.attempts(token)), file_name="learning-checkpoint.md", mime="text/markdown")
    st.caption("Downloading is optional. Progress is saved locally whether or not you download.")
    if st.button("Start a separate session"):
        st.query_params.clear(); st.rerun()
    confirm_delete = st.checkbox("Delete this disposable profile and its learning records")
    if st.button("Delete session", disabled=not confirm_delete):
        storage.delete(token); st.query_params.clear(); st.rerun()
