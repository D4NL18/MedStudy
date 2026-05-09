package com.medstudy.backend.modules.analytics.dto;

public record TopicAnalyticsResponse(
    String tema,
    String grandeArea,
    long totalQuestions,
    double accuracy,
    long sessionsCount,
    double trendRate
) {}
