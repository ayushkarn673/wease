package com.wease.notification;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

// The server posts to subscription URLs that browsers hand it, so only real push services are accepted.
class WebPushServiceTest {

    @Test
    void acceptsTheBrowsersPushServices() {
        assertThat(WebPushService.isPushServiceUrl("https://fcm.googleapis.com/fcm/send/abc:123")).isTrue();
        assertThat(WebPushService.isPushServiceUrl("https://updates.push.services.mozilla.com/wpush/v2/abc")).isTrue();
        assertThat(WebPushService.isPushServiceUrl("https://web.push.apple.com/QGz1")).isTrue();
        assertThat(WebPushService.isPushServiceUrl("https://wns2-par02p.notify.windows.com/w/?token=abc")).isTrue();
    }

    @Test
    void rejectsAnythingElse() {
        assertThat(WebPushService.isPushServiceUrl("http://fcm.googleapis.com/fcm/send/abc")).isFalse();
        assertThat(WebPushService.isPushServiceUrl("https://169.254.169.254/latest/meta-data")).isFalse();
        assertThat(WebPushService.isPushServiceUrl("https://localhost:8080/api/admin")).isFalse();
        assertThat(WebPushService.isPushServiceUrl("https://evilfcm.googleapis.com.example.com/x")).isFalse();
        assertThat(WebPushService.isPushServiceUrl("https://notpush.apple.com.evil.io/x")).isFalse();
        assertThat(WebPushService.isPushServiceUrl("not a url")).isFalse();
    }
}
