package com.wease.service.impl;

import com.wease.dto.request.BookingRequest;
import com.wease.dto.response.BookingResponse;
import com.wease.entity.*;
import com.wease.repository.BookingRepository;
import com.wease.repository.UserRepository;
import com.wease.repository.WorkerProfileRepository;
import com.wease.service.BookingService;
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

        WorkerProfile worker = workerProfileRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));

        Booking booking = Booking.builder()
                .customer(customer)
                .worker(worker)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .status(BookingStatus.PENDING)
                .price(request.getPrice())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Override
    public BookingResponse updateBookingStatus(Long id, BookingStatus newStatus, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        boolean isCustomer = booking.getCustomer().getId().equals(actor.getId());
        boolean isWorker = booking.getWorker().getUser().getId().equals(actor.getId());

        if (!isCustomer && !isWorker) {
            throw new com.wease.exception.AccessDeniedException("You do not have access to this booking.");
        }

        BookingStatus currentStatus = booking.getStatus();

        if (isCustomer) {
            // Customer can only cancel pending or accepted bookings
            if (newStatus == BookingStatus.CANCELLED) {
                if (currentStatus != BookingStatus.PENDING && currentStatus != BookingStatus.ACCEPTED) {
                    throw new RuntimeException("Cannot cancel booking from status: " + currentStatus);
                }
            } else {
                throw new com.wease.exception.AccessDeniedException("Customers can only cancel bookings.");
            }
        }

        if (isWorker) {
            // Worker actions
            if (currentStatus == BookingStatus.PENDING) {
                if (newStatus != BookingStatus.ACCEPTED && newStatus != BookingStatus.REJECTED) {
                    throw new RuntimeException("Worker can only accept or reject a pending booking.");
                }
            } else if (currentStatus == BookingStatus.ACCEPTED) {
                if (newStatus != BookingStatus.ONGOING && newStatus != BookingStatus.CANCELLED) {
                    throw new RuntimeException("Worker can only start (ongoing) or cancel an accepted booking.");
                }
            } else if (currentStatus == BookingStatus.ONGOING) {
                if (newStatus != BookingStatus.COMPLETED) {
                    throw new RuntimeException("Worker can only complete an ongoing booking.");
                }
            } else {
                throw new RuntimeException("No state transitions allowed from: " + currentStatus);
            }
        }

        booking.setStatus(newStatus);
        bookingRepository.save(booking);

        return toResponse(booking);
    }

    @Override
    public List<BookingResponse> getCustomerBookings(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        return bookingRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getWorkerBookings(String workerEmail) {
        User user = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        WorkerProfile worker = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));

        return bookingRepository.findByWorkerOrderByCreatedAtDesc(worker).stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .customerName(booking.getCustomer().getFullName())
                .customerEmail(booking.getCustomer().getEmail())
                .workerId(booking.getWorker().getId())
                .workerName(booking.getWorker().getUser().getFullName())
                .workerProfession(booking.getWorker().getProfession().name())
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .price(booking.getPrice())
                .address(booking.getAddress())
                .latitude(booking.getLatitude())
                .longitude(booking.getLongitude())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
