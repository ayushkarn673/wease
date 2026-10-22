package com.wease.worker;



import com.wease.user.Role;
import com.wease.user.User;

import com.wease.core.exception.ResourceAlreadyExistsException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.user.UserRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.wease.core.exception.BadRequestException;
import com.wease.core.util.Geo;
import com.wease.review.RatingStats;
import com.wease.review.ReviewService;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerServiceImpl implements WorkerService {

    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;

    @Override
    public List<WorkerResponse> searchAvailableWorkers(Profession profession, String keyword, String city, Double lat, Double lng) {
        if ((lat == null) != (lng == null)) {
            throw new BadRequestException("Send both latitude and longitude.");
        }
        if (lat != null) {
            Geo.requireInIndia(lat, lng);
        }

        boolean hasKeyword = keyword != null && !keyword.isBlank();

        List<WorkerProfile> profiles;
        if (profession != null && hasKeyword) {
            profiles = workerProfileRepository
                    .findByAvailableTrueAndProfessionAndUserFullNameContainingIgnoreCase(profession, keyword.trim());
        } else if (profession != null) {
            profiles = workerProfileRepository.findByAvailableTrueAndProfession(profession);
        } else if (hasKeyword) {
            profiles = workerProfileRepository.findByAvailableTrueAndUserFullNameContainingIgnoreCase(keyword.trim());
        } else {
            profiles = workerProfileRepository.findByAvailableTrue();
        }

        // Workers don't have a separate city field yet, so match the city against their service address.
        String cityFilter = city == null || city.isBlank() ? null : city.trim().toLowerCase(Locale.ROOT);

        Map<Long, RatingStats> ratings = reviewService.statsFor(profiles.stream().map(WorkerProfile::getId).toList());
        List<WorkerResponse> matches = profiles
                .stream()
                .filter(p -> cityFilter == null
                        || (p.getAddress() != null && p.getAddress().toLowerCase(Locale.ROOT).contains(cityFilter)))
                .map(p -> withRating(toResponse(p), ratings.get(p.getId())))
                .toList();
        if (lat == null) {
            return matches;
        }

        // Location search: only professionals with a base location whose 10 km area covers the customer,
        // nearest first. Distance uses the exact base location; the response only carries a rounded one.
        Map<Long, WorkerProfile> byId = profiles.stream().collect(Collectors.toMap(WorkerProfile::getId, p -> p));
        return matches.stream()
                .filter(w -> hasLocation(byId.get(w.getId())))
                .peek(w -> {
                    WorkerProfile p = byId.get(w.getId());
                    w.setDistanceKm(Geo.roundKm(Geo.distanceKm(lat, lng, p.getLatitude(), p.getLongitude())));
                })
                .filter(w -> w.getDistanceKm() <= Geo.SERVICE_RADIUS_KM)
                .sorted(Comparator.comparing(WorkerResponse::getDistanceKm))
                .toList();
    }

    @Override
    public WorkerResponse getWorkerDetails(Long id) {
        WorkerProfile worker = workerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));
        return withRating(toResponse(worker), reviewService.statsFor(List.of(worker.getId())).get(worker.getId()));
    }

    @Override
    public WorkerResponse createProfile(
            WorkerProfileRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
                .build();
        // Onboarding sends the device's location if the browser allows it. If it's missing or unusable,
        // the worker sets their base on the map later instead of failing sign-up.
        if (Geo.isInIndia(request.getLatitude(), request.getLongitude())) {
            profile.setLatitude(request.getLatitude());
            profile.setLongitude(request.getLongitude());
        }

        workerProfileRepository.save(profile);

        return toOwnResponse(profile);
    }

    @Override
    public WorkerResponse updateAvailability(Boolean available, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkerProfile profile = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        profile.setAvailable(available);
        workerProfileRepository.save(profile);

        return toOwnResponse(profile);
    }

    @Override
    public WorkerResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkerProfile profile = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        return toOwnResponse(profile);
    }

    @Override
    public WorkerResponse updateProfile(WorkerUpdateRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkerProfile profile = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        profile.setProfession(request.getProfession());
        profile.setExperience(request.getExperience());
        profile.setBio(request.getBio());
        // Only change the old starting price if a client still sends one.
        if (request.getHourlyRate() != null) {
            profile.setHourlyRate(request.getHourlyRate());
        }
        profile.setAddress(request.getAddress());
        if (request.getLatitude() != null || request.getLongitude() != null) {
            Geo.requireInIndia(request.getLatitude(), request.getLongitude());
        }
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        if (request.getProfilePhoto() != null) {
            profile.setProfilePhoto(request.getProfilePhoto());
        }

        workerProfileRepository.save(profile);
        return toOwnResponse(profile);
    }

    @Override
    public WorkerResponse updatePricing(PricingRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkerProfile profile = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        // Existing bookings keep the terms they were made under; this only affects new bookings.
        profile.setVisitingCharge(request.getVisitingCharge());
        profile.setVisitingChargePolicy(request.getVisitingChargePolicy());
        workerProfileRepository.save(profile);
        return toOwnResponse(profile);
    }

    @Override
    public WorkerResponse updateLocation(LocationRequest request, String email) {
        Geo.requireInIndia(request.getLatitude(), request.getLongitude());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        WorkerProfile profile = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found."));

        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        workerProfileRepository.save(profile);
        return toOwnResponse(profile);
    }

    static boolean hasLocation(WorkerProfile profile) {
        return profile != null && profile.getLatitude() != null && profile.getLongitude() != null;
    }

    // The worker's own view, including their exact base location.
    private WorkerResponse toOwnResponse(WorkerProfile profile) {
        WorkerResponse response = profile.getId() == null ? toResponse(profile)
                : withRating(toResponse(profile), reviewService.statsFor(List.of(profile.getId())).get(profile.getId()));
        response.setLatitude(profile.getLatitude());
        response.setLongitude(profile.getLongitude());
        return response;
    }

    private static WorkerResponse withRating(WorkerResponse response, RatingStats stats) {
        RatingStats s = stats != null ? stats : RatingStats.NONE;
        response.setAverageRating(s.average());
        response.setReviewCount(s.count());
        return response;
    }

    // What customers see: the base location is rounded to about 1 km.
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
                .bio(profile.getBio())
                .approxLatitude(Geo.approximate(profile.getLatitude()))
                .approxLongitude(Geo.approximate(profile.getLongitude()))
                .hasServiceArea(hasLocation(profile))
                .serviceRadiusKm(Geo.SERVICE_RADIUS_KM)
                .visitingCharge(profile.getVisitingCharge())
                .visitingChargePolicy(profile.getVisitingChargePolicy())
                .build();
    }
}
