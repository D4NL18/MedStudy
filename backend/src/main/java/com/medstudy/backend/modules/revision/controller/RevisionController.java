package com.medstudy.backend.modules.revision.controller;

import com.medstudy.backend.modules.revision.dto.RevisionSummaryResponse;
import com.medstudy.backend.modules.revision.service.RevisionService;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springdoc.core.annotations.ParameterObject;

/**
 * Controller responsible for managing study session revisions.
 */
@RestController
@RequestMapping("/api/revisoes")
@RequiredArgsConstructor
@Tag(name = "Revisions", description = "Management of study session revisions")
public class RevisionController {

    private final RevisionService service;

    /**
     * Retrieves a summary of the study session revisions.
     *
     * @return a {@link ResponseEntity} containing the {@link RevisionSummaryResponse}
     */
    @Operation(summary = "Get revision summary", description = "Retrieves a summary of the current user's study session revisions")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved summary")
    @GetMapping("/resumo")
    public ResponseEntity<RevisionSummaryResponse> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    /**
     * Retrieves a paginated list of study sessions based on the revision type and search criteria.
     *
     * @param tipo     the type of revision (e.g., TODAY, LATE)
     * @param search   the search query string
     * @param pageable pagination parameters
     * @return a {@link ResponseEntity} containing a paginated list of {@link StudySessionResponse}
     */
    @Operation(summary = "Get study sessions", description = "Retrieves a paginated list of study sessions for revision")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved sessions")
    @GetMapping
    public ResponseEntity<Page<StudySessionResponse>> getSessions(
            @RequestParam(required = false, defaultValue = "HOJE") String tipo,
            @RequestParam(required = false) String search,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(service.getSessions(tipo, search, pageable));
    }
}
