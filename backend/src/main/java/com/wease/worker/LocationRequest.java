package com.wease.worker;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationRequest {

    @NotNull(message = "Choose your base location on the map")
    private Double latitude;

    @NotNull(message = "Choose your base location on the map")
    private Double longitude;
}