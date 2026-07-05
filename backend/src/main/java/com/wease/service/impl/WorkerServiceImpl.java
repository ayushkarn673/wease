package com.wease.service.impl;

import com.wease.dto.response.WorkerResponse;
import com.wease.entity.WorkerProfile;
import com.wease.repository.WorkerProfileRepository;
import com.wease.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerServiceImpl implements WorkerService {

    private final WorkerProfileRepository workerProfileRepository;

    @Override
    public List<WorkerResponse> getAllAvailableWorkers() {

        List<WorkerProfile> workers =
                workerProfileRepository.findByAvailableTrue();

        return workers.stream()
                .map(this::toResponse)
                .toList();
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
                .build();
    }
}
