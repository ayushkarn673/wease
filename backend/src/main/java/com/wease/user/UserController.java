package com.wease.user;

import com.wease.auth.AuthService;
import com.wease.core.MessageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/profile")
    public UserResponse profile(
            Authentication authentication
    ) {

        return userService.getProfile(
                authentication.getName()
        );

    }

    @PutMapping("/profile")
    public UserResponse updateProfile(

            @Valid
            @RequestBody
            UpdateUserRequest request,

            Authentication authentication

    ) {

        return userService.updateProfile(

                request,
                authentication.getName()

        );

    }

    @PutMapping("/city")
    public UserResponse updateCity(@Valid @RequestBody UpdateCityRequest request, Authentication authentication) {
        return userService.updateCity(request.getCity(), authentication.getName());
    }

    @PostMapping("/resend-verification")
    public MessageResponse resendVerification(Authentication authentication) {
        authService.resendVerification(authentication.getName());
        return new MessageResponse("We've sent a new verification link to your email.");
    }

}