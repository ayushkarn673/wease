package com.wease.service;

import com.wease.dto.request.WorkerProfileRequest;
import com.wease.dto.response.WorkerResponse;

import java.util.List;

public interface WorkerService {

    List<WorkerResponse> getAllAvailableWorkers();

    WorkerResponse createProfile(
            WorkerProfileRequest request,
            String email
    );

}
