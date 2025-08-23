# ICRoots — Minimal Interfaces (frozen 2025-08-23T19:09:53+01:00)

Single source of truth for today's local build.

## event_bus_backend

- emit(event)
- list_recent(limit)

## repute_backend

- get_level(principal)
- set_level(principal, level) # (guarded for loans)

## collateral_backend

- deposit_mock(principal, amount)
- get_collateral(principal)

## trust_ai_backend

- recommend(principal, collateral, trust)

## loans_backend

- ping()
- register_user()
- get_summary(principal)
- request_loan(amount)
- repay(loan_id, amount)

---

### Notes / decisions (today only)

- No Firebase for core flow; we stay on ICP canisters.
- BTC collateral mocked; ckBTC/Chain Fusion later.
- AI = deterministic rule today; external model later.

### Success for Step 3

- One short page everyone agrees on (this file).
