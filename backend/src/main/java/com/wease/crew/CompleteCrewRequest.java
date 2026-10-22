package com.wease.crew;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CompleteCrewRequest {

    // Optional: worker-days actually supplied, if fewer than planned. Defaults to the planned amount.
    @Min(value = 1, message = "Worker-days must be at least 1")
    private Integer actualWorkerDays;
}