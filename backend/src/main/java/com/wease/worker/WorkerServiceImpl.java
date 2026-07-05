package com.wease.worker;



import com.wease.user.Role;
import com.wease.user.User;

import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.user.UserRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerServiceImpl implements WorkerService {

    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;

    @Override
    public List<WorkerResponse> getAllAvailableWorkers() {
        return workerProfileRepository.findByAvailableTrue()
                .stream()
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
            throw new com.wease.core.exception.AccessDeniedException("Only workers can create a profile.");
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

    private WorkerResponse toResponse(WorkerProfile profile) {
        return WorkerResponse.builder()
                .id(profile.getId())
                .fullName(profile.getUser().getFullName())
                .profession(profile.getProfession())
                .experience(profile.getExperience())
                .hourlyRate(profile.getHourlyRate())
                .address(profile.getAddress())
                .verified(profile.getVerified())
                .available(profile.getAvailable())
                .profilePhoto(profile.getProfilePhoto())
                .build();
    }
}
