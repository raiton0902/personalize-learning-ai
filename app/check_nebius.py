import argparse
import json
from dataclasses import asdict

from llm import ModelRequestError, SetupError, load_settings, request_math_help


def main() -> int:
    parser = argparse.ArgumentParser(description="Check setup locally, or explicitly make one Nebius request.")
    parser.add_argument("--live", action="store_true", help="Send one request; may incur provider charges.")
    args = parser.parse_args()
    try:
        settings = load_settings()
        if not args.live:
            print("Key and model are configured; no network request was made.")
            print("Live calls enabled:", settings.allow_live)
            print("Account access, model availability, and billing are not verified by this check.")
            return 0
        reply = request_math_help(settings)
    except (SetupError, ModelRequestError) as error:
        print(str(error))
        return 1
    print(json.dumps(asdict(reply), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
