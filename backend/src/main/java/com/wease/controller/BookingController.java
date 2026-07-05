package com.wease.controller;

import com.wease.dto.request.BookingRequest;
import com.wease.dto.response.BookingResponse;
import com.wease.entity.BookingStatus;
import com.wease.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        return bookingService.createBooking(request, authentication.getName());
    }

    @PutMapping("/{id}/status")
    public BookingResponse updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            Authentication authentication
    ) {
        return bookingService.updateBookingStatus(id, status, authentication.getName());
    }

    @GetMapping("/customer")
    public List<BookingResponse> getCustomerBookings(Authentication authentication) {
        return bookingService.getCustomerBookings(authentication.getName());
    }

    @GetMapping("/worker")
    public List<BookingResponse> getWorkerBookings(Authentication authentication) {
        return bookingService.getWorkerBookings(authentication.getName());
    }
}
