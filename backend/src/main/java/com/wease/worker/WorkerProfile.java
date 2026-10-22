package com.wease.worker;

import com.wease.core.BaseEntity;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "worker_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Profession profession;

    private Integer experience;

    @Column(length = 1000)
    private String bio;

    private Double hourlyRate;

    private String address;

    private Double latitude;

    private Double longitude;

    @Builder.Default
    private Boolean verified = false;

    @Builder.Default
    private Boolean available = true;

    private String profilePhoto;

    // Pricing chosen by the worker. Null means no visiting charge has been set (treated as free).
    @Column(precision = 10, scale = 2)
    private BigDecimal visitingCharge;

    @Enumerated(EnumType.STRING)
    private VisitingChargePolicy visitingChargePolicy;
}
