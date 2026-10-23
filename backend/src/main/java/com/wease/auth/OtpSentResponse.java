package com.wease.auth;

public record OtpSentResponse(String message, String phone, long expiresInSeconds, long resendInSeconds) {
}