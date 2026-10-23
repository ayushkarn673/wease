package com.wease.notification;

import java.time.LocalDate;
import java.time.LocalTime;

// Published when a customer books a professional. Holds plain values so it can be handled after the
// booking's transaction has committed.
public record BookingRequestedEvent(
        Long bookingId,
        Long workerUserId,
        String customerName,
        String serviceLabel,
        LocalDate date,
        LocalTime time) {
}
