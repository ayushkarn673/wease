package com.wease.booking;

import com.wease.core.BaseEntity;
import com.wease.user.User;
import com.wease.worker.VisitingChargePolicy;
import com.wease.worker.WorkerProfile;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer who booked
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Worker profile being booked
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_profile_id", nullable = false)
    private WorkerProfile workerProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime bookingTime;

    @Column(nullable = false)
    private String serviceAddress;

    // Pin for the service address (null for bookings made before maps were added).
    private Double serviceLatitude;

    private Double serviceLongitude;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double estimatedPrice;

    private Double finalPrice;

    // Terms agreed when the booking was made. A copy, so later changes to the worker's pricing don't
    // change bookings that already exist.
    @Column(precision = 10, scale = 2)
    private BigDecimal visitingCharge;

    @Enumerated(EnumType.STRING)
    private VisitingChargePolicy visitingChargePolicy;

    // The amounts from the quote the customer approved (null until one is approved).
    @Column(precision = 10, scale = 2)
    private BigDecimal agreedLabour;

    @Column(precision = 10, scale = 2)
    private BigDecimal agreedMaterials;

    @Column(precision = 10, scale = 2)
    private BigDecimal agreedOther;

    @Enumerated(EnumType.STRING)
    private QuoteState quoteState;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(precision = 10, scale = 2)
    private BigDecimal amountPaid;

    // The star rating the customer gave for this booking (null until they rate it).
    private Integer customerRating;

    // Wease's commission, fixed when the job is completed.
    @Column(precision = 10, scale = 2)
    private BigDecimal platformCommission;
}