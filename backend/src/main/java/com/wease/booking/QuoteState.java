package com.wease.booking;

// Where the booking stands with the worker's repair quote, kept on the booking so lists don't need to
// load every quote.
public enum QuoteState {
    NONE,
    AWAITING_APPROVAL,
    APPROVED,
    DECLINED
}