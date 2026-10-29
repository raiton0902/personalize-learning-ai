import json
from datetime import date, timedelta

import pytest
from starlette.testclient import TestClient

import review
import tutor
import web_server
import web_store as store
import web_tutor


@pytest.fixture
def pl_client(monkeypatch, tmp_path):
    monkeypatch.setenv("WEB_DB", str(tmp_path / "pl_workspace.sqlite3"))
    monkeypatch.setenv("WEB_SESSION_SECRET", "pl-test-session-secret")
    with TestClient(web_server.app) as c:
        res = c.post("/api/auth/signup", json={"email": "student@example.com", "password": "correct-horse-battery"})
        assert res.status_code == 200
        yield c


def js_five_lesson_fixture():
    return {
        "title": "JavaScript for Interactive Browser Projects",
        "intended_outcome": "Build an interactive browser page with state updates and event listeners.",
        "scope_note": "Five focused lessons across two modules, tailored for a beginner building a browser project.",
        "grounding_status": "unverified_general",
        "grounding_note": "No reference supplied; provisional curriculum based on general knowledge (unverified).",
        "prerequisites": ["Basic computer literacy and a web browser"],
        "prerequisite_bridges": [],
        "optional_enrichment": ["Explore browser localStorage after completing the core DOM module"],
        "review_opportunities": [
            "After Conditionals: combine variables, expressions, and branching",
            "After DOM Events: cumulative check updating state and rendering to the page",
        ],
        "modules": [
            {
                "id": "mod.foundations",
                "title": "Language Foundations",
                "summary": "Store values, update state, and branch with conditions.",
                "objective_ids": ["js.variables", "js.expressions", "js.conditionals"],
            },
            {
                "id": "mod.browser",
                "title": "Functions and Browser DOM",
                "summary": "Reusable functions and interactive DOM event handlers.",
                "objective_ids": ["js.functions", "js.dom_events"],
            },
        ],
        "objectives": [
            {
                "id": "js.variables",
                "title": "Variables and State Updates",
                "outcome": "Declare let/const bindings and trace how reassignment updates a value.",
                "prerequisites": [],
                "source_ids": ["general"],
                "minutes": 12,
                "module_id": "mod.foundations",
                "module_title": "Language Foundations",
                "concepts": [
                    {"id": "js.variables.let_const", "title": "let and const bindings", "summary": "Declare mutable and immutable bindings", "required": True},
                    {"id": "js.variables.reassignment", "title": "State reassignment", "summary": "Evaluate right-hand side before updating variable", "required": True},
                ],
            },
            {
                "id": "js.expressions",
                "title": "Numbers, Strings, and Expressions",
                "outcome": "Combine numbers and strings predictably and inspect results with console.log.",
                "prerequisites": ["js.variables"],
                "source_ids": ["general"],
                "minutes": 15,
                "module_id": "mod.foundations",
                "module_title": "Language Foundations",
                "concepts": [{"id": "js.expressions.eval", "title": "Expression evaluation", "summary": "Compute arithmetic and string expressions", "required": True}],
            },
            {
                "id": "js.conditionals",
                "title": "Comparisons and If/Else Branching",
                "outcome": "Use === comparisons and if/else blocks to choose between two actions.",
                "prerequisites": ["js.expressions"],
                "source_ids": ["general"],
                "minutes": 15,
                "module_id": "mod.foundations",
                "module_title": "Language Foundations",
                "concepts": [{"id": "js.conditionals.branch", "title": "Strict equality and branching", "summary": "Choose execution path from boolean conditions", "required": True}],
            },
            {
                "id": "js.functions",
                "title": "Functions, Parameters, and Return Values",
                "outcome": "Write small functions that accept inputs and return a computed result.",
                "prerequisites": ["js.conditionals"],
                "source_ids": ["general"],
                "minutes": 18,
                "module_id": "mod.browser",
                "module_title": "Functions and Browser DOM",
                "concepts": [{"id": "js.functions.io", "title": "Parameters and return values", "summary": "Pass arguments and capture returned values", "required": True}],
            },
            {
                "id": "js.dom_events",
                "title": "Selecting Elements and Click Events",
                "outcome": "Update page text when a button is clicked using querySelector and addEventListener.",
                "prerequisites": ["js.functions"],
                "source_ids": ["general"],
                "minutes": 20,
                "module_id": "mod.browser",
                "module_title": "Functions and Browser DOM",
                "concepts": [{"id": "js.dom_events.listener", "title": "DOM selection and click listener", "summary": "Wire button click to state update and DOM text", "required": True}],
            },
        ],
    }


def test_scenario_a_broad_beginner_goal_and_variable_curriculum_size(pl_client, monkeypatch):
    # Save universal preferences first; intake should reuse them without re-asking if all preferences are set
    pl_client.post("/api/profile", json={"goal": "", "tone": "Calm and encouraging", "interest": "Browser games"})

    propose_calls = []

    def fake_propose(state, changes=""):
        propose_calls.append(state["profile"].copy())
        return js_five_lesson_fixture(), {}

    monkeypatch.setattr(web_tutor, "propose", fake_propose)

    # 1. Broad goal without starting knowledge or project context triggers compact intake
    created = pl_client.post("/api/courses", json={"profile": {"goal": "I want to learn JavaScript."}})
    assert created.status_code == 200
    payload = created.json()
    cid = payload["id"]
    state = payload["state"]

    assert state["stage"] == "intake"
    assert state["curriculum"] is None
    assert state["approved_version"] is None
    assert len(propose_calls) == 0
    assert "intended_outcome" in state["intake"]["missing"]
    assert "starting_knowledge" in state["intake"]["missing"]
    assert state["intake"]["known"]["tone"] == "Calm and encouraging"
    assert state["intake"]["known"]["interest"] == "Browser games"

    # Cannot approve or start a lesson while in intake
    assert pl_client.post(f"/api/courses/{cid}", json={"action": "approve"}).status_code == 400
    assert pl_client.post(f"/api/courses/{cid}", json={"action": "teach"}).status_code == 400

    # 2. Submit beginner/browser-project intake context -> generates 5-lesson hierarchical curriculum
    after_intake = pl_client.post(
        f"/api/courses/{cid}",
        json={
            "action": "intake",
            "profile": {
                "goal": "I want to learn JavaScript.",
                "intended_outcome": "Build an interactive browser scoreboard",
                "starting_knowledge": "Complete beginner, no prior coding",
                "time_budget": "90 minutes this week",
                "requirements": "Plain browser JavaScript without frameworks",
            },
        },
    )
    assert after_intake.status_code == 200
    plan_state = after_intake.json()["state"]
    assert len(propose_calls) == 1
    assert plan_state["stage"] == "plan"
    assert plan_state["approved_version"] is None
    assert len(plan_state["curriculum"]["objectives"]) == 5
    assert len(plan_state["curriculum"]["modules"]) == 2
    assert plan_state["curriculum"]["total_minutes"] == 80
    assert plan_state["curriculum"]["optional_enrichment"]
    assert plan_state["curriculum"]["review_opportunities"]

    # Reloading from SQLite preserves all 5 lessons and hierarchy
    reloaded = pl_client.get(f"/api/courses/{cid}").json()["state"]
    assert len(reloaded["curriculum"]["objectives"]) == 5
    assert reloaded["current_position"]["total_lessons"] == 5
    assert reloaded["current_position"]["total_modules"] == 2

    # 3. Variable curriculum size: a small focused goal can have just 1 lesson (not forced to 3 or 5)
    monkeypatch.setattr(
        web_tutor,
        "propose",
        lambda st, ch="": (
            {
                "title": "Single Concept: JavaScript const vs let",
                "scope_note": "One focused lesson.",
                "objectives": [
                    {
                        "id": "js.const_let",
                        "title": "const vs let",
                        "outcome": "Choose const or let appropriately.",
                        "prerequisites": [],
                        "source_ids": ["general"],
                        "minutes": 8,
                    }
                ],
            },
            {},
        ),
    )
    small = pl_client.post("/api/courses", json={"profile": {"goal": "Learn JavaScript variables"}}).json()["state"]
    assert small["stage"] == "plan"
    assert len(small["curriculum"]["objectives"]) == 1


def test_scenario_b_existing_knowledge_reuses_background_without_false_mastery(pl_client, monkeypatch):
    captured = {}

    def fake_generate(schema, purpose, state, instruction, extra=None):
        captured["extra"] = extra
        return (
            {
                "title": "JavaScript from Python Background",
                "intended_outcome": "Write browser scripts using existing Python mental models.",
                "scope_note": "Skips generic programming intro and bridges Python variables/loops to JavaScript.",
                "grounding_status": "unverified_general",
                "grounding_note": "Unverified general knowledge.",
                "prerequisites": ["Python variables and loops"],
                "prerequisite_bridges": [
                    "Bridge from Python (variables, loops): map def/for/let syntax and block braces {} without repeating basic loop theory."
                ],
                "optional_enrichment": [],
                "review_opportunities": [],
                "modules": [
                    {
                        "id": "mod.js_bridge",
                        "title": "Syntax Bridge and Functions",
                        "summary": "Fast syntax bridge into JavaScript specifics.",
                        "objective_ids": ["js.syntax_bridge", "js.dom_intro"],
                    }
                ],
                "objectives": [
                    {
                        "id": "js.syntax_bridge",
                        "title": "JavaScript let/const and for-loop Syntax Bridge",
                        "outcome": "Translate Python variable bindings and loops into JavaScript let/const and block syntax.",
                        "prerequisites": [],
                        "source_ids": ["general"],
                        "minutes": 10,
                        "module_id": "mod.js_bridge",
                        "module_title": "Syntax Bridge and Functions",
                        "source_sections": [],
                        "concepts": [
                            {"id": "js.syntax_bridge.let", "title": "let/const vs Python assignment", "summary": "Block-scoped declarations", "required": True},
                            {"id": "js.syntax_bridge.loops", "title": "C-style and for..of loops", "summary": "Loop syntax in JS", "required": True},
                        ],
                        "prerequisite_bridge": "Uses your Python variables and loops background; checks only JS syntax differences.",
                        "optional_enrichment": "",
                        "assessment_required": True,
                        "review_opportunity": "",
                    },
                    {
                        "id": "js.dom_intro",
                        "title": "DOM Manipulation",
                        "outcome": "Update page elements from JavaScript.",
                        "prerequisites": ["js.syntax_bridge"],
                        "source_ids": ["general"],
                        "minutes": 15,
                        "module_id": "mod.js_bridge",
                        "module_title": "Syntax Bridge and Functions",
                        "source_sections": [],
                        "concepts": [{"id": "js.dom_intro.query", "title": "querySelector", "summary": "Select DOM nodes", "required": True}],
                        "prerequisite_bridge": "",
                        "optional_enrichment": "",
                        "assessment_required": True,
                        "review_opportunity": "Combine loop iteration with DOM updates",
                    },
                ],
            },
            {},
        )

    monkeypatch.setattr(web_tutor, "generate", fake_generate)

    res = pl_client.post(
        "/api/courses",
        json={
            "profile": {
                "goal": "I want to learn JavaScript",
                "level": "I already know variables and loops from Python",
            }
        },
    )
    assert res.status_code == 200
    state = res.json()["state"]
    cid = res.json()["id"]

    # Intake reused stated background and extracted prior_knowledge
    assert state["stage"] == "plan"
    assert "starting_knowledge" in state["intake"]["known"]
    assert "starting_knowledge" not in state["intake"]["missing"]
    prior_concepts = {p["concept"] for p in state["intake"]["prior_knowledge"]}
    assert {"variables", "loops"}.issubset(prior_concepts)
    assert captured["extra"]["intake_context"]["prior_knowledge"]

    # Curriculum has prerequisite bridge
    assert any("Python" in b for b in state["curriculum"]["prerequisite_bridges"])
    assert "Python" in state["curriculum"]["objectives"][0]["prerequisite_bridge"]

    # Approving the plan does NOT mark JS concepts as mastered without JS evidence
    approved = pl_client.post(f"/api/courses/{cid}", json={"action": "approve"}).json()["state"]
    for concept_rec in approved["concepts"].values():
        assert concept_rec["taught"] is False
        assert concept_rec["status"] == "unassessed"
    assert approved["review"] == {}


def test_scenario_c_supplied_syllabus_maps_sections_and_flags_truncation(pl_client, monkeypatch):
    syllabus_text = (
        "# CS101 Web Programming Syllabus\n"
        "## Section 1: Variables, Types, and Expressions\n"
        "Covers let, const, numbers, strings, and boolean expressions.\n"
        "## Section 2: Control Flow and Functions\n"
        "Covers if/else statements, loops, and reusable function declarations.\n"
        "[truncated: Section 3 Asynchronous Fetch and Section 4 Modules omitted from this excerpt]\n"
    )
    ref_res = pl_client.post(
        "/api/resources",
        json={"kind": "pasted", "title": "CS101 Syllabus Excerpt", "text": syllabus_text},
    )
    assert ref_res.status_code == 200
    rid = ref_res.json()["resource"]["id"]

    # Model attempts to include one valid section and one fabricated section not in source
    def fake_generate(schema, purpose, state, instruction, extra=None):
        return (
            {
                "title": "CS101 Web Programming",
                "intended_outcome": "Master Sections 1 and 2 of CS101.",
                "scope_note": "Grounded in the retained CS101 syllabus excerpt.",
                "grounding_status": "source_grounded",
                "grounding_note": "",
                "prerequisites": [],
                "prerequisite_bridges": [],
                "optional_enrichment": [],
                "review_opportunities": [],
                "modules": [{"id": "m1", "title": "Core Syllabus", "summary": "", "objective_ids": ["cs.sec1", "cs.sec2"]}],
                "objectives": [
                    {
                        "id": "cs.sec1",
                        "title": "Variables and Expressions",
                        "outcome": "Use let, const, and primitive expressions.",
                        "prerequisites": [],
                        "source_ids": ["reference"],
                        "minutes": 15,
                        "module_id": "m1",
                        "module_title": "Core Syllabus",
                        "source_sections": [
                            "Section 1: Variables, Types, and Expressions",
                            "Section 99: Quantum WebSockets (Fabricated)",
                        ],
                        "concepts": [],
                        "prerequisite_bridge": "",
                        "optional_enrichment": "",
                        "assessment_required": True,
                        "review_opportunity": "",
                    },
                    {
                        "id": "cs.sec2",
                        "title": "Control Flow and Functions",
                        "outcome": "Write conditionals, loops, and functions.",
                        "prerequisites": ["cs.sec1"],
                        "source_ids": ["reference"],
                        "minutes": 20,
                        "module_id": "m1",
                        "module_title": "Core Syllabus",
                        "source_sections": ["Section 2: Control Flow and Functions"],
                        "concepts": [],
                        "prerequisite_bridge": "",
                        "optional_enrichment": "",
                        "assessment_required": True,
                        "review_opportunity": "",
                    },
                ],
            },
            {},
        )

    monkeypatch.setattr(web_tutor, "generate", fake_generate)

    created = pl_client.post(
        "/api/courses",
        json={"profile": {"goal": "Study CS101 syllabus"}, "resource_id": rid},
    ).json()["state"]

    plan = created["curriculum"]
    assert plan["grounding_status"] == "partial_source"
    assert plan["unavailable_sections"]
    assert "truncated" in plan["grounding_note"].lower() or "not claimed" in plan["grounding_note"].lower()
    # Valid inspected sections are mapped, fabricated Section 99 is stripped
    sec1_mapped = plan["objectives"][0]["source_sections"]
    assert "Section 1: Variables, Types, and Expressions" in sec1_mapped
    assert all("Section 99" not in s for s in sec1_mapped)
    assert "Section 2: Control Flow and Functions" in plan["objectives"][1]["source_sections"]


def test_scenario_d_approval_revision_and_candidate_revision_preservation(pl_client, monkeypatch):
    plans = [
        {
            "title": "JS Plan v1",
            "scope_note": "Initial scope",
            "objectives": [
                {"id": "js.variables", "title": "Variables", "outcome": "Use let", "prerequisites": [], "source_ids": ["general"], "minutes": 10},
                {"id": "js.loops", "title": "Loops", "outcome": "Use for", "prerequisites": ["js.variables"], "source_ids": ["general"], "minutes": 12},
            ],
        },
        {
            "title": "JS Plan v2",
            "scope_note": "Added functions before DOM",
            "objectives": [
                {"id": "js.variables", "title": "Variables", "outcome": "Use let", "prerequisites": [], "source_ids": ["general"], "minutes": 10},
                {"id": "js.loops", "title": "Loops", "outcome": "Use for", "prerequisites": ["js.variables"], "source_ids": ["general"], "minutes": 12},
                {"id": "js.functions", "title": "Functions", "outcome": "Write functions", "prerequisites": ["js.loops"], "source_ids": ["general"], "minutes": 15},
            ],
        },
        {
            "title": "JS Plan v3 (Candidate)",
            "scope_note": "Expanded with DOM Events",
            "objectives": [
                {"id": "js.variables", "title": "Variables", "outcome": "Use let", "prerequisites": [], "source_ids": ["general"], "minutes": 10},
                {"id": "js.loops", "title": "Loops", "outcome": "Use for", "prerequisites": ["js.variables"], "source_ids": ["general"], "minutes": 12},
                {"id": "js.functions", "title": "Functions", "outcome": "Write functions", "prerequisites": ["js.loops"], "source_ids": ["general"], "minutes": 15},
                {"id": "js.dom", "title": "DOM Events", "outcome": "Handle clicks", "prerequisites": ["js.functions"], "source_ids": ["general"], "minutes": 15},
            ],
        },
    ]
    call_idx = {"i": 0}

    def fake_propose(state, changes=""):
        idx = min(call_idx["i"], len(plans) - 1)
        call_idx["i"] += 1
        return plans[idx], {}

    monkeypatch.setattr(web_tutor, "propose", fake_propose)
    monkeypatch.setattr(web_tutor, "teach", lambda state, target_objective=None: ({"explanation": "Variables store values.", "worked_example": ["let x = 1;", "x = x + 2;"]}, {}))
    monkeypatch.setattr(web_tutor, "followup", lambda state, q: ({"answer": "A variable is a named storage binding."}, {}))

    # Direct question without starting a course
    direct = pl_client.post("/api/courses", json={"profile": {"goal": "What is a variable in JS?"}, "direct_question": True})
    assert direct.status_code == 200
    assert direct.json()["course_started"] is False
    assert direct.json()["approved_version"] is None
    assert "named storage" in direct.json()["direct_answer"]

    # Create course (v1)
    created = pl_client.post("/api/courses", json={"profile": {"goal": "Learn JavaScript variables"}}).json()
    cid = created["id"]
    path = f"/api/courses/{cid}"
    assert created["state"]["version"] == 1
    assert created["state"]["approved_version"] is None

    # Lessons are unavailable before approval
    assert pl_client.post(path, json={"action": "teach"}).status_code == 400

    # Pre-approval revision produces v2 and does NOT approve the plan
    rev1 = pl_client.post(path, json={"action": "revise", "text": "Add functions"}).json()["state"]
    assert rev1["version"] == 2
    assert rev1["approved_version"] is None
    assert rev1["stage"] == "plan"
    assert len(rev1["curriculum"]["objectives"]) == 3

    # Approving stale version 1 fails
    assert pl_client.post(path, json={"action": "approve", "version": 1}).status_code == 400

    # Approving current version 2 succeeds and shows one-time export offer
    approved = pl_client.post(path, json={"action": "approve", "version": 2}).json()["state"]
    assert approved["approved_version"] == 2
    assert approved["stage"] == "ready"
    assert approved["export_offer"]["shown"] is True
    assert approved["export_offer"]["dismissed"] is False

    # Open lesson 1 (also auto-dismisses export offer so it never nags)
    taught = pl_client.post(path, json={"action": "teach"}).json()["state"]
    assert taught["stage"] == "lesson"
    assert taught["export_offer"]["dismissed"] is True

    # Requesting a curriculum revision during an active approved course creates a candidate revision
    # without destroying the currently accepted v2 curriculum or lesson state!
    cand_state = pl_client.post(path, json={"action": "revise", "text": "Add DOM events"}).json()["state"]
    assert cand_state["version"] == 2
    assert cand_state["approved_version"] == 2
    assert cand_state["stage"] == "lesson"
    assert cand_state["curriculum"]["title"] == "JS Plan v2"
    assert len(cand_state["curriculum"]["objectives"]) == 3
    assert cand_state["pending_revision"]["version"] == 3
    assert cand_state["pending_revision"]["curriculum"]["title"] == "JS Plan v3 (Candidate)"
    assert len(cand_state["pending_revision"]["curriculum"]["objectives"]) == 4

    # Applying the candidate revision switches to v3 while keeping lesson_history intact
    applied = pl_client.post(path, json={"action": "apply_revision", "version": 3}).json()["state"]
    assert applied["version"] == 3
    assert applied["approved_version"] == 3
    assert applied.get("pending_revision") is None
    assert len(applied["curriculum"]["objectives"]) == 4
    assert len(applied["lesson_history"]) == 1


def test_scenario_e_adaptive_feedback_code_trace_and_helped_vs_independent_evidence(pl_client, monkeypatch):
    monkeypatch.setattr(
        web_tutor,
        "propose",
        lambda state, changes="": (
            {
                "title": "JavaScript State Updates",
                "scope_note": "Tracing variable updates",
                "objectives": [
                    {
                        "id": "js.variables",
                        "title": "Variable Reassignment",
                        "outcome": "Trace variable updates using previous value and operator.",
                        "prerequisites": [],
                        "source_ids": ["general"],
                        "minutes": 10,
                    }
                ],
            },
            {},
        ),
    )
    monkeypatch.setattr(
        web_tutor,
        "teach",
        lambda state, target_objective=None: (
            {
                "explanation": "When updating a variable like score = score + 3, JavaScript first reads the current value of score, adds 3, and stores the new result.",
                "worked_example": [
                    "Start with let score = 2; so score holds 2.",
                    "Evaluate score + 3 using the current value 2: 2 + 3 = 5.",
                    "Assign 5 back to score and log 5.",
                ],
            },
            {},
        ),
    )

    practice_calls = []

    def fake_practice(state, changed=False, target_objective=None):
        practice_calls.append({"changed": changed, "adaptation": web_tutor.compute_teaching_adaptation(state)})
        if not changed:
            return (
                {
                    "id": "generated",
                    "prompt": "What does this code log?\nlet score = 2;\nscore = score + 3;\nconsole.log(score);",
                    "answer": "5",
                    "solution": "score starts at 2, then 2 + 3 = 5.",
                },
                {},
            )
        return (
            {
                "id": "generated",
                "prompt": "What does this code log?\nlet points = 4;\npoints = points + 5;\nconsole.log(points);",
                "answer": "9",
                "solution": "points starts at 4, then 4 + 5 = 9.",
            },
            {},
        )

    monkeypatch.setattr(web_tutor, "practice", fake_practice)

    def fake_assess(state, answer, work):
        if answer.strip() == "3":
            return (
                {
                    "status": "incorrect",
                    "evidence": "You predicted 3, which is the number added on the right-hand side.",
                    "possible_gap": "score = score + 3 adds 3 to the previous value of score (2) rather than replacing score with 3.",
                    "diagnostic_question": "What value does score hold right before score + 3 is calculated?",
                    "flagged_line_index": 0,
                    "flagged_start": 0,
                    "flagged_end": 1,
                    "flagged_quote": "3",
                    "hint": "Look at let score = 2 on the first line before adding 3.",
                },
                {},
            )
        return (
            {
                "status": "correct",
                "evidence": "You combined the starting value 4 with + 5 to get 9.",
                "possible_gap": "",
                "diagnostic_question": " Ready for the next step.",
            },
            {},
        )

    monkeypatch.setattr(web_tutor, "assess", fake_assess)
    monkeypatch.setattr(
        web_tutor,
        "repair",
        lambda state, diag: (
            {
                "explanation": "Because score starts at 2, score + 3 evaluates 2 + 3 = 5, so score becomes 5.",
                "observation": "Practising how reassignment uses the previous value of score.",
            },
            {},
        ),
    )

    cid = pl_client.post("/api/courses", json={"profile": {"goal": "Learn JavaScript variables"}}).json()["id"]
    path = f"/api/courses/{cid}"
    pl_client.post(path, json={"action": "approve"})
    pl_client.post(path, json={"action": "teach"})
    pl_client.post(path, json={"action": "practice"})

    # Learner predicts 3 -> diagnostic feedback addresses previous value of score and update operation
    attempt1 = pl_client.post(path, json={"action": "attempt", "answer": "3", "work": "score = 3"}).json()["state"]
    assert attempt1["stage"] == "diagnostic"
    assert "previous value of score" in attempt1["assessment"]["possible_gap"]
    assert attempt1["assistance"]["corrective_feedback"] is True

    # Complete diagnostic -> repair
    rep = pl_client.post(path, json={"action": "diagnostic", "text": "score held 2 before adding 3, so 2 + 3 = 5"}).json()["state"]
    assert rep["stage"] == "repair"
    assert rep["teaching_adaptation"]["step_size"] == "split"

    # Follow-up practice uses changed=True and split step size for the same concept with changed values
    prac2 = pl_client.post(path, json={"action": "practice"}).json()["state"]
    assert prac2["stage"] == "attempt"
    assert "let points = 4;" in prac2["question"]["prompt"]
    assert practice_calls[-1]["changed"] is True
    assert practice_calls[-1]["adaptation"]["step_size"] == "split"

    # Learner requests a hint on the follow-up and then answers correctly -> recorded as helped success, NOT independent mastery
    pl_client.post(path, json={"action": "hint"})
    attempt2 = pl_client.post(path, json={"action": "attempt", "answer": "9", "work": "4 + 5 = 9"}).json()["state"]
    assert attempt2["stage"] == "feedback"
    assert attempt2["attempts"][-1]["help_used"] is True
    assert attempt2["attempts"][-1]["independent"] is False
    assert attempt2["episode"]["outcome"]["category"] == "correct_with_help"
    assert attempt2["review"]["js.variables"]["status"] == "developing"
    assert attempt2["review"]["js.variables"]["evidence"] == "Correct with support"


def test_scenario_f_and_g_resume_and_review_workflow(pl_client, monkeypatch):
    monkeypatch.setattr(web_tutor, "propose", lambda state, changes="": (js_five_lesson_fixture(), {}))
    monkeypatch.setattr(
        web_tutor,
        "teach",
        lambda state, target_objective=None: (
            {
                "explanation": f"Teaching {(target_objective or {'title': 'lesson'})['title']}.",
                "worked_example": ["Step 1", "Step 2"],
            },
            {},
        ),
    )
    monkeypatch.setattr(
        web_tutor,
        "practice",
        lambda state, changed=False, target_objective=None: (
            {
                "id": "generated",
                "prompt": f"Practice for {(target_objective or {'id': 'current'})['id']}",
                "answer": "42",
                "solution": "Solution is 42",
            },
            {},
        ),
    )

    # 1. Resume during intake preserves draft
    cid = pl_client.post("/api/courses", json={"profile": {"goal": "I want to learn JavaScript."}}).json()["id"]
    path = f"/api/courses/{cid}"
    pl_client.post(path, json={"action": "intake_draft", "profile": {"goal": "I want to learn JavaScript.", "intended_outcome": "Interactive quiz"}})
    resumed_intake = pl_client.get(path).json()["state"]
    assert resumed_intake["stage"] == "intake"
    assert resumed_intake["intake"]["draft"]["intended_outcome"] == "Interactive quiz"
    assert resumed_intake["next_action"]["action"] == "intake"

    # 2. Complete intake -> approve -> teach -> practice (unanswered question) -> resume
    pl_client.post(path, json={"action": "intake", "profile": {"goal": "I want to learn JavaScript.", "starting_knowledge": "Beginner", "intended_outcome": "Interactive quiz"}})
    pl_client.post(path, json={"action": "approve"})
    pl_client.post(path, json={"action": "teach"})
    pl_client.post(path, json={"action": "practice"})

    resumed_attempt = pl_client.get(path).json()["state"]
    assert resumed_attempt["stage"] == "attempt"
    assert "answer" not in resumed_attempt["question"]
    assert "solution" not in resumed_attempt["question"]
    assert resumed_attempt["current_position"]["lesson_id"] == "js.variables"
    assert resumed_attempt["next_action"]["action"] == "attempt"

    # 3. Complete Lesson 1 independently on day 1 (2026-10-25)
    day1 = date(2026, 10, 25)
    monkeypatch.setenv("LEARNING_REVIEW_DATE", day1.isoformat())
    monkeypatch.setattr(
        web_tutor,
        "assess",
        lambda state, ans, work: (
            {"status": "correct" if ans == "42" else "incorrect", "evidence": "Checked", "possible_gap": "Gap", "diagnostic_question": "Why?"},
            {},
        ),
    )
    pl_client.post(path, json={"action": "attempt", "answer": "42", "work": "Computed 42", "on_date": day1.isoformat()})
    after_l1 = pl_client.post(path, json={"action": "next"}).json()["state"]

    # Same-session success is 'developing', not 'secure', and not due on the same day
    assert after_l1["review"]["js.variables"]["status"] == "developing"
    assert after_l1["review_status"]["selected"] == []
    # Untaught future lessons (e.g. js.conditionals) cannot be reviewed
    assert pl_client.post(path, json={"action": "start_review", "objective_id": "js.conditionals"}).status_code == 400

    # 4. Advance date to day 2 (2026-10-26): js.variables is now eligible and due for review!
    day2 = day1 + timedelta(days=1)
    monkeypatch.setenv("LEARNING_REVIEW_DATE", day2.isoformat())
    due_state = pl_client.get(path).json()["state"]
    assert due_state["review_status"]["selected"] == ["js.variables"]
    assert due_state["review_status"]["due_items"][0]["label"] == "Review from Language Foundations: Variables and State Updates"

    # Start review -> clearly labeled with earlier module and lesson
    rev_started = pl_client.post(path, json={"action": "start_review", "on_date": day2.isoformat()}).json()["state"]
    assert rev_started["active_review"]["objective_id"] == "js.variables"
    assert "Review from Language Foundations: Variables and State Updates" in rev_started["question"]["review_label"]

    # Skip review is respected and restores current lesson stage
    rev_skipped = pl_client.post(path, json={"action": "skip_review", "on_date": day2.isoformat()}).json()["state"]
    assert rev_skipped.get("active_review") is None
    assert rev_skipped["review_status"]["skipped_today"] is True
    assert rev_skipped["review_history"][-1]["status"] == "skipped"

    # 5. Delayed review success on day 3 advances status to 'secure' and doubles interval to 2
    day3 = day1 + timedelta(days=2)
    monkeypatch.setenv("LEARNING_REVIEW_DATE", day3.isoformat())
    pl_client.post(path, json={"action": "start_review", "on_date": day3.isoformat()})
    rev_correct = pl_client.post(path, json={"action": "attempt", "answer": "42", "work": "Delayed recall", "on_date": day3.isoformat()}).json()["state"]
    assert rev_correct["review"]["js.variables"]["status"] == "secure"
    assert rev_correct["review"]["js.variables"]["interval"] == 2
    pl_client.post(path, json={"action": "next"})

    # 6. Repeated review failures (3 lapses) route to relearning explanation instead of endless drilling
    day6 = day1 + timedelta(days=5)
    monkeypatch.setenv("LEARNING_REVIEW_DATE", day6.isoformat())
    for lapse_num in range(3):
        pl_client.post(path, json={"action": "start_review", "objective_id": "js.variables", "on_date": day6.isoformat()})
        failed_rev = pl_client.post(path, json={"action": "attempt", "answer": "wrong", "work": "unsure", "on_date": day6.isoformat()}).json()["state"]
    assert failed_rev["review"]["js.variables"]["lapses"] == 3
    assert failed_rev["review"]["js.variables"]["status"] == "needs_relearning"
    assert failed_rev["active_review"]["mode"] == "relearning"
    assert failed_rev["stage"] == "repair"
    assert "Relearning" in failed_rev["repair"]["explanation"]


def test_scenario_h_flat_course_migration_optional_check_and_bundled_algebra(pl_client, monkeypatch):
    owner = store.find_account("student@example.com")["id"]
    # Insert a legacy schema v1 flat course directly into SQLite (no modules, no concepts, no intake)
    legacy_flat_state = {
        "profile": {"goal": "Learn Python", "language": "English", "level": "", "tone": "", "interest": "", "context": "", "pace": ""},
        "source": {"id": "general", "title": "Learning goal", "origin": "Unverified", "text": "Learn Python"},
        "resource_id": None,
        "curriculum": {
            "title": "Legacy Flat Python",
            "scope_note": "Two flat objectives",
            "objectives": [
                {"id": "py.one", "title": "Variables", "outcome": "Use variables", "prerequisites": [], "source_ids": ["general"], "minutes": 10, "assessment_required": False},
                {"id": "py.two", "title": "Loops", "outcome": "Use loops", "prerequisites": ["py.one"], "source_ids": ["general"], "minutes": 15, "assessment_required": True},
            ],
        },
        "version": 1,
        "approved_version": 1,
        "objective_index": 0,
        "stage": "lesson",
        "lesson": {"explanation": "Legacy explanation", "worked_example": ["x = 1", "y = 2"]},
        "observations": [],
        "attempts": [],
        "review": {},
        "review_history": [],
        "created": store.now(),
    }
    legacy_cid = store.create_course(owner, legacy_flat_state)

    # Loading via GET migrates deterministically without regenerating or losing state
    migrated = pl_client.get(f"/api/courses/{legacy_cid}").json()["state"]
    assert migrated["schema_version"] == 2
    assert migrated["migrated_from_schema"] == 1
    assert migrated["curriculum"]["title"] == "Legacy Flat Python"
    assert len(migrated["curriculum"]["modules"]) == 1
    assert len(migrated["curriculum"]["objectives"][0]["concepts"]) == 1
    assert migrated["current_position"]["lesson_id"] == "py.one"

    # Objective 1 has assessment_required=False -> skipping check records it as 'unassessed', never 'developing' or 'secure'
    after_skip = pl_client.post(f"/api/courses/{legacy_cid}", json={"action": "skip_check"}).json()["state"]
    assert after_skip["objective_index"] == 1
    assert after_skip["review"]["py.one"]["status"] == "unassessed"
    assert after_skip["concepts"]["py.one.core"]["status"] == "unassessed"

    # Objective 2 has assessment_required=True -> skipping check is rejected server-side
    monkeypatch.setattr(web_tutor, "teach", lambda state, target_objective=None: ({"explanation": "Loops explanation", "worked_example": ["for i in range(2):", "print(i)"]}, {}))
    pl_client.post(f"/api/courses/{legacy_cid}", json={"action": "teach"})
    assert pl_client.post(f"/api/courses/{legacy_cid}", json={"action": "skip_check"}).status_code == 400
    assert pl_client.post(f"/api/courses/{legacy_cid}", json={"action": "next"}).status_code == 400

    # Export includes curriculum hierarchy and concept/review state
    md_export = pl_client.get(f"/api/courses/{legacy_cid}/export?format=md").text
    assert "Curriculum hierarchy" in md_export
    assert "Concept and review state" in md_export
    assert "py.one: status=unassessed" in md_export


def test_scenario_i_playwright_frontend_personal_learning_workflow(monkeypatch, tmp_path):
    import os
    import socket
    import subprocess
    import threading
    import time
    from pathlib import Path
    import uvicorn

    monkeypatch.setenv("WEB_DB", str(tmp_path / "pl_browser.sqlite3"))
    monkeypatch.setenv("WEB_SESSION_SECRET", "pl-browser-secret")
    monkeypatch.setattr(web_tutor, "propose", lambda state, changes="": (js_five_lesson_fixture(), {}))
    monkeypatch.setattr(
        web_tutor,
        "teach",
        lambda state, target_objective=None: (
            {
                "explanation": "Use let score = 2; score = score + 3; to update state step by step.",
                "worked_example": ["Start with score = 2.", "Add 3 to get 5."],
            },
            {},
        ),
    )
    monkeypatch.setattr(
        web_tutor,
        "practice",
        lambda state, changed=False, target_objective=None: (
            {
                "id": "generated",
                "prompt": "Solve 2x + 3 = 11 and explain each step.",
                "answer": "x = 4",
                "solution": "2x = 8 so x = 4",
            },
            {},
        ),
    )

    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()

    config = uvicorn.Config(web_server.app, host="127.0.0.1", port=port, log_level="warning")
    server = uvicorn.Server(config)
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    for _ in range(50):
        if server.started:
            break
        time.sleep(0.05)

    repo_root = Path(__file__).resolve().parents[2]
    frontend_tools_dir = repo_root / "frontend_tools"
    script = f"""
    const {{ chromium }} = require('playwright');
    const assert = require('node:assert/strict');
    (async () => {{
      const browser = await chromium.launch({{ channel: 'chrome', headless: true }});
      const context = await browser.newContext({{ viewport: {{ width: 1440, height: 900 }} }});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://127.0.0.1:{port}/', {{ waitUntil: 'networkidle' }});

      // Sign up
      await page.getByRole('button', {{ name: 'Sign up', exact: true }}).click();
      await page.getByLabel('Email', {{ exact: true }}).fill('browser_pl@example.com');
      await page.getByLabel('Password', {{ exact: true }}).fill('correct-horse-battery');
      await page.locator('.auth-submit').click();
      await page.locator('.avatar').waitFor();
      await page.waitForTimeout(250);

      for (const theme of ['dark', 'light']) {{
        await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
        for (const [width, height] of [[1440, 1000], [1280, 800], [390, 844], [360, 640]]) {{
          await page.setViewportSize({{ width, height }});
          await page.waitForTimeout(200);
          const home = await page.evaluate(async () => {{
            await document.fonts.ready;
            const screen = document.querySelector('.home-first-screen').getBoundingClientRect();
            const composer = document.querySelector('.home-first-screen .composer').getBoundingClientRect();
            const strip = document.querySelector('.home-first-screen .secondary').getBoundingClientRect();
            return {{ gap: strip.top - composer.bottom, bottom: screen.bottom,
              font: getComputedStyle(document.querySelector('.goal')).fontFamily,
              overflow: document.documentElement.scrollWidth > innerWidth }};
          }});
          assert(home.gap >= -14 && home.gap <= -10, JSON.stringify({{ theme, width, home }}));
          assert(Math.abs(home.bottom - height) <= 2, JSON.stringify({{ theme, width, home }}));
          assert(home.font.includes('Inter'));
          assert.equal(home.overflow, false);
        }}
      }}
      await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
      await page.setViewportSize({{ width: 1440, height: 900 }});

      // Submit broad beginner goal -> enters compact intake view
      await page.locator('.goal').fill('I want to learn JavaScript.');
      await page.locator('.send').click();
      await page.locator('.intake-card').waitFor({{ timeout: 5000 }});
      assert.equal(await page.locator('#page-label').innerText(), '');
      assert.equal(await page.locator('#skip-intake-btn').innerText(), 'Skip');
      assert.equal(await page.locator('#intake-pick-ref-btn svg').count(), 1);
      await page.locator('#intake-input-starting_knowledge').fill('Beginner draft retained');
      await page.locator('#intake-pick-ref-btn').click();
      await page.getByLabel('Reference file', {{ exact: true }}).setInputFiles({{
        name: 'browser-reference.txt', mimeType: 'text/plain',
        buffer: Buffer.from('JavaScript reference: Variables store values. A let declaration creates a variable. Assigning a new value updates it. Functions group statements and can return a result.')
      }});
      await page.getByRole('button', {{ name: 'Read file', exact: true }}).click();
      await page.getByRole('button', {{ name: 'Use this reference', exact: true }}).click();
      assert.equal(await page.locator('.intake-card').count(), 1);
      assert.equal(await page.locator('#intake-input-starting_knowledge').inputValue(), 'Beginner draft retained');
      assert((await page.locator('.context-source').innerText()).includes('browser-reference.txt'));

      assert.equal((await page.locator('.stages .counter').innerText()).trim(), 'Intake · Scope check');
      assert.equal(await page.locator('.stages button[data-saved-plan] svg').count(), 0);

      // Fill intake context and submit -> transitions to 5-lesson hierarchical Plan view
      await page.locator('#intake-input-intended_outcome').fill('Build an interactive browser project');
      await page.locator('#intake-input-starting_knowledge').fill('Complete beginner');
      await page.locator('#submit-intake-btn').click();
      await page.locator('.curriculum-hierarchy').waitFor({{ timeout: 5000 }});

      assert.equal(await page.locator('.module-card').count(), 2);
      assert.equal(await page.locator('.lesson-card').count(), 5);
      assert((await page.locator('.stages .counter').innerText()).includes('Module 1 of 2 · Lesson 1 of 5'));
      assert.equal(await page.locator('.enrichment-box').count(), 1);
      assert.equal(await page.locator('.review-opp-box').count(), 1);

      // Check zero horizontal overflow at desktop (1440x900) and mobile (390x844)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await page.setViewportSize({{ width: 390, height: 844 }});
      await page.waitForTimeout(200);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await page.setViewportSize({{ width: 1440, height: 900 }});
      await page.waitForTimeout(200);

      // Approve plan -> shows one-time export offer card and no Plan checkmark SVG
      await page.getByRole('button', {{ name: 'Accept this plan', exact: true }}).click();
      await page.locator('.export-offer-card').waitFor({{ timeout: 5000 }});
      assert.equal(await page.locator('.stages button[data-saved-plan] svg').count(), 0);

      // Dismiss export offer -> card disappears cleanly
      await page.locator('#dismiss-export-offer-btn').click();
      await page.locator('.export-offer-card').waitFor({{ state: 'detached' }});
      assert.equal(await page.locator('.export-offer-card').count(), 0);

      // Teach -> Practice -> verify white/black #need-help-btn
      await page.getByRole('button', {{ name: 'Teach me this idea', exact: true }}).click();
      await page.getByRole('button', {{ name: 'Try a practice problem', exact: true }}).waitFor({{ timeout: 5000 }});
      await page.waitForFunction(() => !document.body.classList.contains('request-running'));
      await page.getByRole('button', {{ name: 'Try a practice problem', exact: true }}).click();
      await page.locator('#need-help-btn').waitFor({{ timeout: 5000 }});
      assert.equal((await page.locator('#need-help-btn').innerText()).trim(), 'Need help?');
      assert.deepEqual(errors, []);

      await browser.close();
    }})();
    """

    try:
        env = dict(os.environ)
        env["NODE_PATH"] = str(frontend_tools_dir / "node_modules")
        proc = subprocess.run(
            ["node", "-e", script],
            cwd=str(frontend_tools_dir),
            env=env,
            capture_output=True,
            text=True,
            timeout=60,
        )
        assert proc.returncode == 0, f"Playwright check failed:\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
    finally:
        server.should_exit = True
        thread.join(timeout=3)


