package com.medstudy.backend.modules.friendship.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.friendship.entity.FriendshipStatus;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for friendship responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponseDTO {
    /**
     * The unique identifier of the friendship.
     */
    @Schema(description = "Unique identifier of the friendship record.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    /**
     * The unique identifier of the user who requested the friendship.
     */
    @Schema(description = "Unique identifier of the user who sent the friendship request.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID requesterId;

    /**
     * The unique identifier of the user who received the friendship request.
     */
    @Schema(description = "Unique identifier of the user who received the friendship request.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID receiverId;

    /**
     * The current status of the friendship.
     */
    @Schema(description = "Current status of the friendship relationship.", example = "ACTIVE")
    private FriendshipStatus status;

    /**
     * The timestamp when the friendship was created.
     */
    @Schema(description = "Timestamp when the friendship relationship was created (ISO 8601).", example = "2024-01-15T09:00:00")
    private LocalDateTime createdAt;

    /**
     * The timestamp when the friendship was last updated.
     */
    @Schema(description = "Timestamp of the last status update on this friendship record (ISO 8601).", example = "2024-03-22T18:45:00")
    private LocalDateTime updatedAt;

}
