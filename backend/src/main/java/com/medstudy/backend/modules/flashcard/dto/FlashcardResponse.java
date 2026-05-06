package com.medstudy.backend.modules.flashcard.dto;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

public record FlashcardResponse(
    UUID id,
    String grandeArea,
    Map<String, Object> frente,
    Map<String, Object> verso,
    LocalDate proximaRevisao,
    String dificuldadeUltima
) {}
