package com.medstudy.backend.modules.analytics.dto;

public record TopicErrorResponse(
    String tema,
    String grandeArea,
    long totalQuestions,
    double errorRate
) {}
