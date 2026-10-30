from copy import deepcopy
from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

import storage
import tutor
from content import TOPICS
from llm import ModelRequestError

APP_PATH = Path(__file__).resolve().parents[1] / "app.py"


def button(app, label):
    return next(x for x in app.button if x.label == label)


def field(items, label):
    return next(x for x in items if x.label == label)


@pytest.fixture
def local_app(monkeypatch, tmp_path):
    monkeypatch.setenv("LEARNING_DB", str(tmp_path / "learning.sqlite3"))
    plan = {"title": "Algebra to coordinates", "scope_note": "Three connected topics; alignment unverified.", "objectives": [
        {"id": cid, "title": title, "outcome": "Understand " + title.lower(), "prerequisites": [], "source_ids": ["bundled"], "minutes": 10}
        for cid, title in TOPICS.items()]}
    monkeypatch.setattr(tutor, "propose", lambda *args: (deepcopy(plan), {}))
    monkeypatch.setattr(tutor, "teach", lambda *args: ({"explanation": "Keep both sides equal.", "worked_example": ["Subtract 4: 2x=6.", "Divide 2: x=3."]}, {}))
    monkeypatch.setattr(tutor, "repair", lambda *args: ({"explanation": "3x=12 means divide both sides by 3; x=4.", "observation": "Needed support dividing by the coefficient."}, {}))
    def assess(state, qid, answer, work):
        correct = answer == "5"
        return {"status": "correct" if correct else "incorrect", "checked_answer": correct, "evidence": "Showed equal operations.", "possible_gap": "coefficient", "diagnostic_question": "What does 3x mean?"}, {}
    monkeypatch.setattr(tutor, "assess", assess)
    return AppTest.from_file(APP_PATH).run()


def through_to_attempt(app):
    field(app.text_area, "Your learning goal").set_value("Understand equations")
    button(app, "Build my learning plan").click().run()
    button(app, "Propose my plan").click().run()
    assert not any(x.label == "Teach me this idea" for x in app.button)
    button(app, "Accept this plan").click().run()
    button(app, "Teach me this idea").click().run()
    button(app, "Try it myself").click().run()
    assert not app.exception


def token_of(app):
    value = app.query_params["session"]
    return value[0] if isinstance(value, list) else value


def test_ui_repair_changed_question_and_resume(local_app):
    app = local_app
    button(app, "Build my learning plan").click().run()
    assert app.error
    through_to_attempt(app)
    token = token_of(app)
    field(app.text_input, "Your answer").set_value("12")
    field(app.text_area, "Show your steps or explain your decision").set_value("3x=12 so x=12")
    button(app, "Check my reasoning").click().run()
    assert storage.load(token)["stage"] == "feedback"
    assert not any("x=4" in str(x.value) for x in app.markdown)
    field(app.text_area, "Your response").set_value("I do not know how to undo the 3")
    button(app, "Help with this step").click().run()
    button(app, "Try a different problem").click().run()
    assert any("4x + 3 = 23" in str(x.value) for x in app.subheader)
    field(app.text_input, "Your answer").set_value("5")
    field(app.text_area, "Show your steps or explain your decision").set_value("Subtract 3: 4x=20. Divide both sides by 4: x=5.")
    button(app, "Check my reasoning").click().run()
    button(app, "Continue").click().run()
    assert not app.exception
    assert storage.load(token)["stage"] == "complete"
    assert len(storage.attempts(token)) == 2
    assert storage.attempts(token)[0]["help_used"] is True
    resumed = AppTest.from_file(APP_PATH)
    resumed.query_params["session"] = token
    resumed.run()
    assert resumed.title[0].value == "One step further"
    assert not resumed.exception


def test_timeout_preserves_pending_work_and_unlocks(local_app, monkeypatch):
    app = local_app
    through_to_attempt(app)
    def fail(*args):
        raise ModelRequestError("The request timed out.")
    monkeypatch.setattr(tutor, "assess", fail)
    field(app.text_input, "Your answer").set_value("12")
    field(app.text_area, "Show your steps or explain your decision").set_value("3x=12")
    button(app, "Check my reasoning").click().run()
    assert any("timed out" in x.value for x in app.error)
    token = token_of(app)
    assert storage.load(token)["attempt"]["answer"] == "12"
    assert storage.load(token)["stage"] == "attempt"
    assert storage.claim(token)
    storage.release(token)
    assert len(storage.attempts(token)) == 1


def test_plan_revision_keeps_teaching_blocked(local_app):
    app = local_app
    field(app.text_area, "Your learning goal").set_value("Understand equations")
    button(app, "Build my learning plan").click().run()
    button(app, "Propose my plan").click().run()
    field(app.text_area, "What should change?").set_value("Use smaller steps").run()
    button(app, "Request a revised plan").click().run()
    state = storage.load(token_of(app))
    assert state["version"] == 2 and state["approved_version"] is None
    assert app.title[0].value == "Does this plan fit?"


def test_profile_observation_export_and_separate_session(local_app):
    app = local_app
    through_to_attempt(app)
    token = token_of(app)
    field(app.text_input, "Interest").set_value("Music")
    button(app, "Save preferences").click().run()
    assert storage.load(token)["profile"]["interest"] == "Music"
    assert len(app.get("download_button")) == 1
    button(app, "Start a separate session").click().run()
    assert app.title[0].value == "What would you like to understand?"
    assert storage.load(token) is not None


def test_pace_controls_and_observation_editing(local_app):
    app = local_app
    field(app.text_area, "Your learning goal").set_value("Understand equations")
    button(app, "Build my learning plan").click().run()
    button(app, "Propose my plan").click().run()
    button(app, "Accept this plan").click().run()
    button(app, "Teach me this idea").click().run()
    assert button(app, "Show the next worked step")
    button(app, "Show the next worked step").click().run()
    assert any("Divide 2" in str(x.value) for x in app.markdown)
    field(app.radio, "Support").set_value("Skip familiar steps")
    button(app, "Adjust this explanation").click().run()
    assert any(x.label == "Worked steps, if useful" for x in app.expander)
    token = token_of(app)
    state = storage.load(token)
    state["observations"] = [{"text": "Requested help", "attempt_id": "test-attempt", "time": "2026-10-25"}]
    storage.save(token, state)
    app.run()
    field(app.text_input, "Teaching observation · you can correct it").set_value("I was checking the wording")
    button(app, "Save observation").click().run()
    assert storage.load(token)["observations"][0]["text"] == "I was checking the wording"
    button(app, "Delete observation").click().run()
    assert storage.load(token)["observations"] == []


def test_review_skip_and_delete_controls(local_app):
    app = local_app
    through_to_attempt(app)
    token = token_of(app)
    state = storage.load(token)
    state.update(stage="review_attempt", pending="ALG-02", attempt_id="review-test")
    storage.save(token,state)
    app.run()
    button(app,"Skip review and continue").click().run()
    assert storage.load(token)["stage"] == "complete"
    assert storage.load(token)["review_history"][-1]["outcome"] == "skipped"
    field(app.checkbox,"Delete this disposable profile and its learning records").check().run()
    button(app,"Delete session").click().run()
    assert storage.load(token) is None
    assert app.title[0].value == "What would you like to understand?"


def test_source_modes_empty_validation_and_previews(local_app):
    app = local_app
    field(app.text_area,"Your learning goal").set_value("Understand equations")
    button(app,"Build my learning plan").click().run()
    field(app.radio,"Reference").set_value("Paste text").run()
    assert button(app,"Propose my plan").disabled
    field(app.text_area,"Reference text").set_value("Solve equations by applying the same operation to both sides.").run()
    assert not button(app,"Propose my plan").disabled
    assert any("Solve equations" in str(x.value) for x in app.text)
    field(app.radio,"Reference").set_value("Upload a PDF").run()
    assert button(app,"Propose my plan").disabled
    field(app.radio,"Reference").set_value("Use the starter course").run()
    assert not button(app,"Propose my plan").disabled
