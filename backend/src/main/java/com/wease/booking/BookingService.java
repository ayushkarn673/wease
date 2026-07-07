package com.wease.booking;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(
            BookingRequest request,
            String customerEmail
    );

    List<BookingResponse> getCustomerBookings(
            String customerEmail
    );

    List<BookingResponse> getWorkerBookings(
            String workerEmail
    );

    BookingResponse acceptBooking(
            Long bookingId,
            String workerEmail
    );

    BookingResponse rejectBooking(
            Long bookingId,
            String workerEmail
    );

    BookingResponse completeBooking(
            Long bookingId,
            String workerEmail
    );

    BookingResponse getBookingDetails(
            Long bookingId,
            String email
    );
}
