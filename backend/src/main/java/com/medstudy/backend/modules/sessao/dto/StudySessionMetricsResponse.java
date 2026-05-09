package com.medstudy.backend.modules.sessao.dto;

public record StudySessionMetricsResponse(
    long totalSessoes,
    long totalQuestoes,
    double mediaAcertos,
    long revisoesCriticas,
    int streakAtual
) {}
