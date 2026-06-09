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

@RestController
@RequestMapping("/api/study-sessions")
@Tag(name = "Study Sessions", description = "Endpoints para gerenciamento de sessões de estudo (Banco de Questões)")
@SecurityRequirement(name = "bearerAuth")
public class StudySessionController {

    private final StudySessionService service;

    public StudySessionController(StudySessionService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Criar nova sessão de estudo")
    public ResponseEntity<StudySessionResponse> create(@RequestBody @Valid StudySessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createSession(request));
    }

    @GetMapping
    @Operation(summary = "Listar sessões de estudo com filtros e paginação")
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

    @GetMapping("/{id}")
    @Operation(summary = "Obter sessão de estudo por ID")
    public ResponseEntity<StudySessionResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar sessão de estudo existente")
    public ResponseEntity<StudySessionResponse> update(@PathVariable UUID id, @RequestBody @Valid StudySessionRequest request) {
        return ResponseEntity.ok(service.updateSession(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir sessão de estudo")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.deleteSession(id);
    }

    @PatchMapping("/{id}/concluir")
    @Operation(summary = "Marcar revisão da sessão como concluída")
    public ResponseEntity<Void> markAsConcluded(@PathVariable UUID id) {
        service.concluirRevisao(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metrics")
    @Operation(summary = "Obter métricas agregadas de desempenho e streak")
    public ResponseEntity<StudySessionMetricsResponse> getMetrics() {
        return ResponseEntity.ok(service.getMetrics());
    }
}
