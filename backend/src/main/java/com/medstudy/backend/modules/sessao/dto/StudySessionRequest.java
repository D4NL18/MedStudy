package com.medstudy.backend.modules.sessao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record StudySessionRequest(
        @NotBlank(message = "Grande área é obrigatória") String grandeArea,

        @NotBlank(message = "Tema é obrigatório") String tema,

        @NotNull(message = "Data da sessão é obrigatória") LocalDate dataSessao,

        int qtsFeitas,
        int qtsCorretas,
        String instituicao,
        String observacoes,
        LocalDate dataProximaRevisao,
        boolean revisaoConcluida) {
}
