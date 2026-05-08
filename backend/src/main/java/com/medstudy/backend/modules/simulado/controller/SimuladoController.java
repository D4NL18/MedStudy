package com.medstudy.backend.modules.simulado.controller;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.service.SimuladoService;
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
@RequestMapping("/api/simulados")
@Tag(name = "Simulados", description = "Gerenciamento de simulados por área médica")
public class SimuladoController {

    private final SimuladoService service;

    public SimuladoController(SimuladoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SimuladoResponse> create(@RequestBody @Valid SimuladoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<SimuladoResponse>> findAll(
            @RequestParam(required = false) String nome,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(service.findAll(nome, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SimuladoResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SimuladoResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid SimuladoRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/template")
    public ResponseEntity<SimuladoResponse> getLatestByInstituicao(@RequestParam String instituicao) {
        SimuladoResponse response = service.findLatestByInstituicao(instituicao);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }
}
