package com.medstudy.backend.modules.competition.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.competition.entity.CompetitionType;
import com.medstudy.backend.modules.competition.entity.MetricType;
import com.medstudy.backend.modules.competition.entity.CompetitionStatus;
import com.medstudy.backend.modules.competition.entity.ParticipantStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Data Transfer Object for competition responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionResponseDTO {

    /**
     * The ID of the competition.
     */
    @Schema(description = "Unique identifier of the competition record.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    /**
     * The title of the competition.
     */
    @Schema(description = "Title of the competition displayed in listings and the detail screen.", example = "Who scores best in Cardiology?")
    private String title;

    /**
     * The ID of the user who created the competition.
     */
    @Schema(description = "Unique identifier of the user who created the competition.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID creatorId;

    /**
     * The name of the user who created the competition.
     */
    @Schema(description = "Display name of the user who created the competition, shown in the screen header.", example = "Dr. John Smith")
    private String creatorName;

    /**
     * The type of the competition.
     */
    @Schema(description = "Type of competition, which defines the scoring mechanic used (e.g., ACCURACY, TOTAL_QUESTIONS).", example = "ACCURACY")
    private CompetitionType competitionType;

    /**
     * The metric type used to score the competition.
     */
    @Schema(description = "Metric used to rank participants throughout the competition (e.g., SESSIONS, CORRECT_ANSWERS).", example = "CORRECT_ANSWERS")
    private MetricType metricType;

    /**
     * The target value to win the competition.
     */
    @Schema(description = "Numeric target to be reached to win the competition. Null if there is no defined goal.", example = "100")
    private Integer targetValue;

    /**
     * The start date of the competition.
     */
    @Schema(description = "Start date of the competition, from which participants' scores are counted.", example = "2024-06-01")
    private LocalDate startDate;

    /**
     * The end date of the competition.
     */
    @Schema(description = "End date of the competition. After this date, the result is finalized and the winner is declared.", example = "2024-06-30")
    private LocalDate endDate;

    /**
     * The status of the competition.
     */
    @Schema(description = "Current lifecycle status of the competition (e.g., PENDING, ACTIVE, COMPLETED, CANCELLED).", example = "ACTIVE")
    private CompetitionStatus status;

    /**
     * The list of participants in the competition.
     */
    @Schema(description = "List of participants in the competition with their profile data and participation status.", example = "[]")
    private List<ParticipantInfo> participants;

    /**
     * The creation timestamp of the competition.
     */
    @Schema(description = "Timestamp when the competition was created in the system (ISO 8601).", example = "2024-05-20T10:30:00")
    private LocalDateTime createdAt;

    /**
     * The last update timestamp of the competition.
     */
    @Schema(description = "Timestamp of the last update to the competition record (ISO 8601).", example = "2024-06-05T14:00:00")
    private LocalDateTime updatedAt;

    /**
     * Information about a participant in the competition.
     *
     * @param userId the user ID of the participant
     * @param name the name of the participant
     * @param handle the handle of the participant
     * @param avatarPresetId the avatar preset ID of the participant
     * @param status the status of the participant in the competition
     * @param joinedAt the timestamp when the participant joined
     */
    public record ParticipantInfo(
        UUID userId,
        String name,
        String handle,
        String avatarPresetId,
        ParticipantStatus status,
        LocalDateTime joinedAt
    ) {}

}
