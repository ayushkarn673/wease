package com.wease.auth;

import com.wease.core.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// A one-time login code sent to a phone. Only a hash of the code is stored.
@Entity
@Table(name = "phone_otps", indexes = @Index(name = "idx_phone_otps_phone", columnList = "phone"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhoneOtp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 64)
    private String codeHash;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Builder.Default
    @Column(nullable = false)
    private Integer attempts = 0;

    private LocalDateTime usedAt;

    public boolean isUsable() {
        return usedAt == null && LocalDateTime.now().isBefore(expiresAt);
    }
}