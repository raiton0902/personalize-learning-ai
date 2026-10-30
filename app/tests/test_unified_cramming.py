import pytest

import web_tutor
from question_matching import extract_goal_signature, is_similar_learning_goal
from test_learning_tracks import plan, track_client


@pytest.mark.parametrize('new,old', [
    ('explain me about machine learninng', 'I want to learn about machine learning'),
    ('Can you explain machinne learning?', 'I would like to understand machine learning'),
    ('Tell me about machine learning', 'Help me learn the basics of machine learning'),
    ('learn machine learning unsupervised learning', 'explain unsupervised learning in machine learning'),
    ('Teach me C++ pointers', 'Explain pointers in C++'),
    ('What is C#?', 'Introduce me to C# programming language'),
])
def test_similar_subject_and_scope(new, old):
    assert is_similar_learning_goal(new, old)
    assert is_similar_learning_goal(old, new)


@pytest.mark.parametrize('new,old', [
    ('I want to learn machine learning specific in unsupervised learning', 'learn machine learning'),
    ('Explain reinforcement learning in machine learning', 'Explain unsupervised learning in machine learning'),
    ('Learn C++', 'Learn C'), ('Learn C#', 'Learn C++'), ('Learn R', 'Learn Go'),
    ('Learn C++ STL', 'Learn C++ pointers'), ('Learn Python for web development', 'Learn Python'),
    ('Learn machine learning', 'Learn deep learning'), ('', 'Learn Python'),
    ('Learn supervised learning in machine learning', 'Learn unsupervised learning in machine learning'),
    ('Learn supervised learning', 'Learn unsupervised learning'),
])
def test_different_subject_or_scope(new, old):
    assert not is_similar_learning_goal(new, old)


def test_signature_preserves_narrowing():
    signature = extract_goal_signature('Explain machine learning focused on unsupervised learning')
    assert signature == {'subject': ('machine', 'learning'), 'subtopic': ('unsupervised',)}


def test_matching_route_keeps_narrow_course_separate(track_client, monkeypatch):
    monkeypatch.setattr(web_tutor, 'propose', lambda *a: pytest.fail('Intake and matching must not infer'))
    old = track_client.post('/api/courses', json={'profile': {'goal': 'I want to learn about machine learning'}}).json()
    matched = track_client.post('/api/courses', json={'profile': {'goal': 'explain me about machine learninng'}}).json()
    assert matched['similar_learning']['id'] == old['id']
    narrowed = track_client.post('/api/courses', json={'profile': {'goal': 'I want to learn machine learning specific in unsupervised learning'}}).json()
    assert narrowed['id'] != old['id'] and narrowed['state']['stage'] == 'intake'
    assert len(track_client.get('/api/courses').json()['courses']) == 2


CRAM_GOAL = "I got an exam tomorrow on Calculus derivatives, chain rule, and optimization in 5 hours, I'm stuck on word problems and no calculator is allowed"


def test_cramming_scope_autofill_and_edit(track_client, monkeypatch):
    monkeypatch.setattr(web_tutor, 'propose', lambda *a: pytest.fail('Review must precede generation'))
    result = track_client.post('/api/courses', json={'profile': {'goal': CRAM_GOAL}}).json()
    state = result['state']
    assert state['stage'] == 'intake' and state['profile']['cramming']
    assert state['profile']['track_type'] == 'advanced_full'
    assert state['profile']['intended_outcome'] == 'Calculus derivatives, chain rule, and optimization'
    assert 'word problems' in state['profile']['level']
    assert '5 hours' in state['profile']['time_budget']
    assert 'no calculator' in state['profile']['context']
    assert len(state['intake']['autofilled']) == 4
    assert 'exact exam topics' in state['intake']['questions'][0]['label']
    edited = track_client.post('/api/courses/'+result['id'], json={'action': 'intake_draft', 'profile': {'level': 'Chain rule', 'time_budget': '3 hours', 'context': ''}}).json()['state']
    assert edited['profile']['cramming'] and edited['intake']['draft']['level'] == 'Chain rule'
    assert not edited['intake']['draft'].get('context')


@pytest.mark.parametrize('goal', ['Quiz in 4 hours on algebra', 'Test tomorrow', 'I am cramming calculus'])
def test_urgent_goals_enable_cramming(goal):
    assert web_tutor.interpret_scope({'goal': goal})[0]['cramming']


def test_explicit_mode_and_mode_separation(track_client):
    normal = track_client.post('/api/courses', json={'profile': {'goal': 'Learn algebra'}}).json()
    cram = track_client.post('/api/courses', json={'profile': {'goal': 'Learn algebra', 'cramming': True}}).json()
    assert normal['id'] != cram['id'] and cram['state']['profile']['cramming']
    assert track_client.post('/api/courses', json={'profile': {'goal': 'Learn algebra', 'cramming': 'false'}}).status_code == 400


@pytest.mark.parametrize('cramming', [False, True])
def test_unified_generation_schema_and_exam_prompt(monkeypatch, cramming):
    def generate(schema, purpose, state, instruction, extra):
        assert 'Beginner' in instruction and 'Intermediate' in instruction and 'Advanced' in instruction
        assert ('CRAMMING:' in instruction) == cramming
        constraints = schema.model_json_schema()['properties']['objectives']
        assert (constraints['minItems'], constraints['maxItems']) == ((3, 9) if cramming else (6, 18))
        return schema.model_validate(plan('advanced_full', cramming)).model_dump(), {}
    monkeypatch.setattr(web_tutor, 'generate', generate)
    result, _ = web_tutor.propose({'profile': {'goal': 'Learn calculus', 'cramming': cramming, 'time_budget': '5 hours'}, 'source': {'id': 'general'}})
    assert [m['level'] for m in result['modules']] == ['Beginner', 'Intermediate', 'Advanced']
    assert result['track_type'] == 'advanced_full'


def test_cramming_rejects_over_budget_plan(monkeypatch):
    monkeypatch.setattr(web_tutor, 'generate', lambda schema, *a: (schema.model_validate(plan('advanced_full', True)).model_dump(), {}))
    with pytest.raises(ValueError, match='exceeds your available time'):
        web_tutor.propose({'profile': {'goal': 'Learn calculus', 'cramming': True, 'time_budget': '20 minutes'}, 'source': {'id': 'general'}})
