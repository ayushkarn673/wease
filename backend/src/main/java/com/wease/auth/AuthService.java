package com.wease.auth;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void verifyEmail(VerifyEmailRequest request);

    void resendVerification(String email);

    OtpSentResponse sendOtp(SendOtpRequest request);

    AuthResponse verifyOtp(VerifyOtpRequest request);

    AuthResponse google(GoogleAuthRequest request);
}
