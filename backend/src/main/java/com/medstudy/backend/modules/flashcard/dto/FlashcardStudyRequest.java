package com.medstudy.backend.modules.flashcard.dto;

import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import jakarta.validation.constraints.NotNull;

public record FlashcardStudyRequest(
    @NotNull(message = "Dificuldade é obrigatória")
    FlashcardDifficulty dificuldade
) {}
