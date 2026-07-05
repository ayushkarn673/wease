package com.wease.booking;



import com.wease.user.User;
import com.wease.worker.WorkerProfile;

import com.wease.user.UserRepository;
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

        WorkerProfile workerProfile = workerProfileRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));

        User workerUser = workerProfile.getUser();

        Booking booking = Booking.builder()
                .customer(customer)
                .worker(workerUser)
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
    public List<BookingResponse> customerBookings(String email) {
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        return bookingRepository.findByCustomer(customer).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> workerBookings(String email) {
        User worker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Worker user not found."));

        return bookingRepository.findByWorker(worker).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse acceptBooking(Long bookingId, String email) {
        Booking booking = getVerifiedBookingForWorker(bookingId, email);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only accept PENDING bookings.");
        }
        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Override
    public BookingResponse rejectBooking(Long bookingId, String email) {
        Booking booking = getVerifiedBookingForWorker(bookingId, email);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only reject PENDING bookings.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Override
    public BookingResponse completeBooking(Long bookingId, String email) {
        Booking booking = getVerifiedBookingForWorker(bookingId, email);
        if (booking.getStatus() != BookingStatus.ACCEPTED && booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Can only complete ACCEPTED or IN_PROGRESS bookings.");
        }
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    private Booking getVerifiedBookingForWorker(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        User worker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Worker not found."));

        if (!booking.getWorker().getId().equals(worker.getId())) {
            throw new com.wease.core.exception.AccessDeniedException("You do not have access to this booking.");
        }

        return booking;
    }

    private BookingResponse toResponse(Booking booking) {
        // Fetch the worker's profession from their profile
        WorkerProfile workerProfile = workerProfileRepository.findByUser(booking.getWorker())
                .orElse(null);

        String profession = workerProfile != null ? workerProfile.getProfession().name() : "GENERAL";

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .customerName(booking.getCustomer().getFullName())
                .workerName(booking.getWorker().getFullName())
                .profession(profession)
                .status(booking.getStatus())
                .estimatedPrice(booking.getEstimatedPrice())
                .build();
    }
}
