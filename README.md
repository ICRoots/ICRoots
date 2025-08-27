<<<<<<< HEAD
ICRoots
=======
Here’s a fresh, judge-friendly **README.md** you can drop in:

---

# ICRoots 🌳🔗

_Bitcoin lending, rooted in trust._

Unlock liquidity against BTC without giving up keys. Borrow stablecoins, build a soul-bound reputation, and get AI-assisted risk checks — all **on-chain** on the Internet Computer (ICP).

---

## 1) Why now?

Millions of BTC sit idle. Users want **fast, non-custodial loans** without CEX risk. ICRoots delivers:

1. **BTC-backed loans** — keep your coins, unlock cash.
2. **Soul-bound reputation** — trust rises (or falls) with your repayments.
3. **Deterministic AI (today)** — transparent rules for scoring; model plug-in later.

---

## 2) What’s live today (local)

- ✅ All five canisters **build & deploy locally** (Rust): `event_bus`, `repute`, `collateral`, `trust_ai`, `loans`
- ✅ **Smoke tests** pass end-to-end (docs: `docs/local-canister-ids.md` & `docs/ICRoots-Playbook.md`)
- ✅ **Debug UI** (Vite/React) can call every canister (no wallet needed for the demo)

> Notes for demo day:
> • **BTC collateral is mocked** (ckBTC/Chain Fusion after demo).
> • **AI is deterministic** rules now (model integration next).
> • No Firebase; all core state on ICP.

---

## 3) Service anatomy

| Concern                   | Canister (crate)     | Why isolated?                | Status           |
| ------------------------- | -------------------- | ---------------------------- | ---------------- |
| Loan ledger & core state  | **`loans_backend`**  | Small, auditable upgrades    | **LIVE (local)** |
| BTC custody & liquidation | `collateral_backend` | Security boundary            | **LIVE (local)** |
| Reputation (soul-bound)   | `repute_backend`     | Separate mint/burn lifecycle | **LIVE (local)** |
| AI scoring engine         | `trust_ai_backend`   | Heavy WASM, pluggable models | **LIVE (local)** |
| UX events / logs          | `event_bus_backend`  | Keep business logic clean    | **LIVE (local)** |

**Minimal interfaces (frozen for sprint)**

- `event_bus_backend`: `emit(text)`, `list_recent(nat64) -> vec text (query)`
- `repute_backend`: `get_level(principal) -> nat (query)`, `set_level(principal, nat)` _(guarded)_
- `collateral_backend`: `deposit_mock(principal, nat)`, `get_collateral(principal) -> nat`
- `trust_ai_backend`: `recommend(principal, nat, nat64) -> record { decision:text; score:nat64; reasons:vec text } (query)`
- `loans_backend`: `ping() -> text`, `register_user()`, `get_summary(principal)`, `request_loan(nat)`, `repay(nat, nat)`

---

## 4) Tech stack

| Layer           | Choice                                         |
| --------------- | ---------------------------------------------- |
| Front-end       | React + Vite + Tailwind                        |
| Smart-contracts | ICP canisters (Rust, Candid)                   |
| Wallet/Auth     | Plug / Internet Identity (post-demo)           |
| AI Layer        | Deterministic rules today; model plug-in later |
| NFTs            | Soul-bound (DIP-721 compatible)                |
| Tooling         | `dfx 0.27`, `cargo`, `didc 0.4`, Husky, Vitest |

---

## 5) Repo map

```
ICRoots/
├─ src/backend/canisters/
│  ├─ loans/        ├─ collateral/ ├─ repute/ ├─ trust_ai/ └─ event_bus/
├─ src/frontend/           # Vite + React (new debug UI)
├─ legacy-frontend/        # Original Netlify UI
├─ docs/                   # Playbook + local canister IDs
├─ tests/                  # unit + ICP integration
├─ scripts/                # helper scripts
├─ dfx.json
└─ README.md
```

---

## 6) 2-minute local demo

**Prereqs**: `node >= 18`, `dfx >= 0.27`, `cargo >= 1.77`, `didc 0.4`

```bash
# 1) start ICP + deploy
dfx start --background
dfx deploy       # builds & installs all five canisters (local)

# 2) run the frontend debug UI
cd src/frontend
npm install
npm run dev      # open http://localhost:5173
```

**In the Debug UI**, try:

- Event Bus → **emit + list_recent**
- Repute → **get_level**
- Collateral → **deposit_mock + get_collateral**
- Trust AI → **recommend** (returns decision + score)
- Loans → **ping / register_user / request_loan / repay**

> Canister IDs used by the UI come from `docs/local-canister-ids.md` / `.dfx/local`.

---

## 7) Security & design choices (today)

- **Deterministic AI**: transparent thresholds so judges can reason about outcomes.
- **Separation of concerns**: loan core vs collateral vs reputation to keep upgrades auditable.
- **Event bus** for UX analytics/logs without polluting business logic.

---

## 8) Roadmap (post-qualification)

- 🔄 Wire real **ckBTC** custody via Chain Fusion; liquidation hooks
- 🏷️ Launch **soul-bound NFT** mint/burn and FE display
- 🤖 Swap deterministic rules for pluggable ML model in `trust_ai`
- 🌐 Public canister deploy + wallet flows (Plug / II)
- 📱 PWA wrapper for low-bandwidth users

---

## 9) Contributing

- Branches: `feat/*`, `fix/*`, `docs/*`
- Run `npm run lint && npm test` before PRs
- Feedback & issues welcome!

---

## 10) License

MIT © 2025 ICRoots team.

---

> _Let’s build a fairer, faster Bitcoin credit market — together._ 🚀
>
> > > > > > > c77ad0b (update readme.md)
