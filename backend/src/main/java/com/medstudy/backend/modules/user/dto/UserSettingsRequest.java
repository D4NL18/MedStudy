package com.medstudy.backend.modules.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "Request object for updating user settings")
public class UserSettingsRequest {
    
    @Min(value = 1, message = "maxReviewsPerDay must be at least 1")
    @Schema(description = "Maximum number of flashcard reviews allowed per day")
    private Integer maxReviewsPerDay;

    @Schema(description = "User's preferred UI theme color")
    private String themeColor;
}
