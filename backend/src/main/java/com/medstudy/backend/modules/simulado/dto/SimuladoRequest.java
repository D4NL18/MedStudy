package com.medstudy.backend.modules.simulado.dto;
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
 * Data Transfer Object for creating or updating a Simulado (mock exam).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimuladoRequest {

    /**
     * The name of the mock exam.
     */
    @Schema(description = "Descriptive name identifying this mock exam (e.g., the exam name, year or custom label).", example = "FAMERP 2023")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String nome;

    /**
     * The date when the mock exam was taken.
     */
    @Schema(description = "Date on which the mock exam was taken.", example = "2023-11-05")
    private @NotNull(message = ValidationMessages.FIELD_REQUIRED) LocalDate dataRealizacao;

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
    private Integer cmTotal;

    /**
     * Correct answers in Internal Medicine (Clínica Médica).
     */
    @Schema(description = "Number of Internal Medicine questions answered correctly.", example = "14")
    private Integer cmAcertos;

    /**
     * Incorrect answers in Internal Medicine (Clínica Médica).
     */
    @Schema(description = "Number of Internal Medicine questions answered incorrectly.", example = "6")
    private Integer cmErros;

    /**
     * Total questions in Surgery (Cirurgia).
     */
    @Schema(description = "Total number of Surgery (Cirurgia) questions in this exam.", example = "15")
    private Integer cirTotal;

    /**
     * Correct answers in Surgery (Cirurgia).
     */
    @Schema(description = "Number of Surgery questions answered correctly.", example = "10")
    private Integer cirAcertos;

    /**
     * Incorrect answers in Surgery (Cirurgia).
     */
    @Schema(description = "Number of Surgery questions answered incorrectly.", example = "5")
    private Integer cirErros;

    /**
     * Total questions in Pediatrics (Pediatria).
     */
    @Schema(description = "Total number of Pediatrics questions in this exam.", example = "10")
    private Integer pedTotal;

    /**
     * Correct answers in Pediatrics (Pediatria).
     */
    @Schema(description = "Number of Pediatrics questions answered correctly.", example = "7")
    private Integer pedAcertos;

    /**
     * Incorrect answers in Pediatrics (Pediatria).
     */
    @Schema(description = "Number of Pediatrics questions answered incorrectly.", example = "3")
    private Integer pedErros;

    /**
     * Total questions in Gynecology and Obstetrics (GO).
     */
    @Schema(description = "Total number of Gynecology and Obstetrics (GO) questions in this exam.", example = "10")
    private Integer goTotal;

    /**
     * Correct answers in Gynecology and Obstetrics (GO).
     */
    @Schema(description = "Number of Gynecology and Obstetrics questions answered correctly.", example = "8")
    private Integer goAcertos;

    /**
     * Incorrect answers in Gynecology and Obstetrics (GO).
     */
    @Schema(description = "Number of Gynecology and Obstetrics questions answered incorrectly.", example = "2")
    private Integer goErros;

    /**
     * Total questions in Preventive Medicine (Preventiva).
     */
    @Schema(description = "Total number of Preventive Medicine (Medicina Preventiva) questions in this exam.", example = "10")
    private Integer prevTotal;

    /**
     * Correct answers in Preventive Medicine (Preventiva).
     */
    @Schema(description = "Number of Preventive Medicine questions answered correctly.", example = "6")
    private Integer prevAcertos;

    /**
     * Incorrect answers in Preventive Medicine (Preventiva).
     */
    @Schema(description = "Number of Preventive Medicine questions answered incorrectly.", example = "4")
    private Integer prevErros;
}
