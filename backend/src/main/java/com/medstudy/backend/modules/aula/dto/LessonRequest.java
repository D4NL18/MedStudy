package com.medstudy.backend.modules.aula.dto;

import com.medstudy.backend.modules.aula.entity.LessonPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record LessonRequest(
        @NotBlank(message = "Grande área é obrigatória") String grandeArea,
        String subArea,
        @NotBlank(message = "Tema é obrigatório") String tema,
        @NotNull(message = "Prioridade é obrigatória") LessonPriority prioridade,
        Boolean aulaAssistida,
        LocalDate dataAula,
        Integer percentAcerto,
        Boolean reforco,
        Boolean revisao) {
}
