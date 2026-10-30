import hashlib
import json
import os
import secrets
import sqlite3
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path


def now():
    return datetime.now(timezone.utc).isoformat()


@contextmanager
def db():
    path = Path(os.getenv("WEB_DB", str(Path(__file__).parent / "local_results" / "workspace.sqlite3")))
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path, timeout=15)
    connection.row_factory = sqlite3.Row
    connection.executescript("""
      CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE,password TEXT,google_sub TEXT UNIQUE,profile TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS logins(hash TEXT PRIMARY KEY,owner TEXT,expires REAL);
      CREATE TABLE IF NOT EXISTS courses(id TEXT PRIMARY KEY,owner TEXT,state TEXT,updated TEXT,revision INTEGER DEFAULT 0);
      CREATE TABLE IF NOT EXISTS resources(id TEXT PRIMARY KEY,owner TEXT,data TEXT,created TEXT);
      CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,owner TEXT,course TEXT,title TEXT,created TEXT);
      CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER,until REAL);
      CREATE TABLE IF NOT EXISTS reasoning_files(id TEXT PRIMARY KEY,owner TEXT,course TEXT,exercise TEXT,data TEXT,created TEXT);
    """)
    connection.commit()
    try:
        yield connection
    finally:
        connection.close()


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    return salt + ":" + hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1).hex()


def create_account(email, password=None, google_sub=None):
    owner = secrets.token_hex(16)
    with db() as connection, connection:
        connection.execute("INSERT INTO accounts VALUES (?,?,?,?,?)", (owner, email.lower(), password_hash(password) if password else None, google_sub, "{}"))
    return owner


def find_account(email):
    with db() as connection:
        return connection.execute("SELECT * FROM accounts WHERE email=?", (email.lower(),)).fetchone()


def login(owner):
    token = secrets.token_urlsafe(32)
    with db() as connection, connection:
        connection.execute("DELETE FROM logins WHERE expires<?", (time.time(),))
        connection.execute("INSERT INTO logins VALUES (?,?,?)", (hashlib.sha256(token.encode()).hexdigest(), owner, time.time()+7*86400))
    return token


def account(token):
    with db() as connection:
        row = connection.execute("SELECT a.* FROM accounts a JOIN logins l ON a.id=l.owner WHERE l.hash=? AND l.expires>?", (hashlib.sha256(token.encode()).hexdigest(), time.time())).fetchone()
    return dict(row) if row else None


def logout(token):
    with db() as connection, connection:
        connection.execute("DELETE FROM logins WHERE hash=?", (hashlib.sha256(token.encode()).hexdigest(),))


def throttle(key, limit=12, seconds=900):
    with db() as connection, connection:
        connection.execute("BEGIN IMMEDIATE")
        row = connection.execute("SELECT count,until FROM rate_limits WHERE key=?", (key,)).fetchone()
        count, until = (row[0], row[1]) if row and row[1] > time.time() else (0, time.time()+seconds)
        if count >= limit:
            raise ValueError("Too many requests. Please try again later.")
        connection.execute("INSERT INTO rate_limits VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,until=excluded.until", (key, count+1, until))


def profile(owner, value, course_id=None):
    with db() as connection, connection:
        connection.execute('BEGIN IMMEDIATE')
        if course_id:
            row=connection.execute('SELECT state FROM courses WHERE id=? AND owner=?',(course_id,owner)).fetchone()
            if not row:
                raise ValueError('This learning session was not found in your account.')
            state=json.loads(row[0])
            # Preference saves merge, so course intake fields are not erased from the panel.
            state['profile']={**(state.get('profile') or {}), **value}
            connection.execute('UPDATE courses SET state=?,revision=revision+1,updated=? WHERE id=? AND owner=?',(json.dumps(state),now(),course_id,owner))
        universal={key:value.get(key,'') for key in ('tone','interest')}
        connection.execute("UPDATE accounts SET profile=? WHERE id=?", (json.dumps(universal), owner))


def add_resource(owner, value):
    rid = secrets.token_hex(12)
    with db() as connection, connection:
        connection.execute("INSERT INTO resources VALUES (?,?,?,?)", (rid, owner, json.dumps(value), now()))
    return rid


def resources(owner):
    with db() as connection:
        rows = connection.execute("SELECT * FROM resources WHERE owner=? ORDER BY created DESC", (owner,)).fetchall()
    return [{**json.loads(r["data"]), "kind": json.loads(r["data"]).get("id", "reference"), "id": r["id"], "created": r["created"]} for r in rows]


def resource(owner, rid):
    return next((x for x in resources(owner) if x["id"] == rid), None)


def create_course(owner, state):
    cid = secrets.token_hex(12)
    with db() as connection, connection:
        connection.execute("INSERT INTO courses VALUES (?,?,?,?,0)", (cid, owner, json.dumps(state), now()))
    return cid


def transfer_course(owner, cid, state, revision, new_state):
    new_cid = secrets.token_hex(12)
    with db() as connection, connection:
        changed = connection.execute('UPDATE courses SET state=?,revision=revision+1,updated=? WHERE owner=? AND id=? AND revision=?',
                                     (json.dumps(state), now(), owner, cid, revision)).rowcount
        if not changed:
            raise ValueError('This session changed in another tab. Reload it before continuing.')
        connection.execute('INSERT INTO courses VALUES (?,?,?,?,0)', (new_cid, owner, json.dumps(new_state), now()))
    return new_cid


def course(owner, cid):
    with db() as connection:
        row = connection.execute("SELECT state,revision FROM courses WHERE owner=? AND id=?", (owner, cid)).fetchone()
        account=connection.execute('SELECT profile FROM accounts WHERE id=?',(owner,)).fetchone()
    if not row:
        raise ValueError("This learning session was not found in your account.")
    state=json.loads(row[0])
    universal=json.loads(account[0]) if account else {}
    state['profile'].update({key:universal[key] for key in ('tone','interest') if key in universal and universal[key]})
    import learning_history
    learning_history.normalize_course_state(state)
    return state, row[1]


def save_course(owner, cid, state, revision, save_explanation=False):
    with db() as connection, connection:
        changed = connection.execute("UPDATE courses SET state=?,revision=revision+1,updated=? WHERE owner=? AND id=? AND revision=?", (json.dumps(state), now(), owner, cid, revision)).rowcount
        if not changed:
            raise ValueError("This session changed in another tab. Reload it before continuing.")
        if save_explanation:
            _save_explanation(connection,owner,cid,state)


def _save_explanation(connection,owner,cid,state):
    objectives=(state.get('curriculum') or {}).get('objectives',[])
    if not objectives:
        return
    objective=objectives[min(state['objective_index'],len(objectives)-1)]
    lesson=state.get('lesson') or {}
    text=lesson.get('explanation','')+'\n\n'+'\n'.join(lesson.get('worked_example',[]))
    if state['stage']=='repair' and state.get('repair'):
        text=state['repair']['explanation']
    if not text.strip():return
    if connection.execute("SELECT 1 FROM resources WHERE owner=? AND json_extract(data,'$.id')='note' AND trim(json_extract(data,'$.text'))=? LIMIT 1",(owner,text.strip())).fetchone():return
    title=objective['title']+(' — Repair' if state['stage']=='repair' else '')
    value={'id':'note','title':title,'origin':'Saved explanation','text':text.strip(),'course_id':cid,'objective_id':objective['id']}
    rid=hashlib.sha256((owner+cid+objective['id']+text).encode()).hexdigest()[:24]
    connection.execute('INSERT OR IGNORE INTO resources VALUES (?,?,?,?)',(rid,owner,json.dumps(value),now()))


def ensure_explanation(owner,cid,state):
    if state.get('lesson') and state.get('stage') in {'lesson','attempt','diagnostic','repair','feedback'}:
        with db() as connection,connection:
            _save_explanation(connection,owner,cid,state)


def exercise_key(state):
    return hashlib.sha256(json.dumps(state['question'],sort_keys=True).encode()).hexdigest()


def add_reasoning_file(owner,cid,state,revision,value):
    rid=secrets.token_hex(12)
    with db() as connection,connection:
        connection.execute('BEGIN IMMEDIATE')
        row=connection.execute('SELECT revision FROM courses WHERE owner=? AND id=?',(owner,cid)).fetchone()
        if not row or row[0]!=revision:raise ValueError('This learning changed. Reopen the practice before attaching a file.')
        connection.execute('INSERT INTO reasoning_files VALUES (?,?,?,?,?,?)',(rid,owner,cid,exercise_key(state),json.dumps(value),now()))
    return rid


def reasoning_files(owner,cid,state,ids):
    if not isinstance(ids,list) or len(ids)>3 or any(not isinstance(x,str) for x in ids) or len(set(ids))!=len(ids):
        raise ValueError('Choose up to three reasoning attachments.')
    with db() as connection:
        result=[]
        for rid in ids:
            row=connection.execute('SELECT data FROM reasoning_files WHERE id=? AND owner=? AND course=? AND exercise=?',(rid,owner,cid,exercise_key(state))).fetchone()
            if not row:raise ValueError('This reasoning file does not belong to your current practice.')
            result.append(json.loads(row[0]))
    return result


def courses(owner):
    with db() as connection:
        rows = connection.execute("SELECT id,state,updated FROM courses WHERE owner=? ORDER BY updated DESC", (owner,)).fetchall()
    return [{"id": r["id"], "goal": (s := json.loads(r["state"]))["profile"]["goal"], "title": (s.get("curriculum") or {}).get("title", s["profile"]["goal"]), "updated": r["updated"], "stage": s["stage"], "step": s["objective_index"], "total": len((s.get("curriculum") or {}).get("objectives", [])),"questions":[{"id":q['id'],"question":q['question']} for q in s.get('followups',[])]} for r in rows]


def event(owner, cid, title):
    with db() as connection, connection:
        connection.execute("INSERT INTO events VALUES (?,?,?,?,?)", (secrets.token_hex(12), owner, cid, title, now()))


def events(owner):
    with db() as connection:
        return [dict(r) for r in connection.execute("SELECT id,course,title,created FROM events WHERE owner=? ORDER BY created DESC LIMIT 500", (owner,))]
