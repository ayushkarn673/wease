package com.wease.dto.response;

import com.wease.entity.Profession;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkerResponse {

    private Long id;

    private String fullName;

    private Profession profession;

    private Integer experience;

    private Double hourlyRate;

    private String address;

    private Boolean verified;

    private Boolean available;

    private String profilePhoto;
}
