package com.wease.review;

import com.wease.booking.Booking;
import com.wease.booking.BookingRepository;
import com.wease.booking.BookingStatus;
import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.worker.WorkerProfile;
import com.wease.worker.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final int LATEST_REVIEWS = 50;

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final WorkerProfileRepository workerProfileRepository;

    // Only the customer of a completed booking can rate it, and only once.
    @Transactional
    public ReviewResponse rateBooking(Long bookingId, ReviewRequest request, String customerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getCustomer().getEmail().equals(customerEmail)) {
            throw new AccessDeniedException("Only the customer on this booking can rate it.");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("You can rate the professional once the job is completed.");
        }
        if (reviewRepository.existsByBooking(booking)) {
            throw new ResourceAlreadyExistsException("You've already rated this booking.");
        }

        String comment = request.getComment() == null || request.getComment().isBlank() ? null : request.getComment().trim();
        Review review = reviewRepository.save(Review.builder()
                .booking(booking)
                .workerProfile(booking.getWorkerProfile())
                .customer(booking.getCustomer())
                .rating(request.getRating())
                .comment(comment)
                .build());
        booking.setCustomerRating(request.getRating());
        bookingRepository.save(booking);
        return ReviewResponse.from(review);
    }

    @Transactional(readOnly = true)
    public ReviewSummaryResponse summaryFor(Long workerProfileId) {
        WorkerProfile worker = workerProfileRepository.findById(workerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        Map<Integer, Long> breakdown = new LinkedHashMap<>();
        for (int stars = 5; stars >= 1; stars--) breakdown.put(stars, 0L);
        for (Object[] row : reviewRepository.ratingCounts(worker)) {
            breakdown.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }
        RatingStats stats = statsFor(List.of(workerProfileId)).getOrDefault(workerProfileId, RatingStats.NONE);
        List<ReviewResponse> latest = reviewRepository
                .findByWorkerProfileOrderByIdDesc(worker, PageRequest.of(0, LATEST_REVIEWS))
                .stream().map(ReviewResponse::from).toList();
        return new ReviewSummaryResponse(stats.average(), stats.count(), breakdown, latest);
    }

    // Average and count per worker, in a single query (used by the worker lists).
    @Transactional(readOnly = true)
    public Map<Long, RatingStats> statsFor(Collection<Long> workerIds) {
        if (workerIds.isEmpty()) return Map.of();
        Map<Long, RatingStats> stats = new HashMap<>();
        for (Object[] row : reviewRepository.statsForWorkers(workerIds)) {
            stats.put(((Number) row[0]).longValue(), RatingStats.of((Number) row[1], (Number) row[2]));
        }
        return stats;
    }
}