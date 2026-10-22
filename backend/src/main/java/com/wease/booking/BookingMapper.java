package com.wease.booking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

// Single place that turns a Booking into its API shape, including the price breakdown.
@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final BillCalculator billCalculator;

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getId())
                .customerName(booking.getCustomer().getFullName())
                .workerName(booking.getWorkerProfile().getUser().getFullName())
                .workerProfileId(booking.getWorkerProfile().getId())
                .profession(booking.getWorkerProfile().getProfession().name())
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .serviceAddress(booking.getServiceAddress())
                .serviceLatitude(booking.getServiceLatitude())
                .serviceLongitude(booking.getServiceLongitude())
                .estimatedPrice(booking.getEstimatedPrice())
                .status(booking.getStatus())
                .finalPrice(booking.getFinalPrice())
                .description(booking.getDescription())
                .quoteState(booking.getQuoteState())
                .paymentMethod(booking.getPaymentMethod())
                .paymentStatus(booking.getPaymentStatus())
                .bill(billCalculator.calculate(booking))
                .customerRating(booking.getCustomerRating())
                .build();
    }
}