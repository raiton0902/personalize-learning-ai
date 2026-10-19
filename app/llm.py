import os
from dataclasses import dataclass, field
from pathlib import Path
from time import perf_counter

from dotenv import load_dotenv
from openai import APIConnectionError, APIStatusError, APITimeoutError, OpenAI

BASE_URL = "https://api.tokenfactory.nebius.com/v1/"
ENV_PATH = Path(__file__).with_name(".env")
MAX_OUTPUT_TOKENS = 512
REQUEST_TIMEOUT_SECONDS = 60.0
TEST_QUESTION = "Solve 3x + 5 = 17. Explain each operation briefly."


class SetupError(ValueError):
    pass


class ModelRequestError(RuntimeError):
    pass


@dataclass(frozen=True)
class Settings:
    api_key: str = field(repr=False)
    model: str
    allow_live: bool = False


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
    if not key or not model:
        raise SetupError(
            "Set NEBIUS_API_KEY and NEBIUS_MODEL in app/.env. "
            "Copy the exact Nemotron model ID from your Token Factory catalog."
        )
    if not model.lower().startswith("nvidia/") or "nemotron" not in model.lower():
        raise SetupError("Choose an NVIDIA Nemotron model ID from Token Factory.")
    return Settings(key, model, os.getenv("NEBIUS_ALLOW_LIVE", "false").lower() == "true")


def request_math_help(settings: Settings) -> ModelReply:
    if not settings.allow_live:
        raise SetupError(
            "Live calls are disabled. Check billing and your agreed budget, "
            "then set NEBIUS_ALLOW_LIVE=true in app/.env."
        )
    started = perf_counter()
    try:
        with OpenAI(
            api_key=settings.api_key,
            base_url=BASE_URL,
            timeout=REQUEST_TIMEOUT_SECONDS,
            max_retries=0,
        ) as client:
            completion = client.chat.completions.create(
                model=settings.model,
                messages=[
                    {"role": "system", "content": "You are a concise mathematics tutor."},
                    {"role": "user", "content": TEST_QUESTION},
                ],
                max_tokens=MAX_OUTPUT_TOKENS,
            )
    except APITimeoutError:
        raise ModelRequestError("The request timed out. No automatic retry was made.") from None
    except APIConnectionError:
        raise ModelRequestError("Could not reach Nebius. Check your connection and retry manually.") from None
    except APIStatusError as error:
        messages = {
            401: "Nebius rejected the API key. Check it locally in app/.env.",
            403: "This key does not have access. Check the Token Factory project permissions.",
            404: "Model or endpoint unavailable. Verify the exact catalog ID.",
            429: "Nebius limited the request. Check quota/balance before retrying.",
        }
        raise ModelRequestError(
            messages.get(error.status_code, "Nebius returned a service error. Retry manually later.")
        ) from None

    if not completion.choices:
        raise ModelRequestError("Nebius returned no answer. Check model settings before retrying.")
    choice = completion.choices[0]
    if choice.finish_reason == "length":
        raise ModelRequestError(
            "The response reached the 512-token limit. It may still incur usage; "
            "check the model's reasoning settings before retrying."
        )
    content = choice.message.content
    if not content or not content.strip():
        raise ModelRequestError("The model returned no answer text. Check its reasoning settings.")
    return ModelReply(
        text=content.replace(settings.api_key, "[redacted]"),
        model=settings.model,
        response_model=completion.model,
        elapsed_seconds=round(perf_counter() - started, 3),
        usage=completion.usage.model_dump() if completion.usage else None,
    )
