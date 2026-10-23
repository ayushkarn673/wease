package com.wease.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

// Notifies the professional's phone/computer about a new booking request, once the booking is saved.
// Runs in the background so the customer's booking doesn't wait for the push services.
@Component
@RequiredArgsConstructor
public class BookingNotifications {

    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("EEE d MMM", Locale.ENGLISH);
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

    private final WebPushService webPushService;

    @Async
    @TransactionalEventListener(fallbackExecution = true)
    public void onBookingRequested(BookingRequestedEvent event) {
        String when = event.date().format(DAY) + ", " + event.time().format(TIME).toLowerCase(Locale.ENGLISH);
        webPushService.sendToUser(event.workerUserId(), new WebPushService.Message(
                "New booking request",
                event.customerName() + " · " + event.serviceLabel() + " · " + when,
                "/booking/" + event.bookingId(),
                "booking-" + event.bookingId()));
    }
}
