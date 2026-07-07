package com.wease.worker;

import com.wease.booking.Booking;
import com.wease.booking.BookingRepository;
import com.wease.booking.BookingResponse;
import com.wease.booking.BookingStatus;
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

    @Override
    public WorkerDashboardResponse getDashboardData(String workerEmail) {
        User workerUser = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker user not found"));

        WorkerProfile workerProfile = workerProfileRepository.findByUser(workerUser)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

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
                .mapToDouble(b -> b.getFinalPrice() != null ? b.getFinalPrice() : b.getEstimatedPrice())
                .sum();

        // Sort bookings by creation date or ID descending to get recent jobs first
        List<BookingResponse> recentBookings = bookings.stream()
                .sorted((b1, b2) -> b2.getId().compareTo(b1.getId()))
                .map(this::toResponse)
                .toList();

        return WorkerDashboardResponse.builder()
                .todayJobs((int) todayJobs)
                .pendingRequests((int) pendingRequests)
                .completedJobs((int) completedJobs)
                .todayEarnings(todayEarnings)
                .rating(4.9) // Default rating
                .available(workerProfile.getAvailable())
                .recentBookings(recentBookings)
                .build();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getId())
                .customerName(booking.getCustomer().getFullName())
                .workerName(booking.getWorkerProfile().getUser().getFullName())
                .profession(booking.getWorkerProfile().getProfession().name())
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .serviceAddress(booking.getServiceAddress())
                .estimatedPrice(booking.getEstimatedPrice())
                .status(booking.getStatus())
                .finalPrice(booking.getFinalPrice())
                .description(booking.getDescription())
                .build();
    }
}
