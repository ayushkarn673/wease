package com.wease.service;

import com.wease.dto.request.BookingRequest;
import com.wease.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, String customerEmail);

    List<BookingResponse> customerBookings(String email);

    List<BookingResponse> workerBookings(String email);

    BookingResponse acceptBooking(Long bookingId, String email);

    BookingResponse rejectBooking(Long bookingId, String email);

    BookingResponse completeBooking(Long bookingId, String email);

}
