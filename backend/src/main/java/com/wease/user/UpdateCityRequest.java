package com.wease.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCityRequest {

    // Null or blank clears the city (browse all cities).
    @Size(max = 60, message = "City name is too long")
    @Pattern(regexp = "^$|^[\\p{L}][\\p{L} .'-]*$", message = "Enter a valid city name")
    private String city;
}