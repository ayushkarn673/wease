package com.wease.firm;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.review.FirmReviewService;
import com.wease.review.RatingStats;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import com.wease.worker.Profession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FirmService {

    private final FirmProfileRepository firmRepository;
    private final UserRepository userRepository;
    private final FirmReviewService firmReviewService;

    @Transactional(readOnly = true)
    public List<FirmResponse> searchFirms(Profession profession, String city) {
        String cityFilter = city == null || city.isBlank() ? null : city.trim().toLowerCase(Locale.ROOT);
        List<FirmProfile> available = firmRepository.findByAvailableTrue();
        Map<Long, RatingStats> ratings = firmReviewService.statsFor(available.stream().map(FirmProfile::getId).toList());
        return available.stream()
                .filter(f -> cityFilter == null || f.covers(cityFilter))
                .filter(f -> profession == null || f.getRates().stream().anyMatch(r -> r.getProfession() == profession))
                .sorted(Comparator.comparing(FirmProfile::getTeamSize).reversed())
                .map(f -> FirmResponse.from(f, false, ratings.getOrDefault(f.getId(), RatingStats.NONE)))
                .toList();
    }

    @Transactional(readOnly = true)
    public FirmResponse getFirm(Long id) {
        FirmProfile firm = firmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Firm not found."));
        return respond(firm, false);
    }

    @Transactional(readOnly = true)
    public FirmResponse getOwnProfile(String email) {
        return respond(findOwnFirm(email), true);
    }

    @Transactional
    public FirmResponse createProfile(FirmProfileRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != Role.FIRM) {
            throw new AccessDeniedException("Only firm accounts can create a firm profile.");
        }
        firmRepository.findByUser(user).ifPresent(existing -> {
            throw new ResourceAlreadyExistsException("Firm profile already exists");
        });

        FirmProfile firm = FirmProfile.builder().user(user).build();
        apply(firm, request);
        firmRepository.save(firm);
        return respond(firm, true);
    }

    @Transactional
    public FirmResponse updateProfile(FirmProfileRequest request, String email) {
        FirmProfile firm = findOwnFirm(email);
        apply(firm, request);
        firmRepository.save(firm);
        return respond(firm, true);
    }

    @Transactional
    public FirmResponse updateAvailability(boolean available, String email) {
        FirmProfile firm = findOwnFirm(email);
        firm.setAvailable(available);
        firmRepository.save(firm);
        return respond(firm, true);
    }

    private FirmResponse respond(FirmProfile firm, boolean includePhone) {
        RatingStats stats = firm.getId() == null ? RatingStats.NONE
                : firmReviewService.statsFor(List.of(firm.getId())).getOrDefault(firm.getId(), RatingStats.NONE);
        return FirmResponse.from(firm, includePhone, stats);
    }

    public FirmProfile findOwnFirm(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return firmRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Firm profile not found."));
    }

    private void apply(FirmProfile firm, FirmProfileRequest request) {
        Map<Profession, BigDecimal> wanted = new LinkedHashMap<>();
        for (FirmRateRequest rate : request.getRates()) {
            if (wanted.put(rate.getProfession(), rate.getDailyRate().setScale(2, RoundingMode.HALF_UP)) != null) {
                throw new BadRequestException("Each skill can only be listed once.");
            }
        }

        firm.setCompanyName(request.getCompanyName().trim());
        firm.setContactPerson(request.getContactPerson().trim());
        firm.setPhone(request.getPhone().replaceAll("[\\s-]", ""));
        firm.setCity(request.getCity().trim());
        firm.setAddress(request.getAddress().trim());
        firm.setGstin(request.getGstin() == null || request.getGstin().isBlank() ? null : request.getGstin().trim());
        firm.setAbout(request.getAbout() == null || request.getAbout().isBlank() ? null : request.getAbout().trim());
        firm.setTeamSize(request.getTeamSize());

        FirmCoverage coverage = request.getCoverage() != null ? request.getCoverage() : FirmCoverage.HOME_CITY;
        firm.setCoverage(coverage);
        firm.getServiceCities().clear();
        if (coverage == FirmCoverage.SELECTED_CITIES) {
            if (request.getServiceCities() == null || request.getServiceCities().isEmpty()) {
                throw new BadRequestException("Choose at least one city you supply crews in.");
            }
            request.getServiceCities().forEach(c -> firm.getServiceCities().add(c.trim()));
        }

        // Update rates in place: changing the rows (rather than deleting and re-adding them) keeps the
        // one-rate-per-skill database constraint happy within a single save.
        Map<Profession, FirmRate> existing = firm.getRates().stream()
                .collect(Collectors.toMap(FirmRate::getProfession, Function.identity()));
        firm.getRates().removeIf(r -> !wanted.containsKey(r.getProfession()));
        wanted.forEach((profession, rate) -> {
            FirmRate current = existing.get(profession);
            if (current != null) {
                current.setDailyRate(rate);
            } else {
                firm.getRates().add(FirmRate.builder().firm(firm).profession(profession).dailyRate(rate).build());
            }
        });
    }
}