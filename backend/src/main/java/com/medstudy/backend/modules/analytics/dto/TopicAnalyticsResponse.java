package com.medstudy.backend.modules.analytics.dto;

public record TopicAnalyticsResponse(
    String tema,
    String grandeArea,
    long totalQuestions,
    double successRate,
    double trendRate,
    String performanceLevel
) {}
