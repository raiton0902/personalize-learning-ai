"""An explicit, resumable set of nine small live model checks. No learner data."""

import argparse
import json
from dataclasses import asdict, replace
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from llm import ModelRequestError, SetupError, load_settings, request_model
from usage import BudgetExceeded, summary


class AssessmentProbe(BaseModel):
    answer: str
    assessment: Literal["correct", "incorrect", "uncertain"]
    gap: Literal["none", "coordinate", "arithmetic", "ambiguous"]
    next_question: str


SCENARIOS = [
    ("solve", "Solve 4x + 3 = 23. Return x as answer. There is no learner attempt, so assessment is uncertain and gap is none.", "uncertain", "none", "5"),
    ("substitution", "Find y in y=3x+2 when x=5. Return y as answer. No learner attempt; assessment uncertain, gap none.", "uncertain", "none", "17"),
    ("point_yes", "Learner checks (3,8) on y=2x+2: x=3,y=8; 2*3+2=8, so yes. Assess their reasoning. Return yes as answer.", "correct", "none", "yes"),
    ("point_no", "Learner checks (4,11) on y=2x+2: 2*4+2=10, not 11, so no. Assess their reasoning. Return no as answer.", "correct", "none", "no"),
    ("ambiguous", "Question: does (3,8) lie on y=2x+2? Learner says only 'No'. We cannot infer the cause. Assessment incorrect, gap ambiguous. Ask a diagnostic; do not supply the final solution yet.", "incorrect", "ambiguous", None),
    ("coordinates", "For (3,8) on y=2x+2, learner writes x=8,y=3, then 2*8+2=18, so no. Identify the supported error and ask a targeted question, without showing the full solution.", "incorrect", "coordinate", None),
    ("arithmetic", "For (3,8) on y=2x+2, learner writes x=3,y=8, then 2*3=5, 5+2=7, so no. Identify the supported error and ask a targeted question, without showing the full solution.", "incorrect", "arithmetic", None),
    ("understand", "After a worked example, learner says 'I understand'. There is no independent solution. Assessment uncertain, gap ambiguous. Ask for one independent step; do not claim mastery.", "uncertain", "ambiguous", None),
    ("indonesian", "Gunakan bahasa Indonesia. Murid menulis 3x+5=17, 3x=12, x=4. Nilai langkahnya. Jawaban akhir 4, penilaian correct, gap none. Minta satu soal baru untuk mencoba sendiri.", "correct", "none", "4"),
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()
    if not args.live:
        print("No request sent. Use --live only with an agreed testing budget.")
        return
    settings = replace(load_settings(), allow_live=True)
    path = Path(__file__).parent / "local_results" / "model_checks.jsonl"
    path.parent.mkdir(exist_ok=True)
    completed = {json.loads(line)["scenario"] for line in path.read_text().splitlines()} if path.exists() else set()
    schema = AssessmentProbe.model_json_schema()
    for name, question, expected_assessment, expected_gap, expected_answer in SCENARIOS:
        if name in completed:
            continue
        record = {"scenario": name}
        try:
            reply = request_model(settings, [
                {"role": "system", "content": "You are a mathematics tutor. Use only observable evidence. Return a JSON object matching this schema: " + json.dumps(schema)},
                {"role": "user", "content": question},
            ], response_format={"type": "json_schema", "json_schema": {"name": "assessment_probe", "strict": True, "schema": schema}},
                max_tokens=1024, purpose="probe:" + name)
            result = AssessmentProbe.model_validate_json(reply.text)
            passed = result.assessment == expected_assessment and result.gap == expected_gap
            if expected_answer is not None:
                passed = passed and expected_answer in result.answer.lower()
            if expected_gap != "none":
                passed = passed and bool(result.next_question.strip())
            record.update(reply=asdict(reply), parsed=result.model_dump(), passed=passed)
        except (ModelRequestError, SetupError, BudgetExceeded) as error:
            record.update(passed=False, error=str(error))
        except ValueError:
            record.update(passed=False, error="Response did not match the required schema.")
        with path.open("a", encoding="utf-8") as out:
            out.write(json.dumps(record, ensure_ascii=False) + "\n")
        print(name, "PASS" if record["passed"] else "FAIL", flush=True)
        if "error" in record:
            print(record["error"])
            break
    print(json.dumps(summary(), indent=2))


if __name__ == "__main__":
    main()
