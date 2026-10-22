package com.wease.worker;

// How a worker's visiting charge relates to the repair bill. Chosen by each worker and shown to the
// customer before they book; every booking keeps a copy of the policy it was made under.
public enum VisitingChargePolicy {
    // The visiting charge is paid on top of any repair work.
    SEPARATE,
    // The visiting charge counts towards the repair bill if the customer approves a quote.
    ADJUST_AGAINST_FINAL_BILL
}