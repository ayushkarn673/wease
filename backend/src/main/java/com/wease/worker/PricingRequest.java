package com.wease.worker;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PricingRequest {

    @NotNull(message = "Enter your visiting charge (0 for a free visit)")
    @DecimalMin(value = "0.00", message = "Visiting charge can't be negative")
    @DecimalMax(value = "5000.00", message = "Visiting charge can be at most ₹5,000")
    @Digits(integer = 4, fraction = 2, message = "Use rupees with up to 2 decimal places")
    private BigDecimal visitingCharge;

    @NotNull(message = "Choose how the visiting charge is billed")
    private VisitingChargePolicy visitingChargePolicy;
}