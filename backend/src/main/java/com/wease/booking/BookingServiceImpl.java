package com.wease.booking;

import com.wease.user.User;
import com.wease.user.Role;
import com.wease.user.UserRepository;
import com.wease.worker.WorkerProfile;
import com.wease.worker.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;

    @Override
    public BookingResponse createBooking(BookingRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new RuntimeException("Only customers can create bookings.");
        }

        WorkerProfile workerProfile = workerProfileRepository.findById(request.getWorkerProfileId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));

        if (!workerProfile.getAvailable()) {
            throw new RuntimeException("Worker is currently unavailable.");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .workerProfile(workerProfile)
                .status(BookingStatus.PENDING)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .serviceAddress(request.getServiceAddress())
                .description(request.getDescription())
                .estimatedPrice(workerProfile.getHourlyRate())
                .build();

        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Override
    public List<BookingResponse> getCustomerBookings(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        return bookingRepository.findByCustomer(customer).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getWorkerBookings(String workerEmail) {
        User workerUser = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker user not found."));

        WorkerProfile workerProfile = workerProfileRepository.findByUser(workerUser)
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));

        return bookingRepository.findByWorkerProfile(workerProfile).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse acceptBooking(Long bookingId, String workerEmail) {
        Booking booking = getVerifiedBookingForWorker(bookingId, workerEmail);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only accept PENDING bookings.");
        }
        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Override
    public BookingResponse rejectBooking(Long bookingId, String workerEmail) {
        Booking booking = getVerifiedBookingForWorker(bookingId, workerEmail);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only reject PENDING bookings.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Override
    public BookingResponse completeBooking(Long bookingId, String workerEmail) {
        Booking booking = getVerifiedBookingForWorker(bookingId, workerEmail);
        if (booking.getStatus() != BookingStatus.ACCEPTED && booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Can only complete ACCEPTED or IN_PROGRESS bookings.");
        }
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    private Booking getVerifiedBookingForWorker(Long bookingId, String workerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        User workerUser = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker user not found."));

        WorkerProfile workerProfile = workerProfileRepository.findByUser(workerUser)
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));

        if (!booking.getWorkerProfile().getId().equals(workerProfile.getId())) {
            throw new com.wease.core.exception.AccessDeniedException("You do not have access to this booking.");
        }

        return booking;
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
                .build();
    }
}
