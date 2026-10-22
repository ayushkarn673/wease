package com.wease.review;

import com.wease.crew.CrewRequest;
import com.wease.firm.FirmProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface FirmReviewRepository extends JpaRepository<FirmReview, Long> {

    boolean existsByCrewRequest(CrewRequest crewRequest);

    List<FirmReview> findByFirmOrderByIdDesc(FirmProfile firm, Pageable pageable);

    // Rows of [firmId, average rating, review count] for the given firms, in one query.
    @Query("select r.firm.id, avg(r.rating), count(r) from FirmReview r where r.firm.id in :firmIds group by r.firm.id")
    List<Object[]> statsForFirms(@Param("firmIds") Collection<Long> firmIds);

    // Rows of [rating, count] for one firm, for the star breakdown.
    @Query("select r.rating, count(r) from FirmReview r where r.firm = :firm group by r.rating")
    List<Object[]> ratingCounts(@Param("firm") FirmProfile firm);
}