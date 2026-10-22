package com.wease.firm;

import com.wease.review.RatingStats;
import com.wease.worker.Profession;

import java.math.BigDecimal;
import java.util.List;

// `phone` is only filled in for the firm's own profile; customers get it once a request is accepted.
public record FirmResponse(
        Long id,
        String companyName,
        String contactPerson,
        String phone,
        String city,
        String address,
        String gstin,
        String about,
        Integer teamSize,
        Boolean available,
        FirmCoverage coverage,
        List<String> coveredCities,
        List<Rate> rates,
        BigDecimal lowestDailyRate,
        // Average star rating from completed crew requests (null when there are no reviews yet).
        Double averageRating,
        long reviewCount
) {
    public record Rate(Profession profession, BigDecimal dailyRate) {
    }

    static FirmResponse from(FirmProfile firm, boolean includePhone, RatingStats stats) {
        // Same order as the database returns them (by skill name), even right after an update.
        List<Rate> rates = firm.getRates().stream()
                .sorted(java.util.Comparator.comparing(r -> r.getProfession().name()))
                .map(r -> new Rate(r.getProfession(), r.getDailyRate()))
                .toList();
        BigDecimal lowest = rates.stream().map(Rate::dailyRate).min(BigDecimal::compareTo).orElse(null);
        return new FirmResponse(
                firm.getId(), firm.getCompanyName(), firm.getContactPerson(), includePhone ? firm.getPhone() : null,
                firm.getCity(), firm.getAddress(), firm.getGstin(), firm.getAbout(), firm.getTeamSize(),
                firm.getAvailable(), firm.getCoverage() != null ? firm.getCoverage() : FirmCoverage.HOME_CITY,
                firm.coveredCities(), rates, lowest, stats.average(), stats.count());
    }
}