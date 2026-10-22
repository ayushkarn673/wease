package com.wease.crew;

import com.wease.worker.Profession;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

// `contactPhone` is the other party's phone, shared only after the firm accepts.
public record CrewRequestResponse(
        Long id,
        Long firmId,
        String firmName,
        String firmCity,
        String customerName,
        Profession profession,
        Integer workers,
        Integer days,
        Integer plannedWorkerDays,
        LocalDate startDate,
        LocalTime reportingTime,
        String siteAddress,
        String siteCity,
        String description,
        BigDecimal dailyRate,
        BigDecimal estimatedTotal,
        Integer actualWorkerDays,
        BigDecimal finalAmount,
        CrewStatus status,
        String contactPhone,
        Integer customerRating,
        LocalDateTime createdAt
) {
}