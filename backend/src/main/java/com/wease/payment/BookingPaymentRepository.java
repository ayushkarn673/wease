package com.wease.payment;

import com.wease.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingPaymentRepository extends JpaRepository<BookingPayment, Long> {

    List<BookingPayment> findByBookingOrderByIdAsc(Booking booking);
}