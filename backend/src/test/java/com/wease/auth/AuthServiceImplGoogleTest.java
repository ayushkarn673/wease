package com.wease.auth;

import com.wease.user.Provider;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

// Signing in with Google proves who owns an email address, so it must not leave an account open to
// someone else who signed up with that address and a password before it was confirmed.
class AuthServiceImplGoogleTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final GoogleTokenVerifier googleTokenVerifier = mock(GoogleTokenVerifier.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(userRepository, passwordEncoder, null,
                mock(com.wease.core.security.jwt.JwtService.class), mock(AuthTokenService.class),
                mock(OtpService.class), googleTokenVerifier);
        when(googleTokenVerifier.verify("token"))
                .thenReturn(new GoogleTokenVerifier.GoogleProfile("owner@gmail.com", "Real Owner"));
        when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));
    }

    @Test
    void unconfirmedPasswordStopsWorkingWhenTheOwnerSignsInWithGoogle() {
        User squatted = account(false, "someone-elses-password");
        when(userRepository.findByEmail("owner@gmail.com")).thenReturn(Optional.of(squatted));

        authService.google(googleRequest());

        assertThat(squatted.getEmailVerified()).isTrue();
        assertThat(passwordEncoder.matches("someone-elses-password", squatted.getPassword())).isFalse();
    }

    @Test
    void confirmedAccountKeepsItsPassword() {
        User owner = account(true, "owners-own-password");
        when(userRepository.findByEmail("owner@gmail.com")).thenReturn(Optional.of(owner));

        authService.google(googleRequest());

        assertThat(passwordEncoder.matches("owners-own-password", owner.getPassword())).isTrue();
    }

    private User account(boolean emailVerified, String password) {
        return User.builder()
                .fullName("Account Holder")
                .email("owner@gmail.com")
                .password(passwordEncoder.encode(password))
                .role(Role.CUSTOMER)
                .provider(Provider.LOCAL)
                .enabled(true)
                .emailVerified(emailVerified)
                .build();
    }

    private static GoogleAuthRequest googleRequest() {
        GoogleAuthRequest request = new GoogleAuthRequest();
        request.setCredential("token");
        return request;
    }
}
