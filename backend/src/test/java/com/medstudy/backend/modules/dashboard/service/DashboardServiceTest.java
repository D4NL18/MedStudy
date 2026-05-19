package com.medstudy.backend.modules.dashboard.service;

import com.medstudy.backend.modules.dashboard.dto.DashboardResponse;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private SimuladoRepository simuladoRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private com.medstudy.backend.modules.analytics.service.AnalyticsService analyticsService;

    @Mock
    private com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private DashboardService dashboardService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getDashboardData_ShouldCalculateMetricsCorrectly() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);

        UUID userId = user.getId();

        // Sessions mocks
        when(studySessionRepository.countByUserId(userId)).thenReturn(10L);
        when(studySessionRepository.sumTotalQuestionsByUserId(userId)).thenReturn(100L);
        when(studySessionRepository.sumTotalCorrectByUserId(userId)).thenReturn(80L);
        
        List<LocalDate> dates = Arrays.asList(LocalDate.now(), LocalDate.now().minusDays(1), LocalDate.now().minusDays(2));
        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(dates);

        // Simulados mocks
        Simulado sim = new Simulado();
        sim.setCmTotal(20); sim.setCmAcertos(15);
        sim.setCirTotal(20); sim.setCirAcertos(10);
        sim.setPedTotal(20); sim.setPedAcertos(18);
        sim.setGoTotal(20); sim.setGoAcertos(12);
        sim.setPrevTotal(20); sim.setPrevAcertos(14);
        
        when(simuladoRepository.findAllByUserId(userId)).thenReturn(Collections.singletonList(sim));
        
        when(analyticsService.getAreaAnalytics("TOTAL")).thenReturn(Collections.emptyList());
        when(analyticsService.getTopErrorThemes("LAST_60_DAYS")).thenReturn(Collections.emptyList());
        when(badgeService.getUserBadges(userId)).thenReturn(Collections.emptyList());

        DashboardResponse response = dashboardService.getDashboardData();

        assertEquals(10L, response.sessions().totalSessions());
        assertEquals(80.0, response.sessions().successRate());
        assertEquals("MEDIUM", response.sessions().performanceLevel());
        assertEquals(3, response.currentStreak());
        assertEquals(69.0, response.simulados().averageScore());
        assertEquals("Pediatria", response.simulados().bestArea());
        assertEquals("Cirurgia", response.simulados().worstArea());
    }
}
