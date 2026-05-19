package com.medstudy.backend.modules.notificacao.dto;

public record NotificationSummaryResponse(
    long pendingRevisions,
    long reinforcementLessons,
    long socialAlerts,
    long totalAlerts
) {}
