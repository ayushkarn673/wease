package com.wease.payment;

import com.wease.booking.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(Long id, PaymentMethod method, BigDecimal amount, String recordedBy, LocalDateTime createdAt) {

    static PaymentResponse from(BookingPayment payment) {
        return new PaymentResponse(payment.getId(), payment.getMethod(), payment.getAmount(),
                payment.getRecordedBy().getFullName(), payment.getCreatedAt());
    }
}