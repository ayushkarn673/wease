package com.wease.booking;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.notification.BookingRequestedEvent;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import com.wease.worker.Profession;
import com.wease.worker.VisitingChargePolicy;
import com.wease.worker.WorkerProfile;
import com.wease.worker.WorkerProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Booking rules: who can book, the 10 km service area, times, double bookings, and status changes.
@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    // Alambagh, Lucknow: the professional's base, and a customer about 1 km away.
    private static final double BASE_LAT = 26.8146, BASE_LNG = 80.9022;
    private static final double NEAR_LAT = 26.8180, NEAR_LNG = 80.8990;

    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private WorkerProfileRepository workerProfileRepository;
    @Mock private BookingMapper bookingMapper;
    @Mock private ApplicationEventPublisher events;

    private BookingServiceImpl service;
    private User customer;
    private User workerUser;
    private WorkerProfile worker;

    @BeforeEach
    void setUp() {
        service = new BookingServiceImpl(bookingRepository, userRepository, workerProfileRepository, bookingMapper,
                new BillCalculator(new BigDecimal("5")), events);
        customer = User.builder().id(1L).fullName("Asha Verma").email("asha@test.local").role(Role.CUSTOMER).build();
        workerUser = User.builder().id(2L).fullName("Ramesh Kumar").email("ramesh@test.local").role(Role.WORKER).build();
        worker = WorkerProfile.builder().id(10L).user(workerUser).profession(Profession.ELECTRICIAN).available(true)
                .latitude(BASE_LAT).longitude(BASE_LNG)
                .visitingCharge(new BigDecimal("150")).visitingChargePolicy(VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL).build();
        lenient().when(userRepository.findByEmail("asha@test.local")).thenReturn(Optional.of(customer));
        lenient().when(userRepository.findByEmail("ramesh@test.local")).thenReturn(Optional.of(workerUser));
        lenient().when(workerProfileRepository.findById(10L)).thenReturn(Optional.of(worker));
        lenient().when(workerProfileRepository.findByUser(workerUser)).thenReturn(Optional.of(worker));
    }

    @Nested
    @DisplayName("Creating a booking")
    class Create {

        @Test
        @DisplayName("saves a pending cash booking with the professional's current visiting terms and notifies them")
        void createsPendingBooking() {
            service.createBooking(request(NEAR_LAT, NEAR_LNG, LocalDate.now().plusDays(2)), "asha@test.local");

            ArgumentCaptor<Booking> saved = ArgumentCaptor.forClass(Booking.class);
            verify(bookingRepository).save(saved.capture());
            Booking booking = saved.getValue();
            assertThat(booking.getStatus()).isEqualTo(BookingStatus.PENDING);
            assertThat(booking.getPaymentMethod()).isEqualTo(PaymentMethod.CASH);
            assertThat(booking.getVisitingCharge()).isEqualByComparingTo("150");
            assertThat(booking.getVisitingChargePolicy()).isEqualTo(VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL);
            assertThat(booking.getQuoteState()).isEqualTo(QuoteState.NONE);

            ArgumentCaptor<BookingRequestedEvent> event = ArgumentCaptor.forClass(BookingRequestedEvent.class);
            verify(events).publishEvent(event.capture());
            assertThat(event.getValue().workerUserId()).isEqualTo(2L);
            assertThat(event.getValue().customerName()).isEqualTo("Asha Verma");
            assertThat(event.getValue().serviceLabel()).isEqualTo("Electrician");
        }

        @Test
        @DisplayName("only customers can book")
        void onlyCustomers() {
            assertThatThrownBy(() -> service.createBooking(request(NEAR_LAT, NEAR_LNG, LocalDate.now().plusDays(1)), "ramesh@test.local"))
                    .isInstanceOf(AccessDeniedException.class);
            verifyNothingSaved();
        }

        @Test
        @DisplayName("a professional who isn't taking bookings can't be booked")
        void unavailableProfessional() {
            worker.setAvailable(false);

            assertThatThrownBy(() -> service.createBooking(request(NEAR_LAT, NEAR_LNG, LocalDate.now().plusDays(1)), "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("unavailable");
            verifyNothingSaved();
        }

        @Test
        @DisplayName("an address more than 10 km away is refused, with the distance")
        void outsideServiceArea() {
            // Charbagh → Gomti Nagar is roughly 12–13 km from Alambagh
            assertThatThrownBy(() -> service.createBooking(request(26.8570, 81.0120, LocalDate.now().plusDays(1)), "asha@test.local"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("km from Ramesh Kumar's base");
            verifyNothingSaved();
        }

        @Test
        @DisplayName("a booking needs a map pin")
        void needsLocation() {
            assertThatThrownBy(() -> service.createBooking(request(null, null, LocalDate.now().plusDays(1)), "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("Choose a location");
        }

        @Test
        @DisplayName("can't book a date in the past")
        void pastDate() {
            assertThatThrownBy(() -> service.createBooking(request(NEAR_LAT, NEAR_LNG, LocalDate.now().minusDays(1)), "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("future");
            verifyNothingSaved();
        }

        @Test
        @DisplayName("can't book a slot the professional has already accepted")
        void slotTaken() {
            when(bookingRepository.existsByWorkerProfileAndBookingDateAndBookingTimeAndStatusInAndIdNot(
                    eq(worker), any(), any(), anySet(), eq(0L))).thenReturn(true);

            assertThatThrownBy(() -> service.createBooking(request(NEAR_LAT, NEAR_LNG, LocalDate.now().plusDays(1)), "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("already booked");
            verifyNothingSaved();
        }

        @Test
        @DisplayName("the same customer can't request the same slot twice")
        void duplicateRequest() {
            when(bookingRepository.existsByCustomerAndWorkerProfileAndBookingDateAndBookingTimeAndStatusIn(
                    eq(customer), eq(worker), any(), any(), anySet())).thenReturn(true);

            assertThatThrownBy(() -> service.createBooking(request(NEAR_LAT, NEAR_LNG, LocalDate.now().plusDays(1)), "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("already requested");
            verifyNothingSaved();
        }

        @Test
        @DisplayName("online payment isn't offered yet")
        void noOnlinePayment() {
            BookingRequest request = request(NEAR_LAT, NEAR_LNG, LocalDate.now().plusDays(1));
            request.setPaymentMethod(PaymentMethod.ONLINE);

            assertThatThrownBy(() -> service.createBooking(request, "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("Online payment");
            verifyNothingSaved();
        }
    }

    @Nested
    @DisplayName("The professional's answer")
    class Respond {

        @Test
        @DisplayName("accepting a pending request confirms it")
        void accept() {
            Booking booking = existing(BookingStatus.PENDING, QuoteState.NONE);

            service.acceptBooking(5L, "ramesh@test.local");

            assertThat(booking.getStatus()).isEqualTo(BookingStatus.ACCEPTED);
            verify(bookingRepository).save(booking);
        }

        @Test
        @DisplayName("can't accept two jobs at the same date and time")
        void acceptClash() {
            existing(BookingStatus.PENDING, QuoteState.NONE);
            when(bookingRepository.existsByWorkerProfileAndBookingDateAndBookingTimeAndStatusInAndIdNot(
                    eq(worker), any(), any(), anySet(), eq(5L))).thenReturn(true);

            assertThatThrownBy(() -> service.acceptBooking(5L, "ramesh@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("already have a job");
        }

        @Test
        @DisplayName("only pending requests can be accepted or declined")
        void onlyPending() {
            existing(BookingStatus.CANCELLED, QuoteState.NONE);

            assertThatThrownBy(() -> service.acceptBooking(5L, "ramesh@test.local")).isInstanceOf(BadRequestException.class);
            assertThatThrownBy(() -> service.rejectBooking(5L, "ramesh@test.local")).isInstanceOf(BadRequestException.class);
        }

        @Test
        @DisplayName("completing a job fixes the bill from the approved quote and records the commission")
        void completeWithApprovedQuote() {
            Booking booking = existing(BookingStatus.IN_PROGRESS, QuoteState.APPROVED);
            booking.setAgreedLabour(new BigDecimal("450"));
            booking.setAgreedMaterials(new BigDecimal("180"));

            service.completeBooking(5L, "ramesh@test.local");

            assertThat(booking.getStatus()).isEqualTo(BookingStatus.COMPLETED);
            assertThat(booking.getFinalPrice()).isEqualTo(630.0);
            assertThat(booking.getPlatformCommission()).isEqualByComparingTo("22.50"); // 5% of ₹450 labour
            assertThat(booking.getPaymentStatus()).isEqualTo(PaymentStatus.UNPAID);
        }

        @Test
        @DisplayName("can't complete while the customer still has a quote to answer")
        void completeWithPendingQuote() {
            existing(BookingStatus.ACCEPTED, QuoteState.AWAITING_APPROVAL);

            assertThatThrownBy(() -> service.completeBooking(5L, "ramesh@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("hasn't answered");
        }

        @Test
        @DisplayName("can't complete a job that was never accepted")
        void completeNotAccepted() {
            existing(BookingStatus.PENDING, QuoteState.NONE);

            assertThatThrownBy(() -> service.completeBooking(5L, "ramesh@test.local")).isInstanceOf(BadRequestException.class);
        }
    }

    @Nested
    @DisplayName("Cancelling and viewing")
    class CancelAndView {

        @Test
        @DisplayName("the customer can cancel before the professional has quoted")
        void cancelBeforeQuote() {
            Booking booking = booking(BookingStatus.ACCEPTED, QuoteState.NONE);
            when(bookingRepository.findByIdAndCustomer(5L, customer)).thenReturn(Optional.of(booking));

            service.cancelBooking(5L, "asha@test.local");

            assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        }

        @Test
        @DisplayName("after a quote, the customer declines the quote instead of cancelling")
        void noCancelAfterQuote() {
            Booking booking = booking(BookingStatus.ACCEPTED, QuoteState.AWAITING_APPROVAL);
            when(bookingRepository.findByIdAndCustomer(5L, customer)).thenReturn(Optional.of(booking));

            assertThatThrownBy(() -> service.cancelBooking(5L, "asha@test.local"))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("Decline the quote");
            assertThat(booking.getStatus()).isEqualTo(BookingStatus.ACCEPTED);
        }

        @Test
        @DisplayName("only the customer and the professional can see a booking")
        void privacy() {
            when(bookingRepository.findById(5L)).thenReturn(Optional.of(booking(BookingStatus.PENDING, QuoteState.NONE)));

            service.getBookingDetails(5L, "asha@test.local");
            service.getBookingDetails(5L, "ramesh@test.local");
            assertThatThrownBy(() -> service.getBookingDetails(5L, "someone.else@test.local"))
                    .isInstanceOf(AccessDeniedException.class);
        }
    }

    // --- helpers

    private BookingRequest request(Double lat, Double lng, LocalDate date) {
        BookingRequest request = new BookingRequest();
        request.setWorkerProfileId(10L);
        request.setBookingDate(date);
        request.setBookingTime(LocalTime.of(11, 0));
        request.setServiceAddress("House 12, Chandar Nagar, Alambagh, Lucknow");
        request.setServiceLatitude(lat);
        request.setServiceLongitude(lng);
        request.setDescription("Fan regulator sparking");
        return request;
    }

    private Booking booking(BookingStatus status, QuoteState quoteState) {
        return Booking.builder().id(5L).customer(customer).workerProfile(worker).status(status).quoteState(quoteState)
                .bookingDate(LocalDate.now().plusDays(1)).bookingTime(LocalTime.of(11, 0))
                .visitingCharge(new BigDecimal("150")).visitingChargePolicy(VisitingChargePolicy.ADJUST_AGAINST_FINAL_BILL)
                .paymentStatus(PaymentStatus.UNPAID).amountPaid(BigDecimal.ZERO).build();
    }

    // A booking the professional can find among their own.
    private Booking existing(BookingStatus status, QuoteState quoteState) {
        Booking booking = booking(status, quoteState);
        when(bookingRepository.findByIdAndWorkerProfile(5L, worker)).thenReturn(Optional.of(booking));
        return booking;
    }

    private void verifyNothingSaved() {
        verify(bookingRepository, never()).save(any());
        verify(events, never()).publishEvent(any());
    }
}
