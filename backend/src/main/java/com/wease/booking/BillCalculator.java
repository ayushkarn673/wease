package com.wease.booking;

import com.wease.worker.VisitingChargePolicy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

// Works out what the customer owes, what Wease keeps and what the worker earns.
//
//  - No approved quote (visit only, or the customer declined): total = visiting charge.
//  - SEPARATE policy:                  total = visiting charge + quote.
//  - ADJUST_AGAINST_FINAL_BILL policy: total = the larger of the quote and the visiting charge
//                                      (the visiting charge counts towards the repair).
//  - Commission is charged on labour only, not on materials or the visiting charge.
@Component
public class BillCalculator {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private final BigDecimal commissionPercent;

    public BillCalculator(@Value("${app.platform.commission-percent:5}") BigDecimal commissionPercent) {
        this.commissionPercent = commissionPercent;
    }

    public BigDecimal commissionPercent() {
        return commissionPercent;
    }

    public BookingBill calculate(Booking booking) {
        BigDecimal visit = money(booking.getVisitingCharge());
        VisitingChargePolicy policy = policyOf(booking);
        boolean hasQuote = booking.getAgreedLabour() != null;
        BigDecimal labour = money(booking.getAgreedLabour());
        BigDecimal materials = money(booking.getAgreedMaterials());
        BigDecimal other = money(booking.getAgreedOther());
        BigDecimal quoteTotal = labour.add(materials).add(other);
        boolean completed = booking.getStatus() == BookingStatus.COMPLETED;

        BigDecimal total;
        boolean adjusted = false;
        if (!hasQuote) {
            total = visit;
        } else if (policy == VisitingChargePolicy.SEPARATE) {
            total = visit.add(quoteTotal);
        } else {
            total = quoteTotal.max(visit);
            adjusted = visit.signum() > 0;
        }

        BigDecimal commission = completed && booking.getPlatformCommission() != null
                ? booking.getPlatformCommission()
                : commissionOn(labour);

        // Bookings completed before itemised pricing existed only have the amount the worker entered.
        if (booking.getQuoteState() == null && booking.getFinalPrice() != null) {
            total = money(BigDecimal.valueOf(booking.getFinalPrice()));
            commission = money(booking.getPlatformCommission());
        }

        BigDecimal paid = money(booking.getAmountPaid());
        return new BookingBill(
                visit, policy, labour, materials, other, quoteTotal, adjusted,
                total, paid, total.subtract(paid).max(BigDecimal.ZERO),
                commission, total.subtract(commission), completed);
    }

    public BigDecimal commissionOn(BigDecimal labour) {
        return money(labour).multiply(commissionPercent).divide(HUNDRED, 2, RoundingMode.HALF_UP);
    }

    private static VisitingChargePolicy policyOf(Booking booking) {
        return booking.getVisitingChargePolicy() != null
                ? booking.getVisitingChargePolicy()
                : VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL;
    }

    private static BigDecimal money(BigDecimal value) {
        return (value == null ? BigDecimal.ZERO : value).setScale(2, RoundingMode.HALF_UP);
    }
}