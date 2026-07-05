package com.wease.booking;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {

    private Long bookingId;

    private String customerName;

    private String workerName;

    private String profession;

    private BookingStatus status;

    private Double estimatedPrice;
}
