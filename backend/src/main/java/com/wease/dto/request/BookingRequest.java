package com.wease.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {

    private Long workerId;

    private LocalDate bookingDate;

    private LocalTime bookingTime;

    private String serviceAddress;

    private String description;
}
