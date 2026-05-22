package com.medstudy.backend.modules.competition.dto;

import java.util.UUID;

public record LeaderboardEntryDTO(
    UUID userId,
    String name,
    String handle,
    String avatarPresetId,
    Long score,
    Integer position
) {}
