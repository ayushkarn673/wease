package com.wease.quote;

public enum QuoteStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    // Replaced by a newer quote before or after it was answered.
    SUPERSEDED
}