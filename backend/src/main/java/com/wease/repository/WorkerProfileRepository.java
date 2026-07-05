package com.wease.repository;

import com.wease.entity.Profession;
import com.wease.entity.User;
import com.wease.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkerProfileRepository
        extends JpaRepository<WorkerProfile, Long> {

    List<WorkerProfile> findByAvailableTrue();

    Optional<WorkerProfile> findByUser(User user);

    List<WorkerProfile> findByAvailableTrueAndProfession(Profession profession);

    List<WorkerProfile> findByAvailableTrueAndUserFullNameContainingIgnoreCase(String keyword);

    List<WorkerProfile> findByAvailableTrueAndProfessionAndUserFullNameContainingIgnoreCase(Profession profession, String keyword);

}
