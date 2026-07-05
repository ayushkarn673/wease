package com.wease.dto.response;

import com.wease.entity.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private String customerName;

    private String customerEmail;

    private Long workerId;

    private String workerName;

    private String workerProfession;

    private LocalDate bookingDate;

    private LocalTime bookingTime;

    private BookingStatus status;

    private Double price;

    private String address;

    private Double latitude;

    private Double longitude;

    private LocalDateTime createdAt;
}
