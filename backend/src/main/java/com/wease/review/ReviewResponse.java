package com.wease.review;

import java.time.LocalDateTime;

// `reviewerName` is shortened to first name + last initial, e.g. "Priya S.".
public record ReviewResponse(Long id, Integer rating, String comment, String reviewerName, String profession, LocalDateTime createdAt) {

    static ReviewResponse from(Review review) {
        return new ReviewResponse(review.getId(), review.getRating(), review.getComment(),
                shortName(review.getCustomer().getFullName()),
                review.getWorkerProfile().getProfession().name(), review.getCreatedAt());
    }

    static ReviewResponse from(FirmReview review) {
        return new ReviewResponse(review.getId(), review.getRating(), review.getComment(),
                shortName(review.getCustomer().getFullName()),
                review.getCrewRequest().getProfession().name(), review.getCreatedAt());
    }

    static String shortName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "Customer";
        String[] parts = fullName.trim().split("\\s+");
        return parts.length == 1 ? parts[0] : parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
    }
}