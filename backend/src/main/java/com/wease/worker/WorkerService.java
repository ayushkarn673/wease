package com.wease.worker;






import java.util.List;

public interface WorkerService {

    List<WorkerResponse> searchAvailableWorkers(Profession profession, String keyword, String city, Double lat, Double lng);

    WorkerResponse getWorkerDetails(Long id);

    WorkerResponse createProfile(
            WorkerProfileRequest request,
            String email
    );

    WorkerResponse updateAvailability(
            Boolean available,
            String email
    );

    WorkerResponse getProfile(String email);

    WorkerResponse updateProfile(
            WorkerUpdateRequest request,
            String email
    );

    WorkerResponse updatePricing(PricingRequest request, String email);

    WorkerResponse updateLocation(LocationRequest request, String email);
}
