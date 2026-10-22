package com.wease.booking;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {

    @NotNull(message = "Worker profile ID is required")
    private Long workerProfileId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Booking time is required")
    private LocalTime bookingTime;

    @NotBlank(message = "Service address is required")
    private String serviceAddress;

    @NotNull(message = "Pin the service location on the map")
    private Double serviceLatitude;

    @NotNull(message = "Pin the service location on the map")
    private Double serviceLongitude;

    @NotBlank(message = "Description is required")
    private String description;

    // Optional; defaults to cash. Online payment is not available yet.
    private PaymentMethod paymentMethod;
}
