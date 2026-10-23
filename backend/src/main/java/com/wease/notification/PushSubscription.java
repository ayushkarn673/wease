package com.wease.notification;

import com.wease.core.BaseEntity;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

// One browser or phone that agreed to receive notifications for a user. A user can have several.
@Entity
@Table(name = "push_subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushSubscription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The push service URL for this browser (Google, Mozilla, Apple or Microsoft).
    @Column(nullable = false, unique = true, length = 700)
    private String endpoint;

    // The browser's encryption keys for this subscription.
    @Column(nullable = false, length = 200)
    private String p256dh;

    @Column(nullable = false, length = 100)
    private String auth;
}
