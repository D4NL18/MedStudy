package com.medstudy.backend.modules.notificacao.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object representing the summary of a user's notifications.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSummaryResponse {
    /**
     * The number of pending revisions.
     */
    @Schema(description = "Number of flashcard revisions that are overdue or scheduled for today and still pending.", example = "5")
    private long pendingRevisions;
    
    /**
     * The number of reinforcement lessons.
     */
    @Schema(description = "Number of lessons marked as needing reinforcement, indicating weak topics the student should revisit.", example = "3")
    private long reinforcementLessons;
    
    /**
     * The number of social alerts.
     */
    @Schema(description = "Number of unread social notifications, such as friend requests, badges earned by friends, or competition updates.", example = "2")
    private long socialAlerts;
    
    /**
     * The total number of alerts.
     */
    @Schema(description = "Total number of actionable alerts across all categories (revisions + reinforcements + social).", example = "10")
    private long totalAlerts;

}
