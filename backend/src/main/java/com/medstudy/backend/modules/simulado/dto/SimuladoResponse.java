package com.medstudy.backend.modules.simulado.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Data Transfer Object representing a Simulado (mock exam) response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimuladoResponse {

    /**
     * The unique identifier of the mock exam.
     */
    @Schema(description = "Unique identifier of the mock exam record.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    /**
     * The name of the mock exam.
     */
    @Schema(description = "Descriptive name of the mock exam (e.g., exam name, year, or custom label).", example = "FAMERP 2023")
    private String nome;

    /**
     * The date when the mock exam was taken.
     */
    @Schema(description = "Date on which the mock exam was taken.", example = "2023-11-05")
    private LocalDate dataRealizacao;

    /**
     * The institution that provided the mock exam.
     */
    @Schema(description = "Name of the medical institution that issued the mock exam (e.g., FAMERP, USP, UNICAMP).", example = "FAMERP")
    private String instituicao;

    /**
     * The year of the mock exam.
     */
    @Schema(description = "Year in which the mock exam was originally applied.", example = "2023")
    private Integer ano;

    /**
     * Total questions in Internal Medicine (Clínica Médica).
     */
    @Schema(description = "Total number of Internal Medicine (Clínica Médica) questions in this exam.", example = "20")
    private int cmTotal;

    /**
     * Correct answers in Internal Medicine (Clínica Médica).
     */
    @Schema(description = "Number of Internal Medicine questions answered correctly.", example = "14")
    private int cmAcertos;

    /**
     * Incorrect answers in Internal Medicine (Clínica Médica).
     */
    @Schema(description = "Number of Internal Medicine questions answered incorrectly.", example = "6")
    private int cmErros;

    /**
     * Total questions in Surgery (Cirurgia).
     */
    @Schema(description = "Total number of Surgery (Cirurgia) questions in this exam.", example = "15")
    private int cirTotal;

    /**
     * Correct answers in Surgery (Cirurgia).
     */
    @Schema(description = "Number of Surgery questions answered correctly.", example = "10")
    private int cirAcertos;

    /**
     * Incorrect answers in Surgery (Cirurgia).
     */
    @Schema(description = "Number of Surgery questions answered incorrectly.", example = "5")
    private int cirErros;

    /**
     * Total questions in Pediatrics (Pediatria).
     */
    @Schema(description = "Total number of Pediatrics questions in this exam.", example = "10")
    private int pedTotal;

    /**
     * Correct answers in Pediatrics (Pediatria).
     */
    @Schema(description = "Number of Pediatrics questions answered correctly.", example = "7")
    private int pedAcertos;

    /**
     * Incorrect answers in Pediatrics (Pediatria).
     */
    @Schema(description = "Number of Pediatrics questions answered incorrectly.", example = "3")
    private int pedErros;

    /**
     * Total questions in Gynecology and Obstetrics (GO).
     */
    @Schema(description = "Total number of Gynecology and Obstetrics (GO) questions in this exam.", example = "10")
    private int goTotal;

    /**
     * Correct answers in Gynecology and Obstetrics (GO).
     */
    @Schema(description = "Number of Gynecology and Obstetrics questions answered correctly.", example = "8")
    private int goAcertos;

    /**
     * Incorrect answers in Gynecology and Obstetrics (GO).
     */
    @Schema(description = "Number of Gynecology and Obstetrics questions answered incorrectly.", example = "2")
    private int goErros;

    /**
     * Total questions in Preventive Medicine (Preventiva).
     */
    @Schema(description = "Total number of Preventive Medicine questions in this exam.", example = "10")
    private int prevTotal;

    /**
     * Correct answers in Preventive Medicine (Preventiva).
     */
    @Schema(description = "Number of Preventive Medicine questions answered correctly.", example = "6")
    private int prevAcertos;

    /**
     * Incorrect answers in Preventive Medicine (Preventiva).
     */
    @Schema(description = "Number of Preventive Medicine questions answered incorrectly.", example = "4")
    private int prevErros;

    /**
     * List of badges earned after completing this mock exam.
     */
    @Schema(description = "List of badge types earned by the student as a result of completing this mock exam.", example = "[]")
    private java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newlyEarnedBadges;

}
