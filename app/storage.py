import hashlib
import json
import os
import secrets
import sqlite3
import time
from datetime import datetime, timezone
from pathlib import Path
from contextlib import contextmanager


@contextmanager
def connection():
    path = Path(os.getenv("LEARNING_DB", str(Path(__file__).parent / "local_results" / "learning.sqlite3")))
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=15)
    db.execute("CREATE TABLE IF NOT EXISTS learners (token_hash TEXT PRIMARY KEY, snapshot TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, busy INTEGER NOT NULL DEFAULT 0, busy_since REAL NOT NULL DEFAULT 0)")
    db.execute("CREATE TABLE IF NOT EXISTS attempts (token_hash TEXT, request_id TEXT, data TEXT, PRIMARY KEY(token_hash,request_id))")
    db.commit()
    try:
        yield db
    finally:
        db.close()


def key(token):
    return hashlib.sha256(token.encode()).hexdigest()


def create(profile):
    token = secrets.token_urlsafe(24)
    state = {"profile": profile, "source": None, "curriculum": None, "approved_version": None,
             "version": 0, "objective_index": 0, "stage": "source", "observations": [],
             "review": {}, "review_history": [], "help_used": False, "pending": None,
             "created": datetime.now(timezone.utc).isoformat()}
    with connection() as db, db:
        db.execute("INSERT INTO learners(token_hash,snapshot) VALUES (?,?)", (key(token), json.dumps(state)))
    return token


def load(token):
    with connection() as db:
        row = db.execute("SELECT snapshot,revision FROM learners WHERE token_hash=?", (key(token),)).fetchone()
    if not row:
        return None
    state = json.loads(row[0]); state["_revision"] = row[1]
    return state


def save(token, state):
    revision = state.get("_revision", 0)
    snapshot = {k: v for k, v in state.items() if k != "_revision"}
    with connection() as db, db:
        changed = db.execute("UPDATE learners SET snapshot=?,revision=revision+1 WHERE token_hash=? AND revision=?",
                             (json.dumps(snapshot), key(token), revision)).rowcount
        if not changed:
            raise RuntimeError("This session changed in another tab. Reload before continuing.")
    state["_revision"] = revision + 1


def claim(token):
    with connection() as db, db:
        return bool(db.execute("UPDATE learners SET busy=1,busy_since=? WHERE token_hash=? AND (busy=0 OR busy_since<?)", (time.time(), key(token), time.time()-180)).rowcount)


def release(token):
    with connection() as db, db:
        db.execute("UPDATE learners SET busy=0 WHERE token_hash=?", (key(token),))


def add_attempt(token, request_id, data):
    with connection() as db, db:
        db.execute("INSERT INTO attempts VALUES (?,?,?) ON CONFLICT(token_hash,request_id) DO UPDATE SET data=excluded.data", (key(token), request_id, json.dumps(data)))


def attempts(token):
    with connection() as db:
        rows = db.execute("SELECT data FROM attempts WHERE token_hash=? ORDER BY rowid", (key(token),)).fetchall()
    return [json.loads(row[0]) for row in rows]


def delete(token):
    with connection() as db, db:
        db.execute("DELETE FROM attempts WHERE token_hash=?", (key(token),))
        db.execute("DELETE FROM learners WHERE token_hash=?", (key(token),))
