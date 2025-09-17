use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{
    api::{caller, time},
    call, trap,
};
use ic_cdk::storage::{stable_restore, stable_save};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use serde_json::json;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};

#[derive(CandidType, Deserialize, Clone, Debug)]
struct State {
    admin: Principal,
    repute: Principal,
    collateral: Principal,
    trust_ai: Principal,
    event_bus: Option<Principal>,
    next_loan_id: u128,
    users: HashSet<Principal>,
    loans: HashMap<u128, Loan>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            admin: Principal::anonymous(),
            repute: Principal::anonymous(),
            collateral: Principal::anonymous(),
            trust_ai: Principal::anonymous(),
            event_bus: None,
            next_loan_id: 1,
            users: HashSet::new(),
            loans: HashMap::new(),
        }
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Loan {
    id: u128,
    borrower: Principal,
    amount: u128,
    repaid: u128,
    status: LoanStatus,
    created_at_ns: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug, PartialEq, Eq)]
enum LoanStatus {
    Active,
    Repaid,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
struct InitArgs {
    admin: Option<Principal>,
    repute: Option<Principal>,
    collateral: Option<Principal>,
    trust_ai: Option<Principal>,
    event_bus: Option<Principal>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[init]
fn init(args: Option<InitArgs>) {
    let me = caller();
    let args = args.unwrap_or_default();
    STATE.with(|s| {
        let mut st = s.borrow_mut();
        st.admin = args.admin.unwrap_or(me);
        st.repute = args.repute.unwrap_or(Principal::anonymous());
        st.collateral = args.collateral.unwrap_or(Principal::anonymous());
        st.trust_ai = args.trust_ai.unwrap_or(Principal::anonymous());
        st.event_bus = args.event_bus;
    });
}

#[pre_upgrade]
fn pre_upgrade() {
    let st = STATE.with(|s| s.borrow().clone());
    stable_save((st,)).expect("stable_save failed");
}

#[post_upgrade]
fn post_upgrade() {
    let (st,): (State,) =
        stable_restore().unwrap_or((State { admin: caller(), ..State::default() },));
    STATE.with(|s| *s.borrow_mut() = st);
}

#[query]
fn ping() -> String {
    format!("ok:{}", time())
}

#[update]
fn register_user() {
    let me = caller();
    STATE.with(|s| {
        s.borrow_mut().users.insert(me);
    });
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct LoanInfo {
    id: u128,
    amount: u128,
    status: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Summary {
    registered: bool,
    level: u64,
    collateral: u128,
    outstanding: u128,
    loans: Vec<LoanInfo>,
}

// update (not query) because we do cross-canister calls
#[update]
async fn get_summary(p: Principal) -> Summary {
    let (repute_id, collateral_id) = STATE.with(|s| {
        let st = s.borrow();
        (st.repute, st.collateral)
    });

    let (level,): (u64,) = call(repute_id, "get_level", (p,))
        .await
        .unwrap_or((0_u64,));
    let (collateral,): (u128,) = call(collateral_id, "get_collateral", (p,))
        .await
        .unwrap_or((0_u128,));

    let (registered, loans_vec, outstanding) = STATE.with(|s| {
        let st = s.borrow();
        let registered = st.users.contains(&p);
        let mut loans: Vec<LoanInfo> = st
            .loans
            .values()
            .filter(|l| l.borrower == p)
            .map(|l| LoanInfo {
                id: l.id,
                amount: l.amount,
                status: format!("{:?}", l.status),
            })
            .collect();
        loans.sort_by_key(|li| li.id);
        let outstanding: u128 = st
            .loans
            .values()
            .filter(|l| l.borrower == p && l.status == LoanStatus::Active)
            .map(|l| l.amount.saturating_sub(l.repaid))
            .sum();
        (registered, loans, outstanding)
    });

    Summary {
        registered,
        level,
        collateral,
        outstanding,
        loans: loans_vec,
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Recommendation {
    decision: String,
    score: u64,
    reasons: Vec<String>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct LoanDecision {
    loan_id: Option<u128>,
    decision: String,
    score: u64,
    reasons: Vec<String>,
}

#[update]
async fn request_loan(amount: u128) -> LoanDecision {
    if amount == 0 {
        trap("amount must be > 0");
    }
    let me = caller();

    // must be registered
    let registered = STATE.with(|s| s.borrow().users.contains(&me));
    if !registered {
        trap("not registered");
    }

    let (rep_id, col_id, ai_id, bus) =
        STATE.with(|s| {
            let st = s.borrow();
            (st.repute, st.collateral, st.trust_ai, st.event_bus)
        });

    let (level,): (u64,) = call(rep_id, "get_level", (me,))
        .await
        .unwrap_or((0_u64,));
    let (collateral,): (u128,) = call(col_id, "get_collateral", (me,))
        .await
        .unwrap_or((0_u128,));

    let (rec,): (Recommendation,) =
        call(ai_id, "recommend", (me, collateral, level as u64))
            .await
            .map_err(|e| trap(&format!("trust_ai call failed: {e:?}")))
            .unwrap();

    // On APPROVE, open a loan
    let (loan_id_opt, decision) = if rec.decision == "APPROVE" {
        let id = STATE.with(|s| {
            let mut st = s.borrow_mut();
            let id = st.next_loan_id;
            st.next_loan_id += 1;
            st.loans.insert(
                id,
                Loan {
                    id,
                    borrower: me,
                    amount,
                    repaid: 0,
                    status: LoanStatus::Active,
                    created_at_ns: time(),
                },
            );
            id
        });
        (Some(id), "APPROVE".to_string())
    } else {
        (None, rec.decision.clone())
    };

    // best-effort audit event
    if let Some(bus) = bus {
        let payload = json!({
            "kind": "loans.request",
            "actor": format!("{}", me),
            "amount": amount,
            "decision": decision,
            "score": rec.score,
            "reasons": rec.reasons,
            "loan_id": loan_id_opt,
        })
        .to_string();
        let _: Result<(), _> = ic_cdk::call(bus, "emit", (payload,)).await;
    }

    LoanDecision {
        loan_id: loan_id_opt,
        decision,
        score: rec.score,
        reasons: rec.reasons,
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct RepayResult {
    repaid: u128,
    remaining: u128,
    status: String,
}

#[update]
async fn repay(loan_id: u128, amount: u128) -> RepayResult {
    if amount == 0 {
        trap("amount must be > 0");
    }
    let me = caller();

    let (event_bus, result) = STATE.with(|s| {
        let mut st = s.borrow_mut();

        // read bus BEFORE taking a mutable ref to the loan (fixes E0502)
        let bus = st.event_bus;

        let l = st
            .loans
            .get_mut(&loan_id)
            .unwrap_or_else(|| trap("loan not found"));

        if l.borrower != me {
            trap("only borrower can repay");
        }
        if l.status != LoanStatus::Active {
            trap("loan not active");
        }

        l.repaid = l.repaid.saturating_add(amount);
        if l.repaid >= l.amount {
            l.status = LoanStatus::Repaid;
        }
        let remaining = l.amount.saturating_sub(l.repaid);
        let status = format!("{:?}", l.status);

        (bus, RepayResult { repaid: l.repaid, remaining, status })
    });

    // best-effort audit event
    if let Some(bus) = event_bus {
        let payload = json!({
            "kind": "loans.repay",
            "actor": format!("{}", me),
            "loan_id": loan_id,
            "amount": amount,
        })
        .to_string();
        let _: Result<(), _> = ic_cdk::call(bus, "emit", (payload,)).await;
    }

    result
}

ic_cdk::export_candid!();
