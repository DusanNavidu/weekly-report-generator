package com.sisenco.backend.controller;

import com.sisenco.backend.dto.ApiResponse;
import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.UserResponseDto;
import com.sisenco.backend.model.Role;
import com.sisenco.backend.model.User;
import com.sisenco.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


/**
 * @author Dusan
 * @date 9/4/2026
 */

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", user));
    }

    @PostMapping("/add-member")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<UserResponseDto>> addTeamMember(@RequestBody User user) {
        user.setRole(Role.TEAM_MEMBER);
        UserResponseDto savedUser = userService.registerUser(user);
        return ResponseEntity.ok(new ApiResponse<>(201, "SUCCESS", savedUser));
    }

    @GetMapping("/members")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<PaginatedData<UserResponseDto>>> getAllTeamMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginatedData<UserResponseDto> paginatedMembers = userService.getTeamMembers(page, size);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", paginatedMembers));
    }
}