# ICRoots Canister Handover Document

## Overview

ICRoots is a Bitcoin-collateralized lending platform on ICP. Users deposit BTC into an ICP wallet, use it as collateral, and access fiat/USDT loans. Trust levels are represented via soulbound NFTs. AI-powered scoring and recommendation features will reduce borrower risk and guide lender decisions.

This document outlines the current canisters, their roles, and what still needs to be built.

---

## 🔹 Active Canisters

### 1. Frontend Canister

- **Purpose:** Serves the React/Next.js frontend.
- **Status:** Deployed and accessible via [theicroots.netlify.app](https://theicroots.netlify.app).
- **Key Dependencies:** Calls backend canisters via agent-js.

---

### 2. User Canister

- **Purpose:** Manages user accounts for both borrower and lender roles.
- **Functions:**
    - Register user (borrower/lender)
    - Map principal IDs to user profiles
    - Store KYC-lite info (email, name, ID type)
- **Status:** Functional, but needs refinement for borrower/lender flows.

---

### 3. Loan Canister

- **Purpose:** Core loan lifecycle management.
- **Functions:**
    - Borrower: request loan, set terms
    - Lender: view/approve/reject loan
    - Update loan status: pending → active → repaid/defaulted
- **Status:** Basic logic live, but repayment enforcement & interest rate checks need AI integration.

---

### 4. Collateral Canister

- **Purpose:** Manages BTC collateral deposits.
- **Functions:**
    - Lock BTC deposits
    - Release BTC after loan repayment
    - Trigger auto-liquidation on defaults
- **Status:** Partially live. Currently simulates BTC deposits using ICP ledger. Needs integration with ckBTC for live testnet/mainnet use.

---

### 5. Trust NFT Canister

- **Purpose:** Issues & updates soulbound NFTs representing trust levels.
- **Tiers:**
    - 🌱 Sprout → new user
    - 🌿 Sapling → 1–2 loans
    - 🌲 Branch → good repayment record
    - 🌳 Trunk → consistent behavior
    - 🌰 Oak → highest reputation
- **Status:** NFT issuance is live, but automated progression logic based on loan history is incomplete.

---

## 🔹 Pending Canister

### 6. AI Risk Engine Canister (Critical)

- **Purpose:** Uses AI models to assess borrower risk, recommend safe interest rates, and guide lenders.
- **Functions Needed:**
    - Score loan requests → approve/reject high-risk cases
    - Recommend fair interest rates
    - Match lenders to borrowers using historical repayment + profile data
- **Status:** Placeholder exists, but no AI integration yet. Needs urgent build in the next 6 days.

---

## 🔹 Integration Gaps / Next Steps

1. **User ↔ Loan ↔ Collateral sync**
     - Ensure loan approval automatically locks BTC collateral.
     - On repayment, collateral auto-released.
     - On default, liquidation triggered.

2. **AI Risk Engine Canister (highest priority)**
     - Must be implemented for MVP.
     - Could use external AI service (e.g., HuggingFace inference API or ICP’s AI features).

3. **NFT Trust Levels Automation**
     - Loan repayment/default events must feed into NFT level adjustments.

4. **Frontend ↔ Backend Calls**
     - Agent-js needs consistent API endpoints.
     - Some calls are stubs — need wiring to real canister methods.

---

## 🔹 Suggested Stack for Dev

- **Language:** Motoko preferred for ICP-native canisters (Rust also viable)
- **Libraries:**
    - ic-cdk for smart contract development
    - agent-js for frontend integration
    - ext or dip721 for NFTs
- **AI Layer:**
    - Option A: Simple scoring logic hardcoded for MVP
    - Option B: Call external AI API → return scores into canister
- **Version Control:** [GitHub repo: ICRoots Repo](https://github.com/ICRoots)

---

## ✅ Immediate Next Steps for the Dev (3 Days)

1. Review Loan + Collateral canisters → finish integration.
2. Build AI Risk Engine Canister (scoring, interest recommendation, rejection).
3. Wire NFT trust progression to loan repayment/default events.
4. Test full borrower → loan → lender → repayment lifecycle on local replica, then deploy to ICP testnet.
