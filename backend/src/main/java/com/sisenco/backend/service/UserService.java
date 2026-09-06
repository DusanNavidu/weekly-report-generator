package com.sisenco.backend.service;

import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.UserResponseDto;
import com.sisenco.backend.model.User;

/**
 * @author Dusan
 * @date 9/4/2026
 */

public interface UserService {
    UserResponseDto registerUser(User user);
    User findByEmail(String email);
    PaginatedData<UserResponseDto> getTeamMembers(int page, int size);

    void deleteUser(String id);
}
