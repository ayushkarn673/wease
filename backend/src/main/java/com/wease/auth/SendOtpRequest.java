package com.wease.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequest {

    @NotBlank(message = "Enter your mobile number")
    private String phone;
}