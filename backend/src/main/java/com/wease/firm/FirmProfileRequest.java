package com.wease.firm;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class FirmProfileRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 120, message = "Company name is too long")
    private String companyName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Name is too long")
    private String contactPerson;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+91[- ]?)?[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
    private String phone;

    @NotBlank(message = "City is required")
    @Size(max = 60, message = "City name is too long")
    @Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Enter a valid city name")
    private String city;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address is too long")
    private String address;

    @Pattern(regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$", message = "Enter a valid 15-character GSTIN")
    private String gstin;

    @Size(max = 1000, message = "Keep the description under 1000 characters")
    private String about;

    @NotNull(message = "Team size is required")
    @Min(value = 1, message = "Team size must be at least 1")
    @Max(value = 10000, message = "Team size is too large")
    private Integer teamSize;

    // Optional; defaults to the firm's own city.
    private FirmCoverage coverage;

    @Size(max = 10, message = "Choose up to 10 cities")
    private List<@NotBlank @Size(max = 60) @Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Enter valid city names") String> serviceCities;

    @NotNull(message = "Add at least one skill with a daily rate")
    @Size(min = 1, max = 8, message = "Add between 1 and 8 skills")
    private List<@Valid FirmRateRequest> rates;
}