package com.medstudy.backend.modules.flashcard.controller;

import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.dto.FlashcardResponse;
import com.medstudy.backend.modules.flashcard.dto.FlashcardStudyRequest;
import com.medstudy.backend.modules.flashcard.service.FlashcardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for managing and studying flashcards.
 */
@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
@Tag(name = "Flashcards", description = "Flashcard management and study")
public class FlashcardController {

    private final FlashcardService service;

    /**
     * Creates a new flashcard.
     *
     * @param request the request containing flashcard details
     * @return the created flashcard response
     */
    @Operation(summary = "Create flashcard", description = "Creates a new flashcard for the current user.")
    @ApiResponse(responseCode = "201", description = "Flashcard created successfully")
    @PostMapping
    public ResponseEntity<FlashcardResponse> create(@RequestBody @Valid FlashcardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /**
     * Retrieves a paginated list of flashcards.
     *
     * @param pageable pagination information
     * @return a page of flashcard responses
     */
    @Operation(summary = "List flashcards", description = "Retrieves a paginated list of flashcards for the current user.")
    @ApiResponse(responseCode = "200", description = "List of flashcards retrieved successfully")
    @GetMapping
    public ResponseEntity<Page<FlashcardResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(service.listAll(pageable));
    }

    /**
     * Retrieves a flashcard by its ID.
     *
     * @param id the unique identifier of the flashcard
     * @return the flashcard response
     */
    @Operation(summary = "Get flashcard", description = "Retrieves a flashcard by its unique identifier.")
    @ApiResponse(responseCode = "200", description = "Flashcard retrieved successfully")
    @GetMapping("/{id}")
    public ResponseEntity<FlashcardResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * Updates an existing flashcard.
     *
     * @param id the unique identifier of the flashcard to update
     * @param request the request containing updated flashcard details
     * @return the updated flashcard response
     */
    @Operation(summary = "Update flashcard", description = "Updates an existing flashcard.")
    @ApiResponse(responseCode = "200", description = "Flashcard updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<FlashcardResponse> update(@PathVariable UUID id, @RequestBody @Valid FlashcardRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    /**
     * Deletes a flashcard by its ID.
     *
     * @param id the unique identifier of the flashcard to delete
     * @return an empty response
     */
    @Operation(summary = "Delete flashcard", description = "Deletes a flashcard by its unique identifier.")
    @ApiResponse(responseCode = "204", description = "Flashcard deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Submits a study response for a flashcard.
     *
     * @param request the request containing study response details
     * @return the updated flashcard response after study
     */
    @Operation(summary = "Study flashcard", description = "Submits a study result for a flashcard and updates spaced repetition data.")
    @ApiResponse(responseCode = "200", description = "Study result processed successfully")
    @PostMapping("/responder")
    public ResponseEntity<FlashcardResponse> study(@RequestBody @Valid FlashcardStudyRequest request) {
        return ResponseEntity.ok(service.study(request));
    }

    /**
     * Retrieves the study queue for today.
     *
     * @return a list of flashcard responses scheduled for today
     */
    @Operation(summary = "Get today's queue", description = "Retrieves the list of flashcards scheduled for review today.")
    @ApiResponse(responseCode = "200", description = "Today's queue retrieved successfully")
    @GetMapping("/hoje")
    public ResponseEntity<List<FlashcardResponse>> getTodayQueue() {
        return ResponseEntity.ok(service.getTodayQueue());
    }

    /**
     * Retrieves a summary of flashcard study progress.
     *
     * @return an object containing the study summary
     */
    @Operation(summary = "Get study summary", description = "Retrieves a summary of the user's flashcard study progress.")
    @ApiResponse(responseCode = "200", description = "Summary retrieved successfully")
    @GetMapping("/summary")
    public ResponseEntity<Object> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    /**
     * Resets the study progress of flashcards.
     *
     * @param grandeArea optional subject area to filter the reset operation
     * @return an empty response
     */
    @Operation(summary = "Reset progress", description = "Resets the spaced repetition progress for flashcards, optionally filtered by subject area.")
    @ApiResponse(responseCode = "200", description = "Progress reset successfully")
    @PostMapping("/reset")
    public ResponseEntity<Void> reset(@RequestParam(required = false) String grandeArea) {
        service.resetProgress(grandeArea);
        return ResponseEntity.ok().build();
    }
}
