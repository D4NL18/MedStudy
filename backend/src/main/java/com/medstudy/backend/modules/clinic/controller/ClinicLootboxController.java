package com.medstudy.backend.modules.clinic.controller;

import com.medstudy.backend.modules.clinic.dto.LootboxOpenResponseDto;
import com.medstudy.backend.modules.clinic.dto.LootboxTierResponseDto;
import com.medstudy.backend.modules.clinic.entity.LootboxTier;
import com.medstudy.backend.modules.clinic.service.ClinicLootboxService;
import com.medstudy.backend.modules.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Medical Lootbox endpoints (P-093, P-094, P-095).
 */
@RestController
@RequestMapping({"/api/v1/clinic/lootboxes", "/api/clinic/lootboxes"})
@Tag(name = "Minha Clínica Médica - Lootboxes", description = "Endpoints de Caixas da Sorte Médicas e Sistema de Raridades")
@PreAuthorize("isAuthenticated()")
public class ClinicLootboxController {

    private final ClinicLootboxService clinicLootboxService;

    public ClinicLootboxController(ClinicLootboxService clinicLootboxService) {
        this.clinicLootboxService = clinicLootboxService;
    }

    @Operation(
            summary = "Listar tiers de caixas da sorte médicas disponíveis",
            description = "Retorna os 3 tiers oficiais (Residente, Especialista, Chefe de Ala) com custos em XP e probabilidades públicas."
    )
    @ApiResponse(responseCode = "200", description = "Lista de tiers retornada com sucesso")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getLootboxes() {
        List<LootboxTierResponseDto> tiers = clinicLootboxService.getAvailableTiers();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("data", tiers);

        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("timestamp", Instant.now());
        meta.put("totalTiers", tiers.size());
        response.put("meta", meta);

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Abrir caixa da sorte médica sob transação ACID",
            description = "Debita o custo do saldo investível (current_xp), sorteia item conforme probabilidades do tier e concede cashback se duplicado."
    )
    @ApiResponse(responseCode = "200", description = "Caixa aberta com sucesso")
    @ApiResponse(responseCode = "400", description = "Tier de Lootbox inválido")
    @ApiResponse(responseCode = "422", description = "Saldo de XP insuficiente")
    @PostMapping("/{tier}/open")
    public ResponseEntity<LootboxOpenResponseDto> openLootbox(
            @AuthenticationPrincipal User user,
            @PathVariable("tier") String tierStr
    ) {
        UUID userId = ClinicController.resolveAuthenticatedUserId(user);

        if (tierStr == null || tierStr.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O parâmetro tier é obrigatório.");
        }

        LootboxTier tier;
        try {
            tier = LootboxTier.valueOf(tierStr.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tier de Lootbox inválido. Opções válidas: TIER_1_RESIDENT, TIER_2_SPECIALIST, TIER_3_CHIEF_OF_STAFF."
            );
        }

        LootboxOpenResponseDto result = clinicLootboxService.openLootbox(userId, tier);
        return ResponseEntity.ok(result);
    }
}
