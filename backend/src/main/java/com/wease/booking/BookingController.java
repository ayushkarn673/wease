package com.wease.booking;

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

    @GetMapping("/customer")
    public List<BookingResponse> customerBookings(Authentication authentication) {
        return bookingService.getCustomerBookings(authentication.getName());
    }

    @GetMapping("/worker")
    public List<BookingResponse> workerBookings(Authentication authentication) {
        return bookingService.getWorkerBookings(authentication.getName());
    }

    @PutMapping("/{id}/accept")
    public BookingResponse accept(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.acceptBooking(id, authentication.getName());
    }

    @PutMapping("/{id}/reject")
    public BookingResponse reject(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.rejectBooking(id, authentication.getName());
    }

    @PutMapping("/{id}/complete")
    public BookingResponse complete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.completeBooking(id, authentication.getName());
    }
}
