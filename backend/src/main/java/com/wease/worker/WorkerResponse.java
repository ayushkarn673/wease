package com.wease.worker;


import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkerResponse {

    private Long id;

    private String fullName;

    private Profession profession;

    private Integer experience;

    private Double hourlyRate;

    private String address;

    private Boolean verified;

    private Boolean available;

    private String profilePhoto;

    private String bio;

    // Exact base location: only filled in for the worker's own profile.
    private Double latitude;

    private Double longitude;

    // Rounded (about 1 km) base location for maps shown to customers.
    private Double approxLatitude;

    private Double approxLongitude;

    private Boolean hasServiceArea;

    private Double serviceRadiusKm;

    // Average star rating from completed bookings (null when there are no reviews yet).
    private Double averageRating;

    private Long reviewCount;

    // Distance from the customer's location, when they searched by location.
    private Double distanceKm;

    // Null when the worker hasn't set one; customers see it as a free visit.
    private BigDecimal visitingCharge;

    private VisitingChargePolicy visitingChargePolicy;
}
