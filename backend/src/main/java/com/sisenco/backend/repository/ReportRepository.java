package com.sisenco.backend.repository;

import com.sisenco.backend.model.Report;
import com.sisenco.backend.model.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
    Page<Report> findByUserId(String userId, Pageable pageable);
    long countByStatus(ReportStatus status);
}
