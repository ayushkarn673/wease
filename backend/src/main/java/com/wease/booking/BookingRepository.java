package com.wease.booking;

import com.wease.user.User;
import com.wease.worker.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer(User customer);

    List<Booking> findByWorkerProfile(WorkerProfile workerProfile);
}
