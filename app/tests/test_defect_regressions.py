"""Offline regressions for the 29 October QA/UI repair brief."""
import json
from unittest.mock import patch

import httpx2
import pytest
from openai import OpenAI

import llm
import web_tutor
from test_web import client


def test_qa01_strong_404_has_exact_diagnostic_and_no_fallback(monkeypatch):
    monkeypatch.setenv('NEBIUS_API_KEY', 'synthetic-offline-key')
    strong = 'nvidia/NVIDIA-Nemotron-3-Super-120b-a12b'
    calls = []

    def handler(request):
        calls.append(json.loads(request.content)['model'])
        return httpx2.Response(404, json={'error': {'message': 'private provider body'}})

    client = OpenAI(api_key='synthetic-offline-key', base_url='https://offline.invalid/v1/',
                    max_retries=0, http_client=httpx2.Client(transport=httpx2.MockTransport(handler)))
    with patch('llm.OpenAI', return_value=client) as factory:
        with pytest.raises(llm.ModelRequestError) as error:
            llm.request_model(llm.Settings('nvidia/nemotron-default', True, strong), [], purpose='curriculum')
    assert str(error.value) == f'Model unavailable: {strong}. Check NEBIUS_MODEL_STRONG against the exact Token Factory catalog ID and your project access. No automatic fallback was made.'
    assert calls == [strong]
    assert factory.call_args.kwargs['max_retries'] == 0


@pytest.mark.parametrize('route', ['nvidia/nemotron bad', 'nvidia/nemotron?key=bad', 'nvidia/nemotron/extra'])
def test_qa01_invalid_strong_slug_is_rejected_before_transport(monkeypatch, route):
    monkeypatch.setenv('NEBIUS_API_KEY', 'synthetic-offline-key')
    with patch('llm.OpenAI') as factory:
        with pytest.raises(llm.SetupError, match='Nemotron'):
            llm.request_model(llm.Settings('nvidia/nemotron-default', True, route), [], purpose='lesson')
        factory.assert_not_called()


def direct_state():
    return {'profile': {'goal': 'Learn force and motion', 'tone': 'One short explanation and one example.'},
            'source': {'id': 'general', 'text': 'Force equals mass times acceleration.'},
            'objective_index': 0, 'stage': 'intake'}


def test_qa02_direct_answer_has_brevity_schema_and_style_contract(monkeypatch):
    def fake(schema, purpose, data, instruction):
        assert data['profile']['tone'] == 'One short explanation and one example.'
        assert 'teaching_style' in instruction and '90 words' in instruction
        assert schema.model_json_schema()['properties']['answer']['maxLength'] <= 1200
        return {'answer': 'Force changes motion. For example, 2 kg at 3 m/s² needs 6 N.'}, {}
    monkeypatch.setattr(web_tutor.tutor, 'generate', fake)
    answer, _ = web_tutor.followup(direct_state(), 'What is force?')
    assert answer['answer'].endswith('6 N.')


@pytest.mark.parametrize('answer', [
    'A force changes motion. ' * 8 + 'and this means',
    'Here is a calculation:\n```python\nforce = 2 * 3',
])
def test_qa02_incomplete_direct_answer_is_not_saved_as_success(monkeypatch, answer):
    monkeypatch.setattr(web_tutor, 'generate', lambda *a, **k: ({'answer': answer}, {}))
    with pytest.raises(llm.ModelRequestError, match='incomplete'):
        web_tutor.followup(direct_state(), 'Explain force')


def test_intake_saved_outcome_and_background_remain_editable():
    profile = {'goal': 'Learn physics', 'intended_outcome': 'Understand motion', 'level': 'Beginner'}
    intake = web_tutor.build_intake_state(profile)
    ids = {q['id'] for q in intake['questions']}
    assert {'intended_outcome', 'starting_knowledge'} <= ids
    assert intake['missing'] == []


def test_qa02_incomplete_answer_keeps_saved_course_answer(client, monkeypatch):
    client.post('/api/auth/signup', json={'email': 'direct@example.invalid', 'password': 'synthetic-test-only'})
    cid = client.post('/api/courses', json={'profile': {'goal': 'Algebra'}}).json()['id']
    monkeypatch.setattr(web_tutor, 'generate', lambda *a, **k: ({'answer': 'Force changes motion.'}, {}))
    assert client.post(f'/api/courses/{cid}', json={'action': 'direct_question', 'text': 'What is force?'}).status_code == 200
    monkeypatch.setattr(web_tutor, 'generate', lambda *a, **k: ({'answer': 'A force changes motion. ' * 8 + 'and this means'}, {}))
    failed = client.post(f'/api/courses/{cid}', json={'action': 'direct_question', 'text': 'Explain more'})
    assert failed.status_code == 400 and failed.json()['code'] == 'model_error'
    assert 'incomplete' in failed.json()['error']
    assert client.get(f'/api/courses/{cid}').json()['state']['last_direct_answer']['answer'] == 'Force changes motion.'


def test_browser_qa_ui_regressions(monkeypatch, tmp_path):
    import os
    import socket
    import subprocess
    import threading
    import time
    from pathlib import Path
    import uvicorn
    import web_server

    from docx import Document
    from reportlab.pdfgen.canvas import Canvas
    upload_text = 'A variable is an unknown quantity. Subtract the same quantity from both sides of an equation to keep it balanced.'
    (tmp_path / 'regression.txt').write_text(upload_text, encoding='utf-8')
    (tmp_path / 'regression.md').write_text('# Test source\n' + upload_text, encoding='utf-8')
    document = Document()
    document.add_paragraph(upload_text)
    document.save(tmp_path / 'regression.docx')
    pdf = Canvas(str(tmp_path / 'regression.pdf'))
    pdf.drawString(30, 700, upload_text)
    pdf.save()
    monkeypatch.setenv('WEB_DB', str(tmp_path / 'isolated-web.sqlite3'))
    monkeypatch.setenv('WEB_SESSION_SECRET', 'synthetic-regression-secret')
    monkeypatch.setattr(web_tutor.tutor, 'generate', lambda *a, **k: (_ for _ in ()).throw(AssertionError('Unexpected inference')))
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
        script = Path(__file__).with_name('browser_defects.cjs')
        result = subprocess.run(['node', str(script), str(port), os.getenv('REPAIR_AUDIT_PHASE', 'after'), str(tmp_path)],
                                capture_output=True, text=True, timeout=240)
        assert result.returncode == 0, result.stdout + result.stderr
    finally:
        server.should_exit = True
        thread.join(5)
