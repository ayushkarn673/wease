package com.wease.worker;




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

    @GetMapping("/{id}")
    public WorkerResponse getWorkerDetails(@PathVariable Long id) {
        return workerService.getWorkerDetails(id);
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
