package com.wease.review;

// Average rating (rounded to one decimal, null when there are no reviews) and how many reviews.
public record RatingStats(Double average, long count) {

    public static final RatingStats NONE = new RatingStats(null, 0);

    public static RatingStats of(Number average, Number count) {
        long n = count == null ? 0 : count.longValue();
        return n == 0 ? NONE : new RatingStats(Math.round(average.doubleValue() * 10) / 10.0, n);
    }
}