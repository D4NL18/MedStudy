package com.medstudy.backend.modules.friendship.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Data Transfer Object for social profile responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialProfileResponseDTO {
    /**
     * The unique identifier of the user.
     */
    @Schema(description = "Unique identifier of the user.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    /**
     * The name of the user.
     */
    @Schema(description = "Full name of the user.", example = "John Doe")
    private String name;

    /**
     * The social handle of the user.
     */
    @Schema(description = "The user's unique handle on the platform, used in mentions and public profile URLs.", example = "@dr.john")
    private String handle;

    /**
     * The university or college of the user.
     */
    @Schema(description = "Name of the medical school or university attended by the user.", example = "Harvard Medical School")
    private String faculdade;

    /**
     * The current semester of the user.
     */
    @Schema(description = "Current semester of the medical student (1 to 12). Null if the user has already graduated.", example = "8")
    private Integer semestre;

    /**
     * The preset avatar identifier for the user.
     */
    @Schema(description = "Identifier of the avatar preset selected by the user to represent their profile picture.", example = "avatar_03")
    private String avatarPresetId;

    /**
     * Indicates whether the user has graduated.
     */
    @Schema(description = "Indicates whether the user has completed their medical degree.", example = "true")
    private Boolean isFormado;

    /**
     * The relationship status of the user with the current user.
     */
    @Schema(description = "Relationship status between the requesting user and this profile (e.g., FRIENDS, PENDING, NONE).", example = "FRIENDS")
    private String relationshipStatus;

    /**
     * Indicates whether the user is the requester of the friendship.
     */
    @Schema(description = "Indicates whether the current authenticated user is the one who initiated the friendship request.", example = "false")
    private Boolean isRequester;

    /**
     * The study streak of the user.
     */
    @Schema(description = "Number of consecutive days this user has been actively studying on the platform.", example = "21")
    private Integer streak;

}
