package com.sisenco.backend.controller;

import com.sisenco.backend.dto.*;
import com.sisenco.backend.model.User;
import com.sisenco.backend.service.UserService;
import com.sisenco.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

/**
 * @author Dusan
 * @date 9/4/2026
 */

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@RequestBody User user) {
        UserResponseDto registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(new ApiResponse<>(201, "SUCCESS", registeredUser), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.findByEmail(request.getEmail());
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        AuthResponse authResponse = new AuthResponse(accessToken, refreshToken, user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", authResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        String reqRefreshToken = request.getRefreshToken();

        if (jwtUtil.validateToken(reqRefreshToken)) {
            String email = jwtUtil.extractEmail(reqRefreshToken);
            User user = userService.findByEmail(email);

            // Generate new access token
            String newAccessToken = jwtUtil.generateAccessToken(email);

            AuthResponse authResponse = new AuthResponse(newAccessToken, reqRefreshToken, user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", authResponse));
        } else {
            throw new RuntimeException("Invalid or expired refresh token!");
        }
    }
}
