package com.medstudy.backend.modules.gamificacao.dto;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import java.time.LocalDateTime;

public record UserBadgeResponse(
    BadgeType type,
    String displayName,
    String description,
    LocalDateTime earnedAt
) {}
