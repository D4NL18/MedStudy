package com.medstudy.backend.modules.flashcard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(description = "Request object for flashcard redistribution preview")
public class RedistributionPreviewRequest {
    
    @NotNull(message = "targetEndDate is required")
    @Schema(description = "The target end date to spread the flashcards up to")
    private LocalDate targetEndDate;
}
