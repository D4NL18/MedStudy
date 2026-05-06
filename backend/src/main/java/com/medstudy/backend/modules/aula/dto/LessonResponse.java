package com.medstudy.backend.modules.aula.dto;

import java.util.UUID;

public record LessonResponse(
    UUID id,
    String grandeArea,
    String tema,
    String prioridade,
    boolean aulaAssistida
) {}
