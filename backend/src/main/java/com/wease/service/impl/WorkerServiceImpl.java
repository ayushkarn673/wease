package com.wease.service.impl;

import com.wease.dto.request.WorkerProfileRequest;
import com.wease.dto.response.WorkerResponse;
import com.wease.entity.Role;
import com.wease.entity.User;
import com.wease.entity.WorkerProfile;
import com.wease.exception.ResourceAlreadyExistsException;
import com.wease.repository.UserRepository;
import com.wease.repository.WorkerProfileRepository;
import com.wease.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerServiceImpl implements WorkerService {

    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;

    @Override
    public List<WorkerResponse> getAllAvailableWorkers(com.wease.entity.Profession profession, String keyword) {
        List<WorkerProfile> workers;

        if (profession != null && keyword != null && !keyword.trim().isEmpty()) {
            workers = workerProfileRepository.findByAvailableTrueAndProfessionAndUserFullNameContainingIgnoreCase(profession, keyword.trim());
        } else if (profession != null) {
            workers = workerProfileRepository.findByAvailableTrueAndProfession(profession);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            workers = workerProfileRepository.findByAvailableTrueAndUserFullNameContainingIgnoreCase(keyword.trim());
        } else {
            workers = workerProfileRepository.findByAvailableTrue();
        }

        return workers.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public WorkerResponse getWorkerDetails(Long id) {
        WorkerProfile worker = workerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker profile not found."));
        return toResponse(worker);
    }

    @Override
    public WorkerResponse createProfile(
            WorkerProfileRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.WORKER) {
            throw new com.wease.exception.AccessDeniedException("Only workers can create a profile.");
        }

        workerProfileRepository.findByUser(user)
                .ifPresent(existing -> {
                    throw new ResourceAlreadyExistsException(
                            "Worker profile already exists"
                    );
                });

        WorkerProfile profile = WorkerProfile.builder()
                .user(user)
                .profession(request.getProfession())
                .experience(request.getExperience())
                .bio(request.getBio())
                .hourlyRate(request.getHourlyRate())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        workerProfileRepository.save(profile);

        return toResponse(profile);
    }

    private WorkerResponse toResponse(WorkerProfile worker) {
        return WorkerResponse.builder()
                .id(worker.getId())
                .fullName(worker.getUser().getFullName())
                .profession(worker.getProfession().name())
                .experience(worker.getExperience())
                .hourlyRate(worker.getHourlyRate())
                .rating(null) // TODO: calculate from reviews later
                .verified(worker.getVerified())
                .available(worker.getAvailable())
                .profilePhoto(worker.getProfilePhoto())
                .bio(worker.getBio())
                .address(worker.getAddress())
                .latitude(worker.getLatitude())
                .longitude(worker.getLongitude())
                .build();
    }
}
