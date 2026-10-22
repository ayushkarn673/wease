package com.wease.crew;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crew-requests")
@RequiredArgsConstructor
public class CrewRequestController {

    private final CrewRequestService crewService;

    @PostMapping
    public CrewRequestResponse create(@Valid @RequestBody CreateCrewRequest request, Authentication authentication) {
        return crewService.create(request, authentication.getName());
    }

    @GetMapping("/customer")
    public List<CrewRequestResponse> customerRequests(Authentication authentication) {
        return crewService.customerRequests(authentication.getName());
    }

    @GetMapping("/firm")
    public List<CrewRequestResponse> firmRequests(Authentication authentication) {
        return crewService.firmRequests(authentication.getName());
    }

    @GetMapping("/{id}")
    public CrewRequestResponse get(@PathVariable Long id, Authentication authentication) {
        return crewService.get(id, authentication.getName());
    }

    @PutMapping("/{id}/accept")
    public CrewRequestResponse accept(@PathVariable Long id, Authentication authentication) {
        return crewService.accept(id, authentication.getName());
    }

    @PutMapping("/{id}/reject")
    public CrewRequestResponse reject(@PathVariable Long id, Authentication authentication) {
        return crewService.reject(id, authentication.getName());
    }

    @PutMapping("/{id}/complete")
    public CrewRequestResponse complete(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) CompleteCrewRequest request,
            Authentication authentication
    ) {
        return crewService.complete(id, request != null ? request.getActualWorkerDays() : null, authentication.getName());
    }

    @PutMapping("/{id}/cancel")
    public CrewRequestResponse cancel(@PathVariable Long id, Authentication authentication) {
        return crewService.cancel(id, authentication.getName());
    }
}