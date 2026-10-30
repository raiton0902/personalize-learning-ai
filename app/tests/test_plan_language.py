import copy
import json
from types import SimpleNamespace

import pytest
from pydantic import BaseModel

import language_rules
import tutor
import web_tutor
from test_learning_tracks import plan


@pytest.mark.parametrize('goal', ['teach me about Japanese History', 'Japanese history', 'Chinese history', 'Korean war', 'French history'])
def test_country_subject_keeps_english(goal):
    assert language_rules.resolve({'goal': goal, 'language': ''}) == 'English'


@pytest.mark.parametrize('text,code', [('目次', 'zh-cn'), ('かな', 'ja'), ('역사', 'ko')])
def test_short_script_detection(text, code):
    assert language_rules.detect_language(text) == code


@pytest.mark.parametrize('field', ['title', 'scope_note', 'module_title', 'module_summary', 'objective_title', 'objective_outcome'])
@pytest.mark.parametrize('language', ['', 'English', 'Indonesian'])
def test_short_non_latin_plan_field_is_mismatch(field, language):
    value = {'title': 'History', 'modules': [{}], 'objectives': [{}]}
    if field.startswith('module_'):
        value['modules'][0][field.removeprefix('module_')] = '目次'
    elif field.startswith('objective_'):
        value['objectives'][0][field.removeprefix('objective_')] = '解释该时期的地理与文化基础'
    else:
        value[field] = '目次'
    assert language_rules.plan_mismatch({'goal': 'teach me about Japanese History', 'language': language}, value)


def test_japanese_requested_language_is_respected():
    assert not language_rules.plan_mismatch({'language': 'Japanese'}, {'title': '日本の歴史', 'scope_note': 'かな'})


def test_short_english_curriculum_title_is_not_foreign_drift():
    assert not language_rules.plan_mismatch({'language': 'English'}, {'title': 'Intermediate practice'})
    assert not language_rules.plan_mismatch({'language': 'English'}, {'modules': [{'title': 'Core Exam Essentials'}]})


def test_short_french_outcome_is_detected_for_english_instruction():
    assert language_rules.plan_mismatch({'language': 'English'}, {'objectives': [{'outcome': 'Les bases de la programmation'}]})


@pytest.mark.parametrize('title', ['Linear Regression Fundamentals', 'Statistical Model Evaluation', 'Regression Model Diagnostics'])
def test_english_technical_titles_do_not_trigger_paid_repair(monkeypatch,title):
    value=plan('advanced_full')
    value['title']=title
    value['modules'][0]['title']=title
    calls=[]
    def generate(schema,*args):
        calls.append(1)
        return schema.model_validate(value).model_dump(),{}
    monkeypatch.setattr(web_tutor,'generate',generate)
    web_tutor.propose({'profile':{'goal':'I want to learn statistics','language':'English'},'source':{'id':'general'}})
    assert len(calls)==1


def test_mismatch_diagnostics_identify_field_without_learner_content():
    issues=language_rules.plan_language_issues({'language':'English'},{'modules':[{'summary':'Les bases de la programmation'}]})
    assert issues==[{'field':'modules[0].summary','detected':'French','expected':'English'}]


def test_biology_goal_with_empty_intake_keeps_english_without_repair(monkeypatch):
    value=plan('advanced_full')
    value['title']='Biological Classification'
    value['modules'][0]['title']='Cellular Organization'
    calls=[]
    def generate(schema,*args):
        calls.append(1)
        return schema.model_validate(value).model_dump(),{}
    monkeypatch.setattr(web_tutor,'generate',generate)
    profile={'goal':'I want to learn biology','language':'automatic'}
    assert language_rules.resolve(profile)=='English'
    result,_=web_tutor.propose({'profile':profile,'source':{'id':'general'},'intake':{}})
    assert result['title']=='Biological Classification'
    assert len(calls)==1


@pytest.mark.parametrize('repair', ['success', 'still_wrong', 'changed_structure'])
def test_plan_language_repair_is_one_pass_and_preserves_structure(monkeypatch, repair):
    original = plan('advanced_full')
    original['title'] = '目次'
    translated = copy.deepcopy(original)
    translated['title'] = 'Japanese History'
    if repair == 'still_wrong': translated['title'] = '目次'
    if repair == 'changed_structure': translated['objectives'][0]['minutes'] += 1
    calls = []
    def generate(schema, purpose, state, instruction, extra):
        calls.append(instruction)
        if len(calls) == 2:
            assert state['profile']['language'] == 'English'
            assert extra['plan_to_translate']['title'] == '目次'
            assert 'CRITICAL LANGUAGE RULE' in instruction
        assert len(calls) <= 2
        return schema.model_validate(original if len(calls) == 1 else translated).model_dump(), {}
    monkeypatch.setattr(web_tutor, 'generate', generate)
    state = {'profile': {'goal': 'teach me about Japanese History', 'language': ''}, 'source': {'id': 'general'}}
    if repair == 'success':
        result, metadata = web_tutor.propose(state)
        assert result['title'] == 'Japanese History' and 'language_repair' in metadata
    else:
        with pytest.raises(ValueError, match='structure|wrong language'):
            web_tutor.propose(state)
    assert len(calls) == 2


def test_correct_language_does_not_repair(monkeypatch):
    calls = []
    def generate(schema, *args):
        calls.append(1)
        return schema.model_validate(plan('advanced_full')).model_dump(), {}
    monkeypatch.setattr(web_tutor, 'generate', generate)
    web_tutor.propose({'profile': {'goal': 'Learn Python'}, 'source': {'id': 'general'}})
    assert len(calls) == 1


def test_system_and_user_prompt_separate_instruction_language_from_subject(monkeypatch):
    class Reply(BaseModel):
        text: str

    def request(settings, messages, **kwargs):
        assert 'CRITICAL LANGUAGE RULE' in messages[0]['content']
        assert 'NEVER switch language or script' in messages[0]['content']
        data = json.loads(messages[1]['content'])
        assert data['response_language'] == 'English'
        assert 'Japanese History' in data['profile']['goal']
        assert 'strictly in English' in data['language_instruction']
        return SimpleNamespace(text='{"text":"English explanation"}', elapsed_seconds=0, usage={}, response_model='mock')

    monkeypatch.setattr(tutor, 'load_settings', lambda: object())
    monkeypatch.setattr(tutor, 'request_model', request)
    web_tutor.generate(Reply, 'general_curriculum', {
        'profile': {'goal': 'teach me about Japanese History', 'language': ''},
        'objective_index': 0, 'source': {'id': 'general', 'text': ''},
    }, 'Propose a curriculum.')
