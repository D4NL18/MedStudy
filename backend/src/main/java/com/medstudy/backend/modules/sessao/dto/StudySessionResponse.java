package com.medstudy.backend.modules.sessao.dto;

import java.time.LocalDate;
import java.util.UUID;

public record StudySessionResponse(
    UUID id,
    String grandeArea,
    String tema,
    LocalDate dataSessao,
    int qtsFeitas,
    int qtsCorretas,
    String instituicao,
    String observacoes,
    LocalDate dataProximaRevisao,
    boolean revisaoConcluida,
    java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newlyEarnedBadges
) {}
