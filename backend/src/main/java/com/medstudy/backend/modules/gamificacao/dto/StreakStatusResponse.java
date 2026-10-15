package com.medstudy.backend.modules.gamificacao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreakStatusResponse {

    @Schema(description = "Ofensiva atual do usuário calculada com as sessões e reparos.", example = "12")
    private int currentStreak;

    @Schema(description = "Indica se o streak está quebrado/em risco (ex: não estudou ontem).", example = "true")
    private boolean streakAtRisk;

    @Schema(description = "Indica se o usuário está elegível para realizar o Streak Repair.", example = "true")
    private boolean canRepair;

    @Schema(description = "Prazo limite para resgatar a ofensiva.", example = "2026-10-15T23:59:59")
    private LocalDateTime repairDeadline;

    @Schema(description = "Quantidade de cards necessária na missão de resgate.", example = "20")
    private int requiredCardsCount;

    @Schema(description = "Quantidade de cards já revisados hoje na tentativa de resgate.", example = "10")
    private int currentRepairedCount;

    @Schema(description = "Data/hora do último reparo de streak realizado.", example = "2026-10-01T14:30:00")
    private LocalDateTime lastRepairedAt;
}
