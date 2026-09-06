package com.sisenco.backend.repository;

import com.sisenco.backend.model.Role;
import com.sisenco.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Dusan
 * @date 9/4/2026
 */

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Page<User> findByRoleAndIsActiveTrue(Role role, Pageable pageable);
}
