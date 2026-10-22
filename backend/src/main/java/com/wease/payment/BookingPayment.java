package com.wease.payment;

import com.wease.booking.Booking;
import com.wease.booking.PaymentMethod;
import com.wease.core.BaseEntity;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

// One money movement against a booking. Cash is recorded by the worker who collected it; online
// payments will be recorded only after the gateway confirms them on the server.
@Entity
@Table(name = "booking_payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingPayment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_id", nullable = false)
    private User recordedBy;

    // Gateway payment id for online payments.
    @Column(length = 100)
    private String reference;
}