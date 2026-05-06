package com.medstudy.backend.modules.aula.dto;

import jakarta.validation.constraints.NotBlank;

public record LessonRequest(
        @NotBlank(message = "Grande área é obrigatória") String grandeArea,

        @NotBlank(message = "Tema é obrigatório") String tema,

        @NotBlank(message = "Prioridade é obrigatória") String prioridade,

        boolean aulaAssistida) {
}
