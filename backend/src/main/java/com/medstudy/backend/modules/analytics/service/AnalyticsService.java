package com.medstudy.backend.modules.analytics.service;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicErrorResponse;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for processing and retrieving analytics data.
 */
@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final StudySessionRepository repository;

    /**
     * Constructs a new AnalyticsService with the given repository.
     *
     * @param repository The study session repository.
     */
    public AnalyticsService(StudySessionRepository repository) {
        this.repository = repository;
    }

    /**
     * Retrieves analytics data aggregated by area for a specified period.
     *
     * @param period The period to filter analytics data.
     * @return A list of area analytics responses.
     */
    public List<AreaAnalyticsResponse> getAreaAnalytics(String period) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();

        List<Object[]> totals = repository.aggregateByAreaTotal(userId);
        List<Object[]> last30d = repository.aggregateByAreaSince(userId, LocalDate.now().minusDays(30));
        List<Object[]> last7d = repository.aggregateByAreaSince(userId, LocalDate.now().minusDays(7));

        java.util.Map<String, AreaData> aggregated = new java.util.HashMap<>();

        for (Object[] row : totals) {
            String rawArea = (String) row[0];
            String area = normalizeAreaName(rawArea);
            long totalQuest = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            long totalCorr = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            long sessions = row[3] != null ? ((Number) row[3]).longValue() : 0L;
            
            AreaData data = aggregated.computeIfAbsent(area, k -> new AreaData());
            data.totalQuest += totalQuest;
            data.totalCorr += totalCorr;
            data.sessions += sessions;
        }

        List<AreaAnalyticsResponse> responses = new ArrayList<>();
        for (java.util.Map.Entry<String, AreaData> entry : aggregated.entrySet()) {
            String area = entry.getKey();
            AreaData data = entry.getValue();
            double rateGlobal = data.totalQuest > 0 ? (double) data.totalCorr / data.totalQuest * 100 : 0;

            double rate30d = calculateNormalizedRate(area, last30d, 1);
            double rate7d = calculateNormalizedRate(area, last7d, 1);

            double trendShort = rate30d > 0 ? rate7d - rate30d : 0;
            double trendLong = rateGlobal > 0 ? rate30d - rateGlobal : 0;

            responses.add(new AreaAnalyticsResponse(
                area,
                data.totalQuest,
                rateGlobal,
                data.sessions,
                trendShort,
                trendLong,
                calculatePerformanceLevel(rateGlobal)
            ));
        }
        return responses;
    }

    private static class AreaData {
        long totalQuest = 0;
        long totalCorr = 0;
        long sessions = 0;
    }

    private String normalizeAreaName(String raw) {
        if (raw == null) return "Desconhecido";
        String lower = raw.toLowerCase();
        if (lower.contains("clnica") || lower.contains("clinica")) return "Cl\u00EDnica M\u00E9dica";
        if (lower.contains("ginecologia") || lower.contains("obstet")) return "Ginecologia e Obstetr\u00EDcia";
        if (lower.contains("pediatria")) return "Pediatria";
        if (lower.contains("cirurgia")) return "Cirurgia";
        if (lower.contains("preventiva")) return "Preventiva";
        return raw;
    }

    private double calculateNormalizedRate(String normalizedKey, List<Object[]> data, int valueIndex) {
        long q = 0;
        long c = 0;
        for (Object[] row : data) {
            String area = normalizeAreaName((String) row[0]);
            if (area.equals(normalizedKey)) {
                q += row[valueIndex] != null ? ((Number) row[valueIndex]).longValue() : 0L;
                c += row[valueIndex + 1] != null ? ((Number) row[valueIndex + 1]).longValue() : 0L;
            }
        }
        return q > 0 ? (double) c / q * 100 : 0;
    }

    /**
     * Retrieves analytics data aggregated by topic for a specified period.
     *
     * @param period The period to filter analytics data.
     * @return A list of topic analytics responses.
     */
    public List<TopicAnalyticsResponse> getTopicAnalytics(String period) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();

        List<Object[]> totals = repository.aggregateByTopicTotal(userId);
        List<Object[]> last30d = repository.aggregateByTopicSince(userId, LocalDate.now().minusDays(30));
        List<Object[]> last7d = repository.aggregateByTopicSince(userId, LocalDate.now().minusDays(7));

        List<TopicAnalyticsResponse> responses = new ArrayList<>();
        for (Object[] row : totals) {
            String tema = (String) row[0];
            String area = (String) row[1];
            long totalQuest = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            long totalCorr = row[3] != null ? ((Number) row[3]).longValue() : 0L;
            long sessions = row[4] != null ? ((Number) row[4]).longValue() : 0L;
            double rateGlobal = totalQuest > 0 ? (double) totalCorr / totalQuest * 100 : 0;

            double rate30d = calculateRate(tema, last30d, 2);
            double rate7d = calculateRate(tema, last7d, 2);

            double trendShort = rate30d > 0 ? rate7d - rate30d : 0;
            double trendLong = rateGlobal > 0 ? rate30d - rateGlobal : 0;

            responses.add(new TopicAnalyticsResponse(
                tema,
                area,
                totalQuest,
                rateGlobal,
                sessions,
                trendShort,
                trendLong,
                calculatePerformanceLevel(rateGlobal)
            ));
        }
        return responses;
    }

    /**
     * Retrieves the top error themes for a specified period.
     *
     * @param period The period to filter analytics data.
     * @return A list of top error themes responses.
     */
    public List<TopicErrorResponse> getTopErrorThemes(String period) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();

        LocalDate since = calculateSinceDate(period);
        List<Object[]> errors = repository.findTopErrorsByUserIdSince(userId, since);

        return errors.stream()
            .limit(10)
            .map(row -> {
                long total = ((Number) row[2]).longValue();
                long correct = ((Number) row[3]).longValue();
                double errorRate = total > 0 ? (double) (total - correct) / total * 100 : 0;
                return new TopicErrorResponse(
                    (String) row[0],
                    (String) row[1],
                    total,
                    errorRate
                );
            })
            .toList();
    }

    private LocalDate calculateSinceDate(String period) {
        if (period == null || period.equalsIgnoreCase("TOTAL")) return LocalDate.of(2000, 1, 1);
        return switch (period.toUpperCase()) {
            case "LAST_7_DAYS" -> LocalDate.now().minusDays(7);
            case "LAST_30_DAYS" -> LocalDate.now().minusDays(30);
            case "LAST_60_DAYS" -> LocalDate.now().minusDays(60);
            case "CURRENT_YEAR" -> LocalDate.now().withDayOfYear(1);
            default -> LocalDate.of(2000, 1, 1);
        };
    }

    private double calculateRate(String key, List<Object[]> data, int valueIndex) {
        for (Object[] row : data) {
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
        if (rate < 85) return "MEDIUM";
        return "HIGH";
    }
}
