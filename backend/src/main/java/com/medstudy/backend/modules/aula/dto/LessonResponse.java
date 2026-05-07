package com.medstudy.backend.modules.aula.dto;

import com.medstudy.backend.modules.aula.entity.LessonPriority;
import java.util.UUID;

public record LessonResponse(
    UUID id,
    String grandeArea,
    String tema,
    LessonPriority prioridade,
    boolean aulaAssistida
) {}
