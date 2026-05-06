package com.medstudy.backend.modules.flashcard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Map;

public record FlashcardRequest(
        @NotBlank(message = "Grande área é obrigatória") String grandeArea,

        @NotNull(message = "Frente é obrigatória") Map<String, Object> frente,

        @NotNull(message = "Verso é obrigatório") Map<String, Object> verso,

        LocalDate proximaRevisao,
        String dificuldadeUltima) {
}
