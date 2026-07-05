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

    @NotBlank(message = "Description is required")
    private String description;
}
