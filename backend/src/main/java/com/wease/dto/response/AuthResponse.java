package com.wease.dto.response;

import com.wease.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String fullName;
    private String email;
    private Role role;
}
