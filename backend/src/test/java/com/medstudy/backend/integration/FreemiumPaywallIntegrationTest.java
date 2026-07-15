package com.medstudy.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.config.CacheConfig;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.auth.dto.RegisterRequest;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.cache.CacheManager;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class FreemiumPaywallIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        if (cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE) != null) {
            cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE).clear();
        }
    }

    @Test
    @DisplayName("Should create 30-day TRIAL subscription on register and allow access to protected API")
    void register_ShouldCreateTrialAndAllowProtectedAccess() throws Exception {
        String email = "trialtest_" + UUID.randomUUID() + "@medstudy.com";
        RegisterRequest registerRequest = new RegisterRequest("Trial User", email, "Password123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").exists());

        User user = userRepository.findByEmail(email).orElseThrow();
        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElseThrow();

        assertEquals(SubscriptionStatus.TRIAL, subscription.getStatus());
        assertNotNull(subscription.getTrialEndDate());

        String jwtToken = jwtService.generateToken(user);

        mockMvc.perform(get("/api/user-settings")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should block access with HTTP 402 Payment Required when subscription is EXPIRED")
    void expiredSubscription_AccessingProtectedEndpoint_ShouldReturn402() throws Exception {
        User user = new User();
        user.setName("Expired User");
        user.setEmail("expired_" + UUID.randomUUID() + "@medstudy.com");
        user.setPassword(passwordEncoder.encode("Password123!"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.EXPIRED);
        subscription.setTrialStartDate(Instant.now().minus(40, ChronoUnit.DAYS));
        subscription.setTrialEndDate(Instant.now().minus(10, ChronoUnit.DAYS));
        subscriptionRepository.save(subscription);

        String jwtToken = jwtService.generateToken(user);

        mockMvc.perform(get("/api/user-settings")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isPaymentRequired())
                .andExpect(jsonPath("$.code").value("PAYWALL_REQUIRED"))
                .andExpect(jsonPath("$.status").value("EXPIRED"))
                .andExpect(jsonPath("$.message").value(containsString("expirado")));
    }

    @Test
    @DisplayName("Should allow access to exempt auth endpoint even when subscription is EXPIRED")
    void expiredSubscription_AccessingExemptEndpoint_ShouldReturn200() throws Exception {
        User user = new User();
        user.setName("Expired User Exempt");
        user.setEmail("exempt_" + UUID.randomUUID() + "@medstudy.com");
        user.setPassword(passwordEncoder.encode("Password123!"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.EXPIRED);
        subscription.setTrialStartDate(Instant.now().minus(40, ChronoUnit.DAYS));
        subscription.setTrialEndDate(Instant.now().minus(10, ChronoUnit.DAYS));
        subscriptionRepository.save(subscription);

        String jwtToken = jwtService.generateToken(user);

        // Accessing /api/auth/logout (an exempt endpoint under /api/auth/** returning 204 No Content)
        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"dummy\"}"))
                .andExpect(status().isNoContent());
    }
}
