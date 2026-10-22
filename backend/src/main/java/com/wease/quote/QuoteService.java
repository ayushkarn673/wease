package com.wease.quote;

import com.wease.booking.Booking;
import com.wease.booking.BookingRepository;
import com.wease.booking.BookingStatus;
import com.wease.booking.QuoteState;
import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

// Quote after inspection: the worker prices the job, the customer approves or declines, and nothing
// chargeable beyond the visiting charge happens without an approved quote.
@Service
@RequiredArgsConstructor
public class QuoteService {

    private static final Set<BookingStatus> QUOTABLE = EnumSet.of(BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS);
    private static final BigDecimal MAX_TOTAL = new BigDecimal("1000000.00");

    private final ServiceQuoteRepository quoteRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<QuoteResponse> getQuotes(Long bookingId, String email) {
        Booking booking = findBooking(bookingId);
        if (!isCustomer(booking, email) && !isWorker(booking, email)) {
            throw new AccessDeniedException("You do not have access to this booking.");
        }
        return quoteRepository.findByBookingOrderByIdDesc(booking).stream().map(QuoteResponse::from).toList();
    }

    @Transactional
    public QuoteResponse submitQuote(Long bookingId, QuoteRequest request, String workerEmail) {
        Booking booking = findBooking(bookingId);
        if (!isWorker(booking, workerEmail)) {
            throw new AccessDeniedException("Only the professional on this booking can send a quote.");
        }
        if (!QUOTABLE.contains(booking.getStatus())) {
            throw new BadRequestException("You can send a quote once you've accepted the job and until it's completed.");
        }

        // Once a quote has been approved, any further quote is extra work on top of it.
        ServiceQuote quote = ServiceQuote.builder()
                .booking(booking)
                .status(QuoteStatus.PENDING)
                .extraWork(booking.getAgreedLabour() != null)
                .note(trim(request.getNote()))
                .build();
        BigDecimal labour = BigDecimal.ZERO;
        BigDecimal materials = BigDecimal.ZERO;
        BigDecimal other = BigDecimal.ZERO;
        for (QuoteItemRequest item : request.getItems()) {
            BigDecimal amount = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            quote.getItems().add(QuoteItem.builder()
                    .quote(quote)
                    .type(item.getType())
                    .description(item.getDescription().trim())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice().setScale(2, RoundingMode.HALF_UP))
                    .amount(amount)
                    .build());
            switch (item.getType()) {
                case LABOUR -> labour = labour.add(amount);
                case MATERIAL -> materials = materials.add(amount);
                case OTHER -> other = other.add(amount);
            }
        }
        BigDecimal total = labour.add(materials).add(other);
        if (total.signum() <= 0) {
            throw new BadRequestException("The quote total must be more than ₹0.");
        }
        if (total.compareTo(MAX_TOTAL) > 0) {
            throw new BadRequestException("The quote total can be at most ₹10,00,000.");
        }
        quote.setLabourTotal(labour);
        quote.setMaterialTotal(materials);
        quote.setOtherTotal(other);
        quote.setTotal(total);

        // Only one quote can be waiting for an answer: a new one replaces the unanswered one.
        quoteRepository.findByBookingAndStatus(booking, QuoteStatus.PENDING)
                .forEach(old -> old.setStatus(QuoteStatus.SUPERSEDED));

        booking.setQuoteState(QuoteState.AWAITING_APPROVAL);
        quoteRepository.save(quote);
        bookingRepository.save(booking);
        return QuoteResponse.from(quote);
    }

    @Transactional
    public QuoteResponse acceptQuote(Long bookingId, Long quoteId, String customerEmail) {
        Booking booking = findBooking(bookingId);
        ServiceQuote quote = findPendingQuoteForCustomer(booking, quoteId, customerEmail);
        if (!QUOTABLE.contains(booking.getStatus())) {
            throw new BadRequestException("This booking can no longer be changed.");
        }

        quote.setStatus(QuoteStatus.ACCEPTED);
        quote.setRespondedAt(LocalDateTime.now());

        // Extra work is added to what was already approved; a first quote sets the agreed amounts.
        boolean extra = Boolean.TRUE.equals(quote.getExtraWork()) && booking.getAgreedLabour() != null;
        booking.setAgreedLabour(addTo(extra ? booking.getAgreedLabour() : null, quote.getLabourTotal()));
        booking.setAgreedMaterials(addTo(extra ? booking.getAgreedMaterials() : null, quote.getMaterialTotal()));
        booking.setAgreedOther(addTo(extra ? booking.getAgreedOther() : null, quote.getOtherTotal()));
        booking.setQuoteState(QuoteState.APPROVED);
        booking.setStatus(BookingStatus.IN_PROGRESS);
        bookingRepository.save(booking);
        return QuoteResponse.from(quote);
    }

    @Transactional
    public QuoteResponse rejectQuote(Long bookingId, Long quoteId, String customerEmail) {
        Booking booking = findBooking(bookingId);
        ServiceQuote quote = findPendingQuoteForCustomer(booking, quoteId, customerEmail);

        quote.setStatus(QuoteStatus.REJECTED);
        quote.setRespondedAt(LocalDateTime.now());
        // Declining extra work leaves the earlier approved quote in place.
        booking.setQuoteState(booking.getAgreedLabour() != null ? QuoteState.APPROVED : QuoteState.DECLINED);
        bookingRepository.save(booking);
        return QuoteResponse.from(quote);
    }

    private ServiceQuote findPendingQuoteForCustomer(Booking booking, Long quoteId, String customerEmail) {
        if (!isCustomer(booking, customerEmail)) {
            throw new AccessDeniedException("Only the customer on this booking can answer a quote.");
        }
        ServiceQuote quote = quoteRepository.findByIdAndBooking(quoteId, booking)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found."));
        if (quote.getStatus() != QuoteStatus.PENDING) {
            throw new BadRequestException("This quote has already been answered or replaced.");
        }
        return quote;
    }

    private Booking findBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private static boolean isCustomer(Booking booking, String email) {
        return booking.getCustomer().getEmail().equals(email);
    }

    private static boolean isWorker(Booking booking, String email) {
        return booking.getWorkerProfile().getUser().getEmail().equals(email);
    }

    private static BigDecimal addTo(BigDecimal current, BigDecimal amount) {
        return current == null ? amount : current.add(amount);
    }

    private static String trim(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}