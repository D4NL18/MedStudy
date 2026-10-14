package com.medstudy.backend.modules.gamificacao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreakRepairExecutionResponse {

    @Schema(description = "Indica se o reparo foi executado com sucesso.", example = "true")
    private boolean success;

    @Schema(description = "Novo valor de streak recalculado após o reparo.", example = "13")
    private int newStreak;

    @Schema(description = "Mensagem descritiva do resultado da operação.", example = "Ofensiva restaurada com sucesso!")
    private String message;
}
