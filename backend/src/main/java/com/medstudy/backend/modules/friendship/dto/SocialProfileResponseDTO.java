package com.medstudy.backend.modules.friendship.dto;

import java.util.UUID;

public record SocialProfileResponseDTO(
    UUID userId,
    String name,
    String handle,
    String faculdade,
    Integer semestre,
    String avatarPresetId,
    Boolean isFormado,
    String relationshipStatus,
    Boolean isRequester,
    Integer streak
) {}
