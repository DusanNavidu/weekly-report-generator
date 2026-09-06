package com.sisenco.backend.service.impl;

import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.UserResponseDto;
import com.sisenco.backend.model.Role;
import com.sisenco.backend.model.User;
import com.sisenco.backend.repository.UserRepository;
import com.sisenco.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dusan
 * @date 9/4/2026
 */

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public PaginatedData<UserResponseDto> getTeamMembers(int page, int size) {
        Page<User> userPage = userRepository.findByRoleAndIsActiveTrue(Role.TEAM_MEMBER, PageRequest.of(page, size));

        List<UserResponseDto> dtoList = userPage.getContent().stream()
                .map(this::mapToDto)
                .toList();

        return new PaginatedData<>(
                dtoList,
                userPage.getNumber(),
                userPage.getTotalPages(),
                userPage.getTotalElements()
        );
    }

    private UserResponseDto mapToDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }
}