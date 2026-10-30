import json
from unittest.mock import patch

import httpx2
import pytest
from openai import OpenAI

from llm import ModelRequestError, Settings, SetupError, load_settings, request_math_help
from llm import request_model, request_limits, ABSOLUTE_MAX_OUTPUT_TOKENS

SECRET = "offline-test-secret"
SETTINGS = Settings("nvidia/nemotron-offline-test", True)


@pytest.fixture(autouse=True)
def offline_key(monkeypatch):
    monkeypatch.setenv("NEBIUS_API_KEY",SECRET)
    monkeypatch.delenv("NEBIUS_MODEL_STRONG",raising=False)
    monkeypatch.delenv("NEBIUS_ENABLE_THINKING",raising=False)


def fake_completion(*, text="x = 4", finish="stop", usage=True):
    body = {
        "id": "offline-response",
        "object": "chat.completion",
        "created": 0,
        "model": SETTINGS.model,
        "choices": [{"index": 0, "message": {"role": "assistant", "content": text}, "finish_reason": finish}],
    }
    if usage:
        body["usage"] = {"prompt_tokens": 24, "completion_tokens": 8, "total_tokens": 32}
    return body


def run_offline(handler):
    client = OpenAI(
        api_key=SECRET,
        base_url="https://api.tokenfactory.nebius.com/v1/",
        max_retries=0,
        http_client=httpx2.Client(transport=httpx2.MockTransport(handler)),
    )
    with patch("llm.OpenAI", return_value=client) as factory:
        result = request_math_help(SETTINGS)
        assert factory.call_args.kwargs["max_retries"] == 0
        assert factory.call_args.kwargs["timeout"] == 60.0
        return result


def test_missing_config_is_local(monkeypatch, tmp_path):
    monkeypatch.delenv("NEBIUS_API_KEY", raising=False)
    monkeypatch.delenv("NEBIUS_MODEL", raising=False)
    with pytest.raises(SetupError, match="Set NEBIUS_API_KEY"):
        load_settings(tmp_path / "missing.env")


def test_env_file_loads_without_disclosing_secret(monkeypatch, tmp_path):
    for name in ("NEBIUS_API_KEY", "NEBIUS_MODEL", "NEBIUS_ALLOW_LIVE"):
        monkeypatch.delenv(name, raising=False)
    env = tmp_path / ".env"
    env.write_text("NEBIUS_API_KEY=test-private\nNEBIUS_MODEL=nvidia/nemotron-offline-test\n")
    settings = load_settings(env)
    assert not hasattr(settings,"api_key")
    assert not settings.allow_live
    assert "test-private" not in repr(settings)


def test_live_disabled_never_constructs_client():
    with patch("llm.OpenAI") as factory:
        with pytest.raises(SetupError, match="disabled"):
            request_math_help(Settings(SETTINGS.model))
        factory.assert_not_called()


def test_non_nemotron_rejected(monkeypatch, tmp_path):
    monkeypatch.setenv("NEBIUS_API_KEY", "offline")
    monkeypatch.setenv("NEBIUS_MODEL", "other/model")
    with pytest.raises(SetupError, match="NVIDIA Nemotron"):
        load_settings(tmp_path / "missing.env")


def test_bounded_request_and_usage():
    def handler(request):
        assert str(request.url) == "https://api.tokenfactory.nebius.com/v1/chat/completions"
        body = json.loads(request.content)
        assert body["max_tokens"] == 512
        assert body["model"] == SETTINGS.model
        return httpx2.Response(200, json=fake_completion())

    reply = run_offline(handler)
    assert reply.text == "x = 4"
    assert reply.usage["total_tokens"] == 32


@pytest.mark.parametrize("status", [401, 403, 404, 429, 500])
def test_errors_are_sanitized_and_not_retried(status):
    calls = []

    def handler(request):
        calls.append(request)
        return httpx2.Response(status, json={"error": {"message": SECRET}})

    with pytest.raises(ModelRequestError) as error:
        run_offline(handler)
    assert SECRET not in str(error.value)
    assert len(calls) == 1


def test_timeout_is_safe():
    def handler(request):
        raise httpx2.ReadTimeout("private provider diagnostic", request=request)

    with pytest.raises(ModelRequestError, match="timed out"):
        run_offline(handler)


@pytest.mark.parametrize("text,finish", [(None, "stop"), ("partial", "length")])
def test_incomplete_response_is_not_success(text, finish):
    with pytest.raises(ModelRequestError):
        run_offline(lambda request: httpx2.Response(200, json=fake_completion(text=text, finish=finish)))


def test_usage_can_be_absent_and_response_redacts_key():
    reply = run_offline(lambda request: httpx2.Response(
        200, json=fake_completion(text=SECRET, usage=False)
    ))
    assert reply.usage is None
    assert reply.text == "[redacted]"


@pytest.mark.parametrize('purpose,limit,timeout',[
    ('connection',512,60),('curriculum',8192,120),('general_curriculum',8192,120),
    ('lesson',8192,120),('general_lesson',8192,120),('general_assessment',4096,60),
    ('repair',4096,60),('question_chat',1536,60),('general_practice',4096,60)])
def test_purpose_limits_and_timeout(purpose,limit,timeout):
    from types import SimpleNamespace
    completion=SimpleNamespace(usage=None,model=SETTINGS.model,choices=[SimpleNamespace(finish_reason='stop',message=SimpleNamespace(content='Done'))])
    with patch('llm.OpenAI') as factory:
        create=factory.return_value.__enter__.return_value.chat.completions.create
        create.return_value=completion
        request_model(SETTINGS,[],purpose=purpose)
        assert create.call_args.kwargs['max_tokens']==limit
        assert factory.call_args.kwargs['timeout']==timeout
        assert factory.call_args.kwargs['max_retries']==0


@pytest.mark.parametrize('limit',[0,-1,True,1.5,8193])
def test_invalid_output_limits_never_construct_client(limit):
    with patch('llm.OpenAI') as factory:
        with pytest.raises(SetupError):request_model(SETTINGS,[],purpose='curriculum',max_tokens=limit)
        factory.assert_not_called()


@pytest.mark.parametrize('purpose',['curriculum','general_curriculum','lesson','general_lesson','diagnostic','general_repair','repair'])
def test_optional_strong_tier(purpose):
    from llm import model_for
    strong='nvidia/NVIDIA-Nemotron-3-Super-120b-a12b'
    assert model_for(Settings(SETTINGS.model,True,strong),purpose)==strong
    assert model_for(SETTINGS,purpose)==SETTINGS.model


@pytest.mark.parametrize('purpose',['question_chat','learner_question','practice','assessment','general_assessment'])
def test_chat_practice_and_assessment_keep_default_tier(purpose):
    from llm import model_for
    assert model_for(Settings(SETTINGS.model,True,'nvidia/nemotron-strong'),purpose)==SETTINGS.model


def test_strong_config_is_optional_validated_and_secret_free(monkeypatch,tmp_path):
    monkeypatch.setenv('NEBIUS_MODEL',SETTINGS.model)
    monkeypatch.setenv('NEBIUS_MODEL_STRONG',' ')
    assert load_settings(tmp_path/'missing.env').strong_model is None
    monkeypatch.setenv('NEBIUS_MODEL_STRONG','other/model')
    with pytest.raises(SetupError,match='NEBIUS_MODEL_STRONG'):load_settings(tmp_path/'missing.env')
    monkeypatch.setenv('NEBIUS_MODEL_STRONG','nvidia/nemotron-strong')
    settings=load_settings(tmp_path/'missing.env')
    assert settings.strong_model=='nvidia/nemotron-strong' and 'api_key' not in vars(settings) and SECRET not in repr(settings)


@pytest.mark.parametrize('enabled',[False,True])
@pytest.mark.parametrize('purpose',['general_curriculum','general_lesson','question_chat','general_practice','general_assessment','general_repair'])
def test_thinking_only_for_assessment_repair_and_bounded_output(enabled,purpose):
    from types import SimpleNamespace
    with patch('llm.OpenAI') as factory:
        create=factory.return_value.__enter__.return_value.chat.completions.create
        create.return_value=SimpleNamespace(usage=None,model=SETTINGS.model,choices=[SimpleNamespace(finish_reason='stop',message=SimpleNamespace(content='Done'))])
        settings=Settings(SETTINGS.model,True,enable_thinking=enabled)
        request_model(settings,[],purpose=purpose)
        expected=enabled and purpose in {'general_assessment','general_repair'}
        assert create.call_args.kwargs['extra_body']['chat_template_kwargs']['enable_thinking']==expected
        assert create.call_args.kwargs['max_tokens']==request_limits(purpose,expected)[0]


@pytest.mark.parametrize('text',[None,'',' ','<think>private reasoning</think>','<think>private unfinished reasoning'])
def test_reasoning_only_response_is_safe_and_metered(text):
    from types import SimpleNamespace
    from usage import summary
    with patch('llm.OpenAI') as factory:
        create=factory.return_value.__enter__.return_value.chat.completions.create
        create.return_value=SimpleNamespace(usage=None,model=SETTINGS.model,choices=[SimpleNamespace(finish_reason='stop',message=SimpleNamespace(content=text,reasoning_content='private reasoning'))])
        with pytest.raises(ModelRequestError,match='no answer text') as error:
            request_model(Settings(SETTINGS.model,True,enable_thinking=True),[],purpose='assessment')
        assert 'private' not in str(error.value) and summary()['calls']==1 and summary()['reserved_usd']==.01


def test_thinking_env_defaults_off(monkeypatch,tmp_path):
    monkeypatch.setenv('NEBIUS_MODEL',SETTINGS.model)
    assert not load_settings(tmp_path/'missing.env').enable_thinking
    monkeypatch.setenv('NEBIUS_ENABLE_THINKING','true')
    assert load_settings(tmp_path/'missing.env').enable_thinking


@pytest.mark.parametrize('strong', [None, 'nvidia/NVIDIA-Nemotron-3-Super-120b-a12b'])
def test_selected_tier_reaches_transport_and_meter(strong):
    from usage import connect
    selected = strong or SETTINGS.model

    def handler(request):
        assert json.loads(request.content)['model'] == selected
        return httpx2.Response(200, json=fake_completion())

    client = OpenAI(api_key=SECRET, base_url='https://offline.invalid/v1/',
                    http_client=httpx2.Client(transport=httpx2.MockTransport(handler)))
    with patch('llm.OpenAI', return_value=client):
        result = request_model(Settings(SETTINGS.model, True, strong), [], purpose='general_lesson')
    assert result.model == selected
    with connect() as db:
        model, state, cost = db.execute('SELECT model,state,cost FROM calls').fetchone()
    assert (model, state) == (selected, 'received')
    assert cost == pytest.approx((24 * .30 + 8 * .80) / 1_000_000) if strong else cost is None
