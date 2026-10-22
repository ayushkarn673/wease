package com.wease.auth;

import com.wease.user.Provider;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.core.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthTokenService authTokenService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (request.getRole() == Role.ADMIN) {
            throw new AccessDeniedException(
                    "Admin accounts cannot be created through public registration."
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email already registered."
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .provider(Provider.LOCAL)
                .enabled(true)
                .emailVerified(false)
                .build();

        userRepository.save(user);
        authTokenService.sendEmailVerification(user);

        return toAuthResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(
                request.getEmail()
        ).orElseThrow();

        return toAuthResponse(user);
    }

    // Always succeeds from the caller's point of view, so the endpoint can't be used to discover accounts.
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail().trim())
                .filter(user -> user.getProvider() == null || user.getProvider() == Provider.LOCAL)
                .ifPresent(authTokenService::sendPasswordReset);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = authTokenService.redeem(request.getToken(), AuthTokenType.PASSWORD_RESET);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        // Receiving the reset email proves the user controls this address.
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        User user = authTokenService.redeem(request.getToken(), AuthTokenType.EMAIL_VERIFICATION);
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    @Override
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new BadRequestException("Your email is already verified.");
        }
        authTokenService.sendEmailVerification(user);
    }

    private AuthResponse toAuthResponse(User user) {
        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .emailVerified(Boolean.TRUE.equals(user.getEmailVerified()))
                .city(user.getCity())
                .build();
    }
}
