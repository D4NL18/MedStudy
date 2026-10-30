package com.medstudy.backend.modules.clinic.controller;

import com.medstudy.backend.modules.clinic.dto.StudyActionRewardRequest;
import com.medstudy.backend.modules.clinic.dto.StudyActionRewardResponse;
import com.medstudy.backend.modules.clinic.service.StudyXpEngineService;
import com.medstudy.backend.modules.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST Controller for crediting study XP rewards into the student's clinic account (P-080, P-081, P-086).
 */
@RestController
@RequestMapping({"/api/v1/study", "/api/study"})
@Tag(name = "Motor de XP de Estudo", description = "Endpoints para cálculo determinístico de XP de estudo e multiplicador de ofensiva diária")
@PreAuthorize("isAuthenticated()")
public class StudyRewardController {

    private final StudyXpEngineService studyXpEngineService;

    public StudyRewardController(StudyXpEngineService studyXpEngineService) {
        this.studyXpEngineService = studyXpEngineService;
    }

    @Operation(
            summary = "Creditar recompensa de XP por atividade de estudo concluída",
            description = "Calcula o XP base e multiplicador de streak diário, credita simultaneamente lifetime_xp e current_xp e registra transação auditável."
    )
    @ApiResponse(responseCode = "200", description = "Recompensa de XP creditada com sucesso")
    @PostMapping("/action-reward")
    public ResponseEntity<StudyActionRewardResponse> rewardStudyAction(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StudyActionRewardRequest request
    ) {
        UUID userId = ClinicController.resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(studyXpEngineService.rewardStudyAction(userId, request));
    }
}
