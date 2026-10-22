package com.wease.firm;

import com.wease.core.BaseEntity;
import com.wease.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

// A labour firm that supplies crews. The firm decides who it sends; it lists a daily rate per skill.
@Entity
@Table(name = "firm_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FirmProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 120)
    private String companyName;

    @Column(nullable = false, length = 100)
    private String contactPerson;

    // Shared with a customer only once the firm accepts their request.
    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 60)
    private String city;

    @Column(nullable = false)
    private String address;

    // Optional; shown as provided, not verified by Wease.
    @Column(length = 15)
    private String gstin;

    @Column(length = 1000)
    private String about;

    @Column(nullable = false)
    private Integer teamSize;

    @Builder.Default
    private Boolean available = true;

    // Null for firms created before coverage existed: treated as HOME_CITY.
    @Enumerated(EnumType.STRING)
    private FirmCoverage coverage;

    // Cities served when coverage is SELECTED_CITIES.
    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "firm_service_cities", joinColumns = @JoinColumn(name = "firm_id"))
    @Column(name = "city", length = 60, nullable = false)
    private Set<String> serviceCities = new LinkedHashSet<>();

    // The cities this firm accepts crew requests for.
    public List<String> coveredCities() {
        if (coverage == FirmCoverage.SELECTED_CITIES && !serviceCities.isEmpty()) {
            return serviceCities.stream().sorted().toList();
        }
        return List.of(city);
    }

    public boolean covers(String cityName) {
        return cityName != null && coveredCities().stream().anyMatch(c -> c.equalsIgnoreCase(cityName.trim()));
    }

    @Builder.Default
    @OneToMany(mappedBy = "firm", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("profession ASC")
    private List<FirmRate> rates = new ArrayList<>();
}