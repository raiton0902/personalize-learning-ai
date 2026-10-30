"""Temporary integration server: real routes/storage, deterministic model replies only."""
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"app"))
directory=tempfile.TemporaryDirectory(prefix="learning-browser-")
os.environ["WEB_DB"]=str(Path(directory.name)/"web.sqlite3")
os.environ["LEARNING_USAGE_DB"]=str(Path(directory.name)/"usage.sqlite3")
os.environ["TRANSCRIPTION_ALLOW_PAID"]="false"
import tutor


def fake_generate(schema,purpose,data,instructions):
    if "curriculum" in purpose:
        result={"title":"Python variables", "scope_note":"A short course on assignment.", "objectives":[{"id":"python.variables","title":"Variables","outcome":"Assign a value and inspect it.","prerequisites":[],"source_ids":[data["source"]["id"]],"minutes":10}]}
    elif "lesson" in purpose:
        result={"explanation":"A variable is a name referring to a value. Assignment binds that name.\n\nWrite x = 3 and then inspect x.","worked_example":["Set x = 3.","Print x to see 3."]}
    elif purpose=="question_chat":
        unrelated="photosynthesis" in data["learner_question"].lower()
        result={"scope":"new_learning" if unrelated else "same_course","new_goal":"Learn photosynthesis" if unrelated else "","answer":"Plants turn sunlight into chemical energy." if unrelated else "Assignment binds a name to a value. For example, x = 3 makes x refer to 3."}
    elif purpose=="learner_question":
        result={"answer":"Assignment binds a name to the value on its right. It does not add to the old value."}
    elif "practice" in purpose:
        result={"prompt":"What is x after x = 3?","answer":"3","solution":"The assignment sets x to 3."}
    elif "assessment" in purpose:
        result={"status":"correct" if data["answer"]=="3" else "incorrect","evidence":"Compared the shown assignment with your reasoning.","possible_gap":"" if data["answer"]=="3" else "Assignment may be confused with addition.","diagnostic_question":"What does x = 3 assign to x?"}
    else:
        result={"explanation":"Assignment binds x to 3; it does not add one.","observation":"Needed support distinguishing assignment from addition."}
    if 'steps' in schema.model_fields:
        result['steps']=['Read the value on the right: 3.', 'Bind the name x to 3.']
    return schema.model_validate(result).model_dump(),{"model":"offline-fixture"}


tutor.generate=fake_generate
import uvicorn
import web_server
uvicorn.run(web_server.app,host="127.0.0.1",port=8781,log_level="warning")
