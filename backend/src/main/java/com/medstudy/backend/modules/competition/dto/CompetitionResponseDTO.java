package com.medstudy.backend.modules.competition.dto;

import com.medstudy.backend.modules.competition.entity.CompetitionType;
import com.medstudy.backend.modules.competition.entity.MetricType;
import com.medstudy.backend.modules.competition.entity.CompetitionStatus;
import com.medstudy.backend.modules.competition.entity.ParticipantStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CompetitionResponseDTO(
    UUID id,
    String title,
    UUID creatorId,
    String creatorName,
    CompetitionType competitionType,
    MetricType metricType,
    Integer targetValue,
    LocalDate startDate,
    LocalDate endDate,
    CompetitionStatus status,
    List<ParticipantInfo> participants,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public record ParticipantInfo(
        UUID userId,
        String name,
        String handle,
        String avatarPresetId,
        ParticipantStatus status,
        LocalDateTime joinedAt
    ) {}
}
