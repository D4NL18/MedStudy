package com.medstudy.backend.modules.flashcard.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/**
 * Data Transfer Object for studying flashcards.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardStudyRequest {

    /**
     * The unique identifier of the flashcard being studied.
     */
    @Schema(description = "Unique identifier of the flashcard being studied.", example = "123e4567-e89b-12d3-a456-426614174000")
    private @NotNull(message = ValidationMessages.FIELD_REQUIRED)
    UUID flashcardId;

    /**
     * The difficulty level selected by the student after reviewing the card.
     */
    @Schema(description = "Difficulty level selected by the student after reviewing the card (EASY, MEDIUM or HARD). This value drives the spaced repetition algorithm to schedule the next review.", example = "MEDIUM")
    private @NotNull(message = ValidationMessages.FIELD_REQUIRED)
    FlashcardDifficulty dificuldade;

}
