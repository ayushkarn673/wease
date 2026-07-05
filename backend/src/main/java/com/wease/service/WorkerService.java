package com.wease.service;

import com.wease.dto.response.WorkerResponse;

import java.util.List;

public interface WorkerService {

    List<WorkerResponse> getAllAvailableWorkers();

}
