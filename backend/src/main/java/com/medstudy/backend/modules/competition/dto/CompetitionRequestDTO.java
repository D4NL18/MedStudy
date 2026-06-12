package com.medstudy.backend.modules.competition.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.competition.entity.CompetitionType;
import com.medstudy.backend.modules.competition.entity.MetricType;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Data Transfer Object for creating or updating a competition.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionRequestDTO {

    /**
     * The title of the competition.
     */
    @Schema(description = "Title of the competition, visible to all invited participants.", example = "Who scores best in Cardiology?")
    private String title;

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
    @Schema(description = "End date of the competition. After this date, no additional scores are accepted.", example = "2024-06-30")
    private LocalDate endDate;

    /**
     * List of friend IDs invited to the competition.
     */
    @Schema(description = "List of friend IDs invited to join the competition. Only confirmed friends can be invited.", example = "[\"a1b2c3d4-...\", \"e5f6g7h8-...\"]")
    private List<UUID> invitedFriendIds;

}
