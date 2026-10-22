package com.wease.auth;

import com.wease.core.BaseEntity;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// One-time link token for password reset or email verification.
// Only a SHA-256 hash of the token is stored; the raw value exists only in the email link.
@Entity
@Table(name = "auth_tokens", indexes = @Index(name = "idx_auth_token_hash", columnList = "tokenHash", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthTokenType type;

    @Column(nullable = false, length = 64)
    private String tokenHash;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime usedAt;

    public boolean isUsable() {
        return usedAt == null && expiresAt.isAfter(LocalDateTime.now());
    }
}
