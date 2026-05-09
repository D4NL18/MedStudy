package com.medstudy.backend.modules.aula.controller;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.aula.service.LessonService;
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
@RequestMapping("/api/lessons")
@Tag(name = "Lessons", description = "Plano de aulas e gerenciamento de prioridades")
public class LessonController {

    private final LessonService service;

    public LessonController(LessonService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LessonResponse> create(@RequestBody @Valid LessonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<LessonResponse>> findAll(
            @RequestParam(required = false) String grandeArea,
            @RequestParam(required = false) LessonPriority prioridade,
            @RequestParam(required = false) Boolean aulaAssistida,
            @RequestParam(required = false) String tema,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(service.findAll(grandeArea, prioridade, aulaAssistida, tema, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid LessonRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/{id}/toggle-assistida")
    public ResponseEntity<LessonResponse> toggleAssistida(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleAssistida(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
