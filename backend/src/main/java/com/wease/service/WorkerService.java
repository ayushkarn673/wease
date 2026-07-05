package com.wease.service;

import com.wease.dto.request.WorkerProfileRequest;
import com.wease.dto.response.WorkerResponse;

import com.wease.entity.Profession;

import java.util.List;

public interface WorkerService {

    List<WorkerResponse> getAllAvailableWorkers(Profession profession, String keyword);

    WorkerResponse getWorkerDetails(Long id);

    WorkerResponse createProfile(
            WorkerProfileRequest request,
            String email
    );

}
