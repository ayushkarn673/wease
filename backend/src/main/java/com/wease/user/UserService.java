package com.wease.user;

public interface UserService {

    UserResponse getProfile(String email);

    UserResponse updateProfile(
            UpdateUserRequest request,
            String email
    );
}
