package com.wease.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerResponse {

    private Long id;

    private String fullName;

    private String profession;

    private Integer experience;

    private Double hourlyRate;

    private Double rating;

    private Boolean verified;

    private Boolean available;

    private String profilePhoto;
}
