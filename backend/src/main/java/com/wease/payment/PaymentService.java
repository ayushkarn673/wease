package com.wease.payment;

import com.wease.booking.*;
import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.core.util.Money;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final BookingPaymentRepository paymentRepository;
    private final BillCalculator billCalculator;
    private final BookingMapper bookingMapper;

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPayments(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        boolean participant = booking.getCustomer().getEmail().equals(email)
                || booking.getWorkerProfile().getUser().getEmail().equals(email);
        if (!participant) {
            throw new AccessDeniedException("You do not have access to this booking.");
        }
        return paymentRepository.findByBookingOrderByIdAsc(booking).stream().map(PaymentResponse::from).toList();
    }

    // The worker confirms cash they collected. Locked so two submissions can't both pass the
    // balance check and overpay the booking.
    @Transactional
    public BookingResponse recordCashPayment(Long bookingId, BigDecimal amount, String workerEmail) {
        Booking booking = bookingRepository.findWithLockById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getWorkerProfile().getUser().getEmail().equals(workerEmail)) {
            throw new AccessDeniedException("Only the professional on this booking can record a cash payment.");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Record payment after marking the job as completed.");
        }

        BookingBill bill = billCalculator.calculate(booking);
        if (bill.balanceDue().signum() == 0) {
            throw new BadRequestException("This booking is already fully paid.");
        }
        if (amount.compareTo(bill.balanceDue()) > 0) {
            throw new BadRequestException("That's more than the " + Money.rupees(bill.balanceDue()) + " still due.");
        }

        paymentRepository.save(BookingPayment.builder()
                .booking(booking)
                .method(PaymentMethod.CASH)
                .amount(amount)
                .recordedBy(booking.getWorkerProfile().getUser())
                .build());

        BigDecimal paid = bill.amountPaid().add(amount);
        booking.setAmountPaid(paid);
        booking.setPaymentStatus(paid.compareTo(bill.total()) >= 0 ? PaymentStatus.PAID : PaymentStatus.PARTIALLY_PAID);
        bookingRepository.save(booking);
        return bookingMapper.toResponse(booking);
    }
}