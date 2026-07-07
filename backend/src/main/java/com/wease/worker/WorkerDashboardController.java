package com.wease.worker;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerDashboardController {

    private final WorkerDashboardService workerDashboardService;

    @GetMapping("/dashboard")
    public WorkerDashboardResponse getDashboardData(Authentication authentication) {
        return workerDashboardService.getDashboardData(authentication.getName());
    }
}
