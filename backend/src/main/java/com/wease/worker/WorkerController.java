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
    public List<WorkerResponse> getWorkers(
            @RequestParam(required = false) Profession profession,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city,
            // Customer's location: only professionals whose 10 km area covers it are returned.
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        return workerService.searchAvailableWorkers(profession, q, city, lat, lng);
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

    @GetMapping("/profile")
    public WorkerResponse getProfile(
            Authentication authentication
    ) {
        return workerService.getProfile(
                authentication.getName()
        );
    }

    @PutMapping("/profile")
    public WorkerResponse updateProfile(
            @Valid @RequestBody WorkerUpdateRequest request,
            Authentication authentication
    ) {
        return workerService.updateProfile(
                request,
                authentication.getName()
        );
    }

    @PutMapping("/pricing")
    public WorkerResponse updatePricing(
            @Valid @RequestBody PricingRequest request,
            Authentication authentication
    ) {
        return workerService.updatePricing(request, authentication.getName());
    }

    @PutMapping("/location")
    public WorkerResponse updateLocation(
            @Valid @RequestBody LocationRequest request,
            Authentication authentication
    ) {
        return workerService.updateLocation(request, authentication.getName());
    }

    @PutMapping("/availability")
    public WorkerResponse updateAvailability(
            @Valid @RequestBody AvailabilityRequest request,
            Authentication authentication
    ) {
        return workerService.updateAvailability(
                request.getAvailable(),
                authentication.getName()
        );
    }
}
