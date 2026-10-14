package com.medstudy.backend.modules.dashboard.dto;

import com.medstudy.backend.modules.dashboard.enums.MasteryTier;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalMasteryResponse {

    @Schema(description = "Percentual global ponderado de maestria clínica (0 a 100)", example = "72.4")
    private double overallMastery;

    @Schema(description = "Tier global correspondente", example = "PLATINA")
    private MasteryTier overallTier;

    @Schema(description = "Detalhamento da maestria nas 5 grandes áreas médicas")
    private List<AreaMasteryDTO> areas;
}
