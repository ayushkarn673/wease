package com.wease.controller;

import com.wease.dto.request.WorkerProfileRequest;
import com.wease.dto.response.WorkerResponse;
import com.wease.service.WorkerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public List<WorkerResponse> getWorkers() {
        return workerService.getAllAvailableWorkers();
    }

    @PostMapping("/profile")
    public WorkerResponse createProfile(
            @Valid @RequestBody WorkerProfileRequest request,
            Authentication authentication
    ) {
        return workerService.createProfile(
                request,
                authentication.getName()
        );
    }
}
