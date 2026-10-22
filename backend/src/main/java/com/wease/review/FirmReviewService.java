package com.wease.review;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.crew.CrewRequest;
import com.wease.crew.CrewRequestRepository;
import com.wease.crew.CrewStatus;
import com.wease.firm.FirmProfile;
import com.wease.firm.FirmProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FirmReviewService {

    private static final int LATEST_REVIEWS = 50;

    private final FirmReviewRepository reviewRepository;
    private final CrewRequestRepository crewRepository;
    private final FirmProfileRepository firmRepository;

    // Only the customer of a completed crew request can rate the firm, and only once per request.
    @Transactional
    public ReviewResponse rateCrewRequest(Long crewRequestId, ReviewRequest request, String customerEmail) {
        CrewRequest crew = crewRepository.findById(crewRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found."));
        if (!crew.getCustomer().getEmail().equals(customerEmail)) {
            throw new AccessDeniedException("Only the customer who made this request can rate the firm.");
        }
        if (crew.getStatus() != CrewStatus.COMPLETED) {
            throw new BadRequestException("You can rate the firm once the work is completed.");
        }
        if (reviewRepository.existsByCrewRequest(crew)) {
            throw new ResourceAlreadyExistsException("You've already rated this request.");
        }

        String comment = request.getComment() == null || request.getComment().isBlank() ? null : request.getComment().trim();
        FirmReview review = reviewRepository.save(FirmReview.builder()
                .crewRequest(crew)
                .firm(crew.getFirm())
                .customer(crew.getCustomer())
                .rating(request.getRating())
                .comment(comment)
                .build());
        crew.setCustomerRating(request.getRating());
        crewRepository.save(crew);
        return ReviewResponse.from(review);
    }

    @Transactional(readOnly = true)
    public ReviewSummaryResponse summaryFor(Long firmId) {
        FirmProfile firm = firmRepository.findById(firmId)
                .orElseThrow(() -> new ResourceNotFoundException("Firm not found."));

        Map<Integer, Long> breakdown = new LinkedHashMap<>();
        for (int stars = 5; stars >= 1; stars--) breakdown.put(stars, 0L);
        for (Object[] row : reviewRepository.ratingCounts(firm)) {
            breakdown.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }
        RatingStats stats = statsFor(List.of(firmId)).getOrDefault(firmId, RatingStats.NONE);
        List<ReviewResponse> latest = reviewRepository.findByFirmOrderByIdDesc(firm, PageRequest.of(0, LATEST_REVIEWS))
                .stream().map(ReviewResponse::from).toList();
        return new ReviewSummaryResponse(stats.average(), stats.count(), breakdown, latest);
    }

    @Transactional(readOnly = true)
    public Map<Long, RatingStats> statsFor(Collection<Long> firmIds) {
        if (firmIds.isEmpty()) return Map.of();
        Map<Long, RatingStats> stats = new HashMap<>();
        for (Object[] row : reviewRepository.statsForFirms(firmIds)) {
            stats.put(((Number) row[0]).longValue(), RatingStats.of((Number) row[1], (Number) row[2]));
        }
        return stats;
    }
}