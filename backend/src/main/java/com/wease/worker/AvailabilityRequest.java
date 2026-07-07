package com.wease.worker;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvailabilityRequest {
    @NotNull
    private Boolean available;
}
