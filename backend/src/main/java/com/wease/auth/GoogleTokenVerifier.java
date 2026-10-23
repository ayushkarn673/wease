package com.wease.auth;

import com.wease.core.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import java.util.Set;

// Checks a Google Sign-In ID token: Google's signature, issuer, expiry, that it was issued for this app
// (audience = our client ID) and that Google has verified the email address.
@Component
public class GoogleTokenVerifier {

    private static final String GOOGLE_KEYS = "https://www.googleapis.com/oauth2/v3/certs";
    private static final Set<String> ISSUERS = Set.of("accounts.google.com", "https://accounts.google.com");

    private final JwtDecoder decoder;

    public GoogleTokenVerifier(@Value("${app.google.client-id:}") String clientId) {
        if (clientId == null || clientId.isBlank()) {
            this.decoder = null;
            return;
        }
        NimbusJwtDecoder nimbus = NimbusJwtDecoder.withJwkSetUri(GOOGLE_KEYS).build();
        OAuth2TokenValidator<Jwt> issuer = jwt -> ISSUERS.contains(jwt.getClaimAsString("iss"))
                ? OAuth2TokenValidatorResult.success()
                : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Wrong issuer", null));
        OAuth2TokenValidator<Jwt> audience = jwt -> jwt.getAudience() != null && jwt.getAudience().contains(clientId)
                ? OAuth2TokenValidatorResult.success()
                : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Wrong audience", null));
        nimbus.setJwtValidator(new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(), issuer, audience));
        this.decoder = nimbus;
    }

    public record GoogleProfile(String email, String name) {
    }

    public GoogleProfile verify(String idToken) {
        if (decoder == null) {
            throw new BadRequestException("Google sign-in isn't set up on this server yet.");
        }
        Jwt jwt;
        try {
            jwt = decoder.decode(idToken);
        } catch (JwtException e) {
            throw new BadRequestException("Google sign-in failed. Please try again.");
        }
        Object verified = jwt.getClaims().get("email_verified");
        String email = jwt.getClaimAsString("email");
        if (email == null || !(Boolean.TRUE.equals(verified) || "true".equals(String.valueOf(verified)))) {
            throw new BadRequestException("Your Google account's email isn't verified.");
        }
        String name = jwt.getClaimAsString("name");
        return new GoogleProfile(email.toLowerCase(), name == null || name.isBlank() ? email.split("@")[0] : name);
    }
}