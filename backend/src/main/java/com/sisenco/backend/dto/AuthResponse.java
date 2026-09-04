package com.sisenco.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author Dusan
 * @date 9/4/2026
 */

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String role;
}
