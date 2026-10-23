package com.wease.auth;

import com.wease.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String token;
    private String fullName;
    private String email;
    private Role role;
    private Boolean emailVerified;
    private String city;
    private String phone;
    // True when this request created the account (e.g. send professionals to finish their profile).
    private boolean newAccount;
}
