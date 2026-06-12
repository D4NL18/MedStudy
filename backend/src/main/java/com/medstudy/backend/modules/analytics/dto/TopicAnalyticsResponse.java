package com.medstudy.backend.modules.analytics.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object representing analytics data for a specific topic.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicAnalyticsResponse {
    @Schema(description = "The specific medical topic or subtopic being analyzed (e.g., Heart Failure, Pneumonia).", example = "Heart Failure")
    private String tema;
    @Schema(description = "The medical major area to which this topic belongs (e.g., Internal Medicine, Surgery).", example = "Internal Medicine")
    private String grandeArea;
    @Schema(description = "Total number of questions answered on this topic during the analyzed period.", example = "45")
    private long totalQuestions;
    @Schema(description = "Accuracy percentage for this topic, ranging from 0.0 to 100.0.", example = "68.9")
    private double accuracy;
    @Schema(description = "Number of study sessions dedicated to this topic.", example = "6")
    private long sessionsCount;
    @Schema(description = "Short-term performance trend for this topic compared to the previous period.", example = "5.0")
    private double trendShort;
    @Schema(description = "Long-term performance trend for this topic compared to the student's overall history.", example = "-2.1")
    private double trendLong;
    @Schema(description = "Qualitative performance classification for this topic (e.g., Excellent, Good, Average, Critical).", example = "Average")
    private String performanceLevel;

}
