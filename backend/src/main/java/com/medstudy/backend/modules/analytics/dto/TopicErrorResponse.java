package com.medstudy.backend.modules.analytics.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object representing error analytics for a specific topic.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicErrorResponse {
    @Schema(description = "The specific medical topic in which the student has the highest error rate.", example = "Cardiac Arrhythmias")
    private String tema;
    @Schema(description = "The medical major area to which this critical topic belongs.", example = "Internal Medicine")
    private String grandeArea;
    @Schema(description = "Total number of questions answered on this topic.", example = "30")
    private long totalQuestions;
    @Schema(description = "Error rate percentage for this topic, ranging from 0.0 to 100.0. Values above 50% indicate a critical area.", example = "61.3")
    private double errorRate;

}
