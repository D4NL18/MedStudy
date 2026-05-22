package com.medstudy.backend.modules.competition.dto;

import com.medstudy.backend.modules.competition.entity.CompetitionType;
import com.medstudy.backend.modules.competition.entity.MetricType;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CompetitionRequestDTO(
    String title,
    CompetitionType competitionType,
    MetricType metricType,
    Integer targetValue,
    LocalDate startDate,
    LocalDate endDate,
    List<UUID> invitedFriendIds
) {}
