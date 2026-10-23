package com.wease.notification;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
public class PushController {

    private final WebPushService webPushService;

    // Public: the browser needs it before it can subscribe.
    @GetMapping("/public-key")
    public ResponseEntity<Map<String, String>> publicKey() {
        String key = webPushService.publicKey();
        return key == null ? ResponseEntity.status(503).build() : ResponseEntity.ok(Map.of("publicKey", key));
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<Void> subscribe(@Valid @RequestBody PushSubscriptionRequest request, Authentication authentication) {
        webPushService.subscribe(authentication.getName(), request.getEndpoint(), request.getKeys().getP256dh(), request.getKeys().getAuth());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/subscriptions")
    public ResponseEntity<Void> unsubscribe(@RequestBody Map<String, String> body, Authentication authentication) {
        String endpoint = body.get("endpoint");
        if (endpoint != null) {
            webPushService.unsubscribe(authentication.getName(), endpoint);
        }
        return ResponseEntity.noContent().build();
    }
}
