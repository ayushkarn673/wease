package com.wease.quote;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings/{bookingId}/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService quoteService;

    @GetMapping
    public List<QuoteResponse> getQuotes(@PathVariable Long bookingId, Authentication authentication) {
        return quoteService.getQuotes(bookingId, authentication.getName());
    }

    @PostMapping
    public QuoteResponse submitQuote(
            @PathVariable Long bookingId,
            @Valid @RequestBody QuoteRequest request,
            Authentication authentication
    ) {
        return quoteService.submitQuote(bookingId, request, authentication.getName());
    }

    @PutMapping("/{quoteId}/accept")
    public QuoteResponse acceptQuote(@PathVariable Long bookingId, @PathVariable Long quoteId, Authentication authentication) {
        return quoteService.acceptQuote(bookingId, quoteId, authentication.getName());
    }

    @PutMapping("/{quoteId}/reject")
    public QuoteResponse rejectQuote(@PathVariable Long bookingId, @PathVariable Long quoteId, Authentication authentication) {
        return quoteService.rejectQuote(bookingId, quoteId, authentication.getName());
    }
}