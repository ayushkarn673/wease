package com.wease.crew;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.core.exception.ResourceNotFoundException;
import com.wease.firm.FirmProfile;
import com.wease.firm.FirmProfileRepository;
import com.wease.firm.FirmRate;
import com.wease.firm.FirmService;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CrewRequestService {

    private static final Set<CrewStatus> OPEN = EnumSet.of(CrewStatus.PENDING, CrewStatus.ACCEPTED);

    private final CrewRequestRepository crewRepository;
    private final FirmProfileRepository firmRepository;
    private final FirmService firmService;
    private final UserRepository userRepository;

    @Transactional
    public CrewRequestResponse create(CreateCrewRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));
        if (customer.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("Only customers can request a crew.");
        }
        FirmProfile firm = firmRepository.findById(request.getFirmId())
                .orElseThrow(() -> new ResourceNotFoundException("Firm not found."));
        if (!Boolean.TRUE.equals(firm.getAvailable())) {
            throw new BadRequestException("This firm isn't taking requests right now.");
        }
        FirmRate rate = firm.getRates().stream()
                .filter(r -> r.getProfession() == request.getProfession())
                .findFirst()
                .orElseThrow(() -> new BadRequestException("This firm doesn't supply that skill."));

        if (!firm.covers(request.getSiteCity())) {
            throw new BadRequestException(firm.getCompanyName() + " supplies crews in "
                    + String.join(", ", firm.coveredCities()) + " only.");
        }

        LocalDate today = LocalDate.now();
        if (request.getStartDate().isBefore(today)
                || (request.getStartDate().isEqual(today) && request.getReportingTime().isBefore(LocalTime.now()))) {
            throw new BadRequestException("The start date and time must be in the future.");
        }
        if (crewRepository.existsByCustomerAndFirmAndProfessionAndStartDateAndStatusIn(
                customer, firm, request.getProfession(), request.getStartDate(), OPEN)) {
            throw new BadRequestException("You already have an open request with this firm for that skill and date.");
        }

        CrewRequest crew = CrewRequest.builder()
                .customer(customer)
                .firm(firm)
                .profession(request.getProfession())
                .workers(request.getWorkers())
                .days(request.getDays())
                .startDate(request.getStartDate())
                .reportingTime(request.getReportingTime())
                .siteAddress(request.getSiteAddress().trim())
                .siteCity(firm.coveredCities().stream()
                        .filter(c -> c.equalsIgnoreCase(request.getSiteCity().trim())).findFirst().orElse(request.getSiteCity().trim()))
                .description(request.getDescription().trim())
                .dailyRate(rate.getDailyRate())
                .estimatedTotal(rate.getDailyRate().multiply(BigDecimal.valueOf((long) request.getWorkers() * request.getDays())))
                .status(CrewStatus.PENDING)
                .build();
        crewRepository.save(crew);
        return toResponse(crew, false);
    }

    @Transactional(readOnly = true)
    public List<CrewRequestResponse> customerRequests(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));
        return crewRepository.findByCustomerOrderByIdDesc(customer).stream().map(c -> toResponse(c, false)).toList();
    }

    @Transactional(readOnly = true)
    public List<CrewRequestResponse> firmRequests(String firmEmail) {
        FirmProfile firm = firmService.findOwnFirm(firmEmail);
        return crewRepository.findByFirmOrderByIdDesc(firm).stream().map(c -> toResponse(c, true)).toList();
    }

    @Transactional(readOnly = true)
    public CrewRequestResponse get(Long id, String email) {
        CrewRequest crew = find(id);
        if (isCustomer(crew, email)) return toResponse(crew, false);
        if (isFirm(crew, email)) return toResponse(crew, true);
        throw new AccessDeniedException("You do not have access to this request.");
    }

    @Transactional
    public CrewRequestResponse accept(Long id, String firmEmail) {
        CrewRequest crew = findForFirm(id, firmEmail);
        requireStatus(crew, CrewStatus.PENDING, "Only new requests can be accepted.");
        crew.setStatus(CrewStatus.ACCEPTED);
        return toResponse(crew, true);
    }

    @Transactional
    public CrewRequestResponse reject(Long id, String firmEmail) {
        CrewRequest crew = findForFirm(id, firmEmail);
        requireStatus(crew, CrewStatus.PENDING, "Only new requests can be declined.");
        crew.setStatus(CrewStatus.REJECTED);
        return toResponse(crew, true);
    }

    // The final amount can be lower than the estimate (fewer worker-days used) but never higher.
    @Transactional
    public CrewRequestResponse complete(Long id, Integer actualWorkerDays, String firmEmail) {
        CrewRequest crew = findForFirm(id, firmEmail);
        requireStatus(crew, CrewStatus.ACCEPTED, "Only accepted requests can be completed.");
        int planned = crew.getWorkers() * crew.getDays();
        int actual = actualWorkerDays != null ? actualWorkerDays : planned;
        if (actual > planned) {
            throw new BadRequestException("You can't bill more than the " + planned
                    + " worker-days the customer agreed to.");
        }
        crew.setActualWorkerDays(actual);
        crew.setFinalAmount(crew.getDailyRate().multiply(BigDecimal.valueOf(actual)));
        crew.setStatus(CrewStatus.COMPLETED);
        return toResponse(crew, true);
    }

    @Transactional
    public CrewRequestResponse cancel(Long id, String customerEmail) {
        CrewRequest crew = find(id);
        if (!isCustomer(crew, customerEmail)) {
            throw new AccessDeniedException("Only the customer who made this request can cancel it.");
        }
        if (!OPEN.contains(crew.getStatus())) {
            throw new BadRequestException("This request can no longer be cancelled.");
        }
        if (crew.getStatus() == CrewStatus.ACCEPTED && !crew.getStartDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("The crew is due to start, so this request can't be cancelled here. Please contact the firm.");
        }
        crew.setStatus(CrewStatus.CANCELLED);
        return toResponse(crew, false);
    }

    private CrewRequest find(Long id) {
        return crewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Request not found."));
    }

    private CrewRequest findForFirm(Long id, String firmEmail) {
        CrewRequest crew = find(id);
        if (!isFirm(crew, firmEmail)) {
            throw new AccessDeniedException("This request belongs to another firm.");
        }
        return crew;
    }

    private static void requireStatus(CrewRequest crew, CrewStatus status, String message) {
        if (crew.getStatus() != status) throw new BadRequestException(message);
    }

    private static boolean isCustomer(CrewRequest crew, String email) {
        return crew.getCustomer().getEmail().equals(email);
    }

    private static boolean isFirm(CrewRequest crew, String email) {
        return crew.getFirm().getUser().getEmail().equals(email);
    }

    private static CrewRequestResponse toResponse(CrewRequest crew, boolean viewerIsFirm) {
        boolean shareContact = crew.getStatus() == CrewStatus.ACCEPTED || crew.getStatus() == CrewStatus.COMPLETED;
        String contact = !shareContact ? null : viewerIsFirm ? crew.getCustomer().getPhone() : crew.getFirm().getPhone();
        return new CrewRequestResponse(
                crew.getId(), crew.getFirm().getId(), crew.getFirm().getCompanyName(), crew.getFirm().getCity(),
                crew.getCustomer().getFullName(), crew.getProfession(), crew.getWorkers(), crew.getDays(),
                crew.getWorkers() * crew.getDays(), crew.getStartDate(), crew.getReportingTime(), crew.getSiteAddress(), crew.getSiteCity(),
                crew.getDescription(), crew.getDailyRate(), crew.getEstimatedTotal(), crew.getActualWorkerDays(),
                crew.getFinalAmount(), crew.getStatus(), contact, crew.getCustomerRating(), crew.getCreatedAt());
    }
}