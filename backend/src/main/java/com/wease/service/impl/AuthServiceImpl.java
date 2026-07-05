package com.wease.service.impl;

import com.wease.dto.request.LoginRequest;
import com.wease.dto.request.RegisterRequest;
import com.wease.dto.response.AuthResponse;
import com.wease.entity.Provider;
import com.wease.entity.User;
import com.wease.repository.UserRepository;
import com.wease.security.jwt.JwtService;
import com.wease.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .provider(Provider.LOCAL)
                .enabled(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .token(null)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
