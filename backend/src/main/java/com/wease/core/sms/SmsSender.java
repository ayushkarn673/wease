package com.wease.core.sms;

// Sends one-time login codes by SMS. Swap the implementation to use a real provider (MSG91, Twilio, ...).
public interface SmsSender {

    void sendOtp(String phone, String code);
}