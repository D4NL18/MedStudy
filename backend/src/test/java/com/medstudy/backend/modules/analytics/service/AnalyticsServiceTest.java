package com.medstudy.backend.modules.analytics.service;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private StudySessionRepository repository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AnalyticsService analyticsService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getAreaAnalytics_ShouldReturnDataWithTrend() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);

        UUID userId = user.getId();

        List<Object[]> totals = new ArrayList<>();
        totals.add(new Object[]{"CLINICA_MEDICA", 100L, 80L, 5L});

        List<Object[]> recent = new ArrayList<>();
        recent.add(new Object[]{"CLINICA_MEDICA", 20L, 18L});

        when(repository.aggregateByAreaTotal(userId)).thenReturn(totals);
        when(repository.aggregateByAreaSince(eq(userId), any())).thenReturn(recent);

        List<AreaAnalyticsResponse> result = analyticsService.getAreaAnalytics("TOTAL");

        assertFalse(result.isEmpty());
        assertEquals("CLINICA_MEDICA", result.get(0).grandeArea());
        assertEquals(80.0, result.get(0).accuracy());
        assertEquals(90.0, result.get(0).trendRate()); // 18/20 * 100
    }

    @Test
    void getTopicAnalytics_ShouldReturnData() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);

        UUID userId = user.getId();

        List<Object[]> totals = new ArrayList<>();
        totals.add(new Object[]{"Pneumo", "CLINICA_MEDICA", 50L, 40L, 3L});

        List<Object[]> recent = new ArrayList<>();
        recent.add(new Object[]{"Pneumo", "CLINICA_MEDICA", 10L, 9L});

        when(repository.aggregateByTopicTotal(userId)).thenReturn(totals);
        when(repository.aggregateByTopicSince(eq(userId), any())).thenReturn(recent);

        var result = analyticsService.getTopicAnalytics("TOTAL");

        assertFalse(result.isEmpty());
        assertEquals("Pneumo", result.get(0).tema());
        assertEquals(90.0, result.get(0).trendRate());
    }
}
