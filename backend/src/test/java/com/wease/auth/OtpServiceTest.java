package com.wease.auth;

import com.wease.core.exception.BadRequestException;
import com.wease.core.sms.SmsSender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Phone login codes: rate limits, only-the-newest-code-works, wrong attempts, expiry and lockout.
@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    private static final String PHONE = "+919876543210";

    @Mock
    private PhoneOtpRepository repository;

    @Mock
    private SmsSender smsSender;

    @InjectMocks
    private OtpService otpService;

    @BeforeEach
    void savedCodesAreReturned() {
        org.mockito.Mockito.lenient().when(repository.save(any(PhoneOtp.class))).thenAnswer(call -> call.getArgument(0));
    }

    @Test
    @DisplayName("Sending a code stores only its hash and texts the 6-digit code")
    void sendStoresHashAndTextsCode() {
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.empty());
        when(repository.countByPhoneAndCreatedAtAfter(eq(PHONE), any())).thenReturn(0L);
        when(repository.findByPhoneAndUsedAtIsNull(PHONE)).thenReturn(List.of());

        otpService.send(PHONE);

        ArgumentCaptor<String> code = ArgumentCaptor.forClass(String.class);
        verify(smsSender).sendOtp(eq(PHONE), code.capture());
        assertThat(code.getValue()).matches("\\d{6}");

        ArgumentCaptor<PhoneOtp> saved = ArgumentCaptor.forClass(PhoneOtp.class);
        verify(repository).save(saved.capture());
        assertThat(saved.getValue().getCodeHash()).hasSize(64).doesNotContain(code.getValue());
        assertThat(saved.getValue().getExpiresAt()).isBetween(LocalDateTime.now().plusMinutes(4), LocalDateTime.now().plusMinutes(6));
    }

    @Test
    @DisplayName("A new code can't be requested within 30 seconds of the last one")
    void resendCooldown() {
        PhoneOtp recent = otp("000000", LocalDateTime.now().plusMinutes(5));
        recent.setCreatedAt(LocalDateTime.now().minusSeconds(10));
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(recent));

        assertThatThrownBy(() -> otpService.send(PHONE))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Please wait");
        verify(smsSender, never()).sendOtp(anyString(), anyString());
    }

    @Test
    @DisplayName("At most 5 codes per number per hour")
    void hourlyLimit() {
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.empty());
        when(repository.countByPhoneAndCreatedAtAfter(eq(PHONE), any())).thenReturn(5L);

        assertThatThrownBy(() -> otpService.send(PHONE))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Too many codes");
        verify(smsSender, never()).sendOtp(anyString(), anyString());
    }

    @Test
    @DisplayName("Sending a new code cancels the older unused ones")
    void newCodeCancelsOldOnes() {
        PhoneOtp older = otp("111111", LocalDateTime.now().plusMinutes(3));
        older.setCreatedAt(LocalDateTime.now().minusMinutes(2));
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(older));
        when(repository.countByPhoneAndCreatedAtAfter(eq(PHONE), any())).thenReturn(1L);
        when(repository.findByPhoneAndUsedAtIsNull(PHONE)).thenReturn(List.of(older));

        otpService.send(PHONE);

        assertThat(older.getUsedAt()).isNotNull();
        verify(repository, times(2)).save(any(PhoneOtp.class)); // the cancelled code and the new one
    }

    @Test
    @DisplayName("The right code is accepted")
    void rightCodeAccepted() {
        PhoneOtp sent = sendAndCapture();
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(sent));

        assertThat(otpService.check(PHONE, lastCode)).isSameAs(sent);
        assertThat(otpService.check(PHONE, " " + lastCode + " ")).isSameAs(sent); // spaces from pasting are ignored
    }

    @Test
    @DisplayName("A wrong code is counted and says how many tries are left")
    void wrongCodeCounted() {
        PhoneOtp sent = sendAndCapture();
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(sent));
        String wrong = lastCode.equals("000000") ? "111111" : "000000";

        assertThatThrownBy(() -> otpService.check(PHONE, wrong)).hasMessage("Incorrect code. 4 attempts left.");
        assertThat(sent.getAttempts()).isEqualTo(1);
    }

    @Test
    @DisplayName("After 5 wrong tries even the right code is refused")
    void lockoutAfterFiveWrongTries() {
        PhoneOtp sent = sendAndCapture();
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(sent));
        String wrong = lastCode.equals("000000") ? "111111" : "000000";

        for (int i = 0; i < 4; i++) {
            assertThatThrownBy(() -> otpService.check(PHONE, wrong)).hasMessageContaining("attempt");
        }
        assertThatThrownBy(() -> otpService.check(PHONE, wrong)).hasMessageContaining("Too many wrong attempts");
        assertThatThrownBy(() -> otpService.check(PHONE, lastCode)).hasMessageContaining("Too many wrong attempts");
    }

    @Test
    @DisplayName("Expired and already-used codes are refused")
    void expiredOrUsedCodesRefused() {
        PhoneOtp expired = otp("123456", LocalDateTime.now().minusSeconds(1));
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(expired));
        assertThatThrownBy(() -> otpService.check(PHONE, "123456")).hasMessageContaining("expired");

        PhoneOtp used = otp("123456", LocalDateTime.now().plusMinutes(5));
        otpService.markUsed(used);
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.of(used));
        assertThatThrownBy(() -> otpService.check(PHONE, "123456")).hasMessageContaining("expired");
    }

    @Test
    @DisplayName("No code was ever sent to this number")
    void noCodeSent() {
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> otpService.check(PHONE, "123456")).isInstanceOf(BadRequestException.class);
    }

    // --- helpers

    private String lastCode;

    // Sends a code through the real service and returns what it stored, keeping the texted code.
    private PhoneOtp sendAndCapture() {
        when(repository.findFirstByPhoneOrderByIdDesc(PHONE)).thenReturn(Optional.empty());
        when(repository.countByPhoneAndCreatedAtAfter(eq(PHONE), any())).thenReturn(0L);
        when(repository.findByPhoneAndUsedAtIsNull(PHONE)).thenReturn(List.of());
        otpService.send(PHONE);

        ArgumentCaptor<String> code = ArgumentCaptor.forClass(String.class);
        verify(smsSender).sendOtp(eq(PHONE), code.capture());
        lastCode = code.getValue();
        ArgumentCaptor<PhoneOtp> saved = ArgumentCaptor.forClass(PhoneOtp.class);
        verify(repository).save(saved.capture());
        return saved.getValue();
    }

    // A stored code whose hash we don't know; only expiry and use matter for these checks.
    private static PhoneOtp otp(String code, LocalDateTime expiresAt) {
        return PhoneOtp.builder().phone(PHONE).codeHash("x".repeat(64)).expiresAt(expiresAt).build();
    }
}
