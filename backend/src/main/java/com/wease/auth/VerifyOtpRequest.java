package com.wease.auth;

import com.wease.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VerifyOtpRequest {

    @NotBlank(message = "Enter your mobile number")
    private String phone;

    @NotBlank(message = "Enter the 6-digit code")
    @Pattern(regexp = "\\d{6}", message = "Enter the 6-digit code")
    private String code;

    // Only needed when creating a new account.
    @Size(max = 100, message = "Name is too long")
    private String fullName;

    // Account type for a new account; defaults to customer.
    private Role role;
}