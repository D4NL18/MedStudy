package com.medstudy.backend.modules.analytics.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object representing analytics data for a specific area.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaAnalyticsResponse {
    @Schema(description = "The medical major area being analyzed (e.g., Internal Medicine, Surgery, Pediatrics).", example = "Internal Medicine")
    private String grandeArea;
    @Schema(description = "Total number of questions answered in this area during the analyzed period.", example = "120")
    private long totalQuestions;
    @Schema(description = "Accuracy percentage for this area, ranging from 0.0 to 100.0.", example = "72.5")
    private double accuracy;
    @Schema(description = "Number of study sessions completed in this area.", example = "15")
    private long sessionsCount;
    @Schema(description = "Short-term performance trend compared to the previous period. Positive values indicate improvement.", example = "3.2")
    private double trendShort;
    @Schema(description = "Long-term performance trend compared to the student's overall historical data.", example = "-1.5")
    private double trendLong;
    @Schema(description = "Qualitative performance classification for this area (e.g., Excellent, Good, Average, Critical).", example = "Good")
    private String performanceLevel;

}
