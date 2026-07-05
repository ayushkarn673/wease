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
    public List<BookingResponse> getCustomerBookings(Authentication authentication) {
        return bookingService.customerBookings(authentication.getName());
    }

    @GetMapping("/worker")
    public List<BookingResponse> getWorkerBookings(Authentication authentication) {
        return bookingService.workerBookings(authentication.getName());
    }

    @PutMapping("/{id}/accept")
    public BookingResponse acceptBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.acceptBooking(id, authentication.getName());
    }

    @PutMapping("/{id}/reject")
    public BookingResponse rejectBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.rejectBooking(id, authentication.getName());
    }

    @PutMapping("/{id}/complete")
    public BookingResponse completeBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return bookingService.completeBooking(id, authentication.getName());
    }
}
