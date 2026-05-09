package com.medstudy.backend.modules.dashboard.service;

import com.medstudy.backend.modules.dashboard.dto.DashboardResponse;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
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
class DashboardServiceTest {

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private SimuladoRepository simuladoRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@medstudy.com");

        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(testUser, null, Collections.emptyList())
        );
    }

    @Test
    void shouldCalculateStreakCorrectly_WithTodayAndYesterday() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today, today.minusDays(1), today.minusDays(2));
        
        when(studySessionRepository.findDistinctSessionDatesByUserId(any())).thenReturn(dates);
        
        DashboardResponse response = dashboardService.getDashboardData();
        
        assertEquals(3, response.currentStreak());
    }

    @Test
    void shouldCalculateStreakCorrectly_WithYesterdayOnly() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today.minusDays(1), today.minusDays(2));
        
        when(studySessionRepository.findDistinctSessionDatesByUserId(any())).thenReturn(dates);
        
        DashboardResponse response = dashboardService.getDashboardData();
        
        assertEquals(2, response.currentStreak());
    }

    @Test
    void shouldReturnZeroStreak_WhenLastSessionWasThreeDaysAgo() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today.minusDays(3), today.minusDays(4));
        
        when(studySessionRepository.findDistinctSessionDatesByUserId(any())).thenReturn(dates);
        
        DashboardResponse response = dashboardService.getDashboardData();
        
        assertEquals(0, response.currentStreak());
    }

    @Test
    void shouldReturnPerformanceLevelHigh_WhenRateIsAboveEighty() {
        when(studySessionRepository.sumTotalQuestionsByUserId(any())).thenReturn(100L);
        when(studySessionRepository.sumTotalCorrectByUserId(any())).thenReturn(85L);
        
        DashboardResponse response = dashboardService.getDashboardData();
        
        assertEquals("HIGH", response.sessions().performanceLevel());
    }
}
