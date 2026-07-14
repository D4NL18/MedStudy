package com.medstudy.backend.modules.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSettingsResponse {
    private Integer maxReviewsPerDay;
    private String themeColor;
}
