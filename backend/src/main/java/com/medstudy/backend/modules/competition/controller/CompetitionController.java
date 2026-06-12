package com.medstudy.backend.modules.competition.controller;

import com.medstudy.backend.modules.competition.dto.CompetitionRequestDTO;
import com.medstudy.backend.modules.competition.dto.CompetitionResponseDTO;
import com.medstudy.backend.modules.competition.dto.LeaderboardEntryDTO;
import com.medstudy.backend.modules.competition.service.CompetitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for managing competitions.
 */
@RestController
@RequestMapping("/api/competitions")
@Tag(name = "Competitions", description = "Endpoints for managing study competitions")
public class CompetitionController {

    private final CompetitionService competitionService;

    /**
     * Constructs a new CompetitionController.
     *
     * @param competitionService the competition service
     */
    public CompetitionController(CompetitionService competitionService) {
        this.competitionService = competitionService;
    }

    /**
     * Creates a new competition.
     *
     * @param request the competition request data
     * @return the created competition response
     */
    @PostMapping
    @Operation(summary = "Create a competition", description = "Creates a new study competition")
    @ApiResponse(responseCode = "200", description = "Competition created successfully")
    public CompetitionResponseDTO createCompetition(@RequestBody CompetitionRequestDTO request) {
        return competitionService.createCompetition(request);
    }

    /**
     * Accepts a competition invite.
     *
     * @param id the ID of the competition
     * @return the competition response
     */
    @PostMapping("/{id}/accept")
    @Operation(summary = "Accept an invite", description = "Accepts an invitation to join a competition")
    @ApiResponse(responseCode = "200", description = "Invite accepted successfully")
    public CompetitionResponseDTO acceptInvite(@PathVariable UUID id) {
        return competitionService.acceptInvite(id);
    }

    /**
     * Declines a competition invite.
     *
     * @param id the ID of the competition
     * @return the competition response
     */
    @PostMapping("/{id}/decline")
    @Operation(summary = "Decline an invite", description = "Declines an invitation to join a competition")
    @ApiResponse(responseCode = "200", description = "Invite declined successfully")
    public CompetitionResponseDTO declineInvite(@PathVariable UUID id) {
        return competitionService.declineInvite(id);
    }

    /**
     * Retrieves all competitions for the current user.
     *
     * @return a list of competition responses
     */
    @GetMapping
    @Operation(summary = "Get user competitions", description = "Retrieves a list of all competitions for the authenticated user")
    @ApiResponse(responseCode = "200", description = "Competitions retrieved successfully")
    public List<CompetitionResponseDTO> getUserCompetitions() {
        return competitionService.getUserCompetitions();
    }

    /**
     * Retrieves the leaderboard for a specific competition.
     *
     * @param id the ID of the competition
     * @return a list of leaderboard entries
     */
    @GetMapping("/{id}/leaderboard")
    @Operation(summary = "Get competition leaderboard", description = "Retrieves the leaderboard for the specified competition")
    @ApiResponse(responseCode = "200", description = "Leaderboard retrieved successfully")
    public List<LeaderboardEntryDTO> getLeaderboard(@PathVariable UUID id) {
        return competitionService.getLeaderboard(id);
    }
}
