package com.wease.crew;

import com.wease.worker.Profession;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateCrewRequest {

    @NotNull(message = "Firm is required")
    private Long firmId;

    @NotNull(message = "Choose a skill")
    private Profession profession;

    @NotNull(message = "Enter how many workers you need")
    @Min(value = 1, message = "At least 1 worker")
    @Max(value = 200, message = "At most 200 workers per request")
    private Integer workers;

    @NotNull(message = "Enter how many days")
    @Min(value = 1, message = "At least 1 day")
    @Max(value = 60, message = "At most 60 days per request")
    private Integer days;

    @NotNull(message = "Choose a start date")
    private LocalDate startDate;

    @NotNull(message = "Choose a reporting time")
    private LocalTime reportingTime;

    @NotBlank(message = "Choose the site's city")
    @Size(max = 60, message = "City name is too long")
    private String siteCity;

    @NotBlank(message = "Enter the site address")
    @Size(max = 255, message = "Address is too long")
    private String siteAddress;

    @NotBlank(message = "Describe the work")
    @Size(min = 10, max = 1000, message = "Describe the work in 10 to 1000 characters")
    private String description;
}