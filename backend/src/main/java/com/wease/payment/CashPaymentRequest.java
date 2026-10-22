package com.wease.payment;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CashPaymentRequest {

    @NotNull(message = "Enter the amount you collected")
    @DecimalMin(value = "1.00", message = "Amount must be at least ₹1")
    @DecimalMax(value = "1000000.00", message = "Amount is too large")
    @Digits(integer = 7, fraction = 2, message = "Use rupees with up to 2 decimal places")
    private BigDecimal amount;
}