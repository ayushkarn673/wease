package com.wease.auth;

import com.wease.user.Provider;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.core.exception.NewAccountRequiredException;
import com.wease.core.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthTokenService authTokenService;
    private final OtpService otpService;
    private final GoogleTokenVerifier googleTokenVerifier;

    // New accounts must be verified with Google or a phone code. Email + password sign-up can be switched
    // back on (e.g. for automated tests) with PASSWORD_SIGNUP_ENABLED=true.
    @Value("${app.auth.password-signup-enabled:true}")
    private boolean passwordSignupEnabled;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (!passwordSignupEnabled) {
            throw new BadRequestException("Sign up with Google or your phone number.");
        }

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

        return toAuthResponse(user, true);
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

    @Override
    public OtpSentResponse sendOtp(SendOtpRequest request) {
        String phone = PhoneNumbers.normalize(request.getPhone());
        otpService.send(phone);
        return new OtpSentResponse("We've sent a 6-digit code to " + PhoneNumbers.mask(phone) + ".",
                PhoneNumbers.mask(phone), OtpService.CODE_TTL.getSeconds(), OtpService.RESEND_AFTER.getSeconds());
    }

    // Logs in the owner of a verified number, or creates their account (name + type) on first use.
    // Not one transaction: a wrong code must still be counted even though this throws.
    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String phone = PhoneNumbers.normalize(request.getPhone());
        PhoneOtp otp = otpService.check(phone, request.getCode());

        User existing = userRepository.findFirstByPhoneAndPhoneVerifiedTrue(phone).orElse(null);
        if (existing != null) {
            requireEnabled(existing);
            otpService.markUsed(otp);
            return toAuthResponse(existing, false);
        }

        String name = request.getFullName() == null ? "" : request.getFullName().trim();
        if (name.isEmpty()) {
            // The code stays valid so the client can ask for a name and send it again.
            throw new NewAccountRequiredException("No account uses this number yet. Add your name to create one.");
        }

        String email = PhoneNumbers.placeholderEmail(phone);
        if (userRepository.existsByEmail(email)) {
            throw new ResourceAlreadyExistsException("An account for this number already exists.");
        }
        User user = userRepository.save(User.builder()
                .fullName(name)
                .email(email)
                .password(unusablePassword())
                .phone(phone)
                .phoneVerified(true)
                .role(newAccountRole(request.getRole()))
                .provider(Provider.LOCAL)
                .enabled(true)
                .emailVerified(false)
                .build());
        otpService.markUsed(otp);
        return toAuthResponse(user, true);
    }

    @Override
    @Transactional
    public AuthResponse google(GoogleAuthRequest request) {
        GoogleTokenVerifier.GoogleProfile profile = googleTokenVerifier.verify(request.getCredential());

        User existing = userRepository.findByEmail(profile.email()).orElse(null);
        if (existing != null) {
            requireEnabled(existing);
            // Google has confirmed this address belongs to the person signing in. A password set before the
            // address was confirmed may belong to someone else who signed up with it, so it stops working
            // (the owner can set a new one with "Forgot password").
            if (!Boolean.TRUE.equals(existing.getEmailVerified())) {
                existing.setEmailVerified(true);
                existing.setPassword(unusablePassword());
                userRepository.save(existing);
            }
            return toAuthResponse(existing, false);
        }

        User user = userRepository.save(User.builder()
                .fullName(profile.name())
                .email(profile.email())
                .password(unusablePassword())
                .role(newAccountRole(request.getRole()))
                .provider(Provider.GOOGLE)
                .enabled(true)
                .emailVerified(true)
                .build());
        return toAuthResponse(user, true);
    }

    private static Role newAccountRole(Role requested) {
        if (requested == Role.ADMIN) {
            throw new AccessDeniedException("Admin accounts cannot be created through public registration.");
        }
        return requested != null ? requested : Role.CUSTOMER;
    }

    private static void requireEnabled(User user) {
        if (Boolean.FALSE.equals(user.getEnabled())) {
            throw new AccessDeniedException("This account has been disabled.");
        }
    }

    // Google and phone accounts have no password; store a random hash nobody knows.
    private String unusablePassword() {
        return passwordEncoder.encode(UUID.randomUUID() + ":" + UUID.randomUUID());
    }

    private AuthResponse toAuthResponse(User user) {
        return toAuthResponse(user, false);
    }

    private AuthResponse toAuthResponse(User user, boolean newAccount) {
        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .emailVerified(Boolean.TRUE.equals(user.getEmailVerified()))
                .city(user.getCity())
                .phone(user.getPhone())
                .newAccount(newAccount)
                .build();
    }
}
