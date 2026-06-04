package com.medstudy.backend.modules.dashboard.service;

import com.medstudy.backend.modules.dashboard.dto.DashboardResponse;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final StudySessionRepository studySessionRepository;
    private final SimuladoRepository simuladoRepository;
    private final com.medstudy.backend.modules.analytics.service.AnalyticsService analyticsService;
    private final com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService;

    public DashboardService(StudySessionRepository studySessionRepository, 
                            SimuladoRepository simuladoRepository,
                            com.medstudy.backend.modules.analytics.service.AnalyticsService analyticsService,
                            com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService) {
        this.studySessionRepository = studySessionRepository;
        this.simuladoRepository = simuladoRepository;
        this.analyticsService = analyticsService;
        this.badgeService = badgeService;
    }

    public DashboardResponse getDashboardData() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();

        // 1. Session Metrics
        long totalSessions = studySessionRepository.countByUserId(userId);
        
        Long totalQuestions = studySessionRepository.sumTotalQuestionsByUserId(userId);
        Long totalCorrect = studySessionRepository.sumTotalCorrectByUserId(userId);
        
        totalQuestions = totalQuestions != null ? totalQuestions : 0L;
        totalCorrect = totalCorrect != null ? totalCorrect : 0L;
        
        double successRate = totalQuestions > 0 ? (double) totalCorrect / totalQuestions * 100 : 0.0;
        String perfLevel = calculatePerformanceLevel(successRate);

        DashboardResponse.StudyMetrics studyMetrics = new DashboardResponse.StudyMetrics(
            totalSessions,
            totalQuestions,
            successRate,
            perfLevel
        );

        // 2. Simulado Metrics
        List<Simulado> simulados = simuladoRepository.findAllByUserId(userId);
        long totalSimulados = simulados.size();
        double avgScore = 0;
        String bestArea = "N/A";
        String worstArea = "N/A";

        if (totalSimulados > 0) {
            long simTotalQuest = 0;
            long simTotalCorrect = 0;

            for (Simulado s : simulados) {
                simTotalQuest += (s.getCmTotal() + s.getCirTotal() + s.getPedTotal() + s.getGoTotal() + s.getPrevTotal());
                simTotalCorrect += (s.getCmAcertos() + s.getCirAcertos() + s.getPedAcertos() + s.getGoAcertos() + s.getPrevAcertos());
            }
            avgScore = simTotalQuest > 0 ? (double) simTotalCorrect / simTotalQuest * 100 : 0.0;
            
            Map<String, AreaTotal> totals = new HashMap<>();
            for (Simulado s : simulados) {
                updateAreaTotal(totals, "Clínica Médica", s.getCmTotal(), s.getCmAcertos());
                updateAreaTotal(totals, "Cirurgia", s.getCirTotal(), s.getCirAcertos());
                updateAreaTotal(totals, "Pediatria", s.getPedTotal(), s.getPedAcertos());
                updateAreaTotal(totals, "Ginecologia e Obstetrícia", s.getGoTotal(), s.getGoAcertos());
                updateAreaTotal(totals, "Preventiva", s.getPrevTotal(), s.getPrevAcertos());
            }
        }

        // 4. Analytics
        var areaAnalytics = analyticsService.getAreaAnalytics("TOTAL");

        String globalBestArea = "N/A";
        String globalWorstArea = "N/A";

        if (areaAnalytics != null && !areaAnalytics.isEmpty()) {
            globalBestArea = areaAnalytics.stream()
                .max(Comparator.comparingDouble(com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse::getAccuracy))
                .map(com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse::getGrandeArea).orElse("N/A");

            globalWorstArea = areaAnalytics.stream()
                .min(Comparator.comparingDouble(com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse::getAccuracy))
                .map(com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse::getGrandeArea).orElse("N/A");
        }

        DashboardResponse.SimuladoMetrics simuladoMetrics = new DashboardResponse.SimuladoMetrics(
            totalSimulados,
            avgScore,
            globalBestArea,
            globalWorstArea
        );

        // 3. Streak
        int streak = calculateStreak(userId);

        // 4. Analytics
        var topErrors = analyticsService.getTopErrorThemes("LAST_60_DAYS");

        // 5. Evolution (Last 6 months)
        List<DashboardResponse.EvolutionPoint> evolution = calculateEvolution(userId);

        // 6. Recent Badges
        List<com.medstudy.backend.modules.gamificacao.dto.UserBadgeResponse> recentBadges = badgeService.getUserBadges(userId).stream()
            .sorted(Comparator.comparing(com.medstudy.backend.modules.gamificacao.entity.UserBadge::getEarnedAt).reversed())
            .limit(3)
            .map(ub -> new com.medstudy.backend.modules.gamificacao.dto.UserBadgeResponse(
                ub.getBadgeType(),
                ub.getBadgeType().getDisplayName(),
                ub.getBadgeType().getDescription(),
                ub.getEarnedAt()
            ))
            .collect(java.util.stream.Collectors.toList());

        return new DashboardResponse(studyMetrics, simuladoMetrics, streak, areaAnalytics, topErrors, evolution, recentBadges);
    }

    private List<DashboardResponse.EvolutionPoint> calculateEvolution(UUID userId) {
        List<DashboardResponse.EvolutionPoint> points = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            int month = monthDate.getMonthValue();
            int year = monthDate.getYear();
            
            Long monthTotal = studySessionRepository.sumTotalQuestionsByUserIdAndMonth(userId, month, year);
            Long monthCorrect = studySessionRepository.sumTotalCorrectByUserIdAndMonth(userId, month, year);
            
            monthTotal = monthTotal != null ? monthTotal : 0L;
            monthCorrect = monthCorrect != null ? monthCorrect : 0L;
            
            double rate = monthTotal > 0 ? (double) monthCorrect / monthTotal * 100 : 0.0;
            
            String label = monthDate.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, new Locale("pt", "BR"));
            points.add(new DashboardResponse.EvolutionPoint(label, rate));
        }
        return points;
    }

    private String calculatePerformanceLevel(double rate) {
        if (rate < 70) return "LOW";
        if (rate < 85) return "MEDIUM";
        return "HIGH";
    }

    private int calculateStreak(UUID userId) {
        List<LocalDate> dates = studySessionRepository.findDistinctSessionDatesByUserId(userId);
        if (dates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!dates.get(0).equals(today) && !dates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        for (int i = 0; i < dates.size() - 1; i++) {
            if (ChronoUnit.DAYS.between(dates.get(i+1), dates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    private void updateAreaTotal(Map<String, AreaTotal> map, String name, int total, int acertos) {
        AreaTotal at = map.getOrDefault(name, new AreaTotal());
        at.total += total;
        at.acertos += acertos;
        map.put(name, at);
    }

    private static class AreaTotal {
        int total = 0;
        int acertos = 0;
        double getRate() { return total > 0 ? (double) acertos / total : 0; }
    }
}
