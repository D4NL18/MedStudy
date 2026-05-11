package com.medstudy.backend.modules.dashboard.dto;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicErrorResponse;
import java.util.List;

public record DashboardResponse(
    StudyMetrics sessions,
    SimuladoMetrics simulados,
    int currentStreak,
    List<AreaAnalyticsResponse> areaAnalytics,
    List<TopicErrorResponse> topErrors,
    List<EvolutionPoint> evolution
) {
    public record StudyMetrics(
        long totalSessions,
        long totalQuestions,
        double successRate,
        String performanceLevel
    ) {}

    public record SimuladoMetrics(
        long totalSimulados,
        double averageScore,
        String bestArea,
        String worstArea
    ) {}

    public record EvolutionPoint(
        String label, // Ex: "Jan"
        double value  // Ex: 75.5
    ) {}
}
