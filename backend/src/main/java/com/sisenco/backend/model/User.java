package com.sisenco.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Dusan
 * @date 9/4/2026
 */

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String fullName;
    private String email;
    private String password;
    private Role role; // TEAM_MEMBER or MANAGER

    private boolean isActive = true;
}
