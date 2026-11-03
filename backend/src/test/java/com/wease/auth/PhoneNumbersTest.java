package com.wease.auth;

import com.wease.core.exception.BadRequestException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PhoneNumbersTest {

    @ParameterizedTest(name = "\"{0}\" → +919876543210")
    @ValueSource(strings = {"9876543210", "+919876543210", "919876543210", "09876543210", "98765 43210", "+91 98765-43210", "(987) 654 3210"})
    @DisplayName("The usual ways of writing an Indian mobile number all become +91XXXXXXXXXX")
    void normalizesCommonFormats(String raw) {
        assertThat(PhoneNumbers.normalize(raw)).isEqualTo("+919876543210");
    }

    @ParameterizedTest(name = "\"{0}\" is rejected")
    @NullAndEmptySource
    @ValueSource(strings = {"12345", "5876543210", "98765432101", "+449876543210", "abcdefghij", "0098765432"})
    @DisplayName("Landlines, short, long, foreign or non-numeric numbers are rejected")
    void rejectsInvalidNumbers(String raw) {
        assertThatThrownBy(() -> PhoneNumbers.normalize(raw))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("10-digit");
    }

    @Test
    @DisplayName("Phone-only accounts get an internal email that can never receive mail")
    void placeholderEmail() {
        String email = PhoneNumbers.placeholderEmail("+919876543210");

        assertThat(email).isEqualTo("p919876543210@phone.wease.invalid");
        assertThat(PhoneNumbers.isPlaceholderEmail(email)).isTrue();
        assertThat(PhoneNumbers.isPlaceholderEmail("someone@gmail.com")).isFalse();
        assertThat(PhoneNumbers.isPlaceholderEmail(null)).isFalse();
    }

    @Test
    @DisplayName("Masked number shows only the last four digits")
    void mask() {
        assertThat(PhoneNumbers.mask("+919876543210")).isEqualTo("+91 ••••• •3210").doesNotContain("98765");
    }
}
