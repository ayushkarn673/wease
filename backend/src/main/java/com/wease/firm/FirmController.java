package com.wease.firm;

import com.wease.worker.AvailabilityRequest;
import com.wease.worker.Profession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/firms")
@RequiredArgsConstructor
public class FirmController {

    private final FirmService firmService;

    @GetMapping
    public List<FirmResponse> searchFirms(
            @RequestParam(required = false) Profession profession,
            @RequestParam(required = false) String city
    ) {
        return firmService.searchFirms(profession, city);
    }

    @GetMapping("/{id}")
    public FirmResponse getFirm(@PathVariable Long id) {
        return firmService.getFirm(id);
    }

    @GetMapping("/profile")
    public FirmResponse getOwnProfile(Authentication authentication) {
        return firmService.getOwnProfile(authentication.getName());
    }

    @PostMapping("/profile")
    public FirmResponse createProfile(@Valid @RequestBody FirmProfileRequest request, Authentication authentication) {
        return firmService.createProfile(request, authentication.getName());
    }

    @PutMapping("/profile")
    public FirmResponse updateProfile(@Valid @RequestBody FirmProfileRequest request, Authentication authentication) {
        return firmService.updateProfile(request, authentication.getName());
    }

    @PutMapping("/availability")
    public FirmResponse updateAvailability(@Valid @RequestBody AvailabilityRequest request, Authentication authentication) {
        return firmService.updateAvailability(request.getAvailable(), authentication.getName());
    }
}