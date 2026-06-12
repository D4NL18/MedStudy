package com.medstudy.backend.modules.sessao.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO for a study session.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionResponse {
    @Schema(description = "Unique identifier of the study session record.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    /**
     * Major area of the study session.
     */
    @Schema(description = "The major medical area covered in this study session (e.g., Internal Medicine, Surgery).", example = "Internal Medicine")
    private String grandeArea;
    /**
     * Theme of the study session.
     */
    @Schema(description = "The specific topic or subtopic studied during this session.", example = "Heart Failure")
    private String tema;
    /**
     * Date of the study session.
     */
    @Schema(description = "Date when the study session took place.", example = "2024-05-20")
    private LocalDate dataSessao;
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
    @Schema(description = "Scheduled date for the next revision of this session's content.", example = "2024-05-27")
    private LocalDate dataProximaRevisao;
    /**
     * Indicates whether the revision is concluded.
     */
    @Schema(description = "Indicates whether the scheduled revision for this session has been completed by the student.", example = "false")
    private boolean revisaoConcluida;
    /**
     * List of newly earned badges from this session.
     */
    @Schema(description = "List of badge types earned by the student as a result of this study session, awarded in real time.", example = "[]")
    private java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newlyEarnedBadges;

}
