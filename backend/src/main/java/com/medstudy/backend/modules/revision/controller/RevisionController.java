package com.medstudy.backend.modules.revision.controller;

import com.medstudy.backend.modules.revision.dto.RevisionSummaryResponse;
import com.medstudy.backend.modules.revision.service.RevisionService;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/revisoes")
@RequiredArgsConstructor
@Tag(name = "Revisões", description = "Gestão de revisões das sessões de estudo")
public class RevisionController {

    private final RevisionService service;

    @GetMapping("/resumo")
    public ResponseEntity<RevisionSummaryResponse> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @GetMapping
    public ResponseEntity<java.util.List<StudySessionResponse>> getSessions(
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "HOJE") String tipo) {
        return ResponseEntity.ok(service.getSessions(tipo));
    }
}
