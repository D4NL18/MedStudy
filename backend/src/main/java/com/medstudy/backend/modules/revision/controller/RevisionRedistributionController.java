package com.medstudy.backend.modules.revision.controller;

import com.medstudy.backend.modules.revision.dto.RedistributionPreviewRequest;
import com.medstudy.backend.modules.revision.dto.RedistributionPreviewResponse;
import com.medstudy.backend.modules.revision.service.RevisionRedistributionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for managing flashcard redistribution.
 */
@RestController
@RequestMapping("/api/redistribute")
@RequiredArgsConstructor
@Tag(name = "Revision Redistribution", description = "Endpoints for managing spaced repetition redistribution")
public class RevisionRedistributionController {

    private final RevisionRedistributionService service;

    /**
     * Generates a preview for redistributing overdue flashcards up to a target date.
     *
     * @param request the request containing the target end date
     * @return the preview response containing draft ID and warnings
     */
    @Operation(summary = "Generate redistribution preview", description = "Calculates the new distribution of overdue flashcards and saves a temporary draft.")
    @ApiResponse(responseCode = "200", description = "Preview generated successfully")
    @PostMapping("/preview")
    public ResponseEntity<RedistributionPreviewResponse> preview(@RequestBody @Valid RedistributionPreviewRequest request) {
        return ResponseEntity.ok(service.generatePreview(request.getTargetEndDate()));
    }

    /**
     * Applies a previously generated redistribution draft.
     *
     * @param draftId the UUID of the draft to apply
     * @return an empty response
     */
    @Operation(summary = "Apply redistribution draft", description = "Applies the flashcard updates from a previously generated preview draft.")
    @ApiResponse(responseCode = "200", description = "Draft applied successfully")
    @PostMapping("/apply/{draftId}")
    public ResponseEntity<Void> apply(@PathVariable UUID draftId) {
        service.applyDraft(draftId);
        return ResponseEntity.ok().build();
    }
}
