"""Select due review IDs without modifying learner records. Standard library only."""

import argparse
import json
import math
import random
from datetime import date
from pathlib import Path


FRAGILITY = {"unassessed": 1.5, "fragile": 3, "developing": 2, "secure": 1}


def select_reviews(state, today, count=1, seed=None):
    if not isinstance(state, dict) or not isinstance(state.get("concepts"), list):
        raise ValueError("state must contain a concepts array")
    if type(count) is not int or count < 0:
        raise ValueError("count must be a nonnegative integer")
    pool, repairs, seen = [], [], set()
    for concept in state["concepts"]:
        if not isinstance(concept, dict):
            raise ValueError("each concept must be an object")
        cid = concept.get("id")
        if not isinstance(cid, str) or not cid.strip() or cid in seen:
            raise ValueError("concept IDs must be nonempty unique strings")
        seen.add(cid)
        if type(concept.get("taught")) is not bool:
            raise ValueError(f"{cid}: taught must be a boolean")
        enabled = concept.get("review_enabled", True)
        if type(enabled) is not bool:
            raise ValueError(f"{cid}: review_enabled must be a boolean")
        if not concept["taught"] or not enabled:
            continue
        status = concept.get("status", "unassessed")
        if status not in {*FRAGILITY, "needs_relearning"}:
            raise ValueError(f"{cid}: unsupported status")
        lapses = concept.get("lapses", 0)
        if type(lapses) is not int or lapses < 0:
            raise ValueError(f"{cid}: lapses must be a nonnegative integer")
        if status == "needs_relearning" or lapses >= 3:
            repairs.append(cid)
            continue
        try:
            due = date.fromisoformat(concept["next_due"])
        except (KeyError, TypeError, ValueError) as error:
            raise ValueError(f"{cid}: next_due must be an ISO date") from error
        importance = concept.get("importance", 1)
        if type(importance) not in (int, float) or not math.isfinite(importance) or importance <= 0:
            raise ValueError(f"{cid}: importance must be positive and finite")
        if due <= today:
            weight = importance * FRAGILITY[status] * (1 + min((today - due).days, 30) / 10)
            if not math.isfinite(weight):
                raise ValueError(f"{cid}: computed weight must be finite")
            pool.append((cid, weight))
    eligible_count = len(pool)
    rng = random.Random(seed)
    selected = []
    for _ in range(min(count, len(pool))):
        scale = max(weight for _, weight in pool)
        index = rng.choices(range(len(pool)), weights=[w / scale for _, w in pool], k=1)[0]
        selected.append(pool.pop(index)[0])
    return {"selected": selected, "needs_relearning": repairs, "eligible_due_count": eligible_count}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("state", type=Path)
    parser.add_argument("--today", required=True, type=date.fromisoformat)
    parser.add_argument("--count", type=int, default=1)
    parser.add_argument("--seed", type=int)
    args = parser.parse_args()
    try:
        state = json.loads(args.state.read_text(encoding="utf-8-sig"))
        result = select_reviews(state, args.today, args.count, args.seed)
    except (OSError, ValueError) as error:
        parser.exit(2, f"error: {error}\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
