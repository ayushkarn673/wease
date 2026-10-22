package com.wease.firm;

import com.wease.worker.Profession;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FirmRateRequest {

    @NotNull(message = "Choose a skill")
    private Profession profession;

    @NotNull(message = "Enter a daily rate")
    @DecimalMin(value = "100.00", message = "Daily rate must be at least ₹100 per worker")
    @DecimalMax(value = "100000.00", message = "Daily rate can be at most ₹1,00,000 per worker")
    @Digits(integer = 6, fraction = 2, message = "Use rupees with up to 2 decimal places")
    private BigDecimal dailyRate;
}