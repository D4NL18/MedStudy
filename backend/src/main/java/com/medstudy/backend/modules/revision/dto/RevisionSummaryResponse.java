package com.medstudy.backend.modules.revision.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object representing the summary of study session revisions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevisionSummaryResponse {

    @Schema(description = "Number of study session revisions that are past their scheduled date.", example = "3")
    private long atrasadas;

    @Schema(description = "Number of study session revisions scheduled for today.", example = "5")
    private long hoje;

    @Schema(description = "Number of study session revisions scheduled for future dates.", example = "12")
    private long futuras;

    @Schema(description = "Number of study session revisions that have been successfully completed by the user.", example = "45")
    private long concluidas;

}
