use candid::{CandidType, Deserialize, Principal, Nat};
use ic_cdk::{api::caller, call, trap};
use ic_cdk::storage::{stable_restore, stable_save};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use serde_json::json;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};

#[derive(CandidType, Deserialize, Clone, Debug)]
struct State {
    admin: Principal,
    /// Principals allowed to call `set_level` (e.g., loans canister)
    allowed_setters: HashSet<Principal>,
    /// Reputation levels
    levels: HashMap<Principal, Nat>,
    /// Optional event bus canister to emit audit events
    event_bus: Option<Principal>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            admin: Principal::anonymous(),
            allowed_setters: HashSet::new(),
            levels: HashMap::new(),
            event_bus: None,
        }
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
struct InitArgs {
    /// Optional admin override; defaults to the deployer (caller)
    admin: Option<Principal>,
    /// Optional loans canister principal allowed to set levels
    loans: Option<Principal>,
    /// Optional event bus canister principal to receive emits
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
            st.allowed_setters.insert(l);
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
        State {
            admin: caller(),
            ..State::default()
        },
    ));
    STATE.with(|s| *s.borrow_mut() = st);
}

#[query]
fn get_level(p: Principal) -> Nat {
    STATE.with(|s| s.borrow().levels.get(&p).cloned().unwrap_or(Nat::from(0u64)))
}

#[update]
async fn set_level(p: Principal, level: Nat) {
    ensure_can_set().unwrap_or_else(|e| trap(&e));
    STATE.with(|s| {
        s.borrow_mut().levels.insert(p, level.clone());
    });

    // best-effort event emission
    if let Some(bus) = STATE.with(|s| s.borrow().event_bus) {
        let payload = json!({
            "kind": "repute.set_level",
            "actor": format!("{}", caller()),
            "principal": format!("{}", p),
            "level": level,
        })
        .to_string();
        let _: Result<(), _> = call(bus, "emit", (payload,)).await;
    }
}

fn ensure_can_set() -> Result<(), String> {
    let c = caller();
    STATE.with(|s| {
        let st = s.borrow();
        if c == st.admin || st.allowed_setters.contains(&c) {
            Ok(())
        } else {
            Err("unauthorized: caller is not admin or allowed setter".into())
        }
    })
}

ic_cdk::export_candid!();
