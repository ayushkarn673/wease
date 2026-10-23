package com.wease.core.security.jwt;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final UserDetails USER = User.withUsername("someone@example.com").password("x").authorities(List.of()).build();

    // A secret pasted into a hosting dashboard can pick up a space or line break; logins must still work,
    // and tokens must match those signed with the clean secret.
    @Test
    void whitespaceInTheSecretIsIgnored() {
        byte[] key = new byte[64];
        new SecureRandom().nextBytes(key);
        String clean = Base64.getEncoder().encodeToString(key);
        String pasted = clean.substring(0, 40) + " " + clean.substring(40, 64) + "\r\n" + clean.substring(64);

        JwtService withPasted = service(pasted);
        JwtService withClean = service(clean);

        String token = withPasted.generateToken(USER);
        assertThat(withPasted.isTokenValid(token, USER)).isTrue();
        assertThat(withClean.isTokenValid(token, USER)).isTrue();
    }

    private static JwtService service(String secret) {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secret", secret);
        ReflectionTestUtils.setField(service, "jwtExpiration", 60_000L);
        service.initSigningKey();
        return service;
    }
}
