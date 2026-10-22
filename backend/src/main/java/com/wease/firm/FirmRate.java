package com.wease.firm;

import com.wease.worker.Profession;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

// What a firm charges per worker per day for one skill.
@Entity
@Table(name = "firm_rates", uniqueConstraints = @UniqueConstraint(columnNames = {"firm_id", "profession"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FirmRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firm_id", nullable = false)
    private FirmProfile firm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Profession profession;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;
}