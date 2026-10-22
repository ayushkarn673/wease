package com.wease.auth;

import com.wease.core.exception.BadRequestException;
import com.wease.core.mail.EmailService;
import com.wease.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

// Issues and redeems one-time email links (password reset, email verification).
@Service
@RequiredArgsConstructor
public class AuthTokenService {

    private static final Duration RESET_TTL = Duration.ofMinutes(30);
    private static final Duration VERIFY_TTL = Duration.ofHours(24);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final AuthTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public void sendPasswordReset(User user) {
        String token = issue(user, AuthTokenType.PASSWORD_RESET, RESET_TTL);
        String link = frontendUrl + "/reset-password?token=" + token;
        emailService.send(user.getEmail(), "Reset your Wease password",
                "Hi " + user.getFullName() + ",\n\n"
                        + "We received a request to reset your Wease password. Use the link below within 30 minutes:\n\n"
                        + link + "\n\n"
                        + "If you didn't ask for this, you can ignore this email — your password won't change.\n\n— Wease");
    }

    @Transactional
    public void sendEmailVerification(User user) {
        String token = issue(user, AuthTokenType.EMAIL_VERIFICATION, VERIFY_TTL);
        String link = frontendUrl + "/verify-email?token=" + token;
        emailService.send(user.getEmail(), "Confirm your email for Wease",
                "Hi " + user.getFullName() + ",\n\n"
                        + "Please confirm your email address by opening this link (valid for 24 hours):\n\n"
                        + link + "\n\n— Wease");
    }

    // Validates and consumes a token, returning its user. Throws if it is unknown, used or expired.
    @Transactional
    public User redeem(String rawToken, AuthTokenType type) {
        AuthToken token = tokenRepository.findByTokenHashAndType(hash(rawToken), type)
                .filter(AuthToken::isUsable)
                .orElseThrow(() -> new BadRequestException("This link is invalid or has expired. Please request a new one."));
        token.setUsedAt(LocalDateTime.now());
        return token.getUser();
    }

    private String issue(User user, AuthTokenType type, Duration ttl) {
        // Only the newest link of each type stays valid.
        tokenRepository.deleteByUserAndType(user, type);

        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        tokenRepository.save(AuthToken.builder()
                .user(user)
                .type(type)
                .tokenHash(hash(raw))
                .expiresAt(LocalDateTime.now().plus(ttl))
                .build());
        return raw;
    }

    private static String hash(String raw) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
