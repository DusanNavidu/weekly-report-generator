package com.sisenco.backend.config;

import com.sisenco.backend.model.Role;
import com.sisenco.backend.model.User;
import com.sisenco.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * @author Dusan
 * @date 9/5/2026
 */
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.fullname}")
    private String adminFullName;

    @Value("${admin.default.email}")
    private String adminEmail;

    @Value("${admin.default.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User defaultManager = new User();
            defaultManager.setFullName(adminFullName);
            defaultManager.setEmail(adminEmail);

            defaultManager.setPassword(passwordEncoder.encode(adminPassword));

            defaultManager.setRole(Role.MANAGER);

            userRepository.save(defaultManager);
            System.out.println("Default Manager created successfully! Email: " + adminEmail);
        } else {
            System.out.println("Default Manager already exists. Skipping creation.");
        }
    }
}