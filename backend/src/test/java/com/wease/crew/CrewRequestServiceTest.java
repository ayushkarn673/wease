package com.wease.crew;

import com.wease.core.exception.AccessDeniedException;
import com.wease.core.exception.BadRequestException;
import com.wease.firm.FirmCoverage;
import com.wease.firm.FirmProfile;
import com.wease.firm.FirmProfileRepository;
import com.wease.firm.FirmRate;
import com.wease.firm.FirmService;
import com.wease.user.Role;
import com.wease.user.User;
import com.wease.user.UserRepository;
import com.wease.worker.Profession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

// Crew requests to labour firms: who can ask, which cities and skills a firm covers, the estimate,
// and the firm never billing more worker-days than agreed.
@ExtendWith(MockitoExtension.class)
class CrewRequestServiceTest {

    private static final String CUSTOMER = "asha@test.local";
    private static final String FIRM_OWNER = "awadh@test.local";

    @Mock private CrewRequestRepository crewRepository;
    @Mock private FirmProfileRepository firmRepository;
    @Mock private FirmService firmService;
    @Mock private UserRepository userRepository;

    private CrewRequestService service;
    private User customer;
    private FirmProfile firm;

    @BeforeEach
    void setUp() {
        service = new CrewRequestService(crewRepository, firmRepository, firmService, userRepository);
        customer = User.builder().id(1L).fullName("Asha Verma").email(CUSTOMER).phone("9812300111").role(Role.CUSTOMER).build();
        User owner = User.builder().id(3L).fullName("Rakesh Tiwari").email(FIRM_OWNER).role(Role.FIRM).build();
        firm = FirmProfile.builder().id(20L).user(owner).companyName("Awadh Labour Services").phone("9812300401")
                .city("Lucknow").coverage(FirmCoverage.HOME_CITY).available(true).build();
        firm.getRates().add(FirmRate.builder().firm(firm).profession(Profession.LABOURER).dailyRate(new BigDecimal("650")).build());
        firm.getRates().add(FirmRate.builder().firm(firm).profession(Profession.MASON).dailyRate(new BigDecimal("900")).build());
        lenient().when(userRepository.findByEmail(CUSTOMER)).thenReturn(Optional.of(customer));
        lenient().when(userRepository.findByEmail(FIRM_OWNER)).thenReturn(Optional.of(owner));
        lenient().when(firmRepository.findById(20L)).thenReturn(Optional.of(firm));
    }

    @Nested
    @DisplayName("Requesting a crew")
    class Create {

        @Test
        @DisplayName("prices it as daily rate × workers × days")
        void estimate() {
            CrewRequestResponse response = service.create(request(Profession.MASON, 4, 3, "lucknow"), CUSTOMER);

            ArgumentCaptor<CrewRequest> saved = ArgumentCaptor.forClass(CrewRequest.class);
            verify(crewRepository).save(saved.capture());
            CrewRequest crew = saved.getValue();
            assertThat(crew.getDailyRate()).isEqualByComparingTo("900");
            assertThat(crew.getEstimatedTotal()).isEqualByComparingTo("10800"); // 900 × 4 workers × 3 days
            assertThat(crew.getStatus()).isEqualTo(CrewStatus.PENDING);
            assertThat(crew.getSiteCity()).isEqualTo("Lucknow"); // spelled the way the firm lists it
            assertThat(response.contactPhone()).isNull(); // phone numbers are shared only after acceptance
        }

        @Test
        @DisplayName("only customers can request a crew")
        void onlyCustomers() {
            assertThatThrownBy(() -> service.create(request(Profession.LABOURER, 2, 1, "Lucknow"), FIRM_OWNER))
                    .isInstanceOf(AccessDeniedException.class);
            verify(crewRepository, never()).save(any());
        }

        @Test
        @DisplayName("the firm must supply that skill")
        void skillNotOffered() {
            assertThatThrownBy(() -> service.create(request(Profession.ELECTRICIAN, 2, 1, "Lucknow"), CUSTOMER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("doesn't supply that skill");
        }

        @Test
        @DisplayName("the site must be in a city the firm covers")
        void cityNotCovered() {
            assertThatThrownBy(() -> service.create(request(Profession.LABOURER, 2, 1, "Kanpur"), CUSTOMER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("supplies crews in Lucknow only");
        }

        @Test
        @DisplayName("a firm covering selected cities accepts those cities")
        void selectedCities() {
            firm.setCoverage(FirmCoverage.SELECTED_CITIES);
            firm.setServiceCities(new java.util.LinkedHashSet<>(Set.of("Lucknow", "Kanpur")));

            service.create(request(Profession.LABOURER, 2, 1, "Kanpur"), CUSTOMER);

            verify(crewRepository).save(any());
        }

        @Test
        @DisplayName("a firm that's paused isn't taking requests")
        void firmPaused() {
            firm.setAvailable(false);

            assertThatThrownBy(() -> service.create(request(Profession.LABOURER, 2, 1, "Lucknow"), CUSTOMER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("isn't taking requests");
        }

        @Test
        @DisplayName("the start date can't be in the past")
        void pastDate() {
            CreateCrewRequest request = request(Profession.LABOURER, 2, 1, "Lucknow");
            request.setStartDate(LocalDate.now().minusDays(1));

            assertThatThrownBy(() -> service.create(request, CUSTOMER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("future");
        }
    }

    @Nested
    @DisplayName("The firm's side")
    class FirmSide {

        @Test
        @DisplayName("accepting shares each side's phone number")
        void acceptSharesContact() {
            CrewRequest crew = crew(CrewStatus.PENDING);

            CrewRequestResponse response = service.accept(30L, FIRM_OWNER);

            assertThat(crew.getStatus()).isEqualTo(CrewStatus.ACCEPTED);
            assertThat(response.contactPhone()).isEqualTo("9812300111"); // the firm sees the customer's number
        }

        @Test
        @DisplayName("another firm can't accept or decline it")
        void otherFirm() {
            crew(CrewStatus.PENDING);

            assertThatThrownBy(() -> service.accept(30L, "other.firm@test.local")).isInstanceOf(AccessDeniedException.class);
            assertThatThrownBy(() -> service.reject(30L, "other.firm@test.local")).isInstanceOf(AccessDeniedException.class);
        }

        @Test
        @DisplayName("completing bills the worker-days actually used")
        void completeWithFewerDays() {
            CrewRequest crew = crew(CrewStatus.ACCEPTED); // 4 workers × 3 days = 12 worker-days at ₹900

            service.complete(30L, 10, FIRM_OWNER);

            assertThat(crew.getStatus()).isEqualTo(CrewStatus.COMPLETED);
            assertThat(crew.getActualWorkerDays()).isEqualTo(10);
            assertThat(crew.getFinalAmount()).isEqualByComparingTo("9000");
        }

        @Test
        @DisplayName("completing without a number bills the agreed worker-days")
        void completeAsPlanned() {
            CrewRequest crew = crew(CrewStatus.ACCEPTED);

            service.complete(30L, null, FIRM_OWNER);

            assertThat(crew.getFinalAmount()).isEqualByComparingTo("10800");
        }

        @Test
        @DisplayName("can never bill more worker-days than the customer agreed to")
        void cannotOverbill() {
            CrewRequest crew = crew(CrewStatus.ACCEPTED);

            assertThatThrownBy(() -> service.complete(30L, 13, FIRM_OWNER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("12 worker-days");
            assertThat(crew.getStatus()).isEqualTo(CrewStatus.ACCEPTED);
        }
    }

    @Nested
    @DisplayName("Cancelling")
    class Cancel {

        @Test
        @DisplayName("the customer can cancel a new request")
        void cancelNew() {
            CrewRequest crew = crew(CrewStatus.PENDING);

            service.cancel(30L, CUSTOMER);

            assertThat(crew.getStatus()).isEqualTo(CrewStatus.CANCELLED);
        }

        @Test
        @DisplayName("an accepted crew due to start today can't be cancelled here")
        void tooLateToCancel() {
            CrewRequest crew = crew(CrewStatus.ACCEPTED);
            crew.setStartDate(LocalDate.now());

            assertThatThrownBy(() -> service.cancel(30L, CUSTOMER))
                    .isInstanceOf(BadRequestException.class).hasMessageContaining("contact the firm");
        }

        @Test
        @DisplayName("only the customer who asked can cancel")
        void onlyTheCustomer() {
            crew(CrewStatus.PENDING);

            assertThatThrownBy(() -> service.cancel(30L, FIRM_OWNER)).isInstanceOf(AccessDeniedException.class);
        }
    }

    // --- helpers

    private static CreateCrewRequest request(Profession profession, int workers, int days, String city) {
        CreateCrewRequest request = new CreateCrewRequest();
        request.setFirmId(20L);
        request.setProfession(profession);
        request.setWorkers(workers);
        request.setDays(days);
        request.setStartDate(LocalDate.now().plusDays(3));
        request.setReportingTime(LocalTime.of(9, 0));
        request.setSiteCity(city);
        request.setSiteAddress("Plot 4, Mawaiya, Alambagh");
        request.setDescription("Brickwork for a boundary wall");
        return request;
    }

    private CrewRequest crew(CrewStatus status) {
        CrewRequest crew = CrewRequest.builder().id(30L).customer(customer).firm(firm).profession(Profession.MASON)
                .workers(4).days(3).startDate(LocalDate.now().plusDays(3)).reportingTime(LocalTime.of(9, 0))
                .siteAddress("Plot 4").siteCity("Lucknow").description("Boundary wall")
                .dailyRate(new BigDecimal("900")).estimatedTotal(new BigDecimal("10800")).status(status).build();
        lenient().when(crewRepository.findById(30L)).thenReturn(Optional.of(crew));
        return crew;
    }
}
