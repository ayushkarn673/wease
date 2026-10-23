package com.wease.auth;

import com.wease.core.exception.BadRequestException;
import com.wease.core.sms.SmsSender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HexFormat;

// One-time codes for phone login: 6 digits, valid 5 minutes, 5 tries, rate-limited per number.
// Methods here are not transactional on purpose, so a failed attempt is still counted.
@Service
@RequiredArgsConstructor
public class OtpService {

    public static final Duration CODE_TTL = Duration.ofMinutes(5);
    public static final Duration RESEND_AFTER = Duration.ofSeconds(30);
    private static final int MAX_SENDS_PER_HOUR = 5;
    private static final int MAX_ATTEMPTS = 5;

    private final PhoneOtpRepository otpRepository;
    private final SmsSender smsSender;
    private final SecureRandom random = new SecureRandom();

    public void send(String phone) {
        LocalDateTime now = LocalDateTime.now();
        otpRepository.findFirstByPhoneOrderByIdDesc(phone).ifPresent(last -> {
            long wait = RESEND_AFTER.getSeconds() - Duration.between(last.getCreatedAt(), now).getSeconds();
            if (wait > 0) {
                throw new BadRequestException("Please wait " + wait + " seconds before requesting a new code.");
            }
        });
        if (otpRepository.countByPhoneAndCreatedAtAfter(phone, now.minusHours(1)) >= MAX_SENDS_PER_HOUR) {
            throw new BadRequestException("Too many codes requested for this number. Please try again in an hour.");
        }

        // Only the newest code works.
        otpRepository.findByPhoneAndUsedAtIsNull(phone).forEach(old -> {
            old.setUsedAt(now);
            otpRepository.save(old);
        });

        String code = String.format("%06d", random.nextInt(1_000_000));
        otpRepository.save(PhoneOtp.builder()
                .phone(phone)
                .codeHash(hash(phone, code))
                .expiresAt(now.plus(CODE_TTL))
                .build());
        smsSender.sendOtp(phone, code);
    }

    // Returns the matching code (not yet marked used) or throws with a message the user can act on.
    public PhoneOtp check(String phone, String code) {
        PhoneOtp otp = otpRepository.findFirstByPhoneOrderByIdDesc(phone)
                .filter(PhoneOtp::isUsable)
                .orElseThrow(() -> new BadRequestException("This code has expired. Request a new one."));
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Too many wrong attempts. Request a new code.");
        }
        boolean matches = MessageDigest.isEqual(
                otp.getCodeHash().getBytes(StandardCharsets.UTF_8),
                hash(phone, code == null ? "" : code.trim()).getBytes(StandardCharsets.UTF_8));
        if (!matches) {
            otp.setAttempts(otp.getAttempts() + 1);
            otpRepository.save(otp);
            int left = MAX_ATTEMPTS - otp.getAttempts();
            throw new BadRequestException(left > 0
                    ? "Incorrect code. " + left + (left == 1 ? " attempt" : " attempts") + " left."
                    : "Too many wrong attempts. Request a new code.");
        }
        return otp;
    }

    public void markUsed(PhoneOtp otp) {
        otp.setUsedAt(LocalDateTime.now());
        otpRepository.save(otp);
    }

    private static String hash(String phone, String code) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest((phone + ":" + code).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}