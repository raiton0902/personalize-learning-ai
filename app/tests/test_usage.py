import pytest

from usage import BudgetExceeded, connect, finish, reserve, summary


def test_budget_reservations_stop_unknown_spending():
    for _ in range(99):
        reserve("offline", "unknown")
    with pytest.raises(BudgetExceeded):
        for _ in range(2):
            reserve("offline", "unknown")
    assert summary()["calls"] <= 100


def test_reported_usage_replaces_reservation():
    model = "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B"
    call_id = reserve("offline", model)
    finish(call_id, model, {"prompt_tokens": 4000, "completion_tokens": 2000}, "received")
    assert summary()["estimated_usd"] == pytest.approx(0.00072)
    assert summary()["unknown_or_pending"] == 0


def test_unknown_usage_and_other_routes_keep_reservation():
    call_id = reserve("offline", "unknown")
    finish(call_id, "unknown", {"prompt_tokens": 4, "completion_tokens": 2}, "received")
    assert summary()["reserved_usd"] == pytest.approx(0.01)


@pytest.mark.parametrize('value',['bad','0','-1','nan','inf','101'])
def test_invalid_budget_is_clear_and_does_not_reserve(monkeypatch,value):
    from llm import SetupError
    monkeypatch.setenv('NEBIUS_BUDGET_USD',value)
    with pytest.raises(SetupError,match='NEBIUS_BUDGET_USD'):reserve('offline','unknown')
    with connect() as db:assert db.execute('SELECT COUNT(*) FROM calls').fetchone()[0]==0


def test_default_and_custom_budget_pending_reservations(monkeypatch):
    monkeypatch.delenv('NEBIUS_BUDGET_USD',raising=False)
    assert summary()['allowance_usd']==1.0
    monkeypatch.setenv('NEBIUS_BUDGET_USD','0.025')
    reserve('offline','unknown');reserve('offline','unknown')
    with pytest.raises(BudgetExceeded):reserve('offline','unknown')
    assert summary()['reserved_usd']==pytest.approx(.02)


def test_super_price_estimate_and_absent_usage_reservation():
    model='nvidia/NVIDIA-Nemotron-3-Super-120b-a12b'
    call=reserve('offline',model)
    finish(call,model,{'prompt_tokens':1000,'completion_tokens':2000},'received')
    assert summary()['estimated_usd']==pytest.approx(.0019)
    other=reserve('offline',model);finish(other,model,None,'timeout')
    assert summary()['reserved_usd']==pytest.approx(.01)
