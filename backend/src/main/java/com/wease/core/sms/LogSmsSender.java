package com.wease.core.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

// Development fallback until an SMS provider is configured: the code is written to the server log.
// Never use this in production — anyone with log access could read login codes.
@Slf4j
@Component
@ConditionalOnProperty(name = "app.sms.provider", havingValue = "log", matchIfMissing = true)
public class LogSmsSender implements SmsSender {

    @Override
    public void sendOtp(String phone, String code) {
        log.warn("SMS provider not configured — OTP for {} is {} (valid 5 minutes)", phone, code);
    }
}