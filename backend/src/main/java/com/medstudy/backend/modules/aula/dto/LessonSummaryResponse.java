package com.medstudy.backend.modules.aula.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object representing a summary of lessons.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSummaryResponse {

    /**
     * The total number of lessons.
     */
    @Schema(description = "The total number of lessons registered for the user across all medical areas.", example = "100")
    private long total;

    /**
     * The total number of watched lessons.
     */
    @Schema(description = "The total number of lessons the student has already watched or completed.", example = "45")
    private long assistidas;

    /**
     * The total number of pending lessons.
     */
    @Schema(description = "The total number of lessons that are still pending to be watched.", example = "55")
    private long pendentes;

    /**
     * The total number of pending lessons with diamond priority.
     */
    @Schema(description = "The total number of pending lessons flagged with the highest priority (DIAMANTE).", example = "10")
    private long diamantePendentes;

}
