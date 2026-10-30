import pytest
from pathlib import Path
import dotenv
import os

os.environ['WEB_SESSION_SECRET'] = 'isolated-offline-test-session'


_load_dotenv = dotenv.load_dotenv
_private_env = Path(__file__).resolve().parents[1] / '.env'


def _offline_dotenv(path=None, *args, **kwargs):
    if path is not None and Path(path).resolve() == _private_env:
        return False
    return _load_dotenv(path, *args, **kwargs)


dotenv.load_dotenv = _offline_dotenv


@pytest.fixture(autouse=True)
def isolated_usage_meter(monkeypatch, tmp_path):
    monkeypatch.setenv("LEARNING_USAGE_DB", str(tmp_path / "usage.sqlite3"))
