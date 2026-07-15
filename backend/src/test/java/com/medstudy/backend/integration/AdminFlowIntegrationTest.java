package com.medstudy.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.dto.AdminOverrideRequestDto;
import com.medstudy.backend.modules.subscription.dto.AdminSubscriptionStatsDto;
import com.medstudy.backend.modules.subscription.dto.AdminUserSubscriptionDto;
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
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"test", "mock-pix"})
@Transactional
class AdminFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User adminUser;
    private User normalUser;
    private String adminJwt;
    private String normalJwt;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setName("System Admin");
        adminUser.setEmail("admin_" + UUID.randomUUID().toString().substring(0, 8) + "@medstudy.com");
        adminUser.setPassword(passwordEncoder.encode("AdminPass123!"));
        adminUser.setRole("ROLE_ADMIN");
        userRepository.save(adminUser);
        this.adminJwt = jwtService.generateToken(adminUser);

        normalUser = new User();
        normalUser.setName("Student User");
        normalUser.setEmail("student_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com");
        normalUser.setPassword(passwordEncoder.encode("StudentPass123!"));
        normalUser.setRole("ROLE_USER");
        userRepository.save(normalUser);
        this.normalJwt = jwtService.generateToken(normalUser);

        Subscription sub = new Subscription();
        sub.setUser(normalUser);
        sub.setStatus(SubscriptionStatus.TRIAL);
        sub.setTrialStartDate(Instant.now());
        sub.setTrialEndDate(Instant.now().plus(30, ChronoUnit.DAYS));
        subscriptionRepository.save(sub);
    }

    @Test
    @DisplayName("Requisição para estatísticas pelo Admin deve retornar métricas agregadas (HTTP 200)")
    void getStats_AsAdmin_ShouldReturnAggregatedMetrics() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/subscriptions/stats")
                .header("Authorization", "Bearer " + adminJwt))
            .andExpect(status().isOk())
            .andReturn();

        AdminSubscriptionStatsDto stats = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            AdminSubscriptionStatsDto.class
        );

        assertNotNull(stats);
        assertTrue(stats.trialCount() >= 1);
    }

    @Test
    @DisplayName("Sobreposição manual de acesso pelo Admin deve atualizar status, isAdminOverride e motivo notes")
    void overrideUserSubscription_AsAdmin_ShouldGrantAccessAndSetNotes() throws Exception {
        AdminOverrideRequestDto request = new AdminOverrideRequestDto(
            AdminOverrideRequestDto.OverrideOption.GRANT_LIFETIME,
            "Acesso VIP Concedido pelo Desenvolvedor"
        );

        MvcResult result = mockMvc.perform(post("/api/admin/subscriptions/users/" + normalUser.getId() + "/override")
                .header("Authorization", "Bearer " + adminJwt)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andReturn();

        AdminUserSubscriptionDto dto = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            AdminUserSubscriptionDto.class
        );

        assertEquals(SubscriptionStatus.LIFETIME, dto.status());
        assertTrue(dto.isAdminOverride());
        assertEquals("Acesso VIP Concedido pelo Desenvolvedor", dto.notes());

        Subscription subscription = subscriptionRepository.findByUserId(normalUser.getId()).orElseThrow();
        assertEquals(SubscriptionStatus.LIFETIME, subscription.getStatus());
        assertTrue(subscription.isAdminOverride());
        assertEquals("Acesso VIP Concedido pelo Desenvolvedor", subscription.getNotes());
    }

    @Test
    @DisplayName("Tentativa de acesso por usuário comum sem a Role ADMIN deve ser recusada com HTTP 403 Forbidden")
    void nonAdminAccess_ShouldReturn403Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/subscriptions/stats")
                .header("Authorization", "Bearer " + normalJwt))
            .andExpect(status().isForbidden());
    }
}
