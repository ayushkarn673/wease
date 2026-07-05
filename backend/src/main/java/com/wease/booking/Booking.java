package com.wease.booking;

import com.wease.core.BaseEntity;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

// Entity representing a service booking request between customer and worker
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

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private User worker;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDate bookingDate;

    private LocalTime bookingTime;

    private String serviceAddress;

    @Column(length = 1000)
    private String description;

    private Double estimatedPrice;
}
