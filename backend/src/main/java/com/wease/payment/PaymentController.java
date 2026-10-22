package com.wease.payment;

import com.wease.booking.BookingResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings/{bookingId}/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public List<PaymentResponse> getPayments(@PathVariable Long bookingId, Authentication authentication) {
        return paymentService.getPayments(bookingId, authentication.getName());
    }

    @PostMapping("/cash")
    public BookingResponse recordCash(
            @PathVariable Long bookingId,
            @Valid @RequestBody CashPaymentRequest request,
            Authentication authentication
    ) {
        return paymentService.recordCashPayment(bookingId, request.getAmount(), authentication.getName());
    }
}