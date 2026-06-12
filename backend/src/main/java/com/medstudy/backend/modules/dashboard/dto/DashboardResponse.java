package com.medstudy.backend.modules.dashboard.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicErrorResponse;
import java.util.List;

/**
 * Data Transfer Object representing the dashboard response.
 * Contains various metrics including study sessions, simulados, streaks, and analytics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    @Schema(description = "Aggregated metrics from all study sessions, including totals, success rate and performance level.")
    private StudyMetrics sessions;
    @Schema(description = "Aggregated metrics from all mock exams taken, including scores, best and worst areas.")
    private SimuladoMetrics simulados;
    @Schema(description = "Number of consecutive days the student has been actively studying without a break.", example = "14")
    private int currentStreak;
    @Schema(description = "Performance breakdown by major medical area, sorted by relevance.", example = "[]")
    private List<AreaAnalyticsResponse> areaAnalytics;
    @Schema(description = "List of topics with the highest error rate, used to guide targeted revision sessions.", example = "[]")
    private List<TopicErrorResponse> topErrors;
    @Schema(description = "Time-series data points representing the student's performance evolution over the past months.", example = "[]")
    private List<EvolutionPoint> evolution;
    @Schema(description = "List of badges recently earned by the student, displayed in the dashboard trophy shelf.", example = "[]")
    private List<com.medstudy.backend.modules.gamificacao.dto.UserBadgeResponse> recentBadges;

    /**
     * Metrics related to user study sessions.
     *
     * @param totalSessions total number of sessions completed
     * @param totalQuestions total number of questions answered
     * @param successRate percentage of correctly answered questions
     * @param performanceLevel performance level string classification
     */
    public record StudyMetrics(
        long totalSessions,
        long totalQuestions,
        double successRate,
        String performanceLevel
    ) {}

    /**
     * Metrics related to simulados (mock exams).
     *
     * @param totalSimulados total number of simulados taken
     * @param averageScore average score across all simulados
     * @param bestArea the study area with the highest score
     * @param worstArea the study area with the lowest score
     */
    public record SimuladoMetrics(
        long totalSimulados,
        double averageScore,
        String bestArea,
        String worstArea
    ) {}

    /**
     * Represents a data point in the user's performance evolution over time.
     *
     * @param label the time period label (e.g., month name like "Jan")
     * @param value the performance metric value (e.g., success rate percentage)
     */
    public record EvolutionPoint(
        String label,
        double value
    ) {}

}
