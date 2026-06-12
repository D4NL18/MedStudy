package com.medstudy.backend.modules.aula.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.aula.entity.LessonPriority;
import java.util.UUID;

/**
 * Data Transfer Object representing a Lesson.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {

    /**
     * The unique identifier of the lesson.
     */
    @Schema(description = "The unique identifier of the lesson.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "The major medical area covered in this lesson (e.g., Cardiology, Surgery).", example = "Cardiology")
    private String grandeArea;

    @Schema(description = "The specific sub-area or medical specialty of the lesson (e.g., Heart Failure).", example = "Heart Failure")
    private String subArea;

    @Schema(description = "The main theme or topic discussed in the lesson.", example = "Pathophysiology")
    private String tema;

    @Schema(description = "The priority level assigned by the student to study this lesson (e.g., ALTA, MEDIA, BAIXA, DIAMANTE).", example = "ALTA")
    private LessonPriority prioridade;

    @Schema(description = "Indicates whether the student has already watched or completed this lesson.", example = "true")
    private boolean aulaAssistida;

    @Schema(description = "Date when the lesson was scheduled, attended, or completed.", example = "2024-01-01")
    private java.time.LocalDate dataAula;

    @Schema(description = "The percentage of correct answers achieved by the student in questions related to this lesson's topic.", example = "85")
    private Integer percentAcerto;

    @Schema(description = "Flag indicating if the system or student marked this lesson as needing reinforcement or extra study.", example = "false")
    private boolean reforco;

    @Schema(description = "Flag indicating if the student has completed a scheduled review for this lesson.", example = "false")
    private boolean revisao;
}
