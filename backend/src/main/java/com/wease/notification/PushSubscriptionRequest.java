package com.wease.notification;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

// The browser's PushSubscription.toJSON(): { endpoint, keys: { p256dh, auth } }.
@Data
public class PushSubscriptionRequest {

    @NotBlank
    @Size(max = 700)
    private String endpoint;

    @Valid
    @NotNull
    private Keys keys;

    @Data
    public static class Keys {
        @NotBlank
        @Size(max = 200)
        private String p256dh;

        @NotBlank
        @Size(max = 100)
        private String auth;
    }
}
