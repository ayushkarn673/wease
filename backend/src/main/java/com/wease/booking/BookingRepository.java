package com.wease.booking;

import com.wease.user.User;
import com.wease.worker.WorkerProfile;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer(User customer);

    List<Booking> findByWorkerProfile(WorkerProfile workerProfile);

    Optional<Booking> findByIdAndWorkerProfile(Long id, WorkerProfile workerProfile);

    Optional<Booking> findByIdAndCustomer(Long id, User customer);

    // Row lock for changes that must not race, such as recording payments.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Booking> findWithLockById(Long id);

    // Is this worker already committed to a job at this exact date and time?
    boolean existsByWorkerProfileAndBookingDateAndBookingTimeAndStatusInAndIdNot(
            WorkerProfile workerProfile, LocalDate bookingDate, LocalTime bookingTime,
            Collection<BookingStatus> statuses, Long excludedId);

    // Has this customer already asked this worker for the same slot?
    boolean existsByCustomerAndWorkerProfileAndBookingDateAndBookingTimeAndStatusIn(
            User customer, WorkerProfile workerProfile, LocalDate bookingDate, LocalTime bookingTime,
            Collection<BookingStatus> statuses);
}
