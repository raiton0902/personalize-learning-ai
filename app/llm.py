import os
import json
import re
from dataclasses import dataclass
from pathlib import Path
from time import perf_counter

from dotenv import load_dotenv
from openai import APIConnectionError, APIStatusError, APITimeoutError, OpenAI, OpenAIError
from usage import reserve, finish

BASE_URL = "https://api.tokenfactory.nebius.com/v1/"
ENV_PATH = Path(__file__).with_name(".env")
MAX_OUTPUT_TOKENS = 512
REQUEST_TIMEOUT_SECONDS = 60.0
ABSOLUTE_MAX_OUTPUT_TOKENS = 8192
PURPOSE_LIMITS = {
    'curriculum': (8192, 120.0), 'lesson': (8192, 120.0),
    'assessment': (4096, 60.0), 'diagnostic': (4096, 60.0),
    'repair': (4096, 60.0), 'practice': (4096, 60.0),
    'question_chat': (1536, 60.0), 'learner_question': (1536, 60.0),
}
TEST_QUESTION = "Solve 3x + 5 = 17. Explain each operation briefly."


class SetupError(ValueError):
    pass


class ModelRequestError(RuntimeError):
    pass


def valid_model_route(model):
    return bool(re.fullmatch(r'nvidia/[A-Za-z0-9][A-Za-z0-9._-]*', model, re.I)
                and 'nemotron' in model.lower())


def request_limits(purpose, thinking=False):
    group=purpose.removeprefix('general_')
    if thinking and group in {'assessment','repair'}:return (4096,60.0)
    return PURPOSE_LIMITS.get(group,(MAX_OUTPUT_TOKENS,REQUEST_TIMEOUT_SECONDS))


@dataclass(frozen=True)
class Settings:
    model: str
    allow_live: bool = False
    strong_model: str | None = None
    enable_thinking: bool = False


@dataclass(frozen=True)
class ModelReply:
    text: str
    model: str
    response_model: str
    elapsed_seconds: float
    usage: dict | None


def load_settings(env_path: Path = ENV_PATH) -> Settings:
    load_dotenv(env_path, override=False)
    key = os.getenv("NEBIUS_API_KEY", "").strip()
    model = os.getenv("NEBIUS_MODEL", "").strip()
    strong_model = os.getenv('NEBIUS_MODEL_STRONG','').strip() or None
    if not key or not model:
        raise SetupError(
            "Set NEBIUS_API_KEY and NEBIUS_MODEL in app/.env. "
            "Copy the exact Nemotron model ID from your Token Factory catalog."
        )
    if not valid_model_route(model):
        raise SetupError("Choose an NVIDIA Nemotron model ID from Token Factory.")
    if strong_model and not valid_model_route(strong_model):
        raise SetupError('NEBIUS_MODEL_STRONG must be an NVIDIA Nemotron model ID.')
    thinking=os.getenv('NEBIUS_ENABLE_THINKING','false').strip().lower() or 'false'
    if thinking not in {'true','false'}:raise SetupError('NEBIUS_ENABLE_THINKING must be true or false.')
    return Settings(model, os.getenv("NEBIUS_ALLOW_LIVE", "false").lower() == "true", strong_model, thinking=='true')


def model_for(settings, purpose):
    return settings.strong_model if settings.strong_model and purpose.removeprefix('general_') in {'curriculum','lesson','diagnostic','repair'} else settings.model


def request_math_help(settings: Settings) -> ModelReply:
    return request_model(settings, [{"role": "system", "content": "You are a concise mathematics tutor."},
                                    {"role": "user", "content": TEST_QUESTION}])


def request_model(settings: Settings, messages: list, *, response_format=None,
                  max_tokens: int | None = None, purpose: str = "connection") -> ModelReply:
    if not settings.allow_live:
        raise SetupError(
            "Live calls are disabled. Check billing and your agreed budget, "
            "then set NEBIUS_ALLOW_LIVE=true in app/.env."
        )
    key = os.getenv('NEBIUS_API_KEY','').strip()
    if not key:
        raise SetupError('Set NEBIUS_API_KEY locally before making a request.')
    for candidate in (settings.model,settings.strong_model):
        if candidate and not valid_model_route(candidate):
            raise SetupError('Choose an NVIDIA Nemotron model ID from Token Factory.')
    model = model_for(settings,purpose)
    thinking=settings.enable_thinking and purpose.removeprefix('general_') in {'assessment','repair'}
    limit,timeout = request_limits(purpose,thinking)
    max_tokens = limit if max_tokens is None else max_tokens
    if type(max_tokens) is not int or not 1 <= max_tokens <= min(limit,ABSOLUTE_MAX_OUTPUT_TOKENS):
        raise SetupError(f"Output limit for {purpose} must be an integer between 1 and {min(limit,ABSOLUTE_MAX_OUTPUT_TOKENS)} tokens.")
    payload = {"messages": messages, "response_format": response_format}
    if len(json.dumps(payload, ensure_ascii=False).encode("utf-8")) > 24000:
        raise SetupError("This prototype supports at most 24 KB of prompt data per request.")
    call_id = reserve(purpose, model)
    started = perf_counter()
    try:
        with OpenAI(
            api_key=key,
            base_url=BASE_URL,
            timeout=timeout,
            max_retries=0,
        ) as client:
            completion = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                extra_body={"chat_template_kwargs": {"enable_thinking": thinking}},
                **({"response_format": response_format} if response_format else {}),
            )
    except APITimeoutError:
        finish(call_id, model, None, "timeout")
        raise ModelRequestError("The request timed out. No automatic retry was made.") from None
    except APIConnectionError:
        finish(call_id, model, None, "connection_error")
        raise ModelRequestError("Could not reach Nebius. Check your connection and retry manually.") from None
    except APIStatusError as error:
        finish(call_id, model, None, "http_error")
        messages = {
            401: "Nebius rejected the API key. Check it locally in app/.env.",
            403: "This key does not have access. Check the Token Factory project permissions.",
            404: f"Model unavailable: {model}. Check {'NEBIUS_MODEL_STRONG' if settings.strong_model and model == settings.strong_model else 'NEBIUS_MODEL'} against the exact Token Factory catalog ID and your project access. No automatic fallback was made.",
            429: "Nebius limited the request. Check quota/balance before retrying.",
        }
        raise ModelRequestError(
            messages.get(error.status_code, "Nebius returned a service error. Retry manually later.")
        ) from None
    except OpenAIError:
        finish(call_id, model, None, "invalid_response")
        raise ModelRequestError("Nebius returned an unreadable response. Your work is preserved; retry manually.") from None

    usage = completion.usage.model_dump() if completion.usage else None
    finish(call_id, model, usage, "received")
    if not completion.choices:
        raise ModelRequestError("Nebius returned no answer. Check model settings before retrying.")
    choice = completion.choices[0]
    if choice.finish_reason == "length":
        raise ModelRequestError(
            f"The response reached the {max_tokens}-token limit. It may still incur usage; "
            "check the model's reasoning settings before retrying."
        )
    content = choice.message.content
    if isinstance(content,str) and re.match(r'\s*<(think|analysis)>',content,re.I):
        content=re.sub(r'^\s*<(think|analysis)>[\s\S]*?(?:</\1>|$)','',content,flags=re.I)
    if not isinstance(content,str) or not content.strip():
        raise ModelRequestError("The model returned no answer text. Check its reasoning settings.")
    return ModelReply(
        text=content.replace(key, "[redacted]"),
        model=model,
        response_model=completion.model,
        elapsed_seconds=round(perf_counter() - started, 3),
        usage=usage,
    )
