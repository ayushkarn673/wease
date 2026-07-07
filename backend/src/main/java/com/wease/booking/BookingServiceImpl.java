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
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return bookingRepository.findByCustomer(customer).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getWorkerBookings(String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        WorkerProfile profile = workerProfileRepository
                .findByUser(worker)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        return bookingRepository.findByWorkerProfile(profile)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse acceptBooking(Long bookingId, String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        WorkerProfile profile = workerProfileRepository
                .findByUser(worker)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        Booking booking = bookingRepository
                .findByIdAndWorkerProfile(bookingId, profile)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking cannot be accepted.");
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);

        return toResponse(booking);
    }

    @Override
    public BookingResponse rejectBooking(Long bookingId, String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        WorkerProfile profile = workerProfileRepository
                .findByUser(worker)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        Booking booking = bookingRepository
                .findByIdAndWorkerProfile(bookingId, profile)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);

        return toResponse(booking);
    }

    @Override
    public BookingResponse completeBooking(Long bookingId, String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        WorkerProfile profile = workerProfileRepository
                .findByUser(worker)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        Booking booking = bookingRepository
                .findByIdAndWorkerProfile(bookingId, profile)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.COMPLETED);
        // Default finalPrice to estimatedPrice upon completion if not already specified
        if (booking.getFinalPrice() == null) {
            booking.setFinalPrice(booking.getEstimatedPrice());
        }
        bookingRepository.save(booking);

        return toResponse(booking);
    }

    @Override
    public BookingResponse getBookingDetails(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isCustomer = booking.getCustomer().getEmail().equals(email);
        boolean isWorker = booking.getWorkerProfile().getUser().getEmail().equals(email);

        if (!isCustomer && !isWorker) {
            throw new com.wease.core.exception.AccessDeniedException("You do not have access to view this booking.");
        }

        return toResponse(booking);
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
