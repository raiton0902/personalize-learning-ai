import json
import os
import subprocess
import sys
from datetime import date, timedelta
from unittest.mock import patch

import pytest

import storage
import tutor
import review
from content import check_answer, bundled_source


@pytest.fixture(autouse=True)
def isolated_storage(monkeypatch, tmp_path):
    monkeypatch.setenv("LEARNING_DB", str(tmp_path / "learning.sqlite3"))


def profile():
    return {"goal": "Understand equations", "language": "English", "level": "Arithmetic", "interest": "", "tone": "Calm and direct", "pace": "One reasoning move at a time"}


def accepted():
    token = storage.create(profile())
    state = storage.load(token)
    state.update(source=bundled_source(), version=1, approved_version=1,
                 curriculum={"title": "Equations", "scope_note": "Unverified alignment", "objectives": [
                     {"id": "algebra.linear_equations", "title": "Linear equations", "outcome": "Solve two-step equations", "prerequisites": [], "source_ids": ["bundled"], "minutes": 10}]})
    storage.save(token, state)
    return token, state


def test_restart_and_two_learner_isolation():
    first = storage.create(profile())
    second = storage.create({**profile(), "goal": "Coordinate geometry"})
    state = storage.load(first)
    state.update(stage="attempt", pending="ALG-02")
    storage.save(first, state)
    script = "import storage,json; s=storage.load(" + repr(first) + "); print(json.dumps([s['stage'],s['pending']]))"
    env = {**os.environ, "PYTHONPATH": str(__import__('pathlib').Path('app').resolve())}
    restarted = subprocess.check_output([sys.executable, "-c", script], env=env, text=True)
    assert json.loads(restarted) == ["attempt", "ALG-02"]
    assert storage.load(second)["stage"] == "source"
    assert storage.load("wrong-code") is None


def test_stale_tab_cannot_overwrite_and_request_lock():
    token, first = accepted()
    stale = storage.load(token)
    first["profile"]["goal"] = "New goal"
    storage.save(token, first)
    with pytest.raises(RuntimeError, match="another tab"):
        storage.save(token, stale)
    assert storage.claim(token)
    assert not storage.claim(token)
    storage.release(token)
    assert storage.claim(token)


def test_attempt_idempotency_and_delete_are_isolated():
    first, state = accepted()
    second = storage.create(profile())
    storage.add_attempt(first, "request", {"answer": "4"})
    storage.add_attempt(first, "request", {"answer": "4", "help_used": True})
    assert storage.attempts(first) == [{"answer": "4", "help_used": True}]
    storage.delete(first)
    assert storage.load(first) is None and storage.load(second) is not None


def test_approval_enforced_before_any_model_call():
    _, state = accepted()
    state["version"] = 2
    with patch("tutor.request_model") as model:
        with pytest.raises(ValueError, match="Accept"):
            tutor.teach(state)
        with pytest.raises(ValueError):
            tutor.assess(state, "ALG-01", "4", "Subtract 5; divide 3")
        model.assert_not_called()


@pytest.mark.parametrize("qid,answer,expected", [("ALG-01","x = 4",True),("ALG-02","4",False),("SUB-01","11.0",True),("GEO-01","ya",True),("GEO-02","no",True),("ALG-01","__import__('os').system('anything')",None),("GEO-01","I understand",None)])
def test_answer_checks_do_not_execute_text(qid, answer, expected):
    assert check_answer(qid, answer) is expected


def test_model_cannot_override_checked_wrong_answer_or_leak_diagnostic():
    _, state = accepted()
    candidate = {"status": "correct", "evidence": "unsupported", "possible_gap": "", "diagnostic_question": "The answer is 4!"}
    with patch("tutor.generate", return_value=(candidate, {})):
        assessment, _ = tutor.assess(state, "ALG-01", "12", "3x=12 therefore x=12")
    assert assessment["status"] == "incorrect"
    assert "answer is 4" not in assessment["diagnostic_question"]


def test_correct_number_without_reasoning_is_uncertain():
    _, state = accepted()
    candidate = {"status": "correct", "evidence": "right number", "possible_gap": "", "diagnostic_question": "why"}
    with patch("tutor.generate", return_value=(candidate, {})):
        assessment, _ = tutor.assess(state, "ALG-01", "4", "")
    assert assessment["status"] == "uncertain"


def test_invalid_curriculum_source_and_order_rejected():
    _, state = accepted()
    candidate = state["curriculum"]
    candidate["objectives"][0]["source_ids"] = ["invented"]
    with patch("tutor.generate", return_value=(candidate, {})), pytest.raises(tutor.ModelRequestError, match="unknown source"):
        tutor.propose(state)
    candidate["objectives"][0]["source_ids"] = ["bundled"]
    candidate["objectives"][0]["prerequisites"] = ["geometry.point_on_line"]
    with patch("tutor.generate", return_value=(candidate, {})), pytest.raises(tutor.ModelRequestError, match="prerequisites"):
        tutor.propose(state)


def test_review_bounds_and_real_date_scheduling():
    _, state = accepted()
    start = date(2026, 10, 25)
    cid = "algebra.linear_equations"
    review.record(state, cid, True, True, on_date=start)
    assert review.due(state, start)["selected"] == []
    assert review.due(state, start+timedelta(days=1))["selected"] == [cid]
    review.record(state, cid, True, True, review=True, on_date=start+timedelta(days=1))
    assert state["review"][cid]["interval"] == 2
    state["review"][cid]["review_enabled"] = False
    assert review.due(state, start+timedelta(days=10))["selected"] == []
    state["review"][cid]["review_enabled"] = True
    state["review"][cid]["taught"] = False
    assert review.due(state, start+timedelta(days=10))["selected"] == []
    state["approved_version"] = None
    assert review.due(state, start+timedelta(days=10))["selected"] == []


def test_repeated_review_failures_route_to_relearning():
    _, state = accepted()
    cid = "algebra.linear_equations"
    for _ in range(3):
        review.record(state, cid, False, False, review=True)
    result = review.due(state)
    assert cid in result["needs_relearning"] and not result["selected"]
    review.record(state, cid, True, True)
    assert state["review"][cid]["lapses"] == 0


def test_export_keeps_pending_and_no_token():
    token, state = accepted()
    state.update(pending="ALG-02", stage="changed")
    exported = tutor.export_checkpoint(state, [{"answer": "4"}])
    assert '"pending": "ALG-02"' in exported and token not in exported
