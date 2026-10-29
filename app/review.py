import os
from datetime import date, timedelta

from review_selector import select_reviews


def today():
    override = os.getenv("LEARNING_REVIEW_DATE", "").strip()
    if override:
        return date.fromisoformat(override)
    from datetime import datetime
    from zoneinfo import ZoneInfo
    return datetime.now(ZoneInfo("Asia/Jakarta")).date()


def record(state, objective_id, success, independent, *, review=False, on_date=None):
    current = on_date or today()
    if isinstance(current, str):
        current = date.fromisoformat(current)
    review_map = state.setdefault("review", {})
    old = review_map.get(objective_id, {})
    interval = old.get("interval", 1)
    if review and success and independent:
        interval = min(interval * 2, 30)
    elif not success:
        interval = 1
    lapses = old.get("lapses", 0) + (1 if review and not success else 0)
    if not review and success and independent:
        lapses = 0
    review_map[objective_id] = {
        "id": objective_id, "taught": True, "review_enabled": old.get("review_enabled", True),
        "status": "needs_relearning" if lapses >= 3 else ("secure" if success and independent and review else "developing" if success else "fragile"),
        "lapses": lapses, "interval": interval, "next_due": (current + timedelta(days=interval)).isoformat(),
        "last_review": current.isoformat() if review else old.get("last_review"),
        "evidence": "Independent delayed answer" if review and success and independent else "Correct with support" if success and not independent else "Correct practice" if success else "Needs another example",
    }


def record_unassessed(state, objective_id, *, on_date=None):
    current = on_date or today()
    if isinstance(current, str):
        current = date.fromisoformat(current)
    review_map = state.setdefault("review", {})
    old = review_map.get(objective_id, {})
    review_map[objective_id] = {
        "id": objective_id,
        "taught": True,
        "review_enabled": old.get("review_enabled", True),
        "status": "unassessed",
        "lapses": old.get("lapses", 0),
        "interval": 1,
        "next_due": (current + timedelta(days=1)).isoformat(),
        "last_review": old.get("last_review"),
        "evidence": "Lesson read; check skipped (unassessed)",
    }


def approved_ids(state):
    if state.get("approved_version") != state.get("version") or not state.get("curriculum"):
        return set()
    ids = set()
    for obj in state["curriculum"].get("objectives", []):
        ids.add(obj["id"])
        for concept in obj.get("concepts", []):
            if isinstance(concept, dict) and concept.get("id"):
                ids.add(concept["id"])
    return ids


def due(state, on_date=None):
    current = on_date or today()
    if isinstance(current, str):
        current = date.fromisoformat(current)
    approved = approved_ids(state)
    concepts = [x for cid, x in (state.get("review") or {}).items() if cid in approved and isinstance(x, dict)]
    return select_reviews({"concepts": concepts}, current, count=1)


def build_review_status(state, on_date=None):
    current = on_date or today()
    if isinstance(current, str):
        current = date.fromisoformat(current)
    result = due(state, current)
    objectives = (state.get("curriculum") or {}).get("objectives", []) if state.get("approved_version") == state.get("version") else []
    item_meta = {}
    for obj in objectives:
        mod_title = obj.get("module_title") or "Earlier lesson"
        item_meta[obj["id"]] = {"title": obj["title"], "module_title": mod_title, "objective_id": obj["id"]}
        for concept in obj.get("concepts", []):
            if isinstance(concept, dict) and concept.get("id"):
                item_meta[concept["id"]] = {"title": concept.get("title", obj["title"]), "module_title": mod_title, "objective_id": obj["id"]}
    review_map = state.get("review") or {}
    due_items = []
    for cid in result["selected"] + result["needs_relearning"]:
        meta = item_meta.get(cid, {"title": cid, "module_title": "Earlier lesson", "objective_id": cid})
        rec = review_map.get(cid, {})
        mode = "relearning" if cid in result["needs_relearning"] else "review"
        prefix = "Relearning from" if mode == "relearning" else "Review from"
        due_items.append({
            "id": cid,
            "objective_id": meta["objective_id"],
            "title": meta["title"],
            "module_title": meta["module_title"],
            "mode": mode,
            "status": rec.get("status", "developing"),
            "lapses": rec.get("lapses", 0),
            "next_due": rec.get("next_due", ""),
            "label": f"{prefix} {meta['module_title']}: {meta['title']}",
        })
    skipped_today = state.get("review_skipped_on") == current.isoformat()
    return {
        "today": current.isoformat(),
        "timezone": "Asia/Jakarta",
        "selected": [] if skipped_today else result["selected"],
        "needs_relearning": [] if skipped_today else result["needs_relearning"],
        "eligible_due_count": 0 if skipped_today else result["eligible_due_count"],
        "due_items": [] if skipped_today else due_items,
        "skipped_today": skipped_today,
        "active_review": state.get("active_review"),
    }
