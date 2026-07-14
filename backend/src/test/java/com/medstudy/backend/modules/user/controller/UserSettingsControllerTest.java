package com.medstudy.backend.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtAuthenticationFilter;
import com.medstudy.backend.modules.user.dto.UserSettingsRequest;
import com.medstudy.backend.modules.user.dto.UserSettingsResponse;
import com.medstudy.backend.modules.user.service.UserSettingsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserSettingsController.class, excludeFilters = {
        @org.springframework.context.annotation.ComponentScan.Filter(
                type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class)
})
class UserSettingsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private UserSettingsService service;

    @Test
    void getSettings_ShouldReturn200() throws Exception {
        UserSettingsResponse response = UserSettingsResponse.builder()
                .maxReviewsPerDay(50)
                .themeColor("dark")
                .build();

        when(service.getSettings()).thenReturn(response);

        mockMvc.perform(get("/api/user-settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.maxReviewsPerDay").value(50))
                .andExpect(jsonPath("$.themeColor").value("dark"));
    }

    @Test
    void updateSettings_ShouldReturn200() throws Exception {
        UserSettingsRequest request = new UserSettingsRequest();
        request.setMaxReviewsPerDay(150);
        request.setThemeColor("light");

        UserSettingsResponse response = UserSettingsResponse.builder()
                .maxReviewsPerDay(150)
                .themeColor("light")
                .build();

        when(service.updateSettings(any())).thenReturn(response);

        mockMvc.perform(put("/api/user-settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.maxReviewsPerDay").value(150))
                .andExpect(jsonPath("$.themeColor").value("light"));
    }
}
