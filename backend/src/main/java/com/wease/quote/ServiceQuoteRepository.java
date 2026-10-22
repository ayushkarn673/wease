package com.wease.quote;

import com.wease.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceQuoteRepository extends JpaRepository<ServiceQuote, Long> {

    List<ServiceQuote> findByBookingOrderByIdDesc(Booking booking);

    List<ServiceQuote> findByBookingAndStatus(Booking booking, QuoteStatus status);

    Optional<ServiceQuote> findByIdAndBooking(Long id, Booking booking);
}