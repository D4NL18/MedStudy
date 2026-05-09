package com.medstudy.backend.modules.revision.dto;

public record RevisionSummaryResponse(
    long atrasadas,
    long hoje,
    long futuras,
    long concluidas
) {}
