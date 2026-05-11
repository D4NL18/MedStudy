package com.medstudy.backend.modules.flashcard.controller;

import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.dto.FlashcardResponse;
import com.medstudy.backend.modules.flashcard.dto.FlashcardStudyRequest;
import com.medstudy.backend.modules.flashcard.service.FlashcardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
@Tag(name = "Flashcards", description = "Gestão e estudo de flashcards")
public class FlashcardController {

    private final FlashcardService service;

    @PostMapping
    public ResponseEntity<FlashcardResponse> create(@RequestBody @Valid FlashcardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<FlashcardResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(service.listAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlashcardResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashcardResponse> update(@PathVariable UUID id, @RequestBody @Valid FlashcardRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/responder")
    public ResponseEntity<FlashcardResponse> study(@RequestBody @Valid FlashcardStudyRequest request) {
        return ResponseEntity.ok(service.study(request));
    }

    @GetMapping("/hoje")
    public ResponseEntity<java.util.List<FlashcardResponse>> getTodayQueue() {
        return ResponseEntity.ok(service.getTodayQueue());
    }

    @GetMapping("/summary")
    public ResponseEntity<Object> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> reset(@RequestParam(required = false) String grandeArea) {
        service.resetProgress(grandeArea);
        return ResponseEntity.ok().build();
    }
}
