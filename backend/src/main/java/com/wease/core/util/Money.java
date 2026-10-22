package com.wease.core.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public final class Money {

    private Money() {
    }

    // Indian rupee formatting for messages, e.g. ₹1,50,000.50.
    public static String rupees(BigDecimal amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.of("en", "IN"));
        return format.format(amount);
    }
}