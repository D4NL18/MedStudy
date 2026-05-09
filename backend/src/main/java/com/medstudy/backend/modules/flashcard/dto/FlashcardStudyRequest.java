package com.medstudy.backend.modules.flashcard.dto;

import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record FlashcardStudyRequest(
    @NotNull(message = "ID do flashcard é obrigatório")
    UUID flashcardId,
    
    @NotNull(message = "Dificuldade é obrigatória")
    FlashcardDifficulty dificuldade
) {}
