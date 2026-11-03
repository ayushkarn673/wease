package com.wease.quote;

import com.wease.booking.Booking;
import com.wease.booking.BookingRepository;
import com.wease.booking.BookingStatus;
import com.wease.booking.QuoteState;
import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.worker.WorkerProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Quotes after inspection: the professional prices the job, the customer approves or declines, and
// extra work is added on top of what was already agreed.
@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    private static final String CUSTOMER = "asha@test.local";
    private static final String WORKER = "ramesh@test.local";

    @Mock private ServiceQuoteRepository quoteRepository;
    @Mock private BookingRepository bookingRepository;
    @InjectMocks private QuoteService quoteService;

    private Booking booking;

    @BeforeEach
    void setUp() {
        User customer = User.builder().id(1L).fullName("Asha").email(CUSTOMER).role(Role.CUSTOMER).build();
        User worker = User.builder().id(2L).fullName("Ramesh").email(WORKER).role(Role.WORKER).build();
        booking = Booking.builder().id(5L).customer(customer)
                .workerProfile(WorkerProfile.builder().id(10L).user(worker).build())
                .status(BookingStatus.ACCEPTED).quoteState(QuoteState.NONE).build();
        lenient().when(bookingRepository.findById(5L)).thenReturn(Optional.of(booking));
        lenient().when(quoteRepository.findByBookingAndStatus(booking, QuoteStatus.PENDING)).thenReturn(List.of());
    }

    @Nested
    @DisplayName("Sending a quote")
    class Submit {

        @Test
        @DisplayName("adds up labour, materials and other items and waits for the customer")
        void totals() {
            QuoteResponse quote = quoteService.submitQuote(5L, request(
                    item(QuoteItemType.LABOUR, "Repair 2 switchboards", 2, "225"),
                    item(QuoteItemType.MATERIAL, "Fan regulator", 1, "180"),
                    item(QuoteItemType.OTHER, "Disposal", 1, "20")), WORKER);

            assertThat(quote.labourTotal()).isEqualByComparingTo("450.00");
            assertThat(quote.materialTotal()).isEqualByComparingTo("180.00");
            assertThat(quote.otherTotal()).isEqualByComparingTo("20.00");
            assertThat(quote.total()).isEqualByComparingTo("650.00");
            assertThat(quote.status()).isEqualTo(QuoteStatus.PENDING);
            assertThat(quote.extraWork()).isFalse();
            assertThat(quote.items()).hasSize(3);
            assertThat(booking.getQuoteState()).isEqualTo(QuoteState.AWAITING_APPROVAL);
        }

        @Test
        @DisplayName("only the professional on the booking can send one")
        void onlyTheProfessional() {
            assertThatThrownBy(() -> quoteService.submitQuote(5L, request(item(QuoteItemType.LABOUR, "Work", 1, "100")), CUSTOMER))
                    .isInstanceOf(AccessDeniedException.class);
            assertThatThrownBy(() -> quoteService.submitQuote(5L, request(item(QuoteItemType.LABOUR, "Work", 1, "100")), "stranger@test.local"))
                    .isInstanceOf(AccessDeniedException.class);
            verify(quoteRepository, never()).save(any());
        }

        @Test
        @DisplayName("not before the job is accepted, and not after it's finished")
        void onlyWhileWorking() {
            for (BookingStatus status : List.of(BookingStatus.PENDING, BookingStatus.COMPLETED, BookingStatus.CANCELLED)) {
                booking.setStatus(status);
                assertThatThrownBy(() -> quoteService.submitQuote(5L, request(item(QuoteItemType.LABOUR, "Work", 1, "100")), WORKER))
                        .as(status.name()).isInstanceOf(BadRequestException.class);
            }
            verify(quoteRepository, never()).save(any());
        }

        @Test
        @DisplayName("a ₹0 quote is refused")
        void zeroTotal() {
            assertThatThrownBy(() -> quoteService.submitQuote(5L, request(item(QuoteItemType.LABOUR, "Free check", 1, "0")), WORKER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("more than ₹0");
        }

        @Test
        @DisplayName("a quote over ₹10,00,000 is refused")
        void tooLarge() {
            assertThatThrownBy(() -> quoteService.submitQuote(5L, request(
                    item(QuoteItemType.MATERIAL, "Marble", 100, "100000"),
                    item(QuoteItemType.LABOUR, "Fitting", 1, "1")), WORKER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("at most");
        }

        @Test
        @DisplayName("a new quote replaces one the customer hasn't answered yet")
        void replacesUnansweredQuote() {
            ServiceQuote older = ServiceQuote.builder().id(1L).booking(booking).status(QuoteStatus.PENDING).build();
            when(quoteRepository.findByBookingAndStatus(booking, QuoteStatus.PENDING)).thenReturn(List.of(older));

            quoteService.submitQuote(5L, request(item(QuoteItemType.LABOUR, "Work", 1, "300")), WORKER);

            assertThat(older.getStatus()).isEqualTo(QuoteStatus.SUPERSEDED);
        }

        @Test
        @DisplayName("after a quote was approved, the next one is extra work")
        void extraWorkAfterApproval() {
            booking.setStatus(BookingStatus.IN_PROGRESS);
            booking.setAgreedLabour(new BigDecimal("450"));

            QuoteResponse quote = quoteService.submitQuote(5L, request(item(QuoteItemType.LABOUR, "Loose wiring", 1, "200")), WORKER);

            assertThat(quote.extraWork()).isTrue();
        }
    }

    @Nested
    @DisplayName("The customer's answer")
    class Answer {

        @Test
        @DisplayName("approving a first quote sets the agreed prices and starts the job")
        void approveFirstQuote() {
            ServiceQuote quote = pendingQuote(false, "450", "180", "0");

            quoteService.acceptQuote(5L, 7L, CUSTOMER);

            assertThat(quote.getStatus()).isEqualTo(QuoteStatus.ACCEPTED);
            assertThat(quote.getRespondedAt()).isNotNull();
            assertThat(booking.getAgreedLabour()).isEqualByComparingTo("450");
            assertThat(booking.getAgreedMaterials()).isEqualByComparingTo("180");
            assertThat(booking.getQuoteState()).isEqualTo(QuoteState.APPROVED);
            assertThat(booking.getStatus()).isEqualTo(BookingStatus.IN_PROGRESS);
        }

        @Test
        @DisplayName("approving extra work adds to what was already agreed")
        void approveExtraWorkAddsUp() {
            booking.setStatus(BookingStatus.IN_PROGRESS);
            booking.setAgreedLabour(new BigDecimal("450"));
            booking.setAgreedMaterials(new BigDecimal("180"));
            booking.setAgreedOther(BigDecimal.ZERO);
            pendingQuote(true, "200", "50", "0");

            quoteService.acceptQuote(5L, 7L, CUSTOMER);

            assertThat(booking.getAgreedLabour()).isEqualByComparingTo("650");
            assertThat(booking.getAgreedMaterials()).isEqualByComparingTo("230");
        }

        @Test
        @DisplayName("declining a first quote leaves only the visiting charge")
        void declineFirstQuote() {
            ServiceQuote quote = pendingQuote(false, "450", "0", "0");

            quoteService.rejectQuote(5L, 7L, CUSTOMER);

            assertThat(quote.getStatus()).isEqualTo(QuoteStatus.REJECTED);
            assertThat(booking.getQuoteState()).isEqualTo(QuoteState.DECLINED);
            assertThat(booking.getAgreedLabour()).isNull();
        }

        @Test
        @DisplayName("declining extra work keeps the earlier approved quote")
        void declineExtraWork() {
            booking.setAgreedLabour(new BigDecimal("450"));
            pendingQuote(true, "200", "0", "0");

            quoteService.rejectQuote(5L, 7L, CUSTOMER);

            assertThat(booking.getQuoteState()).isEqualTo(QuoteState.APPROVED);
            assertThat(booking.getAgreedLabour()).isEqualByComparingTo("450");
        }

        @Test
        @DisplayName("only the customer on the booking can answer")
        void onlyTheCustomer() {
            assertThatThrownBy(() -> quoteService.acceptQuote(5L, 7L, WORKER)).isInstanceOf(AccessDeniedException.class);
            assertThatThrownBy(() -> quoteService.rejectQuote(5L, 7L, "stranger@test.local")).isInstanceOf(AccessDeniedException.class);
        }

        @Test
        @DisplayName("a quote can only be answered once")
        void answeredOnce() {
            ServiceQuote quote = pendingQuote(false, "450", "0", "0");
            quote.setStatus(QuoteStatus.ACCEPTED);

            assertThatThrownBy(() -> quoteService.acceptQuote(5L, 7L, CUSTOMER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("already been answered");
        }

        @Test
        @DisplayName("only the customer and professional can see the quotes")
        void quotesArePrivate() {
            when(quoteRepository.findByBookingOrderByIdDesc(booking)).thenReturn(List.of());

            assertThat(quoteService.getQuotes(5L, CUSTOMER)).isEmpty();
            assertThat(quoteService.getQuotes(5L, WORKER)).isEmpty();
            assertThatThrownBy(() -> quoteService.getQuotes(5L, "stranger@test.local")).isInstanceOf(AccessDeniedException.class);
        }

        private ServiceQuote pendingQuote(boolean extraWork, String labour, String materials, String other) {
            ServiceQuote quote = ServiceQuote.builder().id(7L).booking(booking).status(QuoteStatus.PENDING).extraWork(extraWork)
                    .labourTotal(new BigDecimal(labour)).materialTotal(new BigDecimal(materials)).otherTotal(new BigDecimal(other))
                    .total(new BigDecimal(labour).add(new BigDecimal(materials)).add(new BigDecimal(other))).build();
            lenient().when(quoteRepository.findByIdAndBooking(7L, booking)).thenReturn(Optional.of(quote));
            return quote;
        }
    }

    // --- helpers

    private static QuoteRequest request(QuoteItemRequest... items) {
        QuoteRequest request = new QuoteRequest();
        request.setItems(List.of(items));
        request.setNote("  Can start today  ");
        return request;
    }

    private static QuoteItemRequest item(QuoteItemType type, String description, int quantity, String unitPrice) {
        QuoteItemRequest item = new QuoteItemRequest();
        item.setType(type);
        item.setDescription(description);
        item.setQuantity(quantity);
        item.setUnitPrice(new BigDecimal(unitPrice));
        return item;
    }
}
