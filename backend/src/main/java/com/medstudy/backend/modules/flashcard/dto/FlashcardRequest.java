package com.medstudy.backend.modules.flashcard.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardRequest {
    @NotBlank(message = "Grande área é obrigatória")
    private String grandeArea;

    @NotNull(message = "Conteúdo da frente é obrigatório")
    private Object frente;

    @NotNull(message = "Conteúdo do verso é obrigatório")
    private Object verso;

    private java.time.LocalDate proximaRevisao;
    private com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty dificuldadeUltima;
    private Double easeFactor;
    private Integer intervaloAtual;
    private Integer consecutiveHardCount;
    private java.time.LocalDate ultimaRevisao;
    private java.time.LocalDate lastStudiedAt;
}

