package com.medstudy.backend.modules.user.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object representing a User response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    /**
     * The unique identifier of the user.
     */
    @Schema(description = "Unique identifier of the user.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    /**
     * The name of the user.
     */
    @Schema(description = "The full name of the user.", example = "John Doe")
    private String name;

    /**
     * The email address of the user.
     */
    @Schema(description = "The email address of the user.", example = "user@example.com")
    private String email;

    /**
     * The role assigned to the user.
     */
    @Schema(description = "The authorization role assigned to the user (e.g., ADMIN, USER).", example = "USER")
    private String role;

    /**
     * The timestamp when the user was created.
     */
    @Schema(description = "Timestamp when the user account was created (ISO 8601).", example = "2024-01-01T12:00:00")
    private LocalDateTime createdAt;

    /**
     * The timestamp when the user was last updated.
     */
    @Schema(description = "Timestamp when the user account was last updated (ISO 8601).", example = "2024-05-10T14:30:00")
    private LocalDateTime updatedAt;

}
