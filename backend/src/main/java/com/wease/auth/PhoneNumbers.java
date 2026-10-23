package com.wease.auth;

import com.wease.core.exception.BadRequestException;

// Indian mobile numbers in one canonical form: +91 followed by 10 digits starting 6-9.
public final class PhoneNumbers {

    // Phone-only accounts get an internal placeholder email (".invalid" can never receive mail).
    public static final String PLACEHOLDER_EMAIL_DOMAIN = "@phone.wease.invalid";

    private PhoneNumbers() {
    }

    public static String normalize(String raw) {
        String digits = raw == null ? "" : raw.replaceAll("[\\s()-]", "");
        if (digits.startsWith("+91")) digits = digits.substring(3);
        else if (digits.startsWith("91") && digits.length() == 12) digits = digits.substring(2);
        else if (digits.startsWith("0") && digits.length() == 11) digits = digits.substring(1);
        if (!digits.matches("[6-9]\\d{9}")) {
            throw new BadRequestException("Enter a valid 10-digit Indian mobile number.");
        }
        return "+91" + digits;
    }

    public static String placeholderEmail(String normalizedPhone) {
        return "p" + normalizedPhone.substring(1) + PLACEHOLDER_EMAIL_DOMAIN;
    }

    public static boolean isPlaceholderEmail(String email) {
        return email != null && email.endsWith(PLACEHOLDER_EMAIL_DOMAIN);
    }

    // "+91 ••••• •3210" for messages, so the number isn't echoed in full.
    public static String mask(String normalizedPhone) {
        return "+91 ••••• •" + normalizedPhone.substring(normalizedPhone.length() - 4);
    }
}