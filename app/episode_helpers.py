from __future__ import annotations

import re
from datetime import datetime, timezone

OBSERVATION_CHOICES = (
    "Moving a number to the other side",
    "Working with negative numbers",
    "Understanding what the question asks",
    "I made a typing mistake",
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def split_work_lines(work: str, answer: str = "", prompt: str = "") -> list[str]:
    raw_lines = [line.strip() for line in str(work or "").splitlines() if line.strip()]
    if raw_lines:
        return raw_lines[:20]
    clean_answer = str(answer or "").strip()
    if clean_answer:
        eq_match = re.search(r"([a-zA-Z]\s*[+\-*/=][^\n?.!]*)", str(prompt or ""))
        if eq_match and "=" in eq_match.group(1) and clean_answer != eq_match.group(1).strip():
            return [eq_match.group(1).strip(), clean_answer]
        return [clean_answer]
    return []


def validate_span(lines: list[str], line_index: int, start: int, end: int, quoted_text: str) -> dict | None:
    if not isinstance(line_index, int) or not isinstance(start, int) or not isinstance(end, int):
        return None
    if line_index < 0 or line_index >= len(lines):
        return None
    line = lines[line_index]
    if start < 0 or end <= start or end > len(line):
        return None
    if not quoted_text or line[start:end] != quoted_text:
        return None
    return {
        "line_index": line_index,
        "start": start,
        "end": end,
        "quoted_text": quoted_text,
    }


def detect_deterministic_span(lines: list[str], prompt: str = "") -> dict | None:
    """Locate a concrete operator/token span in submitted work lines using exact code-point offsets.

    Returns None when no specific operator or token can be isolated safely.
    """
    if not lines:
        return None
    prompt_text = str(prompt or "")
    # Check if the equation in the prompt or first line has + N or - N and a later line repeats the same sign on the RHS
    first_source = lines[0] if "=" in lines[0] else prompt_text
    lhs_add = re.search(r"[a-zA-Z]\s*([+\-\u2212])\s*(\d+)\s*=\s*(\-?\d+)", first_source)
    if lhs_add and len(lines) >= 2:
        lhs_op, const_val, rhs_val = lhs_add.group(1), lhs_add.group(2), lhs_add.group(3)
        norm_lhs_op = "-" if lhs_op in ("-", "\u2212") else "+"
        for idx in range(1, len(lines)):
            line = lines[idx]
            # Look for RHS pattern where the same sign was used instead of the inverse operation
            rhs_part_idx = line.find("=")
            search_start = rhs_part_idx + 1 if rhs_part_idx >= 0 else 0
            rhs_segment = line[search_start:]
            pattern = re.compile(
                rf"{re.escape(rhs_val)}\s*([+\-\u2212])\s*{re.escape(const_val)}"
            )
            m = pattern.search(rhs_segment)
            if m:
                op_char = m.group(1)
                norm_op = "-" if op_char in ("-", "\u2212") else "+"
                if norm_op == norm_lhs_op:
                    start = search_start + m.start(1)
                    end = search_start + m.end(1)
                    return validate_span(lines, idx, start, end, line[start:end])
    # Fallback: if there are at least 2 lines and line 1 has an operator on the right-hand side of '='
    if len(lines) >= 2:
        target_idx = 1
        line = lines[target_idx]
        eq_pos = line.find("=")
        rhs = line[eq_pos + 1 :] if eq_pos >= 0 else line
        op_match = re.search(r"\s([+\-\u2212*/])\s", rhs)
        if op_match:
            offset = eq_pos + 1 if eq_pos >= 0 else 0
            start = offset + op_match.start(1)
            end = offset + op_match.end(1)
            return validate_span(lines, target_idx, start, end, line[start:end])
    return None


def build_work_sheet(work: str, answer: str, prompt: str, assessment: dict | None) -> dict:
    lines = split_work_lines(work, answer, prompt)
    span = None
    if assessment and assessment.get("status") != "correct" and lines:
        span = validate_span(
            lines,
            int(assessment.get("flagged_line_index", -1)),
            int(assessment.get("flagged_start", -1)),
            int(assessment.get("flagged_end", -1)),
            str(assessment.get("flagged_quote", "")),
        )
        if span is None:
            span = detect_deterministic_span(lines, prompt)
    structured_lines = []
    for idx, text in enumerate(lines):
        if span and span["line_index"] == idx:
            structured_lines.append(
                {
                    "index": idx,
                    "text": text,
                    "flagged": True,
                    "span": {
                        "start": span["start"],
                        "end": span["end"],
                        "quoted_text": span["quoted_text"],
                    },
                }
            )
        else:
            structured_lines.append(
                {
                    "index": idx,
                    "text": text,
                    "flagged": False,
                    "span": None,
                }
            )
    return {
        "lines": structured_lines,
        "has_flagged_step": span is not None,
        "flagged_span": span,
    }


def default_assistance(exercise_id: str) -> dict:
    return {
        "exercise_id": str(exercise_id or ""),
        "hint_opened": False,
        "corrective_feedback": False,
        "worked_solution_shown": False,
        "events": [],
    }


def current_exercise_id(state: dict) -> str:
    return str(state.get("exercise_instance") or state.get("current_practice_id") or "current")


def record_assistance_event(state: dict, kind: str) -> dict:
    practice_id = current_exercise_id(state)
    assistance = state.get("assistance")
    if not isinstance(assistance, dict) or assistance.get("exercise_id") != practice_id:
        assistance = default_assistance(practice_id)
    if kind == "hint_opened":
        assistance["hint_opened"] = True
    elif kind == "corrective_feedback":
        assistance["corrective_feedback"] = True
    elif kind == "worked_solution_shown":
        assistance["worked_solution_shown"] = True
    events = list(assistance.get("events") or [])
    if not any(ev.get("kind") == kind for ev in events):
        events.append({"kind": kind, "time": now_iso()})
    assistance["events"] = events[-10:]
    state["assistance"] = assistance
    return assistance


def build_hint_text(state: dict) -> str:
    question = state.get("question") or {}
    if question.get("hint"):
        return str(question["hint"])
    prompt = str(question.get("prompt") or "")
    eq_match = re.search(r"([a-zA-Z])\s*([+\-\u2212])\s*(\d+)\s*=\s*(\-?\d+)", prompt)
    if eq_match:
        var_name, op_char, const_val, _ = eq_match.groups()
        inverse = "add" if op_char in ("-", "\u2212") else "subtract"
        return f"Apply the inverse operation to both sides: {inverse} {const_val} on each side so {var_name} stands alone."
    lesson = state.get("lesson") or {}
    worked = lesson.get("worked_example") or []
    if worked:
        return f"Start with the first move from the worked example: {worked[0]}"
    return "Focus on the first operation needed to isolate the target value, and apply the same move to both sides."


def derive_outcome(state: dict) -> dict:
    stage = state.get("stage") or "plan"
    assessment = state.get("assessment") or {}
    practice_id = current_exercise_id(state)
    assistance = state.get("assistance")
    if not isinstance(assistance, dict) or assistance.get("exercise_id") != practice_id:
        assistance = default_assistance(practice_id)
    status = assessment.get("status")
    hint_used = bool(assistance.get("hint_opened"))
    feedback_used = bool(assistance.get("corrective_feedback"))
    solution_used = bool(assistance.get("worked_solution_shown"))
    any_help = hint_used or feedback_used or solution_used
    repaired_previously = bool(state.get("repaired_in_objective"))

    if status == "correct":
        if not any_help:
            category = "correct_without_recorded_help"
            label = "Solved independently"
            summary = (
                "Solved on a fresh equation after repairing the earlier step."
                if repaired_previously
                else "Solved on this exercise without opening a hint or step repair."
            )
        elif hint_used and not (feedback_used or solution_used):
            category = "correct_with_help"
            label = "Solved with a hint"
            summary = "Solved after opening a step hint on this exercise."
        else:
            category = "correct_with_help"
            label = "Solved with guidance"
            summary = "Solved after receiving step-by-step repair feedback on this exercise."
    elif stage == "repair":
        category = "repaired_needs_transfer"
        label = "Step repaired · Ready for a fresh equation"
        summary = "You worked through the stuck step. Try a fresh problem next to verify the move independently."
    elif stage == "diagnostic":
        category = "unresolved"
        label = "Checking one step"
        summary = "One step needs attention before checking a full solution."
    else:
        category = "in_progress"
        label = "Ready to check your work"
        summary = "Submit an answer and reasoning to check each step."

    evidence_items = []
    if assessment.get("evidence"):
        evidence_items.append(str(assessment["evidence"]))
    if status == "correct":
        evidence_items.append(
            "Hint opened during this problem." if hint_used else "No hint opened on this problem."
        )
        if repaired_previously and not any_help:
            evidence_items.append("Completed on a changed transfer problem after earlier step repair.")
    elif stage in ("diagnostic", "repair"):
        if feedback_used:
            evidence_items.append("Corrective step check opened for the flagged step.")
        if solution_used:
            evidence_items.append("Worked step repair shown; a fresh transfer problem is needed next.")

    return {
        "category": category,
        "label": label,
        "summary": summary,
        "help_used": any_help,
        "hint_opened": hint_used,
        "corrective_feedback": feedback_used,
        "worked_solution_shown": solution_used,
        "repaired_transfer": repaired_previously and status == "correct" and not any_help,
        "evidence_items": evidence_items,
        "caveat": "One attempt is not proof of mastery.",
    }


def build_public_observation(state: dict) -> dict | None:
    stage = state.get("stage") or "plan"
    if stage not in ("diagnostic", "repair", "feedback"):
        return None
    obs_override = state.get("episode_observation")
    assessment = state.get("assessment") or {}
    repair = state.get("repair") or {}
    raw_text = ""
    corrected = False
    learner_note = ""
    obs_id = current_exercise_id(state)
    if isinstance(obs_override, dict) and obs_override.get("id") == obs_id:
        raw_text = str(obs_override.get("text") or "")
        corrected = bool(obs_override.get("corrected"))
        learner_note = str(obs_override.get("learner_note") or "")
    if not raw_text:
        if repair.get("observation"):
            raw_text = str(repair["observation"])
        elif assessment.get("possible_gap"):
            gap = str(assessment["possible_gap"]).strip().rstrip(".")
            raw_text = f"Possible friction point: {gap}."
        elif assessment.get("evidence"):
            raw_text = str(assessment["evidence"])
    if not raw_text:
        return None
    return {
        "id": obs_id,
        "text": raw_text[:240],
        "corrected": corrected,
        "learner_note": learner_note[:240],
        "choices": list(OBSERVATION_CHOICES),
    }


def build_public_episode(state: dict) -> dict | None:
    stage = state.get("stage") or "plan"
    if stage not in ("attempt", "practice", "diagnostic", "repair", "feedback"):
        return None
    attempt = state.get("attempt") or {}
    question = state.get("question") or {}
    assessment = state.get("assessment")
    work_sheet = build_work_sheet(
        str(attempt.get("work") or ""),
        str(attempt.get("answer") or ""),
        str(question.get("prompt") or ""),
        assessment if isinstance(assessment, dict) else None,
    )
    if stage == "diagnostic":
        micro_step = 1
    elif stage == "repair":
        micro_step = 2
    elif stage in ("attempt", "practice") and state.get("repaired_in_objective"):
        micro_step = 3
    elif stage == "feedback" and (assessment or {}).get("status") == "correct":
        micro_step = 3
    else:
        micro_step = 1
    practice_id = current_exercise_id(state)
    assistance = state.get("assistance")
    if not isinstance(assistance, dict) or assistance.get("exercise_id") != practice_id:
        assistance = default_assistance(practice_id)
    hint_text = build_hint_text(state) if assistance.get("hint_opened") else ""
    return {
        "exercise_id": practice_id,
        "micro_step": micro_step,
        "steps": [
            {"number": 1, "label": "Find the step", "active": micro_step == 1, "completed": micro_step > 1},
            {"number": 2, "label": "Repair it", "active": micro_step == 2, "completed": micro_step > 2},
            {"number": 3, "label": "Try independently", "active": micro_step == 3, "completed": stage == "feedback" and (assessment or {}).get("status") == "correct"},
        ],
        "work_sheet": work_sheet,
        "observation": build_public_observation(state),
        "outcome": derive_outcome(state),
        "hint": hint_text,
    }
