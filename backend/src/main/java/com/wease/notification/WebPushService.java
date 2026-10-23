package com.wease.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.user.User;
import com.wease.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Encoding;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Security;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;

// Sends Web Push notifications: they reach a phone or computer even when Wease isn't open.
// Sending never throws; a failed notification is logged and must not break the action that caused it.
@Slf4j
@Service
@RequiredArgsConstructor
public class WebPushService {

    // Only the browsers' own push services are accepted, so the server never posts to arbitrary URLs.
    private static final List<String> PUSH_HOSTS = List.of(
            "fcm.googleapis.com", "push.services.mozilla.com", "push.apple.com", "notify.windows.com");

    private final PushSubscriptionRepository subscriptionRepository;
    private final PushKeysRepository keysRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.push.public-key:}")
    private String configuredPublicKey;

    @Value("${app.push.private-key:}")
    private String configuredPrivateKey;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private PushService pushService;
    private String publicKey;

    public record Message(String title, String body, String url, String tag) {
    }

    @PostConstruct
    void init() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        try {
            PushKeys keys = configuredPublicKey.isBlank() || configuredPrivateKey.isBlank()
                    ? keysRepository.findById(PushKeys.ID).orElseGet(() -> keysRepository.save(generateKeys()))
                    : new PushKeys(PushKeys.ID, configuredPublicKey.trim(), configuredPrivateKey.trim());
            // Apple requires a contact: the site address in production, an email address otherwise.
            String subject = frontendUrl.startsWith("https://") ? frontendUrl : "mailto:support@wease.app";
            pushService = new PushService(keys.getPublicKey(), keys.getPrivateKey(), subject);
            publicKey = keys.getPublicKey();
        } catch (Exception e) {
            log.error("Web Push is disabled: the notification keys could not be loaded", e);
        }
    }

    // The key browsers need to subscribe; null when push is unavailable.
    public String publicKey() {
        return publicKey;
    }

    public void subscribe(String email, String endpoint, String p256dh, String auth) {
        User user = findUser(email);
        if (!isPushServiceUrl(endpoint)) {
            throw new BadRequestException("This browser's notification service isn't supported.");
        }
        // The same browser may be handed to someone else: the subscription follows whoever signed in last.
        PushSubscription subscription = subscriptionRepository.findByEndpoint(endpoint)
                .orElseGet(() -> PushSubscription.builder().endpoint(endpoint).build());
        subscription.setUser(user);
        subscription.setP256dh(p256dh);
        subscription.setAuth(auth);
        subscriptionRepository.save(subscription);
    }

    public void unsubscribe(String email, String endpoint) {
        User user = findUser(email);
        subscriptionRepository.findByEndpoint(endpoint)
                .filter(s -> s.getUser().getId().equals(user.getId()))
                .ifPresent(subscriptionRepository::delete);
    }

    public void sendToUser(Long userId, Message message) {
        if (pushService == null) {
            return;
        }
        String payload;
        try {
            payload = objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            log.warn("Couldn't build a push notification", e);
            return;
        }
        for (PushSubscription subscription : subscriptionRepository.findByUserId(userId)) {
            try {
                Notification notification = new Notification(
                        subscription.getEndpoint(), subscription.getP256dh(), subscription.getAuth(), payload);
                HttpResponse response = pushService.sendAsync(notification, Encoding.AES128GCM).get(15, TimeUnit.SECONDS);
                int status = response.getStatusLine().getStatusCode();
                if (status == 404 || status == 410) {
                    // The browser unsubscribed or the subscription expired.
                    subscriptionRepository.delete(subscription);
                } else if (status >= 300) {
                    log.warn("Push service answered {} for subscription {}", status, subscription.getId());
                }
            } catch (Exception e) {
                log.warn("Couldn't send a push notification to subscription {}: {}", subscription.getId(), e.toString());
            }
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    static boolean isPushServiceUrl(String endpoint) {
        try {
            URI uri = URI.create(endpoint);
            String host = uri.getHost();
            return "https".equals(uri.getScheme()) && host != null
                    && PUSH_HOSTS.stream().anyMatch(h -> host.equals(h) || host.endsWith("." + h));
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private static PushKeys generateKeys() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("ECDH", BouncyCastleProvider.PROVIDER_NAME);
            generator.initialize(ECNamedCurveTable.getParameterSpec(Utils.CURVE));
            KeyPair pair = generator.generateKeyPair();
            Base64.Encoder base64 = Base64.getUrlEncoder().withoutPadding();
            return new PushKeys(PushKeys.ID,
                    base64.encodeToString(Utils.encode((ECPublicKey) pair.getPublic())),
                    base64.encodeToString(Utils.encode((ECPrivateKey) pair.getPrivate())));
        } catch (Exception e) {
            throw new IllegalStateException("Couldn't create Web Push keys", e);
        }
    }
}
