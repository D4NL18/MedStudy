package com.medstudy.backend.modules.aula.dto;

import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.medstudy.backend.modules.aula.entity.LessonPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Data Transfer Object for creating or updating a Lesson.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonRequest {

    @Schema(description = "The major medical area covered in this lesson (e.g., Cardiology, Surgery).", example = "Cardiology")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String grandeArea;

    @Schema(description = "The specific sub-area or medical specialty of the lesson (e.g., Heart Failure).", example = "Heart Failure")
    private String subArea;

    @Schema(description = "The main theme or topic discussed in the lesson.", example = "Pathophysiology")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String tema;

    @Schema(description = "The priority level assigned by the student to study this lesson (e.g., ALTA, MEDIA, BAIXA, DIAMANTE).", example = "ALTA")
    private @NotNull(message = ValidationMessages.FIELD_REQUIRED) LessonPriority prioridade;

    @Schema(description = "Indicates whether the student has already watched or completed this lesson.", example = "true")
    private Boolean aulaAssistida;

    @Schema(description = "Date when the lesson was scheduled, attended, or completed.", example = "2024-01-01")
    private LocalDate dataAula;

    @Schema(description = "The percentage of correct answers achieved by the student in questions related to this lesson's topic.", example = "85")
    private Integer percentAcerto;

    @Schema(description = "Flag indicating if the system or student marked this lesson as needing reinforcement or extra study.", example = "false")
    private Boolean reforco;

    @Schema(description = "Flag indicating if the student has completed a scheduled review for this lesson.", example = "false")
    private Boolean revisao;
}
