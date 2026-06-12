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
    void getAreaAnalytics_ShouldReturnDataWithTrends() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);

        UUID userId = user.getId();

        List<Object[]> totals = new ArrayList<>();
        totals.add(new Object[]{"CLINICA_MEDICA", 100L, 80L, 5L});

        List<Object[]> last30d = new ArrayList<>();
        last30d.add(new Object[]{"CLINICA_MEDICA", 40L, 30L}); // 75%

        List<Object[]> last7d = new ArrayList<>();
        last7d.add(new Object[]{"CLINICA_MEDICA", 20L, 18L}); // 90%

        when(repository.aggregateByAreaTotal(userId)).thenReturn(totals);
        when(repository.aggregateByAreaSince(eq(userId), any())).thenReturn(last30d).thenReturn(last7d);

        List<AreaAnalyticsResponse> result = analyticsService.getAreaAnalytics("TOTAL");

        assertFalse(result.isEmpty());
        assertEquals("CLINICA_MEDICA", result.get(0).getGrandeArea());
        assertEquals(80.0, result.get(0).getAccuracy());
        assertEquals(15.0, result.get(0).getTrendShort(), 0.01); // 90 - 75
        assertEquals(-5.0, result.get(0).getTrendLong(), 0.01);  // 75 - 80
        assertEquals("MEDIUM", result.get(0).getPerformanceLevel());
    }

    @Test
    void getTopicAnalytics_ShouldReturnData() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);

        UUID userId = user.getId();

        List<Object[]> totals = new ArrayList<>();
        totals.add(new Object[]{"Pneumo", "CLINICA_MEDICA", 50L, 40L, 3L});

        List<Object[]> last30d = new ArrayList<>();
        last30d.add(new Object[]{"Pneumo", "CLINICA_MEDICA", 10L, 8L}); // 80%

        List<Object[]> last7d = new ArrayList<>();
        last7d.add(new Object[]{"Pneumo", "CLINICA_MEDICA", 10L, 9L}); // 90%

        when(repository.aggregateByTopicTotal(userId)).thenReturn(totals);
        when(repository.aggregateByTopicSince(eq(userId), any())).thenReturn(last30d).thenReturn(last7d);

        var result = analyticsService.getTopicAnalytics("TOTAL");

        assertFalse(result.isEmpty());
        assertEquals("Pneumo", result.get(0).getTema());
        assertEquals(10.0, result.get(0).getTrendShort(), 0.01); // 90 - 80
    }
}
