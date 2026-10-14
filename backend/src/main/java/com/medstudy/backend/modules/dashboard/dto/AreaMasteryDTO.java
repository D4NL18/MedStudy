package com.medstudy.backend.modules.dashboard.dto;

import com.medstudy.backend.modules.dashboard.enums.MasteryTier;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaMasteryDTO {

    @Schema(description = "Identificador da Grande Área Médica", example = "CLINICA_MEDICA")
    private String grandeArea;

    @Schema(description = "Nome de exibição amigável da especialidade", example = "Clínica Médica")
    private String displayName;

    @Schema(description = "Chave da região anatômica no SVG interativo", example = "torax_snc")
    private String regionKey;

    @Schema(description = "Percentual calculado de maestria (0 a 100)", example = "68.5")
    private double masteryPercentage;

    @Schema(description = "Tier de maestria atingido na área", example = "PLATINA")
    private MasteryTier tier;

    @Schema(description = "Cor hexadecimal correspondente à especialidade", example = "#3B82F6")
    private String corHex;

    @Schema(description = "Total de questões resolvidas na área", example = "120")
    private long questoesFeitas;

    @Schema(description = "Taxa de acerto em questões (%)", example = "78.2")
    private double taxaAcertoQuestoes;

    @Schema(description = "Total de flashcards revisados na área", example = "85")
    private long cardsRevisados;

    @Schema(description = "Taxa de retenção nos flashcards (%)", example = "82.0")
    private double taxaRetencaoCards;

    @Schema(description = "Total de aulas assistidas na área", example = "14")
    private long aulasAssistidas;

    @Schema(description = "Total de aulas cadastradas na área", example = "18")
    private long totalAulas;
}
