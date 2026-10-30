import pytest
import web_tutor
from llm import ModelRequestError


@pytest.mark.parametrize('prompt', ['I want to learn about python', 'I WANT TO LEARN ABOUT PYTHON!!!', ' ', 'TODO'])
def test_invalid_exercise_does_not_mutate_lesson(monkeypatch,prompt):
    state={'source':{'id':'general'},'profile':{'goal':'I want to learn about python'},'objective_index':0,'stage':'lesson','lesson':{'explanation':'Saved lesson'}}
    monkeypatch.setattr(web_tutor,'generate',lambda *a,**k:({'prompt':prompt,'answer':'5','solution':'Add 2 and 3.'},{}))
    with pytest.raises(ModelRequestError,match='lesson is preserved'):
        web_tutor.practice(state)
    assert state['stage']=='lesson' and state['lesson']['explanation']=='Saved lesson'


def test_answerable_exercise_is_preserved_verbatim(monkeypatch):
    state={'source':{'id':'general'},'profile':{'goal':'Learn Python'},'objective_index':0}
    exercise={'prompt':'What does this print?\n```python\nprint(2 + 3)\n```','answer':'5','solution':'2 + 3 is 5.'}
    monkeypatch.setattr(web_tutor,'generate',lambda *a,**k:(exercise,{}))
    result,_=web_tutor.practice(state)
    assert result=={'id':'generated',**exercise}
