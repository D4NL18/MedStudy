package com.medstudy.backend.modules.analytics.service;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicAnalyticsResponse;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final StudySessionRepository repository;

    public AnalyticsService(StudySessionRepository repository) {
        this.repository = repository;
    }

    public List<AreaAnalyticsResponse> getAreaAnalytics(String period) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();

        List<Object[]> totals = repository.aggregateByAreaTotal(userId);
        List<Object[]> recent = repository.aggregateByAreaSince(userId, LocalDate.now().minusDays(7));

        List<AreaAnalyticsResponse> responses = new ArrayList<>();
        for (Object[] row : totals) {
            String area = (String) row[0];
            long totalQuest = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            long totalCorr = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            long sessions = row[3] != null ? ((Number) row[3]).longValue() : 0L;
            double rate = totalQuest > 0 ? (double) totalCorr / totalQuest * 100 : 0;

            double trend = calculateTrend(area, recent, 1);

            responses.add(new AreaAnalyticsResponse(
                area,
                totalQuest,
                rate,
                sessions,
                trend
            ));
        }
        return responses;
    }

    public List<TopicAnalyticsResponse> getTopicAnalytics(String period) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();

        List<Object[]> totals = repository.aggregateByTopicTotal(userId);
        List<Object[]> recent = repository.aggregateByTopicSince(userId, LocalDate.now().minusDays(7));

        List<TopicAnalyticsResponse> responses = new ArrayList<>();
        for (Object[] row : totals) {
            String tema = (String) row[0];
            String area = (String) row[1];
            long totalQuest = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            long totalCorr = row[3] != null ? ((Number) row[3]).longValue() : 0L;
            long sessions = row[4] != null ? ((Number) row[4]).longValue() : 0L;
            double rate = totalQuest > 0 ? (double) totalCorr / totalQuest * 100 : 0;

            double trend = calculateTrend(tema, recent, 2);

            responses.add(new TopicAnalyticsResponse(
                tema,
                area,
                totalQuest,
                rate,
                sessions,
                trend
            ));
        }
        return responses;
    }

    private LocalDate calculateSinceDate(String period) {
        if (period == null) return LocalDate.of(2000, 1, 1);
        return switch (period.toUpperCase()) {
            case "LAST_7_DAYS" -> LocalDate.now().minusDays(7);
            case "LAST_30_DAYS" -> LocalDate.now().minusDays(30);
            case "CURRENT_YEAR" -> LocalDate.now().withDayOfYear(1);
            default -> LocalDate.of(2000, 1, 1);
        };
    }

    private double calculateTrend(String key, List<Object[]> recentData, int valueIndex) {
        for (Object[] row : recentData) {
            if (row[0].equals(key)) {
                long q = row[valueIndex] != null ? ((Number) row[valueIndex]).longValue() : 0L;
                long c = row[valueIndex + 1] != null ? ((Number) row[valueIndex + 1]).longValue() : 0L;
                return q > 0 ? (double) c / q * 100 : 0;
            }
        }
        return 0;
    }

    private String calculatePerformanceLevel(double rate) {
        if (rate < 70) return "LOW";
        if (rate < 80) return "MEDIUM";
        return "HIGH";
    }
}
