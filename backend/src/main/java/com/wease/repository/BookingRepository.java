package com.wease.repository;

import com.wease.entity.Booking;
import com.wease.entity.User;
import com.wease.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerOrderByCreatedAtDesc(User customer);

    List<Booking> findByWorkerOrderByCreatedAtDesc(WorkerProfile worker);

}
