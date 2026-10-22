package com.wease.review;

import java.util.List;
import java.util.Map;

// Everything the profile page needs: the average, the 5..1 star breakdown and the latest reviews.
public record ReviewSummaryResponse(Double average, long count, Map<Integer, Long> breakdown, List<ReviewResponse> reviews) {
}