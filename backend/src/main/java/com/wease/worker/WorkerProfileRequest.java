package com.wease.worker;


import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WorkerProfileRequest {

    @NotNull
    private Profession profession;

    @NotNull
    @Min(0)
    @Max(50)
    private Integer experience;

    @NotBlank
    private String bio;

    // No longer asked for: labour is quoted per job after inspection. Kept optional for older clients.
    @Positive
    private Double hourlyRate;

    @NotBlank
    private String address;

    private Double latitude;

    private Double longitude;
}
