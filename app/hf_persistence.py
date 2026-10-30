"""Optional Hugging Face Spaces Docker entrypoint and private Dataset SQLite sync.

Runs `web_server:app` under Uvicorn without modifying application routes or schemas.
When `HF_TOKEN` and `HF_DATASET_REPO` are configured, restores and backs up
`workspace.sqlite3`, `usage.sqlite3`, and `web-session.key` to a private Hugging Face
Dataset repository so learner accounts and usage ledgers survive container sleep.
"""
from __future__ import annotations

from contextlib import closing
import hashlib
import os
import shutil
import signal
import sqlite3
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path
from typing import Callable

ROOT = Path(__file__).parent
os.environ["GRADIO_SSR_MODE"] = "false"

try:
    import spaces as _hf_spaces
except Exception:
    _hf_spaces = None


def _gpu_decorator(fn):
    if _hf_spaces is not None and hasattr(_hf_spaces, "GPU"):
        try:
            return _hf_spaces.GPU(fn)
        except Exception:
            return fn
    return fn


@_gpu_decorator
def zero_gpu_health(status: str = "ready") -> str:
    return status


def tracked_files() -> dict[str, Path]:
    local_dir = ROOT / "local_results"
    web_db = Path(os.getenv("WEB_DB", str(local_dir / "workspace.sqlite3")))
    usage_db = Path(os.getenv("LEARNING_USAGE_DB", str(local_dir / "usage.sqlite3")))
    secret_key = local_dir / "web-session.key"
    return {
        "workspace.sqlite3": web_db,
        "usage.sqlite3": usage_db,
        "web-session.key": secret_key,
    }


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _valid_sqlite(path: Path) -> bool:
    try:
        with closing(sqlite3.connect(path, timeout=5)) as conn:
            row = conn.execute("PRAGMA integrity_check").fetchone()
            return bool(row and row[0] == "ok")
    except sqlite3.Error:
        return False


def snapshot_file(source: Path, destination: Path, is_sqlite: bool) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if is_sqlite:
        if destination.exists():
            destination.unlink()
        with closing(sqlite3.connect(source, timeout=15)) as src_conn:
            with closing(sqlite3.connect(destination, timeout=15)) as dst_conn:
                src_conn.backup(dst_conn)
    else:
        shutil.copy2(source, destination)


class HubStorage:
    """Thin wrapper around huggingface_hub.HfApi so tests can inject a mock backend."""

    def __init__(self, repo_id: str, token: str):
        from huggingface_hub import HfApi, hf_hub_download

        self.repo_id = repo_id
        self.token = token
        self._api = HfApi(token=token)
        self._download = hf_hub_download

    def download(self, remote_name: str, destination: Path) -> bool:
        try:
            with tempfile.TemporaryDirectory(prefix="hf-restore-") as tmp_dir:
                cached = self._download(
                    repo_id=self.repo_id,
                    filename=remote_name,
                    repo_type="dataset",
                    token=self.token,
                    local_dir=tmp_dir,
                )
                shutil.copy2(cached, destination)
            return True
        except Exception as exc:
            status = getattr(getattr(exc, "response", None), "status_code", None)
            name = exc.__class__.__name__
            if status == 404 or "EntryNotFound" in name or "RepositoryNotFound" in name or "404" in str(exc):
                return False
            raise RuntimeError(f"Could not restore {remote_name} from dataset repository.") from None

    def upload(self, local_path: Path, remote_name: str) -> None:
        try:
            self._api.upload_file(
                path_or_fileobj=str(local_path),
                path_in_repo=remote_name,
                repo_id=self.repo_id,
                repo_type="dataset",
                commit_message=f"Sync {remote_name}",
            )
        except Exception:
            raise RuntimeError(f"Could not upload {remote_name} to dataset repository.") from None


class PersistenceSync:
    def __init__(
        self,
        storage=None,
        files: dict[str, Path] | None = None,
        log: Callable[[str], None] | None = None,
    ):
        self.storage = storage
        self.files = files or tracked_files()
        self.log = log or (lambda msg: print(f"[hf-persistence] {msg}", flush=True))
        self.digests: dict[str, str] = {}
        self.markers: dict[str, tuple[int, int]] = {}

    @classmethod
    def from_env(cls, files: dict[str, Path] | None = None, log: Callable[[str], None] | None = None) -> "PersistenceSync":
        repo_id = os.getenv("HF_DATASET_REPO", "").strip()
        token = os.getenv("HF_TOKEN", "").strip()
        if not repo_id or not token:
            return cls(storage=None, files=files, log=log)
        return cls(storage=HubStorage(repo_id=repo_id, token=token), files=files, log=log)

    @property
    def enabled(self) -> bool:
        return self.storage is not None

    def _stat_marker(self, path: Path) -> tuple[int, int]:
        stat = path.stat()
        wal = Path(str(path) + "-wal")
        if wal.exists():
            wal_stat = wal.stat()
            return ( max(stat.st_mtime_ns, wal_stat.st_mtime_ns), stat.st_size + wal_stat.st_size )
        return (stat.st_mtime_ns, stat.st_size)

    def restore_all(self) -> list[str]:
        if not self.enabled:
            self.log("HF_DATASET_REPO or HF_TOKEN not set; running with local disk only.")
            return []
        restored: list[str] = []
        for remote_name, local_path in self.files.items():
            if local_path.exists() and local_path.stat().st_size > 0:
                continue
            local_path.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(dir=local_path.parent, prefix=".restore-", delete=False) as tmp:
                tmp_path = Path(tmp.name)
            try:
                found = self.storage.download(remote_name, tmp_path)
                if not found:
                    tmp_path.unlink(missing_ok=True)
                    continue
                is_sqlite = remote_name.endswith(".sqlite3")
                if is_sqlite and not _valid_sqlite(tmp_path):
                    tmp_path.unlink(missing_ok=True)
                    self.log(f"Skipped invalid SQLite snapshot for {remote_name}.")
                    continue
                os.replace(tmp_path, local_path)
                self.digests[remote_name] = _sha256(local_path)
                self.markers[remote_name] = self._stat_marker(local_path)
                restored.append(remote_name)
                self.log(f"Restored {remote_name}.")
            except Exception as exc:
                tmp_path.unlink(missing_ok=True)
                self.log(f"Warning: {exc}")
        return restored

    def sync_once(self, force: bool = False) -> list[str]:
        if not self.enabled:
            return []
        uploaded: list[str] = []
        with tempfile.TemporaryDirectory(prefix="hf-sync-") as tmp_dir:
            tmp_root = Path(tmp_dir)
            for remote_name, local_path in self.files.items():
                if not local_path.exists() or local_path.stat().st_size == 0:
                    continue
                try:
                    marker = self._stat_marker(local_path)
                    if not force and self.markers.get(remote_name) == marker:
                        continue
                    is_sqlite = remote_name.endswith(".sqlite3")
                    snap_path = tmp_root / remote_name
                    snapshot_file(local_path, snap_path, is_sqlite=is_sqlite)
                    digest = _sha256(snap_path)
                    self.markers[remote_name] = marker
                    if self.digests.get(remote_name) == digest:
                        continue
                    self.storage.upload(snap_path, remote_name)
                    self.digests[remote_name] = digest
                    uploaded.append(remote_name)
                    self.log(f"Backed up {remote_name}.")
                except Exception as exc:
                    self.log(f"Warning: {exc}")
        return uploaded


def _is_gradio_internal_path(path: str) -> bool:
    return path in {"/config", "/info", "/theme.css", "/robots.txt"} or path.startswith(
        ("/gradio_api/", "/queue/", "/heartbeat/", "/file=", "/assets/index-")
    )


class _StarletteOverlayMiddleware:
    def __init__(self, app, starlette_app):
        self.app = app
        self.starlette_app = starlette_app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "/")
            if not _is_gradio_internal_path(path):
                headers = dict(scope.get("headers") or [])
                proto = headers.get(b"x-forwarded-proto", b"").decode("latin1").split(",")[0].strip()
                if proto in {"http", "https"}:
                    scope = dict(scope, scheme=proto)
                await self.starlette_app(scope, receive, send)
                return
        await self.app(scope, receive, send)


def _run_zerogpu_in_process(port: int) -> int:
    os.environ["GRADIO_SSR_MODE"] = "false"
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    os.chdir(ROOT)
    import inspect
    import gradio as gr
    import web_server

    with gr.Blocks() as demo:
        inp = gr.Textbox(value="ready", visible=False)
        out = gr.Textbox(visible=False)
        btn = gr.Button("check", visible=False)
        btn.click(fn=zero_gpu_health, inputs=inp, outputs=out)

    launch_kwargs = {
        "server_name": "0.0.0.0",
        "server_port": int(port),
        "prevent_thread_lock": True,
        "quiet": True,
    }
    if "ssr_mode" in inspect.signature(demo.launch).parameters:
        launch_kwargs["ssr_mode"] = False

    app, _, _ = demo.launch(**launch_kwargs)
    if getattr(app, "middleware_stack", None) is None and hasattr(app, "build_middleware_stack"):
        app.middleware_stack = app.build_middleware_stack()
    app.middleware_stack = _StarletteOverlayMiddleware(app.middleware_stack, web_server.app)

    stop = threading.Event()
    signal.signal(signal.SIGTERM, lambda *_: stop.set())
    signal.signal(signal.SIGINT, lambda *_: stop.set())
    stop.wait()
    return 0


def serve() -> int:
    if os.getenv("SPACE_ID") or os.getenv("RENDER"):
        os.environ.setdefault("COOKIE_SECURE", "true")

    sync = PersistenceSync.from_env()
    sync.restore_all()

    interval = max(5.0, float(os.getenv("HF_SYNC_INTERVAL_SECONDS", "15") or "15"))
    stop_event = threading.Event()

    def background_loop() -> None:
        while not stop_event.wait(interval):
            sync.sync_once()

    worker = threading.Thread(target=background_loop, name="hf-sqlite-sync", daemon=True)
    if sync.enabled:
        worker.start()

    port = int(os.getenv("PORT", "7860"))
    if _hf_spaces is not None and os.getenv("SPACE_ID"):
        try:
            return _run_zerogpu_in_process(port)
        finally:
            stop_event.set()
            if sync.enabled:
                worker.join(timeout=5)
                sync.sync_once(force=True)

    env = os.environ.copy()
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "web_server:app",
        "--host",
        "0.0.0.0",
        "--port",
        str(port),
        "--proxy-headers",
        "--forwarded-allow-ips=*",
    ]
    proc = subprocess.Popen(cmd, cwd=str(ROOT), env=env)

    def handle_signal(signum, _frame):
        if proc.poll() is None:
            proc.terminate()

    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    try:
        return proc.wait()
    finally:
        stop_event.set()
        if sync.enabled:
            worker.join(timeout=5)
            sync.sync_once(force=True)


if __name__ == "__main__":
    raise SystemExit(serve())
