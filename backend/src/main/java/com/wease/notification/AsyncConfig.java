package com.wease.notification;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

// Lets notifications be sent in the background (see BookingNotifications).
@Configuration
@EnableAsync
public class AsyncConfig {
}
