package com.medstudy.backend.modules.gamificacao.controller;

import com.medstudy.backend.modules.gamificacao.dto.StreakRepairExecutionResponse;
import com.medstudy.backend.modules.gamificacao.dto.StreakStatusResponse;
import com.medstudy.backend.modules.gamificacao.service.StreakRepairService;
import com.medstudy.backend.modules.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gamificacao")
@Tag(name = "Streak Repair", description = "Endpoints para verificação e resgate de ofensiva (Streak)")
public class StreakRepairController {

    private final StreakRepairService streakRepairService;

    public StreakRepairController(StreakRepairService streakRepairService) {
        this.streakRepairService = streakRepairService;
    }

    @Operation(summary = "Obter status do streak e elegibilidade de reparo",
               description = "Retorna o status atual do streak, verificação de quebra de 24h e elegibilidade de Streak Repair")
    @ApiResponse(responseCode = "200", description = "Status do streak retornado com sucesso")
    @GetMapping("/streak-status")
    public ResponseEntity<StreakStatusResponse> getStreakStatus(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(streakRepairService.getStreakStatus(user));
    }

    @Operation(summary = "Executar Streak Repair",
               description = "Executa a recuperação do streak caso a missão de resgate tenha sido cumprida")
    @ApiResponse(responseCode = "200", description = "Streak reparado com sucesso")
    @ApiResponse(responseCode = "400", description = "Usuário não elegível ou meta não atingida")
    @PostMapping("/streak-repair")
    public ResponseEntity<StreakRepairExecutionResponse> executeStreakRepair(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(streakRepairService.executeRepair(user));
    }
}
