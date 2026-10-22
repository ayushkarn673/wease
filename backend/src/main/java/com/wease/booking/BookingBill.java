package com.wease.booking;

import com.wease.worker.VisitingChargePolicy;

import java.math.BigDecimal;

// Price breakdown for a booking. Until the job is completed (`finalised` = false) the total reflects the
// terms agreed so far and can still change if the customer approves a revised quote.
public record BookingBill(
        BigDecimal visitingCharge,
        VisitingChargePolicy visitingChargePolicy,
        BigDecimal labour,
        BigDecimal materials,
        BigDecimal other,
        BigDecimal quoteTotal,
        // True when the visiting charge is counted inside the repair bill rather than added to it.
        boolean visitingChargeAdjusted,
        BigDecimal total,
        BigDecimal amountPaid,
        BigDecimal balanceDue,
        BigDecimal platformCommission,
        BigDecimal workerEarning,
        boolean finalised
) {
}