use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{api::caller, call, trap};
use ic_cdk::storage::{stable_restore, stable_save};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use serde::{Deserialize as SerdeDeserialize, Serialize};
use serde_json::json;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};

#[derive(CandidType, Deserialize, Clone, Debug)]
struct State {
    admin: Principal,
    /// Principals allowed to deposit on behalf of users (e.g., loans canister)
    allowed_depositors: HashSet<Principal>,
    /// Mock balances by user principal (we use u128 for nat)
    balances: HashMap<Principal, u128>,
    /// Optional event bus for audit logs
    event_bus: Option<Principal>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            admin: Principal::anonymous(),
            allowed_depositors: HashSet::new(),
            balances: HashMap::new(),
            event_bus: None,
        }
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
struct InitArgs {
    /// Optional admin override; defaults to deployer
    admin: Option<Principal>,
    /// Optional loans canister that can call deposit_mock
    loans: Option<Principal>,
    /// Optional event bus canister id
    event_bus: Option<Principal>,
}

#[init]
fn init(args: Option<InitArgs>) {
    let me = caller();
    let args = args.unwrap_or_default();
    STATE.with(|s| {
        let mut st = s.borrow_mut();
        st.admin = args.admin.unwrap_or(me);
        if let Some(l) = args.loans {
            st.allowed_depositors.insert(l);
        }
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
    let (st,): (State,) = stable_restore().unwrap_or((
        State { admin: caller(), ..State::default() },
    ));
    STATE.with(|s| *s.borrow_mut() = st);
}

#[query]
fn get_collateral(p: Principal) -> u128 {
    STATE.with(|s| *s.borrow().balances.get(&p).unwrap_or(&0))
}

#[update]
async fn deposit_mock(p: Principal, amount: u128) {
    ensure_can_deposit().unwrap_or_else(|e| trap(&e));
    if amount == 0 {
        trap("amount must be > 0");
    }

    STATE.with(|s| {
        let mut st = s.borrow_mut();
        let entry = st.balances.entry(p).or_insert(0);
        *entry = entry.checked_add(amount).unwrap_or_else(|| trap("overflow on deposit"));
    });

    // best-effort audit event
    if let Some(bus) = STATE.with(|s| s.borrow().event_bus) {
        let payload = json!({
            "kind": "collateral.deposit_mock",
            "actor": format!("{}", caller()),
            "principal": format!("{}", p),
            "amount": amount,
        }).to_string();
        let _: Result<(), _> = call(bus, "emit", (payload,)).await;
    }
}

fn ensure_can_deposit() -> Result<(), String> {
    let c = caller();
    STATE.with(|s| {
        let st = s.borrow();
        if c == st.admin || st.allowed_depositors.contains(&c) {
            Ok(())
        } else {
            Err("unauthorized: caller is not admin or allowed depositor".into())
        }
    })
}

// -------------- (optional) basic tests --------------
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn defaults_to_zero() {
        let me = Principal::anonymous();
        STATE.with(|s| *s.borrow_mut() = State { admin: me, ..State::default() });
        assert_eq!(get_collateral(me), 0);
    }
}
