package com.medstudy.backend.modules.revision.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RedistributionPreviewResponse {
    private UUID draftId;
    private boolean warningLimitExceeded;
    private int totalRevisionsRedistributed;
    private int daysSpread;
    private java.util.List<DailyLoadDto> dailyLoads;
}
