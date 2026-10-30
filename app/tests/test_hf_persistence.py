from contextlib import closing
import shutil
import sqlite3
from pathlib import Path

import hf_persistence


class FakeHubStorage:
    def __init__(self):
        self.remote: dict[str, bytes] = {}
        self.uploads: list[str] = []
        self.fail_upload = False

    def download(self, remote_name: str, destination: Path) -> bool:
        data = self.remote.get(remote_name)
        if data is None:
            return False
        destination.write_bytes(data)
        return True

    def upload(self, local_path: Path, remote_name: str) -> None:
        if self.fail_upload:
            raise RuntimeError(f"Could not upload {remote_name} to dataset repository.")
        self.remote[remote_name] = local_path.read_bytes()
        self.uploads.append(remote_name)


def _create_sqlite(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(path)) as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS items (val TEXT)")
        conn.execute("INSERT INTO items VALUES (?)", (value,))
        conn.commit()


def test_disabled_without_env(monkeypatch, tmp_path):
    monkeypatch.delenv("HF_DATASET_REPO", raising=False)
    monkeypatch.delenv("HF_TOKEN", raising=False)
    files = {"workspace.sqlite3": tmp_path / "workspace.sqlite3"}
    logs = []
    sync = hf_persistence.PersistenceSync.from_env(files=files, log=logs.append)
    assert not sync.enabled
    assert sync.restore_all() == []
    assert sync.sync_once() == []


def test_sync_and_restore_roundtrip(tmp_path):
    storage = FakeHubStorage()
    src_dir = tmp_path / "source"
    dst_dir = tmp_path / "restored"

    src_files = {
        "workspace.sqlite3": src_dir / "workspace.sqlite3",
        "usage.sqlite3": src_dir / "usage.sqlite3",
        "web-session.key": src_dir / "web-session.key",
    }
    _create_sqlite(src_files["workspace.sqlite3"], "account-1")
    _create_sqlite(src_files["usage.sqlite3"], "call-1")
    src_files["web-session.key"].write_text("secret-key-token", encoding="utf-8")

    sync = hf_persistence.PersistenceSync(storage=storage, files=src_files, log=lambda _: None)
    uploaded = sync.sync_once()
    assert set(uploaded) == {"workspace.sqlite3", "usage.sqlite3", "web-session.key"}

    # Unchanged files must not trigger redundant network uploads.
    assert sync.sync_once() == []
    assert sync.sync_once(force=True) == []

    # Modifying only workspace.sqlite3 uploads only that file.
    _create_sqlite(src_files["workspace.sqlite3"], "account-2")
    uploaded_second = sync.sync_once(force=True)
    assert uploaded_second == ["workspace.sqlite3"]

    # Simulate container wake after 48h sleep on a fresh ephemeral disk.
    dst_files = {
        "workspace.sqlite3": dst_dir / "workspace.sqlite3",
        "usage.sqlite3": dst_dir / "usage.sqlite3",
        "web-session.key": dst_dir / "web-session.key",
    }
    restore_sync = hf_persistence.PersistenceSync(storage=storage, files=dst_files, log=lambda _: None)
    restored = restore_sync.restore_all()
    assert set(restored) == {"workspace.sqlite3", "usage.sqlite3", "web-session.key"}
    assert dst_files["web-session.key"].read_text(encoding="utf-8") == "secret-key-token"

    with closing(sqlite3.connect(dst_files["workspace.sqlite3"])) as conn:
        rows = [r[0] for r in conn.execute("SELECT val FROM items ORDER BY rowid").fetchall()]
    assert rows == ["account-1", "account-2"]

    # Immediate sync after restore must not re-upload already synchronized snapshots.
    assert restore_sync.sync_once(force=True) == []


def test_restore_rejects_corrupt_sqlite_and_never_overwrites_existing(tmp_path):
    storage = FakeHubStorage()
    storage.remote["workspace.sqlite3"] = b"not-a-valid-sqlite-database"
    storage.remote["web-session.key"] = b"remote-key"

    local_key = tmp_path / "web-session.key"
    local_key.write_text("existing-local-key", encoding="utf-8")
    files = {
        "workspace.sqlite3": tmp_path / "workspace.sqlite3",
        "web-session.key": local_key,
    }
    logs = []
    sync = hf_persistence.PersistenceSync(storage=storage, files=files, log=logs.append)
    restored = sync.restore_all()
    assert restored == []
    assert not files["workspace.sqlite3"].exists()
    assert local_key.read_text(encoding="utf-8") == "existing-local-key"
    assert any("Skipped invalid SQLite snapshot" in m for m in logs)


def test_web_server_account_survives_simulated_space_sleep(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    import web_server

    db_path = tmp_path / "workspace.sqlite3"
    usage_path = tmp_path / "usage.sqlite3"
    key_path = tmp_path / "web-session.key"
    key_path.write_text("test-hf-session-key", encoding="utf-8")

    monkeypatch.setenv("WEB_DB", str(db_path))
    monkeypatch.setenv("LEARNING_USAGE_DB", str(usage_path))
    monkeypatch.setenv("WEB_SESSION_SECRET", "test-hf-session-key")

    storage = FakeHubStorage()
    files = {
        "workspace.sqlite3": db_path,
        "usage.sqlite3": usage_path,
        "web-session.key": key_path,
    }
    sync = hf_persistence.PersistenceSync(storage=storage, files=files, log=lambda _: None)

    with TestClient(web_server.app) as client:
        res = client.post("/api/auth/signup", json={"email": "hf-learner@example.com", "password": "correct-horse-battery"})
        assert res.status_code == 200
        prof = client.post("/api/profile", json={"goal": "", "language": "", "level": "", "tone": "Concise steps", "interest": "Robotics", "context": "", "pace": ""})
        assert prof.status_code == 200
        cookie_val = client.cookies.get("learning_login")
        assert cookie_val

    # Back up state before container sleep.
    uploaded = sync.sync_once(force=True)
    assert "workspace.sqlite3" in uploaded

    # Simulate ephemeral container reset (delete local SQLite database).
    db_path.unlink()
    assert not db_path.exists()

    # Container wakes up and restores from private HF Dataset storage.
    wake_sync = hf_persistence.PersistenceSync(storage=storage, files=files, log=lambda _: None)
    restored = wake_sync.restore_all()
    assert "workspace.sqlite3" in restored
    assert db_path.exists()

    # Existing login cookie and saved account profile remain valid after wake.
    with TestClient(web_server.app) as client:
        client.cookies.set("learning_login", cookie_val)
        me = client.get("/api/me")
        assert me.status_code == 200
        body = me.json()
        assert body["user"]["email"] == "hf-learner@example.com"
        assert body["user"]["profile"]["interest"] == "Robotics"

