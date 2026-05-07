package com.medstudy.backend.modules.dashboard.dto;

public record DashboardResponse(
    StudyMetrics sessions,
    SimuladoMetrics simulados,
    int currentStreak
) {
    public record StudyMetrics(
        long totalSessions,
        long totalQuestions,
        double successRate,
        String performanceLevel // LOW, MEDIUM, HIGH
    ) {}

    public record SimuladoMetrics(
        long totalSimulados,
        double averageScore,
        String bestArea,
        String worstArea
    ) {}
}
