import socket
import subprocess
import threading
import time
from pathlib import Path

import pytest
import uvicorn
from starlette.testclient import TestClient

import web_server
import web_store
import web_tutor
from schemas import GeneralPlan


def plan(track='beginner', cramming=False):
    groups = [('foundations', 'Beginner', 3)]
    if track != 'beginner':
        groups.append(('applied', 'Intermediate', 4))
    if track == 'advanced_full':
        groups.append(('advanced', 'Advanced', 5))
    if cramming:
        groups = [(mid, level, 2) for mid, level, _ in groups]
    objectives, modules = [], []
    for mid, level, count in groups:
        ids = []
        for _ in range(count):
            oid = f'lesson.{len(objectives)+1}'
            ids.append(oid)
            objectives.append(dict(id=oid, title=f'Lesson {len(objectives)+1}', outcome='Apply the concept in a small project.',
                minutes=15, source_ids=['general'], prerequisites=[objectives[-1]['id']] if objectives else [], module_id=mid, module_title=level))
        modules.append(dict(id=mid, title=level, objective_ids=ids, level=level, estimated_minutes=count*15))
    return dict(title='Learn Python', scope_note='A progressive course.', track_type=track, objectives=objectives, modules=modules,
        next_track_preview=['Applied workflows', 'Advanced implementation'] if track == 'beginner' else [])


@pytest.fixture
def track_client(monkeypatch, tmp_path):
    monkeypatch.setenv('WEB_DB', str(tmp_path / 'tracks.sqlite3'))
    with TestClient(web_server.app) as client:
        client.post('/api/auth/signup', json={'email': 'tracks@example.invalid', 'password': 'synthetic-pass-only'})
        yield client


def test_detailed_goal_still_enters_editable_intake_without_inference(track_client, monkeypatch):
    monkeypatch.setattr(web_tutor, 'propose', lambda *a: pytest.fail('Intake must not generate a plan'))
    goal = 'I want to learn C++ from scratch to build STL data structures for my university exam next Friday, I have 4 hours this week and already know basic Python loops'
    state = track_client.post('/api/courses', json={'profile': {'goal': goal}}).json()['state']
    assert state['stage'] == 'intake'
    assert 'STL data structures' in state['profile']['intended_outcome']
    assert 'Python loops' in state['profile']['level']
    assert state['profile']['time_budget']
    assert 'university exam' in state['profile']['context']
    assert len(state['intake']['autofilled']) == 4
    assert {q['id'] for q in state['intake']['questions']} >= {'intended_outcome', 'starting_knowledge', 'time_budget', 'requirements'}
    cid = track_client.get('/api/courses').json()['courses'][0]['id']
    changed = track_client.post(f'/api/courses/{cid}', json={'action': 'intake_draft', 'profile': {'level': 'Edited background', 'starting_knowledge': 'Edited background', 'time_budget': '', 'context': '', 'requirements': ''}}).json()['state']
    assert changed['intake']['draft']['level'] == 'Edited background'
    assert not changed['intake']['draft'].get('time_budget')


@pytest.mark.parametrize('track', ['beginner', 'intermediate', 'advanced_full'])
def test_tracks_schema_prompt_and_generation(track, monkeypatch):
    def generate(schema, purpose, data, instruction, extra):
        assert 'advanced_full' in instruction
        return schema.model_validate(plan('advanced_full')).model_dump(), {}
    monkeypatch.setattr(web_tutor, 'generate', generate)
    result, _ = web_tutor.propose({'profile': {'goal': 'Learn Python', 'track_type': track}, 'source': {'id': 'general'}, 'intake': {}})
    assert result['track_type'] == 'advanced_full'
    web_tutor.validate_track(result)
    assert all(m['estimated_minutes'] > 0 for m in result['modules'])


@pytest.mark.parametrize('track', ['beginner', 'intermediate', 'advanced_full'])
def test_module_objective_lists_preserve_track_grouping(track, monkeypatch):
    generated = plan('advanced_full')
    for obj in generated['objectives']:
        obj.pop('module_id')
        obj.pop('module_title')
    def generate(schema, *args):
        return schema.model_validate(generated).model_dump(), {}
    monkeypatch.setattr(web_tutor, 'generate', generate)
    result, _ = web_tutor.propose({'profile': {'goal': 'Learn Python', 'track_type': track}, 'source': {'id': 'general'}, 'intake': {}})
    assert [m['objective_ids'] for m in result['modules']] == [m['objective_ids'] for m in generated['modules']]
    assert [o['module_id'] for o in result['objectives']] == [m['id'] for m in generated['modules'] for _ in m['objective_ids']]


@pytest.mark.parametrize('conflict', ['two_lists', 'different_objective_module'])
def test_explicit_module_resolves_conflicting_membership(conflict):
    generated = plan('intermediate')
    first = generated['objectives'][0]
    if conflict == 'two_lists':
        generated['modules'][1]['objective_ids'].append(first['id'])
    else:
        first['module_id'] = generated['modules'][1]['id']
    result = web_tutor.normalize_curriculum(generated, {'id': 'general'}, {}, strict_validation=True)
    expected = first['module_id']
    assert next(o for o in result['objectives'] if o['id'] == first['id'])['module_id'] == expected
    assert [m['id'] for m in result['modules'] if first['id'] in m['objective_ids']] == [expected]


def test_ambiguous_membership_without_explicit_module_is_rejected():
    generated = plan('intermediate')
    first = generated['objectives'][0]
    first['module_id'] = ''
    generated['modules'][1]['objective_ids'].append(first['id'])
    with pytest.raises(ValueError, match='conflicting modules'):
        web_tutor.normalize_curriculum(generated, {'id': 'general'}, {}, strict_validation=True)


def test_invalid_track_shape_rejected_and_old_schema_defaults():
    old = plan()
    old.pop('track_type')
    for module in old['modules']:
        module.pop('level')
        module.pop('estimated_minutes')
    assert GeneralPlan.model_validate(old).track_type == 'beginner'
    with pytest.raises(ValueError, match='selected track'):
        web_tutor.validate_track(plan(), 'advanced_full')


@pytest.mark.parametrize('stage', ['lesson', 'complete'])
@pytest.mark.parametrize('starting_track', ['beginner', 'intermediate'])
def test_extension_candidate_preserves_progress_and_deduplicates(track_client, monkeypatch, stage, starting_track):
    monkeypatch.setattr(web_tutor, 'propose', lambda state, changes='': (plan(starting_track), {}))
    response = track_client.post('/api/courses', json={'skip_intake': True, 'profile': {'goal': 'Learn Python', 'track_type': starting_track}}).json()
    cid = response['id']
    track_client.post(f'/api/courses/{cid}', json={'action': 'approve'})
    owner = track_client.get('/api/me').json()['user']['id']
    state, revision = web_store.course(owner, cid)
    state.update(stage=stage, objective_index=1, lesson={'explanation': 'Saved explanation.', 'worked_example': ['Step one.', 'Step two.']}, attempts=[{'question': 'Saved test', 'answer': '3'}])
    web_store.save_course(owner, cid, state, revision)
    before, _ = web_store.course(owner, cid)
    monkeypatch.setattr(web_tutor, 'propose', lambda state, changes='': (plan('advanced_full'), {}))
    extended = track_client.post(f'/api/courses/{cid}', json={'action': 'extend_curriculum', 'request_id': 'extend-once'})
    assert extended.status_code == 200, extended.text
    duplicate = track_client.post(f'/api/courses/{cid}', json={'action': 'extend_curriculum', 'request_id': 'extend-once'}).json()
    assert duplicate['deduplicated']
    candidate = extended.json()['state']['pending_revision']
    applied = track_client.post(f'/api/courses/{cid}', json={'action': 'apply_revision', 'version': candidate['version']})
    assert applied.status_code == 200, applied.text
    after, _ = web_store.course(owner, cid)
    old_count = len(before['curriculum']['objectives'])
    assert after['curriculum']['objectives'][:old_count] == before['curriculum']['objectives']
    assert after['attempts'] == before['attempts']
    assert after['lesson'] == before['lesson']
    assert after['objective_index'] == (old_count if stage == 'complete' else before['objective_index'])
    assert after['curriculum']['track_type'] == 'advanced_full'
    assert after['lesson_history']


def test_unapproved_extension_and_rejected_candidate_leave_original_intact(track_client, monkeypatch):
    monkeypatch.setattr(web_tutor, 'propose', lambda state, changes='': (plan(), {}))
    created = track_client.post('/api/courses', json={'skip_intake': True, 'profile': {'goal': 'Learn Python'}}).json()
    cid = created['id']
    monkeypatch.setattr(web_tutor, 'propose', lambda state, changes='': (plan('advanced_full'), {}))
    extended = track_client.post(f'/api/courses/{cid}', json={'action': 'extend_curriculum'}).json()['state']
    assert extended['stage'] == 'plan' and extended['approved_version'] is None
    assert extended['curriculum']['track_type'] == 'advanced_full'
    assert extended['curriculum']['objectives'][:3] == created['state']['curriculum']['objectives']
    assert 'pending_revision' not in extended
    failed = track_client.post(f'/api/courses/{cid}', json={'action': 'extend_curriculum'})
    assert failed.status_code == 400
    assert track_client.get(f'/api/courses/{cid}').json()['state']['curriculum'] == extended['curriculum']


def test_guest_and_tracks_browser(monkeypatch, tmp_path):
    monkeypatch.setenv('WEB_DB', str(tmp_path / 'browser.sqlite3'))
    monkeypatch.setattr(web_tutor, 'propose', lambda state, changes='': (plan('advanced_full', bool(state['profile'].get('cramming'))), {}))
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        port = s.getsockname()[1]
    server = uvicorn.Server(uvicorn.Config(web_server.app, host='127.0.0.1', port=port, log_level='warning'))
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    try:
        for _ in range(100):
            if server.started:
                break
            time.sleep(.05)
        proc = subprocess.run(['node', str(Path(__file__).with_name('browser_tracks.cjs')), str(port)], capture_output=True, text=True, timeout=180)
        assert proc.returncode == 0, proc.stdout + proc.stderr
        features = subprocess.run(['node', str(Path(__file__).with_name('browser_cramming.cjs')), str(port)], capture_output=True, text=True, timeout=180)
        assert features.returncode == 0, features.stdout + features.stderr
    finally:
        server.should_exit = True
        thread.join(5)
