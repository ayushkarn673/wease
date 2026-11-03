package com.wease.booking;

import com.wease.worker.VisitingChargePolicy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

// What the customer owes, what Wease keeps and what the worker earns, for each pricing case.
class BillCalculatorTest {

    private final BillCalculator calculator = new BillCalculator(new BigDecimal("5"));

    @Test
    @DisplayName("Visit only (no approved quote): the bill is the visiting charge")
    void visitOnly() {
        BookingBill bill = calculator.calculate(booking("150", VisitingChargePolicy.SEPARATE, null, null, null));

        assertThat(bill.total()).isEqualByComparingTo("150");
        assertThat(bill.quoteTotal()).isEqualByComparingTo("0");
        assertThat(bill.platformCommission()).isEqualByComparingTo("0");
        assertThat(bill.workerEarning()).isEqualByComparingTo("150");
    }

    @Test
    @DisplayName("SEPARATE: visiting charge is added on top of the quote")
    void separatePolicyAddsVisitingCharge() {
        BookingBill bill = calculator.calculate(booking("200", VisitingChargePolicy.SEPARATE, "450", "180", "20"));

        assertThat(bill.quoteTotal()).isEqualByComparingTo("650");
        assertThat(bill.total()).isEqualByComparingTo("850");
        assertThat(bill.visitingChargeAdjusted()).isFalse();
    }

    @Test
    @DisplayName("ADJUST: visiting charge counts towards the repair, so the bill is the quote")
    void adjustPolicyCountsVisitingChargeTowardsQuote() {
        BookingBill bill = calculator.calculate(booking("150", VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL, "450", "180", null));

        assertThat(bill.total()).isEqualByComparingTo("630");
        assertThat(bill.visitingChargeAdjusted()).isTrue();
    }

    @Test
    @DisplayName("ADJUST: a quote smaller than the visiting charge still costs at least the visit")
    void adjustPolicyNeverBelowVisitingCharge() {
        BookingBill bill = calculator.calculate(booking("300", VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL, "100", "50", null));

        assertThat(bill.total()).isEqualByComparingTo("300");
    }

    @Test
    @DisplayName("No policy stored (older bookings) behaves as ADJUST")
    void missingPolicyDefaultsToAdjust() {
        BookingBill bill = calculator.calculate(booking("150", null, "450", null, null));

        assertThat(bill.visitingChargePolicy()).isEqualTo(VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL);
        assertThat(bill.total()).isEqualByComparingTo("450");
    }

    @Test
    @DisplayName("Commission is 5% of labour only, never of materials or the visiting charge")
    void commissionOnLabourOnly() {
        BookingBill bill = calculator.calculate(booking("200", VisitingChargePolicy.SEPARATE, "1000", "5000", "300"));

        assertThat(bill.platformCommission()).isEqualByComparingTo("50.00");
        assertThat(bill.workerEarning()).isEqualByComparingTo(bill.total().subtract(new BigDecimal("50.00")));
    }

    @Test
    @DisplayName("Commission is rounded to paise")
    void commissionRounding() {
        assertThat(calculator.commissionOn(new BigDecimal("333"))).isEqualByComparingTo("16.65");
        assertThat(calculator.commissionOn(new BigDecimal("0.10"))).isEqualByComparingTo("0.01");
        assertThat(calculator.commissionOn(null)).isEqualByComparingTo("0");
    }

    @Test
    @DisplayName("A completed booking keeps the commission recorded at completion")
    void completedBookingUsesStoredCommission() {
        Booking booking = booking("150", VisitingChargePolicy.SEPARATE, "1000", null, null);
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setPlatformCommission(new BigDecimal("40.00")); // e.g. recorded when the rate was 4%

        BookingBill bill = calculator.calculate(booking);

        assertThat(bill.finalised()).isTrue();
        assertThat(bill.platformCommission()).isEqualByComparingTo("40.00");
    }

    @Test
    @DisplayName("Balance due is the total minus what's paid, never negative")
    void balanceDue() {
        Booking booking = booking("150", VisitingChargePolicy.SEPARATE, "450", null, null);
        booking.setAmountPaid(new BigDecimal("200"));
        assertThat(calculator.calculate(booking).balanceDue()).isEqualByComparingTo("400");

        booking.setAmountPaid(new BigDecimal("1000"));
        assertThat(calculator.calculate(booking).balanceDue()).isEqualByComparingTo("0");
    }

    @Test
    @DisplayName("Bookings from before itemised pricing use the stored final amount")
    void legacyBookingUsesFinalPrice() {
        Booking booking = Booking.builder()
                .status(BookingStatus.COMPLETED)
                .finalPrice(800.0)
                .platformCommission(new BigDecimal("40"))
                .build();

        BookingBill bill = calculator.calculate(booking);

        assertThat(bill.total()).isEqualByComparingTo("800");
        assertThat(bill.platformCommission()).isEqualByComparingTo("40");
        assertThat(bill.workerEarning()).isEqualByComparingTo("760");
    }

    private static Booking booking(String visit, VisitingChargePolicy policy, String labour, String materials, String other) {
        return Booking.builder()
                .status(BookingStatus.IN_PROGRESS)
                .quoteState(labour == null ? QuoteState.NONE : QuoteState.APPROVED)
                .visitingCharge(new BigDecimal(visit))
                .visitingChargePolicy(policy)
                .agreedLabour(labour == null ? null : new BigDecimal(labour))
                .agreedMaterials(materials == null ? null : new BigDecimal(materials))
                .agreedOther(other == null ? null : new BigDecimal(other))
                .amountPaid(BigDecimal.ZERO)
                .build();
    }
}
