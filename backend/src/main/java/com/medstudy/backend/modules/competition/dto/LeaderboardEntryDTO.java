package com.medstudy.backend.modules.competition.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Data Transfer Object representing an entry in a competition leaderboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {

    /**
     * The ID of the user.
     */
    @Schema(description = "Unique identifier of the user.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    /**
     * The name of the user.
     */
    @Schema(description = "Full name of the user.", example = "John Doe")
    private String name;

    /**
     * The handle of the user.
     */
    @Schema(description = "The user's unique handle on the platform, displayed in the leaderboard.", example = "@dr.john")
    private String handle;

    /**
     * The avatar preset ID of the user.
     */
    @Schema(description = "Identifier of the avatar preset selected by the user for their profile picture.", example = "avatar_05")
    private String avatarPresetId;

    /**
     * The current score of the user in the competition.
     */
    @Schema(description = "Score accumulated by the participant in the competition, calculated based on the defined metric.", example = "87")
    private Long score;

    /**
     * The current position of the user on the leaderboard.
     */
    @Schema(description = "Current position of the participant in the competition ranking (1 = first place).", example = "3")
    private Integer position;

}
