package com.medstudy.backend.core.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
@AutoConfigureMockMvc
class RateLimitIntegrationTest {

    @MockitoBean
    private JavaMailSender javaMailSender;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldBlockAnonymousAfter7Requests() throws Exception {
        String testIp = "192.168.100.1";
        
        for (int i = 0; i < 7; i++) {
            mockMvc.perform(get("/api/public-endpoint")
                    .with(request -> {
                        request.setRemoteAddr(testIp);
                        return request;
                    }))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    org.assertj.core.api.Assertions.assertThat(status).isNotEqualTo(429);
                });
        }
        
        // 8th request should be blocked (429)
        mockMvc.perform(get("/api/public-endpoint")
                .with(request -> {
                    request.setRemoteAddr(testIp);
                    return request;
                }))
            .andExpect(status().isTooManyRequests());
    }

    @Test
    void shouldBlockUserAfter20Requests() throws Exception {
        String token = "Bearer test-token-for-user";
        
        for (int i = 0; i < 20; i++) {
            mockMvc.perform(get("/api/user-endpoint")
                    .header("Authorization", token))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    org.assertj.core.api.Assertions.assertThat(status).isNotEqualTo(429);
                });
        }
        
        // 21st request should be blocked (429)
        mockMvc.perform(get("/api/user-endpoint")
                .header("Authorization", token))
            .andExpect(status().isTooManyRequests());
    }
    
    @Test
    void shouldBlockAuthEndpointAfter5Requests() throws Exception {
        String testIp = "192.168.100.2";
        
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/auth/login")
                    .with(request -> {
                        request.setRemoteAddr(testIp);
                        return request;
                    }))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    org.assertj.core.api.Assertions.assertThat(status).isNotEqualTo(429);
                });
        }
        
        // 6th request should be blocked (429)
        mockMvc.perform(get("/api/auth/login")
                .with(request -> {
                    request.setRemoteAddr(testIp);
                    return request;
                }))
            .andExpect(status().isTooManyRequests());
    }
}
