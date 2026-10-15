package com.medstudy.backend.modules.dashboard.controller;

import com.medstudy.backend.modules.dashboard.dto.DashboardResponse;
import com.medstudy.backend.modules.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Global KPIs and user streak")
/**
 * REST controller for managing dashboard data.
 * Provides endpoints to retrieve global metrics and user performance statistics.
 */
public class DashboardController {

    private final DashboardService service;
    private final com.medstudy.backend.modules.dashboard.service.ClinicalMasteryService clinicalMasteryService;

    /**
     * Constructs a new DashboardController with the required services.
     *
     * @param service the DashboardService to be used
     * @param clinicalMasteryService the ClinicalMasteryService to be used
     */
    public DashboardController(DashboardService service,
                               com.medstudy.backend.modules.dashboard.service.ClinicalMasteryService clinicalMasteryService) {
        this.service = service;
        this.clinicalMasteryService = clinicalMasteryService;
    }

    /**
     * Retrieves the dashboard data for the authenticated user.
     *
     * @return a ResponseEntity containing the DashboardResponse with user KPIs and streak
     */
    @Operation(summary = "Get Dashboard Data", description = "Retrieves global KPIs, user streak, and other dashboard metrics for the current user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard data")
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }

    /**
     * Retrieves the clinical mastery map for the authenticated user.
     *
     * @param user the authenticated user
     * @return a ResponseEntity containing the ClinicalMasteryResponse with area metrics and tiers
     */
    @Operation(summary = "Get Clinical Mastery", description = "Retorna o mapa de maestria anatômica e das 5 grandes áreas médicas com os respectivos níveis e tiers.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved clinical mastery")
    @GetMapping("/maestria-clinica")
    public ResponseEntity<com.medstudy.backend.modules.dashboard.dto.ClinicalMasteryResponse> getClinicalMastery(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.medstudy.backend.modules.user.entity.User user) {
        return ResponseEntity.ok(clinicalMasteryService.calculateMastery(user));
    }
}
