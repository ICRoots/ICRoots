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

ic_cdk::export_candid!();
