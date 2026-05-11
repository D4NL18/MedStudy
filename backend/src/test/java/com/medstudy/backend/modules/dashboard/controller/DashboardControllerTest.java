package com.medstudy.backend.modules.dashboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.dashboard.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc(addFilters = true)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DashboardService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    @WithMockUser
    void getDashboard_ShouldReturn200() throws Exception {
        when(service.getDashboardData()).thenReturn(null);

        mockMvc.perform(get("/api/dashboard")
                .with(csrf()))
                .andExpect(status().isOk());
    }
}
