use ic_cdk_macros::{update, query};
use std::cell::RefCell;
use std::collections::VecDeque;

const MAX_EVENTS: usize = 200;

thread_local! {
    static EVENTS: RefCell<VecDeque<String>> = RefCell::new(VecDeque::new());
}

/// Append an event (keeps only the latest MAX_EVENTS)
#[update]
fn emit(event: String) {
    EVENTS.with(|cell| {
        let mut q = cell.borrow_mut();
        if q.len() >= MAX_EVENTS {
            q.pop_front();
        }
        q.push_back(event);
    });
}

/// Return up to `limit` most recent events (newest first)
#[query]
fn list_recent(limit: u64) -> Vec<String> {
    EVENTS.with(|cell| {
        let q = cell.borrow();
        let take_n = (limit as usize).min(q.len());
        q.iter().rev().take(take_n).cloned().collect()
    })
}

// Add this at the end of the file to export Candid interface
#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    include_str!("../event_bus_backend.did").to_string()
}

#[cfg(feature = "export-api")]
#[ic_cdk::query(name = "get_candid_pointer")]
fn get_candid_pointer() -> *const std::os::raw::c_char {
    export_candid().as_ptr() as *const std::os::raw::c_char
}
