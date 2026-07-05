package com.wease.service;

import com.wease.dto.request.LoginRequest;
import com.wease.dto.request.RegisterRequest;
import com.wease.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}
