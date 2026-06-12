package com.medstudy.backend.modules.sessao.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating a study session.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionRequest {
    /**
     * Major area of the study session.
     */
    @Schema(description = "The major medical area covered in this study session (e.g., Internal Medicine, Surgery).", example = "Internal Medicine")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String grandeArea;
    /**
     * Theme of the study session.
     */
    @Schema(description = "The specific topic or subtopic studied during this session (e.g., Heart Failure, Pneumonia).", example = "Heart Failure")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String tema;
    /**
     * Date of the study session.
     */
    @Schema(description = "Date when the study session took place.", example = "2024-05-20")
    private @NotNull(message = ValidationMessages.FIELD_REQUIRED) LocalDate dataSessao;
    /**
     * Number of questions done.
     */
    @Schema(description = "Total number of questions attempted during this study session.", example = "30")
    private int qtsFeitas;
    /**
     * Number of correct questions.
     */
    @Schema(description = "Number of questions answered correctly during this study session.", example = "22")
    private int qtsCorretas;
    /**
     * Institution name.
     */
    @Schema(description = "Name of the medical institution or exam bank from which the questions were sourced.", example = "FAMERP 2023")
    private String instituicao;
    /**
     * Observations or notes about the session.
     */
    @Schema(description = "Free-text observations or annotations recorded by the student about this session.", example = "Focused on heart block types. Need to review Wenckebach again.")
    private String observacoes;
    /**
     * Date of the next revision.
     */
    @Schema(description = "Scheduled date for the next revision of this session's content, manually set by the student.", example = "2024-05-27")
    private LocalDate dataProximaRevisao;
    /**
     * Indicates whether the revision is concluded.
     */
    @Schema(description = "Indicates whether the scheduled revision for this session has been completed by the student.", example = "false")
    private boolean revisaoConcluida;


}
