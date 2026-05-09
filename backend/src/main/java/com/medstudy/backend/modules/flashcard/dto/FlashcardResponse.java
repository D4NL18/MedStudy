package com.medstudy.backend.modules.flashcard.dto;

import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import java.time.LocalDate;
import java.util.UUID;

public record FlashcardResponse(
    UUID id,
    String grandeArea,
    Object frente,
    Object verso,
    LocalDate proximaRevisao,
    FlashcardDifficulty dificuldadeUltima,
    Integer intervaloAtual
) {}

