package com.medstudy.backend.modules.simulado.controller;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.service.SimuladoService;
import io.swagger.v3.oas.annotations.Operation;
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
@Tag(name = "Simulados", description = "Management of mock exams (simulados) by medical area")
/**
 * Controller for managing mock exams (Simulados).
 */
public class SimuladoController {

    private final SimuladoService service;

    public SimuladoController(SimuladoService service) {
        this.service = service;
    }

    /**
     * Creates a new mock exam (Simulado).
     *
     * @param request the details of the mock exam to create
     * @return the created mock exam response
     */
    @Operation(summary = "Create new mock exam", description = "Creates a new mock exam for the authenticated user.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Mock exam created successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    @PostMapping
    public ResponseEntity<SimuladoResponse> create(@RequestBody @Valid SimuladoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /**
     * Lists mock exams with pagination and optional filtering by name.
     *
     * @param nome optional name filter
     * @param pageable pagination information
     * @return a paginated list of mock exams
     */
    @Operation(summary = "List mock exams (paginated)", description = "Retrieves a paginated list of mock exams, optionally filtered by name.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    @GetMapping
    public ResponseEntity<Page<SimuladoResponse>> findAll(
            @RequestParam(required = false) String nome,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(service.findAll(nome, pageable));
    }

    /**
     * Retrieves a specific mock exam by its ID.
     *
     * @param id the UUID of the mock exam
     * @return the mock exam details
     */
    @Operation(summary = "Get mock exam by ID", description = "Retrieves the details of a specific mock exam.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved mock exam")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Mock exam not found")
    @GetMapping("/{id}")
    public ResponseEntity<SimuladoResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * Updates an existing mock exam.
     *
     * @param id the UUID of the mock exam to update
     * @param request the updated mock exam details
     * @return the updated mock exam response
     */
    @Operation(summary = "Update mock exam", description = "Updates the details of an existing mock exam.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully updated mock exam")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Mock exam not found")
    @PutMapping("/{id}")
    public ResponseEntity<SimuladoResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid SimuladoRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /**
     * Deletes a mock exam by its ID.
     *
     * @param id the UUID of the mock exam to delete
     * @return no content on success
     */
    @Operation(summary = "Delete mock exam", description = "Deletes a specific mock exam.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Successfully deleted mock exam")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Mock exam not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves the most recent mock exam template by institution.
     *
     * @param instituicao the name of the institution
     * @return the latest mock exam template
     */
    @Operation(summary = "Get template (latest mock exam) by institution", description = "Retrieves the most recent mock exam associated with the given institution.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved template")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Template not found")
    @GetMapping("/template")
    public ResponseEntity<SimuladoResponse> getLatestByInstituicao(@RequestParam String instituicao) {
        SimuladoResponse response = service.findLatestByInstituicao(instituicao);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }
}
