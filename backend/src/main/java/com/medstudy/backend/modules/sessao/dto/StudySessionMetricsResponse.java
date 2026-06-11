package com.medstudy.backend.modules.sessao.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for study session metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionMetricsResponse {
    /**
     * Total number of study sessions.
     */
    @Schema(description = "Total number of study sessions registered by the user on the platform.", example = "42")
    private long totalSessoes;
    /**
     * Total number of questions done.
     */
    @Schema(description = "Total number of questions answered across all study sessions.", example = "850")
    private long totalQuestoes;
    /**
     * Average number of correct answers.
     */
    @Schema(description = "Average number of correct answers per study session, expressed as a percentage.", example = "68.4")
    private double mediaAcertos;
    /**
     * Number of critical revisions.
     */
    @Schema(description = "Number of study sessions flagged for critical revision because the accuracy fell below the acceptable threshold.", example = "4")
    private long revisoesCriticas;
    /**
     * Current user streak.
     */
    @Schema(description = "Number of consecutive days the student has been actively studying without missing a day.", example = "14")
    private int streakAtual;

}
