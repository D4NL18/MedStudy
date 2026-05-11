package com.medstudy.backend.core.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityGateTest {

    @Autowired
    private MockMvc mockMvc;

    @org.springframework.test.context.bean.override.mockito.MockitoBean
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @Test
    void studySessions_ShouldReturn403_WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/study-sessions"))
                .andExpect(status().isForbidden());
    }

    @Test
    void simulados_ShouldReturn403_WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/simulados"))
                .andExpect(status().isForbidden());
    }

    @Test
    void flashcards_ShouldReturn403_WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/flashcards"))
                .andExpect(status().isForbidden());
    }

    @Test
    void lessons_ShouldReturn403_WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/lessons"))
                .andExpect(status().isForbidden());
    }

    @Test
    void analytics_ShouldReturn403_WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/analytics/summary"))
                .andExpect(status().isForbidden());
    }

    @Test
    void dashboard_ShouldReturn403_WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isForbidden());
    }
}
