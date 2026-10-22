package com.wease.booking;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long bookingId;

    private String customerName;

    private String workerName;

    private Long workerProfileId;

    private String profession;

    private LocalDate bookingDate;

    private LocalTime bookingTime;

    private String serviceAddress;

    private Double serviceLatitude;

    private Double serviceLongitude;

    private Double estimatedPrice;

    private BookingStatus status;

    private Double finalPrice;

    private String description;

    private QuoteState quoteState;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private BookingBill bill;

    private Integer customerRating;
}
