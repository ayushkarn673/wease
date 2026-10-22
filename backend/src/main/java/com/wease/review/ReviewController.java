package com.wease.review;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final FirmReviewService firmReviewService;

    @PostMapping("/api/bookings/{bookingId}/review")
    public ReviewResponse rateBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication
    ) {
        return reviewService.rateBooking(bookingId, request, authentication.getName());
    }

    @PostMapping("/api/crew-requests/{crewRequestId}/review")
    public ReviewResponse rateCrewRequest(
            @PathVariable Long crewRequestId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication
    ) {
        return firmReviewService.rateCrewRequest(crewRequestId, request, authentication.getName());
    }

    @GetMapping("/api/firms/{firmId}/reviews")
    public ReviewSummaryResponse firmReviews(@PathVariable Long firmId) {
        return firmReviewService.summaryFor(firmId);
    }

    @GetMapping("/api/workers/{workerId}/reviews")
    public ReviewSummaryResponse workerReviews(@PathVariable Long workerId) {
        return reviewService.summaryFor(workerId);
    }
}