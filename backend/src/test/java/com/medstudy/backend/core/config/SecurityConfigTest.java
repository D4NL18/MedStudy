package com.medstudy.backend.core.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigTest {

    @MockitoBean
    private JavaMailSender javaMailSender;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldIgnoreCsrfForApiEndpoints() throws Exception {
        // A POST request to an API endpoint without a CSRF token.
        // It shouldn't return 403 Forbidden (CSRF blocked).
        // It might return 400 Bad Request because of missing body or 401 Unauthorized for secure endpoints.
        // By testing /api/auth/login without body, we expect 400 Bad Request, not 403.
        mockMvc.perform(post("/api/auth/login"))
               .andExpect(status().isBadRequest());
    }
}
