# ICRoots 🌳🔗

_Bitcoin lending, rooted in trust._

Collateralize BTC, borrow stable-coins, and earn reputation NFTs – all **on-chain** on the Internet Computer (ICP).

---

## 1 Why ICRoots?

Millions of BTC holders sit on locked value but lack fast, non-custodial liquidity.  
ICRoots fixes that with three super-powers:

1. **BTC-backed loans** – keep your coins, unlock short-term cash.
2. **Soul-bound NFT reputation** – trust level grows (or shrinks) with every repayment.
3. **AI copilot** – on-chain risk scoring and loan matchmaking.

---

## 2 Service Anatomy

| Concern                      | Canister (crate)     | Why isolated?                   | Status           |
| ---------------------------- | -------------------- | ------------------------------- | ---------------- |
| Loan ledger & core state     | **`loans_backend`**  | Small, auditable upgrades       | **LIVE (local)** |
| BTC custody & liquidation    | `collateral_backend` | Strong security boundary        | scaffold         |
| Reputation NFTs (soul-bound) | `repute_backend`     | Separate mint/burn lifecycle    | scaffold         |
| AI scoring engine            | `trust_ai_backend`   | Heavy WASM, pluggable ML models | scaffold         |
| UX events / logs             | `event_bus_backend`  | Keep business logic clean       | scaffold         |

---

## 3 Tech Stack

| Layer           | Choice                                         |
| --------------- | ---------------------------------------------- |
| Front-end       | React + Vite + TailwindCSS                     |
| Smart-contracts | ICP canisters (Rust for prod, Motoko for POCs) |
| Wallet/Auth     | Plug Wallet · Internet Identity                |
| AI Layer        | OpenAI / Caffeine AI via `trust_ai`            |
| NFTs            | Soul-bound DIP-721                             |
| Dev tooling     | `dfx`, `cargo`, `didc 0.4`, Husky, Vitest      |

---

## 4 Repo Map

```
ICRoots/
├─ src/backend/canisters/
│  ├─ loans/          # Rust crate → loans_backend.wasm
│  ├─ collateral/
│  ├─ repute/
│  ├─ trust_ai/
│  └─ event_bus/
├─ src/frontend/      # Vite + React (new UI)
├─ legacy-frontend/   # 🕰  Original Netlify UI
├─ docs/              # diagrams & pitch decks
├─ tests/             # unit + ICP integration
├─ scripts/           # helper bash scripts
├─ dfx.json           # workspace definition
└─ README.md          # (you are here)
```

---

## 5 Local Dev Loop

### 1 — Prereqs

```
node >=18     dfx >=0.27     cargo >=1.77
```

### 2 — Clone & install deps

```
git clone https://github.com/ICRoots/ICRoots.git
cd ICRoots
cp .env.sample .env          # adjust NETWORK / wallet if needed
npm install                  # installs front-end + husky hooks
```

### 3 — Run ICP locally + front-end

```
dfx start --background
dfx deploy                   # builds + installs all canisters
```

### modern UI (Vite)

```
npm run --workspace src/frontend dev          # http://localhost:5173
```

### legacy Netlify UI (for reference)

```
npm run --workspace legacy-frontend dev       # http://localhost:5180
```

### Back-end tests

```
cargo test --manifest-path src/backend/canisters/loans/Cargo.toml
```

### Regenerate Candid (didc 0.4)

```
cargo build --manifest-path src/backend/canisters/loans/Cargo.toml \
            --release --target wasm32-unknown-unknown

didc bind --target did \
  target/wasm32-unknown-unknown/release/loans_backend.wasm \
  > src/backend/canisters/loans/loans_backend.did
```

---

## 6 Deploying to Main-net (coming soon)

```bash
dfx identity use prod-owner          # secure identity
dfx build  loans_backend --network ic
dfx deploy loans_backend --network ic --yes
```

| Component     | Canister ID (main-net) | Gateway URL | Notes                            |
| ------------- | ---------------------- | ----------- | -------------------------------- |
| loans_backend | _(pending)_            | _(pending)_ | will be added after cycle top-up |

---

## 7 Hosted Preview

- Legacy UI (Netlify): **[https://myicroots.netlify.app](https://myicroots.netlify.app)**
    → folder: `legacy-frontend/`

---

## 8 Post-Qualification Roadmap

- 🔄 Wire `loans_backend` to real ckBTC custody via **Chain Fusion**
- 🏷️ Launch `repute_backend` soul-bound NFT minting
- 🤖 Deploy first ML model in `trust_ai_backend`
- 📱 Ship PWA wrapper for emerging-market users

---

## 9 Contributing

- **Branches** — `feat/✏️`, `fix/🐛`, `docs/📚`
- Run `npm run lint && npm test` before pushing
- PRs & issue discussions welcome!

---

## 10 License

MIT © 2025 ICRoots team.

---

_Let’s build a fairer, faster Bitcoin credit market – together._ 🚀
