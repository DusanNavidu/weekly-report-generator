package com.sisenco.backend.repository;

import com.sisenco.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    boolean existsByNameAndIsActiveTrue(String name);
    List<Project> findByIsActiveTrue();
}
