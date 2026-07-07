package com.wease.worker;

import com.wease.booking.BookingResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WorkerDashboardResponse {
    private Integer todayJobs;
    private Integer pendingRequests;
    private Integer completedJobs;
    private Double todayEarnings;
    private Double rating;
    private Boolean available;
    private List<BookingResponse> recentBookings;
}
