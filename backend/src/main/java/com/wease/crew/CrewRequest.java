package com.wease.crew;

import com.wease.core.BaseEntity;
import com.wease.firm.FirmProfile;
import com.wease.user.User;
import com.wease.worker.Profession;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

// A customer asking a labour firm for a crew: N workers of one skill for N days.
@Entity
@Table(name = "crew_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrewRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firm_id", nullable = false)
    private FirmProfile firm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Profession profession;

    @Column(nullable = false)
    private Integer workers;

    @Column(nullable = false)
    private Integer days;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalTime reportingTime;

    @Column(nullable = false)
    private String siteAddress;

    // Must be one of the firm's covered cities (null for requests made before coverage existed).
    @Column(length = 60)
    private String siteCity;

    @Column(length = 1000)
    private String description;

    // The firm's rate when the request was made, so later rate changes don't alter it.
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedTotal;

    // Filled in on completion; can only be equal to or lower than the planned worker-days.
    private Integer actualWorkerDays;

    @Column(precision = 12, scale = 2)
    private BigDecimal finalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CrewStatus status;

    // The star rating the customer gave the firm for this request (null until rated).
    private Integer customerRating;
}