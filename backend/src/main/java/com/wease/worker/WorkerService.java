package com.wease.worker;






import java.util.List;

public interface WorkerService {

    List<WorkerResponse> getAllAvailableWorkers();

    WorkerResponse getWorkerDetails(Long id);

    WorkerResponse createProfile(
            WorkerProfileRequest request,
            String email
    );

}
