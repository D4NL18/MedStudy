package com.medstudy.backend.modules.aula.dto;

import com.medstudy.backend.modules.aula.entity.LessonPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LessonRequest(
        @NotBlank(message = "Grande área é obrigatória") String grandeArea,

        @NotBlank(message = "Tema é obrigatório") String tema,

        @NotNull(message = "Prioridade é obrigatória") LessonPriority prioridade,

        boolean aulaAssistida) {
}
