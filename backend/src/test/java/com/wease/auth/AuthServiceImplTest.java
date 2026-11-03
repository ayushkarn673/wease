package com.wease.auth;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.NewAccountRequiredException;
import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.security.jwt.JwtService;
import com.wease.user.Provider;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Sign-up and login rules: email + password, and phone number + one-time code.
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    private static final String PHONE = "+919876543210";

    @Mock private UserRepository userRepository;
    @Mock private JwtService jwtService;
    @Mock private AuthTokenService authTokenService;
    @Mock private OtpService otpService;
    @Mock private GoogleTokenVerifier googleTokenVerifier;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(userRepository, passwordEncoder, null, jwtService, authTokenService, otpService, googleTokenVerifier);
        ReflectionTestUtils.setField(authService, "passwordSignupEnabled", true);
        lenient().when(jwtService.generateToken(any())).thenReturn("signed-token");
        lenient().when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));
    }

    @Nested
    @DisplayName("Sign up with email and password")
    class Register {

        @Test
        @DisplayName("creates a local account with a hashed password and sends the confirmation email")
        void createsAccount() {
            AuthResponse response = authService.register(request("Asha Verma", "asha@example.com", "secret123", Role.CUSTOMER));

            ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(saved.capture());
            User user = saved.getValue();
            assertThat(user.getProvider()).isEqualTo(Provider.LOCAL);
            assertThat(user.getEmailVerified()).isFalse();
            assertThat(user.getPassword()).isNotEqualTo("secret123");
            assertThat(passwordEncoder.matches("secret123", user.getPassword())).isTrue();
            verify(authTokenService).sendEmailVerification(user);

            assertThat(response.getToken()).isEqualTo("signed-token");
            assertThat(response.isNewAccount()).isTrue();
            assertThat(response.getRole()).isEqualTo(Role.CUSTOMER);
        }

        @Test
        @DisplayName("is refused when email sign-up is switched off")
        void refusedWhenSwitchedOff() {
            ReflectionTestUtils.setField(authService, "passwordSignupEnabled", false);

            assertThatThrownBy(() -> authService.register(request("Asha", "asha@example.com", "secret123", Role.CUSTOMER)))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Google or your phone");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("can't create an admin account")
        void noAdminSignup() {
            assertThatThrownBy(() -> authService.register(request("Mallory", "m@example.com", "secret123", Role.ADMIN)))
                    .isInstanceOf(AccessDeniedException.class);
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("can't reuse an email that's already registered")
        void duplicateEmail() {
            when(userRepository.existsByEmail("asha@example.com")).thenReturn(true);

            assertThatThrownBy(() -> authService.register(request("Asha", "asha@example.com", "secret123", Role.CUSTOMER)))
                    .isInstanceOf(ResourceAlreadyExistsException.class);
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Phone number + one-time code")
    class PhoneLogin {

        private final PhoneOtp validCode = PhoneOtp.builder()
                .phone(PHONE).codeHash("h".repeat(64)).expiresAt(LocalDateTime.now().plusMinutes(5)).build();

        @Test
        @DisplayName("sending a code normalises the number and shows it masked")
        void sendCode() {
            SendOtpRequest request = new SendOtpRequest();
            request.setPhone("098765 43210");

            OtpSentResponse response = authService.sendOtp(request);

            verify(otpService).send(PHONE);
            assertThat(response.phone()).isEqualTo("+91 ••••• •3210");
            assertThat(response.message()).doesNotContain("98765");
            assertThat(response.expiresInSeconds()).isEqualTo(300);
        }

        @Test
        @DisplayName("logs in the owner of a verified number and uses up the code")
        void existingNumberLogsIn() {
            User owner = user("Ravi", Role.WORKER);
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.of(owner));

            AuthResponse response = authService.verifyOtp(otpRequest("9876543210", "123456", null, null));

            assertThat(response.isNewAccount()).isFalse();
            assertThat(response.getFullName()).isEqualTo("Ravi");
            assertThat(response.getRole()).isEqualTo(Role.WORKER);
            verify(otpService).markUsed(validCode);
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("the code is used up only after the login token was created")
        void codeUsedOnlyAfterSuccess() {
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.of(user("Ravi", Role.CUSTOMER)));

            authService.verifyOtp(otpRequest(PHONE, "123456", null, null));

            InOrder order = inOrder(jwtService, otpService);
            order.verify(jwtService).generateToken(any());
            order.verify(otpService).markUsed(validCode);
        }

        @Test
        @DisplayName("if the login fails on the server, the code stays valid for another try")
        void failedLoginKeepsCode() {
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.of(user("Ravi", Role.CUSTOMER)));
            when(jwtService.generateToken(any())).thenThrow(new IllegalStateException("signing key broken"));

            assertThatThrownBy(() -> authService.verifyOtp(otpRequest(PHONE, "123456", null, null)))
                    .isInstanceOf(IllegalStateException.class);
            verify(otpService, never()).markUsed(any());
        }

        @Test
        @DisplayName("a disabled account can't log in")
        void disabledAccount() {
            User blocked = user("Ravi", Role.CUSTOMER);
            blocked.setEnabled(false);
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.of(blocked));

            assertThatThrownBy(() -> authService.verifyOtp(otpRequest(PHONE, "123456", null, null)))
                    .isInstanceOf(AccessDeniedException.class);
            verify(otpService, never()).markUsed(any());
        }

        @Test
        @DisplayName("a new number without a name asks for one and keeps the code valid")
        void newNumberNeedsName() {
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.verifyOtp(otpRequest(PHONE, "123456", "   ", null)))
                    .isInstanceOf(NewAccountRequiredException.class);
            verify(otpService, never()).markUsed(any());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("a new number with a name creates a phone-only account")
        void newNumberCreatesAccount() {
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.empty());

            AuthResponse response = authService.verifyOtp(otpRequest(PHONE, "123456", "  Neha Sharma ", Role.FIRM));

            ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(saved.capture());
            User user = saved.getValue();
            assertThat(user.getFullName()).isEqualTo("Neha Sharma");
            assertThat(user.getEmail()).isEqualTo("p919876543210@phone.wease.invalid");
            assertThat(user.getPhone()).isEqualTo(PHONE);
            assertThat(user.getPhoneVerified()).isTrue();
            assertThat(user.getRole()).isEqualTo(Role.FIRM);
            assertThat(user.getPassword()).isNotBlank();
            assertThat(response.isNewAccount()).isTrue();
            verify(otpService).markUsed(validCode);
        }

        @Test
        @DisplayName("a new phone account is a customer unless another type is chosen")
        void defaultRoleIsCustomer() {
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.empty());

            assertThat(authService.verifyOtp(otpRequest(PHONE, "123456", "Neha", null)).getRole()).isEqualTo(Role.CUSTOMER);
        }

        @Test
        @DisplayName("can't create an admin account by phone")
        void noAdminByPhone() {
            when(otpService.check(PHONE, "123456")).thenReturn(validCode);
            when(userRepository.findFirstByPhoneAndPhoneVerifiedTrue(PHONE)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.verifyOtp(otpRequest(PHONE, "123456", "Mallory", Role.ADMIN)))
                    .isInstanceOf(AccessDeniedException.class);
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("a wrong code stops everything before any account is looked up")
        void wrongCode() {
            when(otpService.check(PHONE, "000000")).thenThrow(new BadRequestException("Incorrect code. 4 attempts left."));

            assertThatThrownBy(() -> authService.verifyOtp(otpRequest(PHONE, "000000", "Neha", null)))
                    .hasMessageContaining("Incorrect code");
            verify(userRepository, never()).findFirstByPhoneAndPhoneVerifiedTrue(anyString());
            verify(userRepository, never()).save(any());
        }
    }

    // --- helpers

    private static RegisterRequest request(String name, String email, String password, Role role) {
        RegisterRequest request = new RegisterRequest();
        request.setFullName(name);
        request.setEmail(email);
        request.setPassword(password);
        request.setRole(role);
        return request;
    }

    private static VerifyOtpRequest otpRequest(String phone, String code, String name, Role role) {
        VerifyOtpRequest request = new VerifyOtpRequest();
        request.setPhone(phone);
        request.setCode(code);
        request.setFullName(name);
        request.setRole(role);
        return request;
    }

    private static User user(String name, Role role) {
        return User.builder().fullName(name).email(name.toLowerCase() + "@example.com").password("x")
                .phone(PHONE).phoneVerified(true).role(role).enabled(true).emailVerified(false).build();
    }
}
