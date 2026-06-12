package com.medstudy.backend.modules.flashcard.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating and updating flashcards.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardRequest {
    
    /**
     * Constructs a new FlashcardRequest with the specified fields.
     *
     * @param grandeArea the subject area
     * @param frente the front content of the flashcard
     * @param verso the back content of the flashcard
     */
    public FlashcardRequest(String grandeArea, Object frente, Object verso) {
        this.grandeArea = grandeArea;
        this.frente = frente;
        this.verso = verso;
    }
    
    @Schema(description = "The major medical area to which this flashcard belongs (e.g., Internal Medicine, Surgery).", example = "Pediatrics")
    @NotBlank(message = "Grande área é obrigatória")
    private String grandeArea;

    @Schema(description = "Content displayed on the front of the card: the question or term to be memorized.", example = "What is the Amoxicillin dose for Acute Otitis Media in children?")
    @NotNull(message = "Conteúdo da frente é obrigatório")
    private Object frente;

    @Schema(description = "Content displayed on the back of the card: the answer, explanation or mnemonic.", example = "50 mg/kg/day, divided into 2-3 doses, for 10 days.")
    @NotNull(message = "Conteúdo do verso é obrigatório")
    private Object verso;

    @Schema(description = "Scheduled date for the next revision of this flashcard.", example = "2024-06-15")
    private java.time.LocalDate proximaRevisao;
    
    @Schema(description = "Difficulty level selected by the student in the last revision session.", example = "MEDIUM")
    private com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty dificuldadeUltima;
    
    @Schema(description = "The ease factor multiplier used by the spaced repetition algorithm.", example = "2.5")
    private Double easeFactor;
    
    @Schema(description = "Current interval in days until the next revision.", example = "7")
    private Integer intervaloAtual;
    
    @Schema(description = "Number of consecutive times this flashcard was rated as HARD.", example = "1")
    private Integer consecutiveHardCount;
    
    @Schema(description = "Date when this flashcard was last reviewed.", example = "2024-06-08")
    private java.time.LocalDate ultimaRevisao;
    
    @Schema(description = "Timestamp indicating when the flashcard was last actively studied.", example = "2024-06-08")
    private java.time.LocalDate lastStudiedAt;
}
