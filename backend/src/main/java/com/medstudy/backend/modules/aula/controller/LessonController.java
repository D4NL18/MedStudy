package com.medstudy.backend.modules.aula.controller;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.dto.LessonSummaryResponse;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.aula.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
 * Controller for managing Lessons.
 * Provides endpoints for creating, retrieving, updating, and deleting lessons.
 */
@RestController
@RequestMapping("/api/lessons")
@Tag(name = "Lessons", description = "Lesson plans and priority management")
public class LessonController {

    private final LessonService service;

    /**
     * Constructor for LessonController.
     *
     * @param service the lesson service
     */
    public LessonController(LessonService service) {
        this.service = service;
    }

    /**
     * Creates a new lesson.
     *
     * @param request the request containing lesson details
     * @return the created lesson response
     */
    @PostMapping
    @Operation(summary = "Create a new lesson", description = "Creates a new lesson and returns the created resource.")
    @ApiResponse(responseCode = "201", description = "Lesson created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<LessonResponse> create(@RequestBody @Valid LessonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /**
     * Retrieves a paginated list of lessons based on filters.
     *
     * @param grandeArea optional filter for major area
     * @param prioridade optional filter for priority
     * @param aulaAssistida optional filter for watched status
     * @param tema optional filter for theme
     * @param pageable pagination parameters
     * @return a paginated list of lesson responses
     */
    @GetMapping
    @Operation(summary = "List lessons", description = "Retrieves a paginated list of lessons matching the provided filters.")
    @ApiResponse(responseCode = "200", description = "Lessons retrieved successfully")
    public ResponseEntity<Page<LessonResponse>> findAll(
            @RequestParam(required = false) String grandeArea,
            @RequestParam(required = false) LessonPriority prioridade,
            @RequestParam(required = false) Boolean aulaAssistida,
            @RequestParam(required = false) String tema,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(service.findAll(grandeArea, prioridade, aulaAssistida, tema, pageable));
    }

    /**
     * Retrieves a summary of the lessons.
     *
     * @return the lesson summary response
     */
    @GetMapping("/summary")
    @Operation(summary = "Get lesson summary", description = "Retrieves a summary of the lessons, such as total counts and statistics.")
    @ApiResponse(responseCode = "200", description = "Summary retrieved successfully")
    public ResponseEntity<LessonSummaryResponse> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    /**
     * Retrieves a lesson by its ID.
     *
     * @param id the UUID of the lesson
     * @return the lesson response
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get lesson by ID", description = "Retrieves the details of a specific lesson by its ID.")
    @ApiResponse(responseCode = "200", description = "Lesson retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Lesson not found")
    public ResponseEntity<LessonResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * Updates an existing lesson.
     *
     * @param id the UUID of the lesson to update
     * @param request the request containing updated lesson details
     * @return the updated lesson response
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update lesson", description = "Updates an existing lesson entirely.")
    @ApiResponse(responseCode = "200", description = "Lesson updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @ApiResponse(responseCode = "404", description = "Lesson not found")
    public ResponseEntity<LessonResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid LessonRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /**
     * Toggles the watched status of a lesson.
     *
     * @param id the UUID of the lesson
     * @return the updated lesson response
     */
    @PatchMapping("/{id}/toggle-assistida")
    @Operation(summary = "Toggle watched status", description = "Toggles the 'aulaAssistida' status of the lesson.")
    @ApiResponse(responseCode = "200", description = "Status toggled successfully")
    @ApiResponse(responseCode = "404", description = "Lesson not found")
    public ResponseEntity<LessonResponse> toggleAssistida(@PathVariable UUID id) {
        return ResponseEntity.ok(service.toggleAssistida(id));
    }

    /**
     * Deletes a lesson by its ID.
     *
     * @param id the UUID of the lesson to delete
     * @return an empty response entity
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete lesson", description = "Deletes a lesson by its ID.")
    @ApiResponse(responseCode = "204", description = "Lesson deleted successfully")
    @ApiResponse(responseCode = "404", description = "Lesson not found")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
