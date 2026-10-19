import json
from unittest.mock import patch

import httpx2
import pytest
from openai import OpenAI

from llm import ModelRequestError, Settings, SetupError, load_settings, request_math_help

SETTINGS = Settings("offline-test-secret", "nvidia/nemotron-offline-test", True)


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
        api_key=SETTINGS.api_key,
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
    assert settings.api_key == "test-private"
    assert not settings.allow_live
    assert "test-private" not in repr(settings)


def test_live_disabled_never_constructs_client():
    with patch("llm.OpenAI") as factory:
        with pytest.raises(SetupError, match="disabled"):
            request_math_help(Settings("unused", SETTINGS.model))
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
        return httpx2.Response(status, json={"error": {"message": SETTINGS.api_key}})

    with pytest.raises(ModelRequestError) as error:
        run_offline(handler)
    assert SETTINGS.api_key not in str(error.value)
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
        200, json=fake_completion(text=SETTINGS.api_key, usage=False)
    ))
    assert reply.usage is None
    assert reply.text == "[redacted]"
