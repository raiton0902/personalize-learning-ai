from pathlib import Path
from decimal import Decimal, InvalidOperation
import io
import re

from pypdf import PdfReader

MATERIALS = Path(__file__).parent / "sample_materials"
TOPICS = {
    "algebra.linear_equations": "Linear equations",
    "algebra.substitution": "Substitution",
    "geometry.point_on_line": "Points on a line",
}
QUESTIONS = {
    "ALG-01": {"objective": "algebra.linear_equations", "prompt": "Solve 3x + 5 = 17.", "answer": "4", "solution": "Subtract 5 from both sides: 3x=12. Divide both sides by 3: x=4. Check: 3(4)+5=17."},
    "ALG-02": {"objective": "algebra.linear_equations", "prompt": "Solve 4x + 3 = 23.", "answer": "5", "solution": "Subtract 3 from both sides: 4x=20. Divide by 4: x=5. Check: 4(5)+3=23."},
    "SUB-01": {"objective": "algebra.substitution", "prompt": "Given y = 2x + 3, find y when x = 4.", "answer": "11", "solution": "Replace x: y=2(4)+3=8+3=11. Multiply before adding."},
    "SUB-02": {"objective": "algebra.substitution", "prompt": "Given y = 3x + 2, find y when x = 5.", "answer": "17", "solution": "Replace x: y=3(5)+2=15+2=17."},
    "GEO-01": {"objective": "geometry.point_on_line", "prompt": "Does (3, 8) lie on y = 2x + 2?", "answer": "yes", "solution": "x=3 and y=8. The right side is 2(3)+2=8, equal to the point's y. Yes. A bare wrong answer could reflect reversed coordinates, substitution, or arithmetic: ask before diagnosing."},
    "GEO-02": {"objective": "geometry.point_on_line", "prompt": "Does (4, 11) lie on y = 2x + 2?", "answer": "no", "solution": "x=4 and y=11. The right side is 2(4)+2=10. Since 11 is not 10, no."},
}


def bundled_source():
    return {"id": "bundled", "title": "Algebra to coordinates", "origin": "Original course with OpenStax references",
            "text": (MATERIALS / "course_reference.md").read_text(encoding="utf-8")}


def questions_for(objective):
    return [key for key, question in QUESTIONS.items() if question["objective"] == objective]


def pdf_source(data: bytes, name: str):
    if len(data) > 2 * 1024 * 1024:
        raise ValueError("Use a PDF smaller than 2 MB.")
    try:
        reader = PdfReader(io.BytesIO(data))
        if len(reader.pages) > 12:
            raise ValueError("Use at most 12 pages for this prototype.")
        pages = [page.extract_text() or "" for page in reader.pages]
        if len("".join(pages).strip()) < 35:
            raise ValueError("This PDF has little readable text. Paste its text instead; scanned PDFs need OCR.")
        text = "\n".join(f"Page {i+1}:\n{page}" for i, page in enumerate(pages))
        if len(text) > 9000:
            raise ValueError("This reference is too long. Upload a shorter excerpt or paste the relevant section.")
        return {"id": "pdf", "title": name, "origin": "Learner supplied PDF", "text": text}
    except ValueError:
        raise
    except Exception:
        raise ValueError("This PDF could not be read. Paste the relevant text instead.") from None


def check_answer(question_id: str, answer: str) -> bool | None:
    expected = QUESTIONS[question_id]["answer"]
    text = answer.strip().lower()
    if expected in ("yes", "no"):
        answers = {"yes": "yes", "ya": "yes", "iya": "yes", "no": "no", "tidak": "no"}
        return answers[text] == expected if text in answers else None
    text = re.sub(r"^[xy]\s*=\s*", "", text)
    if not re.fullmatch(r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)", text) or len(text) > 40:
        return None
    try:
        return Decimal(text) == Decimal(expected)
    except InvalidOperation:
        return None
