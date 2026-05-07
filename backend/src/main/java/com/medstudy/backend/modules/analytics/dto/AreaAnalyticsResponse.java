package com.medstudy.backend.modules.analytics.dto;

public record AreaAnalyticsResponse(
    String grandeArea,
    long totalQuestions,
    double accuracy,
    long sessionsCount,
    double trendRate
) {}
