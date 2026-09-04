package com.sisenco.backend.service;

import com.sisenco.backend.model.User;

/**
 * @author Dusan
 * @date 9/4/2026
 */

public interface UserService {
    User registerUser(User user);
    User findByEmail(String email);
}
