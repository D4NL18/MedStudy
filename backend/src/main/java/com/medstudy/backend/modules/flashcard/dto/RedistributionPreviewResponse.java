package com.medstudy.backend.modules.flashcard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RedistributionPreviewResponse {
    private UUID draftId;
    private boolean warningLimitExceeded;
    private int totalFlashcardsRedistributed;
    private int daysSpread;
    private java.util.List<DailyLoadDto> dailyLoads;
}
