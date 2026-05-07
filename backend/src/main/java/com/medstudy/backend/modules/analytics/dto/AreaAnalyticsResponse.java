package com.medstudy.backend.modules.analytics.dto;

public record AreaAnalyticsResponse(
    String area,
    long totalQuestions,
    double successRate,
    double trendRate, // Last 7 days
    String performanceLevel
) {}
