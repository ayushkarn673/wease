package com.wease.quote;

import com.wease.booking.Booking;
import com.wease.core.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// A worker's itemised price for the repair, sent after inspecting the job. The customer must accept it
// before chargeable work starts. Old quotes are kept as history.
@Entity
@Table(name = "service_quotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceQuote extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal labourTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal materialTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal otherTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    // True for extra work sent after a quote was already approved: its amounts are added to the
    // approved ones instead of replacing them.
    private Boolean extraWork;

    @Column(length = 500)
    private String note;

    private LocalDateTime respondedAt;

    @Builder.Default
    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QuoteItem> items = new ArrayList<>();
}