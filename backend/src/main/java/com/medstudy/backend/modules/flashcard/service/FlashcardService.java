package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.dto.FlashcardResponse;
import com.medstudy.backend.modules.flashcard.dto.FlashcardStudyRequest;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.mapper.FlashcardMapper;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for managing flashcard operations.
 */
@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository repository;
    private final FlashcardMapper mapper;
    private final SpacedRepetitionService srService;

    /**
     * Creates a new flashcard for the currently authenticated user.
     *
     * @param request the request containing flashcard details
     * @return the created flashcard response
     */
    @Transactional
    public FlashcardResponse create(FlashcardRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Flashcard flashcard = mapper.toEntity(request);
        flashcard.setUser(user);
        return mapper.toResponse(repository.save(flashcard));
    }

    /**
     * Retrieves a paginated list of flashcards for the currently authenticated user.
     *
     * @param pageable pagination information
     * @return a page of flashcard responses
     */
    @Transactional(readOnly = true)
    public Page<FlashcardResponse> listAll(Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repository.findAllByUserId(user.getId(), pageable).map(mapper::toResponse);
    }

    /**
     * Retrieves a flashcard by its ID.
     *
     * @param id the unique identifier of the flashcard
     * @return the flashcard response
     */
    @Transactional(readOnly = true)
    public FlashcardResponse getById(UUID id) {
        return mapper.toResponse(findByIdAndValidateUser(id));
    }

    /**
     * Updates an existing flashcard.
     *
     * @param id the unique identifier of the flashcard to update
     * @param request the request containing updated flashcard details
     * @return the updated flashcard response
     */
    @Transactional
    public FlashcardResponse update(UUID id, FlashcardRequest request) {
        Flashcard flashcard = findByIdAndValidateUser(id);
        mapper.updateEntity(request, flashcard);
        return mapper.toResponse(repository.save(flashcard));
    }

    /**
     * Deletes a flashcard by its ID.
     *
     * @param id the unique identifier of the flashcard to delete
     */
    @Transactional
    public void delete(UUID id) {
        Flashcard flashcard = findByIdAndValidateUser(id);
        repository.delete(flashcard);
    }

    /**
     * Submits a study response for a flashcard, updating its spaced repetition data.
     *
     * @param request the request containing study response details
     * @return the updated flashcard response after study
     */
    @Transactional
    public FlashcardResponse study(FlashcardStudyRequest request) {
        Flashcard flashcard = findByIdAndValidateUser(request.getFlashcardId());
        srService.calculateNextRevision(flashcard, request.getDificuldade());
        flashcard.setLastStudiedAt(LocalDate.now());
        flashcard.setUltimaRevisao(LocalDate.now());
        return mapper.toResponse(repository.save(flashcard));
    }

    /**
     * Retrieves the list of flashcards scheduled for review today.
     *
     * @return a shuffled list of flashcard responses
     */
    @Transactional(readOnly = true)
    public List<FlashcardResponse> getTodayQueue() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LocalDate today = LocalDate.now();
        List<FlashcardResponse> queue = repository.findAllByUserId(user.getId()).stream()
            .filter(f -> f.getProximaRevisao() == null || !f.getProximaRevisao().isAfter(today))
            .map(mapper::toResponse)
            .collect(Collectors.toList());
        
        Collections.shuffle(queue);
        return queue;
    }

    /**
     * Retrieves a summary of flashcard study progress for the user.
     *
     * @return a map containing the study summary
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Flashcard> cards = repository.findAllByUserId(user.getId());
        LocalDate today = LocalDate.now();
        
        long total = cards.size();
        long disponiveis = cards.stream()
            .filter(f -> f.getProximaRevisao() == null || !f.getProximaRevisao().isAfter(today))
            .count();
        
        long concluidosHoje = cards.stream()
            .filter(f -> f.getUltimaRevisao() != null && f.getUltimaRevisao().equals(today))
            .count();

        return Map.of(
            "total", total,
            "disponiveisHoje", disponiveis,
            "concluidosHoje", concluidosHoje
        );
    }

    /**
     * Resets the spaced repetition progress for all flashcards, optionally filtered by subject area.
     *
     * @param grandeArea optional subject area to filter the reset operation
     */
    @Transactional
    public void resetProgress(String grandeArea) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        repository.resetProgress(user.getId(), grandeArea);
    }

    /**
     * Finds a flashcard by ID and validates that it belongs to the current user.
     *
     * @param id the flashcard ID
     * @return the flashcard entity
     * @throws EntityNotFoundException if the flashcard is not found or does not belong to the user
     */
    private Flashcard findByIdAndValidateUser(UUID id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Flashcard flashcard = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Flashcard não encontrado"));

        if (!flashcard.getUser().getId().equals(user.getId())) {
            throw new EntityNotFoundException("Flashcard não encontrado");
        }
        return flashcard;
    }
}
