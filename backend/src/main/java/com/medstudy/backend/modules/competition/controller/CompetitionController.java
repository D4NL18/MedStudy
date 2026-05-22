package com.medstudy.backend.modules.competition.controller;

import com.medstudy.backend.modules.competition.dto.CompetitionRequestDTO;
import com.medstudy.backend.modules.competition.dto.CompetitionResponseDTO;
import com.medstudy.backend.modules.competition.dto.LeaderboardEntryDTO;
import com.medstudy.backend.modules.competition.service.CompetitionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/competitions")
public class CompetitionController {

    private final CompetitionService competitionService;

    public CompetitionController(CompetitionService competitionService) {
        this.competitionService = competitionService;
    }

    @PostMapping
    public CompetitionResponseDTO createCompetition(@RequestBody CompetitionRequestDTO request) {
        return competitionService.createCompetition(request);
    }

    @PostMapping("/{id}/accept")
    public CompetitionResponseDTO acceptInvite(@PathVariable UUID id) {
        return competitionService.acceptInvite(id);
    }

    @PostMapping("/{id}/decline")
    public CompetitionResponseDTO declineInvite(@PathVariable UUID id) {
        return competitionService.declineInvite(id);
    }

    @GetMapping
    public List<CompetitionResponseDTO> getUserCompetitions() {
        return competitionService.getUserCompetitions();
    }

    @GetMapping("/{id}/leaderboard")
    public List<LeaderboardEntryDTO> getLeaderboard(@PathVariable UUID id) {
        return competitionService.getLeaderboard(id);
    }
}
