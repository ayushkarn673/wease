package com.wease.review;

import com.wease.core.BaseEntity;
import com.wease.crew.CrewRequest;
import com.wease.firm.FirmProfile;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

// A customer's rating of a labour firm for one completed crew request (one review per request).
@Entity
@Table(name = "firm_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FirmReview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crew_request_id", nullable = false, unique = true)
    private CrewRequest crewRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firm_id", nullable = false)
    private FirmProfile firm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 1000)
    private String comment;
}