package com.medstudy.backend.modules.sessao.controller;

import com.medstudy.backend.modules.sessao.dto.StudySessionMetricsResponse;
import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.service.StudySessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for managing Study Sessions.
 */
@RestController
@RequestMapping("/api/study-sessions")
@Tag(name = "Study Sessions", description = "Endpoints for managing study sessions (Question Bank)")
@SecurityRequirement(name = "bearerAuth")
public class StudySessionController {

    /**
     * Service for handling study session operations.
     */
    private final StudySessionService service;

    /**
     * Constructor for StudySessionController.
     *
     * @param service the StudySessionService instance
     */
    public StudySessionController(StudySessionService service) {
        this.service = service;
    }

    /**
     * Create a new study session.
     *
     * @param request the study session data
     * @return the created study session
     */
    @PostMapping
    @Operation(summary = "Create a new study session")
    public ResponseEntity<StudySessionResponse> create(@RequestBody @Valid StudySessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createSession(request));
    }

    /**
     * Retrieve a paginated list of study sessions with optional filters.
     *
     * @param grandeArea optional filter for major area
     * @param tema optional filter for theme
     * @param instituicao optional filter for institution
     * @param revisaoConcluida optional filter for revision completion status
     * @param minRate optional minimum success rate
     * @param maxRate optional maximum success rate
     * @param pageable pagination parameters
     * @return a paginated list of study sessions
     */
    @GetMapping
    @Operation(summary = "List study sessions with filters and pagination")
    public ResponseEntity<Page<StudySessionResponse>> findAll(
            @RequestParam(required = false) String grandeArea,
            @RequestParam(required = false) String tema,
            @RequestParam(required = false) String instituicao,
            @RequestParam(required = false) Boolean revisaoConcluida,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(service.findAll(grandeArea, tema, instituicao, revisaoConcluida, minRate, maxRate, pageable));
    }

    /**
     * Get a specific study session by ID.
     *
     * @param id the study session ID
     * @return the study session
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get study session by ID")
    public ResponseEntity<StudySessionResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * Update an existing study session.
     *
     * @param id the study session ID
     * @param request the updated study session data
     * @return the updated study session
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing study session")
    public ResponseEntity<StudySessionResponse> update(@PathVariable UUID id, @RequestBody @Valid StudySessionRequest request) {
        return ResponseEntity.ok(service.updateSession(id, request));
    }

    /**
     * Delete a study session.
     *
     * @param id the study session ID
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a study session")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.deleteSession(id);
    }

    /**
     * Mark a study session revision as concluded.
     *
     * @param id the study session ID
     * @return empty response
     */
    @PatchMapping("/{id}/concluir")
    @Operation(summary = "Mark session revision as concluded")
    public ResponseEntity<Void> markAsConcluded(@PathVariable UUID id) {
        service.concluirRevisao(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get aggregated performance metrics and streak information.
     *
     * @return the study session metrics
     */
    @GetMapping("/metrics")
    @Operation(summary = "Get aggregated performance metrics and streak")
    public ResponseEntity<StudySessionMetricsResponse> getMetrics() {
        return ResponseEntity.ok(service.getMetrics());
    }
}
