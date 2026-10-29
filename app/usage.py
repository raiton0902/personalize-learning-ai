import os
import math
import sqlite3
from pathlib import Path

DEVELOPMENT_BUDGET_USD = 1.0
RESERVATION_USD = 0.01
MODEL_PRICES = {
    'nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B': (0.06, 0.24),
    # UNVERIFIED: confirm these Super input/output USD-per-million rates in the Token Factory console.
    'nvidia/NVIDIA-Nemotron-3-Super-120b-a12b': (0.30, 0.80),
}


class BudgetExceeded(RuntimeError):
    pass


def budget_limit():
    from llm import SetupError
    try:
        value=float(os.getenv('NEBIUS_BUDGET_USD','').strip() or DEVELOPMENT_BUDGET_USD)
    except ValueError:
        raise SetupError('NEBIUS_BUDGET_USD must be a positive number no greater than 100.') from None
    if not math.isfinite(value) or not 0 < value <= 100:
        raise SetupError('NEBIUS_BUDGET_USD must be a positive number no greater than 100.')
    return value


def connect():
    path = Path(os.getenv("LEARNING_USAGE_DB", str(Path(__file__).parent / "local_results" / "usage.sqlite3")))
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=10)
    db.execute("CREATE TABLE IF NOT EXISTS calls (id INTEGER PRIMARY KEY, started TEXT DEFAULT CURRENT_TIMESTAMP, purpose TEXT, model TEXT, state TEXT, cost REAL, input_tokens INTEGER, output_tokens INTEGER)")
    return db


def reserve(purpose: str, model: str) -> int:
    budget=budget_limit()
    with connect() as db:
        db.execute("BEGIN IMMEDIATE")
        used = db.execute("SELECT COALESCE(SUM(COALESCE(cost, ?)),0) FROM calls", (RESERVATION_USD,)).fetchone()[0]
        if used + RESERVATION_USD > budget:
            raise BudgetExceeded(f"The ${budget:g} local development allowance is exhausted. Ask for a budget decision.")
        return db.execute("INSERT INTO calls(purpose,model,state) VALUES (?,?,'pending')", (purpose, model)).lastrowid


def finish(call_id: int, model: str, usage: dict | None, state: str):
    prompt = usage.get("prompt_tokens") if usage else None
    output = usage.get("completion_tokens") if usage else None
    # Only this exact route's checked rates are used. Unknown usage keeps its reservation.
    # The historical note above applies to Nano; Super is an explicitly UNVERIFIED table estimate.
    rates=MODEL_PRICES.get(model)
    cost = (prompt * rates[0] + output * rates[1]) / 1_000_000 if (
        rates and type(prompt) is int and type(output) is int and prompt >= 0 and output >= 0
    ) else None
    with connect() as db:
        db.execute("UPDATE calls SET state=?, cost=?, input_tokens=?, output_tokens=? WHERE id=?", (state, cost, prompt, output, call_id))


def summary() -> dict:
    with connect() as db:
        count, known, held = db.execute(
            "SELECT COUNT(*),COALESCE(SUM(cost),0),SUM(CASE WHEN cost IS NULL THEN 1 ELSE 0 END) FROM calls"
        ).fetchone()
    return {"calls": count, "estimated_usd": known, "unknown_or_pending": held or 0,
            "reserved_usd": (held or 0) * RESERVATION_USD, "allowance_usd": budget_limit()}
