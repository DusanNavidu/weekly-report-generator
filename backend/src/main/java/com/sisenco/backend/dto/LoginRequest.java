package com.sisenco.backend.dto;

import lombok.Data;

/**
 * @author Dusan
 * @date 9/4/2026
 */

@Data
public class LoginRequest {
    private String email;
    private String password;
}
