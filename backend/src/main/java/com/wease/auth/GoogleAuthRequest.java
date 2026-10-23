package com.wease.auth;

import com.wease.user.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleAuthRequest {

    // The ID token returned by Google Sign-In.
    @NotBlank(message = "Missing Google sign-in token")
    private String credential;

    // Account type if this creates a new account; defaults to customer.
    private Role role;
}