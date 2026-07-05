package com.wease.repository;

import com.wease.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkerProfileRepository
        extends JpaRepository<WorkerProfile, Long> {

    List<WorkerProfile> findByAvailableTrue();

}
