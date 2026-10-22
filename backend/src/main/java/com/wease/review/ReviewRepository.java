package com.wease.review;

import com.wease.booking.Booking;
import com.wease.worker.WorkerProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBooking(Booking booking);

    List<Review> findByWorkerProfileOrderByIdDesc(WorkerProfile workerProfile, Pageable pageable);

    // Rows of [workerProfileId, average rating, review count] for the given workers, in one query.
    @Query("select r.workerProfile.id, avg(r.rating), count(r) from Review r"
            + " where r.workerProfile.id in :workerIds group by r.workerProfile.id")
    List<Object[]> statsForWorkers(@Param("workerIds") Collection<Long> workerIds);

    // Rows of [rating, count] for one worker, for the star breakdown.
    @Query("select r.rating, count(r) from Review r where r.workerProfile = :worker group by r.rating")
    List<Object[]> ratingCounts(@Param("worker") WorkerProfile worker);
}