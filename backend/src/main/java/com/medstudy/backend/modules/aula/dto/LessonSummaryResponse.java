package com.medstudy.backend.modules.aula.dto;

public record LessonSummaryResponse(
    long total,
    long assistidas,
    long pendentes,
    long diamantePendentes
) {}
