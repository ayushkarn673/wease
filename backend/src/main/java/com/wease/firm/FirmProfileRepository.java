package com.wease.firm;

import com.wease.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FirmProfileRepository extends JpaRepository<FirmProfile, Long> {

    Optional<FirmProfile> findByUser(User user);

    List<FirmProfile> findByAvailableTrue();
}