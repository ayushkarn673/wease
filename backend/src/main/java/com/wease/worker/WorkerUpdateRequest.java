package com.wease.worker;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WorkerUpdateRequest {

    @NotNull(message = "Profession is required")
    private Profession profession;

    @NotNull(message = "Experience is required")
    @Min(0)
    private Integer experience;

    @NotBlank(message = "Bio is required")
    @Size(max = 1000)
    private String bio;

    // Optional and no longer shown to customers; labour is quoted per job after inspection.
    @Positive
    private Double hourlyRate;

    @NotBlank(message = "Address is required")
    private String address;

    private Double latitude;

    private Double longitude;

    private String profilePhoto;
}
