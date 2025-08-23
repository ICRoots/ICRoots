use candid::{CandidType, Deserialize, Principal};
use ic_cdk::storage::{stable_restore, stable_save};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query};
use std::cell::RefCell;

/// Configurable thresholds (tunable at deploy/init time)
#[derive(CandidType, Deserialize, Clone, Debug)]
struct Config {
    /// Minimum collateral to be considered "safe" (in smallest units)
    min_collateral: u128,
    /// Minimum trust score (0..=100 recommended) to be considered "trusted"
    min_trust: u64,
    /// Upper bound used to clamp incoming trust scores (prevents weird inputs)
    trust_cap: u64,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            min_collateral: 100_000, // demo default
            min_trust: 50,           // demo default
            trust_cap: 100,
        }
    }
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
struct InitArgs {
    min_collateral: Option<u128>,
    min_trust: Option<u64>,
    trust_cap: Option<u64>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct State {
    cfg: Config,
}

impl Default for State {
    fn default() -> Self {
        Self { cfg: Config::default() }
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[init]
fn init(args: Option<InitArgs>) {
    let args = args.unwrap_or_default();
    STATE.with(|s| {
        let mut st = s.borrow_mut();
        if let Some(v) = args.min_collateral { st.cfg.min_collateral = v; }
        if let Some(v) = args.min_trust { st.cfg.min_trust = v; }
        if let Some(v) = args.trust_cap { st.cfg.trust_cap = v; }
    });
}

#[pre_upgrade]
fn pre_upgrade() {
    let st = STATE.with(|s| s.borrow().clone());
    stable_save((st,)).expect("stable_save failed");
}

#[post_upgrade]
fn post_upgrade() {
    let (st,): (State,) = stable_restore().unwrap_or((State::default(),));
    STATE.with(|s| *s.borrow_mut() = st);
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Recommendation {
    /// "APPROVE" | "REVIEW" | "REJECT"
    decision: String,
    /// 0..=100 heuristic score
    score: u64,
    /// human-readable reasons that led to the decision
    reasons: Vec<String>,
}

/// Deterministic recommendation using inputs + config.
/// - `collateral`: u128 amount in smallest units
/// - `trust`: u64 score (we clamp to `trust_cap`)
#[query]
fn recommend(_p: Principal, collateral: u128, trust: u64) -> Recommendation {
    let (min_collateral, min_trust, trust_cap) = STATE.with(|s| {
        let c = &s.borrow().cfg;
        (c.min_collateral, c.min_trust, c.trust_cap)
    });

    let t = trust.min(trust_cap);
    // Ratios clamped to [0, 1] (integer math)
    let coll_ratio = if min_collateral == 0 { 1.0 } else { (collateral as f64 / min_collateral as f64).min(1.0) };
    let trust_ratio = if min_trust == 0 { 1.0 } else { (t as f64 / min_trust as f64).min(1.0) };

    // Simple weighted score (50/50) → 0..=100
    let score = ((coll_ratio * 50.0) + (trust_ratio * 50.0)).round() as u64;

    // Decision logic
    let mut reasons = Vec::new();
    if collateral < min_collateral {
        reasons.push(format!("collateral {} < min_collateral {}", collateral, min_collateral));
    } else {
        reasons.push(format!("collateral {} ≥ min_collateral {}", collateral, min_collateral));
    }
    if t < min_trust {
        reasons.push(format!("trust {} < min_trust {}", t, min_trust));
    } else {
        reasons.push(format!("trust {} ≥ min_trust {}", t, min_trust));
    }

    let decision = if collateral >= min_collateral && t >= min_trust {
        "APPROVE"
    } else if collateral >= (min_collateral / 2) || t >= min_trust {
        "REVIEW"
    } else {
        "REJECT"
    }.to_string();

    Recommendation { decision, score, reasons }
}
