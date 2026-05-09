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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private StudySessionRepository repository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());

        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(testUser, null, Collections.emptyList())
        );
    }

    @Test
    void shouldCalculateAreaAnalyticsWithTrend() {
        // Mock Total Data: Area, Total Feitas, Total Corretas
        Object[] totalRow = new Object[]{"Cirurgia", 100L, 70L};
        List<Object[]> totalList = Collections.singletonList(totalRow);
        when(repository.aggregateByAreaTotal(any())).thenReturn(totalList);

        // Mock Recent Data (Trend): Area, Total Feitas, Total Corretas
        Object[] recentRow = new Object[]{"Cirurgia", 10L, 9L}; // 90% trend
        List<Object[]> recentList = Collections.singletonList(recentRow);
        when(repository.aggregateByAreaSince(any(), any())).thenReturn(recentList);

        List<AreaAnalyticsResponse> results = analyticsService.getAreaAnalytics("TOTAL");

        assertEquals(1, results.size());
        assertEquals(70.0, results.get(0).successRate());
        assertEquals(90.0, results.get(0).trendRate());
        assertEquals("MEDIUM", results.get(0).performanceLevel());
    }
}
