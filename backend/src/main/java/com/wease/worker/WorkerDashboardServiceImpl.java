package com.wease.worker;

import com.wease.booking.Booking;
import com.wease.booking.BookingMapper;
import com.wease.review.RatingStats;
import com.wease.review.ReviewService;
import com.wease.booking.BookingRepository;
import com.wease.booking.BookingResponse;
import com.wease.booking.BookingStatus;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.user.User;
import com.wease.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerDashboardServiceImpl implements WorkerDashboardService {

    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final ReviewService reviewService;

    @Override
    public WorkerDashboardResponse getDashboardData(String workerEmail) {
        User workerUser = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker user not found"));

        WorkerProfile workerProfile = workerProfileRepository.findByUser(workerUser)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found"));

        List<Booking> bookings = bookingRepository.findByWorkerProfile(workerProfile);
        LocalDate today = LocalDate.now();

        long pendingRequests = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();

        long todayJobs = bookings.stream()
                .filter(b -> (b.getStatus() == BookingStatus.ACCEPTED 
                        || b.getStatus() == BookingStatus.IN_PROGRESS 
                        || b.getStatus() == BookingStatus.COMPLETED) 
                        && b.getBookingDate().equals(today))
                .count();

        long completedJobs = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();

        double todayEarnings = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED 
                        && b.getBookingDate().equals(today))
                // What the worker keeps after Wease's commission.
                .mapToDouble(b -> bookingMapper.toResponse(b).getBill().workerEarning().doubleValue())
                .sum();

        // Sort bookings by creation date or ID descending to get recent jobs first
        List<BookingResponse> recentBookings = bookings.stream()
                .sorted((b1, b2) -> b2.getId().compareTo(b1.getId()))
                .map(bookingMapper::toResponse)
                .toList();

        return WorkerDashboardResponse.builder()
                .todayJobs((int) todayJobs)
                .pendingRequests((int) pendingRequests)
                .completedJobs((int) completedJobs)
                .todayEarnings(todayEarnings)
                // Real average from customer reviews; null until the first review.
                .rating(reviewService.statsFor(List.of(workerProfile.getId()))
                        .getOrDefault(workerProfile.getId(), RatingStats.NONE).average())
                .available(workerProfile.getAvailable())
                .recentBookings(recentBookings)
                .build();
    }

}
