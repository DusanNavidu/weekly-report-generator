package com.sisenco.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author Dusan
 * @date 9/9/2026
 */

@SpringBootTest
@AutoConfigureMockMvc
public class ReportControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String MANAGER_ENDPOINT = "/api/reports/all";

    @Test
    @WithMockUser(roles = "TEAM_MEMBER")
    public void whenTeamMemberAccessManagerEndpoint_thenForbidden() throws Exception {
        mockMvc.perform(get(MANAGER_ENDPOINT))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    public void whenManagerAccessManagerEndpoint_thenOk() throws Exception {
        mockMvc.perform(get(MANAGER_ENDPOINT))
                .andExpect(status().isOk());
    }

    @Test
    public void whenUnauthenticatedAccess_thenUnauthorized() throws Exception {
        mockMvc.perform(get(MANAGER_ENDPOINT))
                .andExpect(status().isUnauthorized());
    }
}