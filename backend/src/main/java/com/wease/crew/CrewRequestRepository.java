package com.wease.crew;

import com.wease.firm.FirmProfile;
import com.wease.user.User;
import com.wease.worker.Profession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface CrewRequestRepository extends JpaRepository<CrewRequest, Long> {

    List<CrewRequest> findByCustomerOrderByIdDesc(User customer);

    List<CrewRequest> findByFirmOrderByIdDesc(FirmProfile firm);

    boolean existsByCustomerAndFirmAndProfessionAndStartDateAndStatusIn(
            User customer, FirmProfile firm, Profession profession, LocalDate startDate, Collection<CrewStatus> statuses);
}