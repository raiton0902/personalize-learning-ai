"""Workflow audit with synthetic accounts, isolated storage and no provider calls."""
import socket
import subprocess
import threading
import time
from pathlib import Path

import pytest
import uvicorn
from starlette.testclient import TestClient

import llm
import web_server
import web_tutor
from test_learning_tracks import plan


@pytest.fixture
def audit_backend(monkeypatch, tmp_path):
    monkeypatch.setenv('WEB_DB', str(tmp_path / 'audit.sqlite3'))
    monkeypatch.setattr(llm, 'request_model', lambda *a, **k: pytest.fail('No live inference in audit'))
    monkeypatch.setattr(web_tutor, 'propose', lambda state, changes='': (plan('advanced_full', bool(state['profile'].get('cramming'))), {}))
    monkeypatch.setattr(web_tutor, 'teach', lambda *a: ({'explanation': 'Assign a value to a name.', 'worked_example': ['Set x = 3.', 'Print x to see 3.']}, {}))


@pytest.fixture
def audit_client(audit_backend):
    with TestClient(web_server.app) as client:
        assert client.post('/api/auth/signup', json={'email': 'audit@example.invalid', 'password': 'synthetic-audit-password'}).status_code == 200
        yield client


@pytest.mark.parametrize('action', ['intake', 'submit_intake', 'skip_intake'])
def test_intake_failure_persists_latest_draft_and_retry_succeeds(audit_client, monkeypatch, action):
    created = audit_client.post('/api/courses', json={'profile': {'goal': 'I want to learn biology'}}).json()
    path = '/api/courses/' + created['id']
    propose = web_tutor.propose
    monkeypatch.setattr(web_tutor, 'propose', lambda *a: (_ for _ in ()).throw(llm.ModelRequestError('Synthetic provider failure')))
    payload = {'action': action, 'request_id': 'intake-1', 'profile': {'intended_outcome': 'Understand cells', 'time_budget': '3 hours', 'level': 'Beginner'}}
    failed = audit_client.post(path, json=payload)
    assert failed.status_code == 400
    saved = audit_client.get(path).json()['state']
    assert saved['stage'] == 'intake' and saved['curriculum'] is None
    assert saved['profile']['intended_outcome'] == 'Understand cells'
    assert saved['intake']['draft']['time_budget'] == '3 hours'
    monkeypatch.setattr(web_tutor, 'propose', propose)
    result = audit_client.post(path, json=payload)
    assert result.status_code == 200, result.text
    assert result.json()['state']['stage'] == 'plan'
    assert audit_client.post(path, json=payload).json()['deduplicated']


@pytest.mark.parametrize('action', ['intake', 'submit_intake', 'skip_intake', 'intake_draft'])
def test_stale_intake_cannot_replace_an_approved_course(audit_client, monkeypatch, action):
    cid = audit_client.post('/api/courses', json={'profile': {'goal': 'Learn Python'}, 'skip_intake': True}).json()['id']
    path = '/api/courses/' + cid
    audit_client.post(path, json={'action': 'approve'})
    before = audit_client.get(path).json()['state']
    monkeypatch.setattr(web_tutor, 'propose', lambda *a: pytest.fail('Stale intake must not generate'))
    response = audit_client.post(path, json={'action': action})
    assert response.status_code == 400
    assert audit_client.get(path).json()['state'] == before


def test_client_cannot_skip_required_assessment(audit_client):
    cid = audit_client.post('/api/courses', json={'profile': {'goal': 'Learn Python'}, 'skip_intake': True}).json()['id']
    path = '/api/courses/' + cid
    audit_client.post(path, json={'action': 'approve'})
    audit_client.post(path, json={'action': 'teach'})
    before = audit_client.get(path).json()['state']
    assert before['curriculum']['objectives'][0]['assessment_required']
    response = audit_client.post(path, json={'action': 'skip_check', 'optional_check': True})
    assert response.status_code == 400
    assert audit_client.get(path).json()['state'] == before


def test_workflow_browser_consistency(audit_backend):
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    server = uvicorn.Server(uvicorn.Config(web_server.app, host='127.0.0.1', port=port, log_level='warning'))
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    try:
        for _ in range(100):
            if server.started:
                break
            time.sleep(.05)
        result = subprocess.run(['node', str(Path(__file__).with_name('browser_workflow_consistency.cjs')), str(port)], capture_output=True, text=True, timeout=180)
        assert result.returncode == 0, result.stdout + result.stderr
    finally:
        server.should_exit = True
        thread.join(5)
