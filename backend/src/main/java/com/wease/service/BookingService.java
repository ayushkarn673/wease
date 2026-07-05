package com.wease.service;

import com.wease.dto.request.BookingRequest;
import com.wease.dto.response.BookingResponse;
import com.wease.entity.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, String customerEmail);

    BookingResponse updateBookingStatus(Long id, BookingStatus status, String userEmail);

    List<BookingResponse> getCustomerBookings(String customerEmail);

    List<BookingResponse> getWorkerBookings(String workerEmail);

}
