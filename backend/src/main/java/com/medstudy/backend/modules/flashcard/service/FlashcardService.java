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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository repository;
    private final FlashcardMapper mapper;
    private final SpacedRepetitionService srService;

    @Transactional
    public FlashcardResponse create(FlashcardRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Flashcard flashcard = mapper.toEntity(request);
        flashcard.setUser(user);
        return mapper.toResponse(repository.save(flashcard));
    }

    @Transactional(readOnly = true)
    public Page<FlashcardResponse> listAll(Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repository.findAllByUserId(user.getId(), pageable).map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public FlashcardResponse getById(UUID id) {
        return mapper.toResponse(findByIdAndValidateUser(id));
    }

    @Transactional
    public FlashcardResponse update(UUID id, FlashcardRequest request) {
        Flashcard flashcard = findByIdAndValidateUser(id);
        mapper.updateEntity(request, flashcard);
        return mapper.toResponse(repository.save(flashcard));
    }

    @Transactional
    public void delete(UUID id) {
        Flashcard flashcard = findByIdAndValidateUser(id);
        repository.delete(flashcard);
    }

    @Transactional
    public FlashcardResponse study(FlashcardStudyRequest request) {
        Flashcard flashcard = findByIdAndValidateUser(request.flashcardId());
        srService.calculateNextRevision(flashcard, request.dificuldade());
        return mapper.toResponse(repository.save(flashcard));
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> getTodayQueue() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repository.findAllByUserId(user.getId()).stream()
            .filter(f -> f.getProximaRevisao() == null || f.getProximaRevisao().isBefore(LocalDateTime.now()))
            .map(mapper::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Flashcard> cards = repository.findAllByUserId(user.getId());
        
        long total = cards.size();
        long disponiveis = cards.stream()
            .filter(f -> f.getProximaRevisao() == null || f.getProximaRevisao().isBefore(LocalDateTime.now()))
            .count();
        long concluidosHoje = 0; // Needs history tracking or field

        return Map.of(
            "total", total,
            "disponiveisHoje", disponiveis,
            "metaDiaria", 20,
            "concluidosHoje", concluidosHoje
        );
    }

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
