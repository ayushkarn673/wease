package com.wease.quote;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class QuoteItemRequest {

    @NotNull(message = "Choose labour, material or other")
    private QuoteItemType type;

    @NotBlank(message = "Describe each item")
    @Size(max = 150, message = "Keep each description under 150 characters")
    private String description;

    @NotNull(message = "Enter a quantity")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity can be at most 100")
    private Integer quantity;

    @NotNull(message = "Enter a price")
    @DecimalMin(value = "0.00", message = "Price can't be negative")
    @DecimalMax(value = "100000.00", message = "Price per item can be at most ₹1,00,000")
    @Digits(integer = 6, fraction = 2, message = "Use rupees with up to 2 decimal places")
    private BigDecimal unitPrice;
}