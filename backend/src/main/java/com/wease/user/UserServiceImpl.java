package com.wease.user;

import com.wease.core.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return map(user);
    }

    @Override
    public UserResponse updateProfile(
            UpdateUserRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return map(user);
    }

    @Override
    public UserResponse updateCity(String city, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setCity(city == null || city.isBlank() ? null : city.trim());
        userRepository.save(user);
        return map(user);
    }

    private UserResponse map(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .emailVerified(Boolean.TRUE.equals(user.getEmailVerified()))
                .city(user.getCity())
                .build();
    }
}
