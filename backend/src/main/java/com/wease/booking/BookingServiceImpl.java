package com.wease.booking;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.core.util.Geo;
import com.wease.notification.BookingRequestedEvent;
import com.wease.user.User;
import com.wease.user.Role;
import com.wease.user.UserRepository;
import com.wease.worker.VisitingChargePolicy;
import com.wease.worker.WorkerProfile;
import com.wease.worker.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    // A worker is committed to a slot once they have accepted it.
    private static final Set<BookingStatus> COMMITTED = EnumSet.of(BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS);
    // A customer's request is still open while pending or committed.
    private static final Set<BookingStatus> OPEN = EnumSet.of(
            BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final BookingMapper bookingMapper;
    private final BillCalculator billCalculator;
    private final ApplicationEventPublisher events;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("Only customers can create bookings.");
        }

        WorkerProfile workerProfile = workerProfileRepository.findById(request.getWorkerProfileId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        if (!workerProfile.getAvailable()) {
            throw new BadRequestException("Worker is currently unavailable.");
        }

        // The service location must be inside the professional's 10 km area (when they've set one).
        Geo.requireInIndia(request.getServiceLatitude(), request.getServiceLongitude());
        if (workerProfile.getLatitude() != null && workerProfile.getLongitude() != null) {
            double km = Geo.distanceKm(request.getServiceLatitude(), request.getServiceLongitude(),
                    workerProfile.getLatitude(), workerProfile.getLongitude());
            if (km > Geo.SERVICE_RADIUS_KM) {
                throw new BadRequestException(String.format(
                        "This address is %.1f km from %s's base. They serve within %.0f km — please choose someone nearer.",
                        km, workerProfile.getUser().getFullName(), Geo.SERVICE_RADIUS_KM));
            }
        }

        LocalDate today = LocalDate.now();
        if (request.getBookingDate().isBefore(today)
                || (request.getBookingDate().isEqual(today) && request.getBookingTime().isBefore(LocalTime.now()))) {
            throw new BadRequestException("Booking date and time must be in the future.");
        }

        if (bookingRepository.existsByWorkerProfileAndBookingDateAndBookingTimeAndStatusInAndIdNot(
                workerProfile, request.getBookingDate(), request.getBookingTime(), COMMITTED, 0L)) {
            throw new BadRequestException("This professional is already booked at that time. Please choose another time.");
        }

        if (bookingRepository.existsByCustomerAndWorkerProfileAndBookingDateAndBookingTimeAndStatusIn(
                customer, workerProfile, request.getBookingDate(), request.getBookingTime(), OPEN)) {
            throw new BadRequestException("You have already requested this professional for that time.");
        }

        PaymentMethod paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH;
        if (paymentMethod == PaymentMethod.ONLINE) {
            throw new BadRequestException("Online payment isn't available yet. Please choose cash.");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .workerProfile(workerProfile)
                .status(BookingStatus.PENDING)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .serviceAddress(request.getServiceAddress())
                .serviceLatitude(request.getServiceLatitude())
                .serviceLongitude(request.getServiceLongitude())
                .description(request.getDescription())
                // The only price known upfront is the visiting charge; repair work is quoted after inspection.
                .estimatedPrice(workerProfile.getVisitingCharge() != null ? workerProfile.getVisitingCharge().doubleValue() : 0.0)
                // Copy of the worker's current terms; later pricing changes don't affect this booking.
                .visitingCharge(workerProfile.getVisitingCharge() != null ? workerProfile.getVisitingCharge() : BigDecimal.ZERO)
                .visitingChargePolicy(workerProfile.getVisitingChargePolicy() != null
                        ? workerProfile.getVisitingChargePolicy() : VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL)
                .quoteState(QuoteState.NONE)
                .paymentMethod(paymentMethod)
                .paymentStatus(PaymentStatus.UNPAID)
                .amountPaid(BigDecimal.ZERO)
                .build();

        bookingRepository.save(booking);
        // Notifies the professional once this booking is committed.
        events.publishEvent(new BookingRequestedEvent(booking.getId(), workerProfile.getUser().getId(),
                customer.getFullName(), workerProfile.getProfession().label(),
                booking.getBookingDate(), booking.getBookingTime()));
        return bookingMapper.toResponse(booking);
    }

    @Override
    public List<BookingResponse> getCustomerBookings(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return bookingRepository.findByCustomer(customer).stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getWorkerBookings(String workerEmail) {
        return bookingRepository.findByWorkerProfile(findWorkerProfile(workerEmail))
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public BookingResponse acceptBooking(Long bookingId, String workerEmail) {
        Booking booking = findWorkerBooking(bookingId, workerEmail);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be accepted.");
        }

        if (bookingRepository.existsByWorkerProfileAndBookingDateAndBookingTimeAndStatusInAndIdNot(
                booking.getWorkerProfile(), booking.getBookingDate(), booking.getBookingTime(), COMMITTED, booking.getId())) {
            throw new BadRequestException("You already have a job at this date and time.");
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse rejectBooking(Long bookingId, String workerEmail) {
        Booking booking = findWorkerBooking(bookingId, workerEmail);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be declined.");
        }

        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(Long bookingId, String workerEmail) {
        Booking booking = findWorkerBooking(bookingId, workerEmail);

        if (!COMMITTED.contains(booking.getStatus())) {
            throw new BadRequestException("Only accepted jobs can be marked as completed.");
        }
        if (booking.getQuoteState() == QuoteState.AWAITING_APPROVAL) {
            throw new BadRequestException("The customer hasn't answered your latest quote yet.");
        }

        // The price is whatever was agreed: the approved quote, or just the visiting charge if there
        // isn't one. The worker can't type in a different amount at this point.
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setPlatformCommission(billCalculator.commissionOn(booking.getAgreedLabour()));
        BookingBill bill = billCalculator.calculate(booking);
        booking.setFinalPrice(bill.total().doubleValue());
        if (bill.balanceDue().signum() == 0) {
            booking.setPaymentStatus(PaymentStatus.PAID);
        }
        bookingRepository.save(booking);

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Booking booking = bookingRepository.findByIdAndCustomer(bookingId, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new BadRequestException("This booking can no longer be cancelled.");
        }
        // Once the worker has inspected and quoted, the visit has happened: the customer declines the
        // quote instead, and the visiting charge applies as agreed.
        if (booking.getQuoteState() != null && booking.getQuoteState() != QuoteState.NONE) {
            throw new BadRequestException("The professional has already inspected the job. Decline the quote instead of cancelling.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return bookingMapper.toResponse(booking);
    }

    @Override
    public BookingResponse getBookingDetails(Long bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        boolean isCustomer = booking.getCustomer().getEmail().equals(email);
        boolean isWorker = booking.getWorkerProfile().getUser().getEmail().equals(email);

        if (!isCustomer && !isWorker) {
            throw new AccessDeniedException("You do not have access to view this booking.");
        }

        return bookingMapper.toResponse(booking);
    }

    private WorkerProfile findWorkerProfile(String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        return workerProfileRepository.findByUser(worker)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found"));
    }

    private Booking findWorkerBooking(Long bookingId, String workerEmail) {
        return bookingRepository.findByIdAndWorkerProfile(bookingId, findWorkerProfile(workerEmail))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

}
