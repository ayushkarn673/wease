package com.wease.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PhoneOtpRepository extends JpaRepository<PhoneOtp, Long> {

    Optional<PhoneOtp> findFirstByPhoneOrderByIdDesc(String phone);

    long countByPhoneAndCreatedAtAfter(String phone, LocalDateTime since);

    List<PhoneOtp> findByPhoneAndUsedAtIsNull(String phone);
}