package com.medstudy.backend.modules.gamificacao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import java.time.LocalDateTime;

/**
 * Data Transfer Object representing a user's earned badge.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeResponse {
    
    @Schema(description = "The type of the badge earned by the user (e.g., STREAK_3).", example = "STREAK_3")
    private BadgeType type;
    
    @Schema(description = "The display name of the badge, shown in the user interface.", example = "Foco Inicial")
    private String displayName;
    
    @Schema(description = "Detailed description explaining what the user achieved to earn this badge.", example = "3 dias seguidos de estudo")
    private String description;
    
    @Schema(description = "Timestamp when the badge was earned (ISO 8601).", example = "2023-10-01T12:00:00")
    private LocalDateTime earnedAt;

}
